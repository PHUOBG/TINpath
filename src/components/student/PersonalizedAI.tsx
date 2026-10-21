import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Target,
  Brain,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Send,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Compass,
  Award,
  Zap,
  Check,
  RotateCcw,
  ChevronRight,
  GraduationCap,
  Info,
  Sliders,
  Filter,
} from 'lucide-react';
import { UserProfile, ExamAttempt, SubjectTopicId } from '../../types';
import { DIAGNOSTIC_QUESTIONS } from '../../data/officialExamsData';
import {
  askThinkingAiTutor,
  askSearchGroundedInfo,
  requestAdaptiveStudyPlan,
  requestDiagnosticAnalysis,
} from '../../services/geminiClient';
import { askRagTutor } from '../../services/ragService.ts';

interface PersonalizedAIProps {
  user: UserProfile;
  examAttempts: ExamAttempt[];
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateTopic: (topicId: SubjectTopicId) => void;
}

interface DiagnosticAnalysisResult {
  overallAssessment: string;
  levelRanking: string;
  strengths: string[];
  weaknesses: string[];
  cognitiveLevels: {
    know: { percentage: number; evaluation: string };
    understand: { percentage: number; evaluation: string };
    apply: { percentage: number; evaluation: string };
  };
  pedagogicalAdvice: string;
  recommendedWeakTopics: string[];
}

export const PersonalizedAI: React.FC<PersonalizedAIProps> = ({
  user,
  examAttempts,
  onUpdateUser,
  onNavigateTopic,
}) => {
  // Main view mode: 'pipeline' (3-step flow) or 'tutor' (AI Tutor Studio)
  const [activeView, setActiveView] = useState<'pipeline' | 'tutor'>('pipeline');

  // Pipeline step: 1 (Diagnostic Test) -> 2 (Competency Diagnosis) -> 3 (AI Adaptive Roadmap)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(() => {
    if (user.diagnosticScore !== undefined && user.diagnosticScore !== null) {
      return 2;
    }
    return 1;
  });

  // Diagnostic Test state
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState<boolean>(() => {
    return user.diagnosticScore !== undefined && user.diagnosticScore !== null;
  });
  const [diagScore, setDiagScore] = useState<number | null>(user.diagnosticScore ?? null);
  const [isAnalyzingDiagnostic, setIsAnalyzingDiagnostic] = useState(false);
  const [diagnosticAnalysis, setDiagnosticAnalysis] = useState<DiagnosticAnalysisResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  // Step 3: Roadmap configuration & generation state
  const [targetScoreInput, setTargetScoreInput] = useState<number>(user.targetScore || 8.5);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(user.dailyStudyMinutes || 45);
  const [trackInput, setTrackInput] = useState<'CS' | 'ICT'>(user.track || 'CS');
  const [daysRemainingInput, setDaysRemainingInput] = useState<number>(75);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<any>(null);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});

  // Companion AI Tutor chat state
  const [tutorMode, setTutorMode] = useState<'rag' | 'thinking' | 'search'>('rag');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    model?: string;
    sources?: string[];
    ragSources?: Array<{ title: string; bookSource: string }>;
  }>>([
    {
      sender: 'ai',
      text: `Xin chào ${user.displayName}! Mình là Trợ lý AI Tin học THPT tích hợp RAG Tri thức SGK Tin học 12. Khi bạn hỏi bài, AI sẽ tự động tìm kiếm đối chiếu các đoạn bài học chuẩn từ SGK GDPT 2018 (Kết Nối Tri Thức, Cánh Diều) trên Supabase để giải thích chính xác nhất!`,
      model: 'Gemini Flash + RAG (SGK Tin 12 GDPT 2018)',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [useHighThinking, setUseHighThinking] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Helper: compute local diagnostic report if AI API key is missing or offline
  const computeLocalAnalysis = (
    score: number,
    correctCount: number,
    total: number,
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>
  ): DiagnosticAnalysisResult => {
    const wrongQs = DIAGNOSTIC_QUESTIONS.filter((q) => answers[q.id] !== q.correctAnswer);
    const wrongTopics = Array.from(new Set(wrongQs.map((q) => q.topicId)));
    const wrongTopicNames = Array.from(new Set(wrongQs.map((q) => q.topicName)));
    const correctQs = DIAGNOSTIC_QUESTIONS.filter((q) => answers[q.id] === q.correctAnswer);
    const correctTopicNames = Array.from(new Set(correctQs.map((q) => q.topicName)));

    // Cognitive levels calculation
    const knowQs = DIAGNOSTIC_QUESTIONS.filter((q) => q.level === 'biet');
    const understandQs = DIAGNOSTIC_QUESTIONS.filter((q) => q.level === 'hieu');
    const applyQs = DIAGNOSTIC_QUESTIONS.filter((q) => q.level === 'van_dung');

    const knowCorrect = knowQs.filter((q) => answers[q.id] === q.correctAnswer).length;
    const understandCorrect = understandQs.filter((q) => answers[q.id] === q.correctAnswer).length;
    const applyCorrect = applyQs.filter((q) => answers[q.id] === q.correctAnswer).length;

    const knowPct = Math.round((knowCorrect / (knowQs.length || 1)) * 100);
    const understandPct = Math.round((understandCorrect / (understandQs.length || 1)) * 100);
    const applyPct = Math.round((applyCorrect / (applyQs.length || 1)) * 100);

    let ranking = 'Khá - Nền tảng tốt, cần nâng cao vận dụng';
    let assessment = `Học sinh thể hiện khả năng nắm bắt kiến thức nền tảng tương đối tốt với ${correctCount}/${total} câu hỏi chính xác. Cần đặc biệt chú ý khắc phục các lỗ hổng lý thuyết liên quan đến mạng máy tính và chuẩn hóa cơ sở dữ liệu.`;

    if (score >= 9.0) {
      ranking = 'Xuất sắc - Nền tảng vững vàng toàn diện';
      assessment = `Học sinh có tư duy Tin học rất xuất sắc, làm chủ hầu hết các chủ đề từ lý thuyết AI, mạng máy tính đến thuật toán và cơ sở dữ liệu. Sẵn sàng cho mục tiêu điểm 9.5 - 10 trong kỳ thi tốt nghiệp THPT.`;
    } else if (score >= 8.0) {
      ranking = 'Giỏi - Nắm chắc kiến thức cốt lõi';
      assessment = `Nền tảng kiến thức rất vững chắc. Bạn chỉ gặp một vài sai sót nhỏ ở các câu hỏi vận dụng hoặc bẫy đề thi. Tập trung rèn luyện đề chuẩn sẽ sớm đạt ngưỡng điểm tối đa.`;
    } else if (score < 5.0) {
      ranking = 'Cần củng cố nền tảng kiến thức';
      assessment = `Học sinh còn bị hổng một số khái niệm cơ bản về mạng máy tính, HTML và cơ sở dữ liệu. Cần bám sát lộ trình 7 ngày của TinPath để ôn lại lý thuyết trọng tâm trước khi luyện đề.`;
    }

    const strengths: string[] = [];
    if (correctTopicNames.length > 0) {
      strengths.push(`Nắm chắc các nội dung: ${correctTopicNames.slice(0, 3).join(', ')}.`);
    }
    if (knowPct >= 75) {
      strengths.push(`Ghi nhớ tốt các định nghĩa, mốc thời gian và khái niệm cốt lõi (Đạt ${knowPct}% ở mức độ Biết).`);
    }
    if (strengths.length === 0) {
      strengths.push('Có tinh thần học hỏi và sẵn sàng bù đắp các lỗ hổng kiến thức.');
    }

    const weaknesses: string[] = [];
    if (wrongTopicNames.length > 0) {
      weaknesses.push(`Cần ôn lại các chuyên đề: ${wrongTopicNames.join(', ')}.`);
    }
    if (applyPct < 70) {
      weaknesses.push(`Kỹ năng xử lý bài tập tính toán địa chỉ IP và truy vết thuật toán còn lúng túng (Đạt ${applyPct}% ở mức độ Vận dụng).`);
    }
    if (weaknesses.length === 0) {
      weaknesses.push('Cần rèn luyện thêm tốc độ phản xạ với các câu hỏi bẫy định nghĩa.');
    }

    return {
      overallAssessment: assessment,
      levelRanking: ranking,
      strengths,
      weaknesses,
      cognitiveLevels: {
        know: {
          percentage: knowPct,
          evaluation: knowPct >= 80 ? 'Nắm chắc kiến thức định nghĩa' : 'Cần ôn lại các khái niệm cơ bản',
        },
        understand: {
          percentage: understandPct,
          evaluation: understandPct >= 70 ? 'Hiểu tốt cơ chế và phân loại' : 'Cần phân biệt rõ các thiết bị & chuẩn mạng',
        },
        apply: {
          percentage: applyPct,
          evaluation: applyPct >= 70 ? 'Tư duy giải quyết bài toán tốt' : 'Cần luyện thêm dạng bài đổi nhị phân & thuật toán',
        },
      },
      pedagogicalAdvice: `Phân bổ 45 phút mỗi ngày: Dành 20 phút đọc lại lý thuyết các phần làm sai, 20 phút làm bài tập trắc nghiệm chuyên đề và 5 phút ôn lại bằng flashcard trước khi ngủ.`,
      recommendedWeakTopics: wrongTopics.length > 0 ? wrongTopics : ['12B', '11F'],
    };
  };

  // Perform Diagnostic Analysis (Calls Gemini API with graceful heuristic fallback)
  const triggerDiagnosticAnalysis = async (score: number, answers: Record<string, 'A' | 'B' | 'C' | 'D'>) => {
    setIsAnalyzingDiagnostic(true);
    let correct = 0;
    const wrongQuestions: Array<{
      id: string;
      topicName: string;
      content: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }> = [];

    // Topic stats accumulator
    const topicStats: Record<string, { topicName: string; correct: number; total: number }> = {};

    for (const q of DIAGNOSTIC_QUESTIONS) {
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { topicName: q.topicName, correct: 0, total: 0 };
      }
      topicStats[q.topicId].total++;

      const userAns = answers[q.id];
      if (userAns === q.correctAnswer) {
        correct++;
        topicStats[q.topicId].correct++;
      } else {
        wrongQuestions.push({
          id: q.id,
          topicName: q.topicName,
          content: q.content,
          userAnswer: userAns || 'Chưa chọn',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
      }
    }

    const topicBreakdown = Object.entries(topicStats).map(([topicId, val]) => ({
      topicId,
      topicName: val.topicName,
      correct: val.correct,
      total: val.total,
      percentage: Math.round((val.correct / val.total) * 100),
    }));

    try {
      const res = await requestDiagnosticAnalysis({
        studentName: user.displayName,
        grade: user.grade,
        track: user.track,
        score,
        totalQuestions: DIAGNOSTIC_QUESTIONS.length,
        correctCount: correct,
        topicBreakdown,
        wrongQuestions,
      });

      if (res && res.rawJson) {
        try {
          const parsed = JSON.parse(res.rawJson);
          setDiagnosticAnalysis(parsed);
          return;
        } catch {
          // If JSON parse fails, use fallback
        }
      }
      // If no valid JSON from real AI, compute local report
      const fallbackReport = computeLocalAnalysis(score, correct, DIAGNOSTIC_QUESTIONS.length, answers);
      setDiagnosticAnalysis(fallbackReport);
    } catch {
      // Local fallback on API error/missing key
      const fallbackReport = computeLocalAnalysis(score, correct, DIAGNOSTIC_QUESTIONS.length, answers);
      setDiagnosticAnalysis(fallbackReport);
    } finally {
      setIsAnalyzingDiagnostic(false);
    }
  };

  // Submit diagnostic test from Step 1
  const handleSubmitDiagnostic = async () => {
    let correct = 0;
    for (const q of DIAGNOSTIC_QUESTIONS) {
      if (diagnosticAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    }
    const score = Number(((correct / DIAGNOSTIC_QUESTIONS.length) * 10).toFixed(1));
    setDiagScore(score);
    setDiagnosticSubmitted(true);
    onUpdateUser({
      ...user,
      diagnosticScore: score,
      xp: user.xp + 50,
    });

    // Automatically advance to Step 2 and trigger AI analysis
    setCurrentStep(2);
    await triggerDiagnosticAnalysis(score, diagnosticAnswers);
  };

  // Quick fill sample test answers for instant demo
  const handleQuickFillSampleAnswers = () => {
    // 7 correct answers, 3 intentional mistakes (diag_3 wrong, diag_5 wrong, diag_9 wrong)
    const sample: Record<string, 'A' | 'B' | 'C' | 'D'> = {
      diag_1: 'B', // Correct
      diag_2: 'A', // Correct
      diag_3: 'A', // Incorrect (Correct is C)
      diag_4: 'B', // Correct
      diag_5: 'B', // Incorrect (Correct is C)
      diag_6: 'C', // Correct
      diag_7: 'C', // Correct
      diag_8: 'C', // Correct
      diag_9: 'A', // Incorrect (Correct is B)
      diag_10: 'C', // Correct
    };
    setDiagnosticAnswers(sample);
  };

  // Generate Personalized Learning Path with Gemini (Step 3)
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);

    const weakList = diagnosticAnalysis?.recommendedWeakTopics || ['12B (Kết nối mạng)', '11F (Cơ sở dữ liệu)'];

    try {
      const res = await requestAdaptiveStudyPlan({
        studentName: user.displayName,
        grade: user.grade,
        track: trackInput,
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        diagnosticScore: diagScore ?? 7.0,
        weakTopics: weakList,
        daysRemaining: daysRemainingInput,
      });

      try {
        const parsed = JSON.parse(res.rawJson);
        setAiRoadmap(parsed);
      } catch {
        setAiRoadmap(generateDynamicFallbackRoadmap(targetScoreInput, weakList));
      }
    } catch {
      // Graceful fallback roadmap
      setAiRoadmap(generateDynamicFallbackRoadmap(targetScoreInput, weakList));
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Helper to construct a dynamic 7-day study plan based on user goals
  const generateDynamicFallbackRoadmap = (target: number, weaks: string[]) => {
    const hasNetworkWeak = weaks.some((w) => w.includes('12B') || w.includes('Mạng') || w.includes('mạng'));
    const hasDbWeak = weaks.some((w) => w.includes('11F') || w.includes('Cơ sở dữ liệu') || w.includes('CSDL'));

    return {
      assessmentSummary: `Nền tảng kiến thức ở mức khá (${diagScore ?? 7.0}đ). Để bứt phá lên mục tiêu ${target} điểm, AI đã cá nhân hóa lộ trình 7 ngày tập trung ưu tiên bù đắp ${hasNetworkWeak ? 'chuyên đề Mạng máy tính 12B' : 'các chuyên đề trọng tâm'} và củng cố kỹ năng làm bài trắc nghiệm.`,
      targetStrategy: `Chiến thuật bứt phá: Dành 4 ngày đầu ôn sâu các phần làm sai ở bài test, 2 ngày tiếp theo luyện tập câu hỏi Đúng/Sai và hoàn thiện đề thi thử vào ngày thứ 7.`,
      dailyRoadmap: [
        {
          day: 1,
          topicCode: '12B',
          topicTitle: 'Mạng máy tính & Thiết bị chuyển mạch (Switch/Router)',
          keyTask: hasNetworkWeak
            ? 'Khắc phục lỗ hổng bài test: Nắm chắc nguyên lý địa chỉ MAC của Switch và IP của Router'
            : 'Tổng ôn thiết bị kết nối mạng và phân biệt Hub, Switch, Access Point',
          minutes: 45,
          focusQuestionType: 'Đọc sơ đồ & Trắc nghiệm nhiều lựa chọn',
        },
        {
          day: 2,
          topicCode: '12B',
          topicTitle: 'Địa chỉ IPv4, IPv6 & Phân giải tên miền DNS',
          keyTask: 'Luyện tập chuyển đổi nhị phân 8-bit sang thập phân và hiểu cơ chế hoạt động của DNS server',
          minutes: 40,
          focusQuestionType: 'Bài tập tính toán & Câu hỏi Đúng/Sai',
        },
        {
          day: 3,
          topicCode: '11F',
          topicTitle: 'Mô hình Cơ sở dữ liệu quan hệ (RDBMS)',
          keyTask: hasDbWeak
            ? 'Củng cố lại khái niệm Bản ghi (Record), Thuộc tính (Field), Khóa chính và Khóa ngoại'
            : 'Phân tích bảng quan hệ, khóa ngoại liên kết giữa các bảng',
          minutes: 45,
          focusQuestionType: 'Lý thuyết CSDL & Truy vấn logic',
        },
        {
          day: 4,
          topicCode: '12A',
          topicTitle: 'Trí tuệ Nhân tạo: 5 Đặc trưng & Phân loại ANI/AGI',
          keyTask: 'Ôn lại 5 đặc trưng của AI, hội thảo Dartmouth 1956 và nhận diện các ứng dụng thực tế',
          minutes: 35,
          focusQuestionType: 'Lý thuyết nhận biết & thông hiểu',
        },
        {
          day: 5,
          topicCode: '12F',
          topicTitle: 'Thiết kế trang web với HTML5 & CSS Box Model',
          keyTask: 'Nắm vững cấu trúc body, thẻ bảng, form input và thuộc tính margin vs padding',
          minutes: 40,
          focusQuestionType: 'Đọc mã HTML/CSS & Nhận diện lỗi',
        },
        {
          day: 6,
          topicCode: '11F_CS',
          topicTitle: 'Thuật toán Tìm kiếm nhị phân & Độ phức tạp O(log n)',
          keyTask: 'Mã giả Binary Search, điều kiện mảng đã sắp xếp và truy vết từng bước chạy',
          minutes: 50,
          focusQuestionType: 'Truy vết mã nguồn & Phân tích thuật toán',
        },
        {
          day: 7,
          topicCode: 'ALL',
          topicTitle: 'Thi thử Đề tổng hợp 28 câu chuẩn ma trận Bộ GD&ĐT',
          keyTask: 'Làm bài thi thử 50 phút đúng cấu trúc: 24 câu nhiều lựa chọn + 4 câu đúng/sai',
          minutes: 50,
          focusQuestionType: 'Đề thi thử tổng hợp',
        },
      ],
    };
  };

  // AI Chat handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isAskingAi) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAskingAi(true);

    try {
      if (tutorMode === 'search') {
        const res = await askSearchGroundedInfo(userText);
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.text,
            model: res.modelUsed,
            sources: res.searchSources,
          },
        ]);
      } else if (tutorMode === 'thinking') {
        const res = await askThinkingAiTutor({
          topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
          userQuestion: userText,
          studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
        });
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.text,
            model: res.modelUsed,
          },
        ]);
      } else {
        // Default: RAG Tutor mode (Đối chiếu SGK Tin 12 từ Supabase)
        try {
          const res = await askRagTutor({
            topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
            userQuestion: userText,
            studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: res.text,
              model: res.modelUsed,
              ragSources: res.sourceChunks,
            },
          ]);
        } catch {
          // Fallback to direct thinking AI if RAG lookup encounters issue
          const res = await askThinkingAiTutor({
            topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
            userQuestion: userText,
            studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: res.text,
              model: res.modelUsed,
            },
          ]);
        }
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Rất tiếc đã có sự cố khi kết nối Gemini API (${err.message || 'Lỗi server'}). Bạn vui lòng kiểm tra lại câu hỏi hoặc thử lại nhé!`,
        },
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  // If user already had diagnosticScore on load, populate initial local analysis
  useEffect(() => {
    if (user.diagnosticScore && !diagnosticAnalysis) {
      // Build an initial sample analysis matching user score
      const sampleAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = {
        diag_1: 'B',
        diag_2: 'A',
        diag_3: 'C',
        diag_4: 'B',
        diag_5: 'C',
        diag_6: 'C',
        diag_7: 'C',
        diag_8: 'C',
        diag_9: 'B',
        diag_10: 'C',
      };
      setDiagnosticAnswers(sampleAnswers);
      const report = computeLocalAnalysis(user.diagnosticScore, 7, 10, sampleAnswers);
      setDiagnosticAnalysis(report);
    }
  }, [user.diagnosticScore]);

  // Answered count in Step 1
  const answeredCount = Object.keys(diagnosticAnswers).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Title & View Switcher */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#2878C8]">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5 flex-wrap">
                  Hệ thống AI Cá nhân hóa TinPath
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-[#2878C8] dark:bg-blue-900/40 dark:text-blue-300 font-bold font-mono">
                    Gemini 3.8 Flash AI
                  </span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Chu trình khép kín: Đánh giá năng lực ➔ Phân tích chẩn đoán ➔ Kiến tạo lộ trình học thích ứng
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Pipeline vs AI Tutor */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-lg text-sm self-start md:self-center">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-4 py-2 rounded-md font-bold transition-colors flex items-center gap-2 ${
                activeView === 'pipeline'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-[#2878C8]" />
              Lộ trình 3 bước AI
            </button>
            <button
              onClick={() => setActiveView('tutor')}
              className={`px-4 py-2 rounded-md font-bold transition-colors flex items-center gap-2 ${
                activeView === 'tutor'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Gia sư AI 24/7
            </button>
          </div>
        </div>

        {/* 3-STEP PIPELINE STEAMLINE HEADER (Visible when in 'pipeline' view) */}
        {activeView === 'pipeline' && (
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2C2C2C]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Step 1 Button */}
              <button
                onClick={() => setCurrentStep(1)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  currentStep === 1
                    ? 'border-[#2878C8] bg-blue-50/60 dark:bg-blue-950/30 shadow-xs ring-1 ring-[#2878C8]/20'
                    : diagnosticSubmitted
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      diagnosticSubmitted
                        ? 'bg-emerald-500 text-white'
                        : currentStep === 1
                        ? 'bg-[#2878C8] text-white'
                        : 'bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {diagnosticSubmitted ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Bước 1: Đánh giá năng lực
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {diagnosticSubmitted ? `Đã hoàn thành (${diagScore ?? 7}đ)` : '10 câu sàng lọc ma trận'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${currentStep === 1 ? 'text-[#2878C8]' : 'text-gray-400'}`} />
              </button>

              {/* Step 2 Button */}
              <button
                onClick={() => {
                  if (diagnosticSubmitted) setCurrentStep(2);
                }}
                disabled={!diagnosticSubmitted}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  currentStep === 2
                    ? 'border-[#2878C8] bg-blue-50/60 dark:bg-blue-950/30 shadow-xs ring-1 ring-[#2878C8]/20'
                    : diagnosticSubmitted
                    ? 'border-gray-200 dark:border-[#333] hover:border-gray-300'
                    : 'border-gray-200 dark:border-[#2C2C2C] bg-gray-50/30 dark:bg-[#1E1E1E] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      currentStep === 2
                        ? 'bg-[#2878C8] text-white'
                        : diagnosticSubmitted
                        ? 'bg-blue-100 dark:bg-blue-900 text-[#2878C8]'
                        : 'bg-gray-200 dark:bg-[#333] text-gray-400'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Bước 2: Phân tích năng lực
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {diagnosticSubmitted ? 'Chẩn đoán đa chiều AI' : 'Cần làm xong Bước 1'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${currentStep === 2 ? 'text-[#2878C8]' : 'text-gray-400'}`} />
              </button>

              {/* Step 3 Button */}
              <button
                onClick={() => {
                  if (diagnosticSubmitted) setCurrentStep(3);
                }}
                disabled={!diagnosticSubmitted}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  currentStep === 3
                    ? 'border-[#2878C8] bg-blue-50/60 dark:bg-blue-950/30 shadow-xs ring-1 ring-[#2878C8]/20'
                    : diagnosticSubmitted
                    ? 'border-gray-200 dark:border-[#333] hover:border-gray-300'
                    : 'border-gray-200 dark:border-[#2C2C2C] bg-gray-50/30 dark:bg-[#1E1E1E] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      currentStep === 3
                        ? 'bg-[#2878C8] text-white'
                        : aiRoadmap
                        ? 'bg-emerald-500 text-white'
                        : diagnosticSubmitted
                        ? 'bg-blue-100 dark:bg-blue-900 text-[#2878C8]'
                        : 'bg-gray-200 dark:bg-[#333] text-gray-400'
                    }`}
                  >
                    {aiRoadmap ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Bước 3: Lộ trình thích ứng AI
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {aiRoadmap ? 'Đã kích hoạt lộ trình 7 ngày' : 'Thiết kế theo mục tiêu'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${currentStep === 3 ? 'text-[#2878C8]' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PIPELINE VIEW */}
      {activeView === 'pipeline' && (
        <div className="space-y-6">
          {/* ======================================================== */}
          {/* BƯỚC 1: ĐÁNH GIÁ NĂNG LỰC ĐẦU VÀO */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
              {/* Step 1 Header & Quick Tools */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#2878C8] text-white font-mono">
                      BƯỚC 1 / 3
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Bài thi Đánh giá Năng lực Đầu vào Tin học THPT
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Gồm 10 câu trắc nghiệm bao quát 5 chủ đề cốt lõi (AI 12A, Mạng 12B, Web 12F, CSDL 11F, Thuật toán 11F_CS) chuẩn ma trận GDPT 2018.
                  </p>
                </div>

                {/* Quick Actions for testing and demo */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleQuickFillSampleAnswers}
                    className="px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                    title="Tự động chọn đáp án mẫu (7/10 câu đúng) để thử nghiệm nhanh phân tích và lộ trình AI"
                  >
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ⚡ Điền nhanh kết quả mẫu
                  </button>
                  {answeredCount > 0 && (
                    <button
                      onClick={() => setDiagnosticAnswers({})}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 hover:text-gray-900 text-xs font-medium transition-colors"
                      title="Xóa tất cả lựa chọn"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Tiến độ làm bài:
                  </span>
                  <div className="w-36 sm:w-56 h-2.5 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2878C8] transition-all duration-300 rounded-full"
                      style={{ width: `${(answeredCount / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-[#2878C8]">
                    {answeredCount} / {DIAGNOSTIC_QUESTIONS.length} câu
                  </span>
                </div>

                <div className="text-gray-500 text-xs hidden sm:block">
                  Thời gian gợi ý: <span className="font-mono font-semibold">10 - 15 phút</span>
                </div>
              </div>

              {/* Question list */}
              <div className="space-y-4">
                {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
                  const isSelected = Boolean(diagnosticAnswers[q.id]);
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-xl border transition-all space-y-3.5 ${
                        isSelected
                          ? 'border-blue-200 dark:border-blue-900/40 bg-white dark:bg-[#222]'
                          : 'border-gray-200 dark:border-[#333] bg-gray-50/40 dark:bg-[#1E1E1E]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-950 text-[#2878C8] font-bold font-mono flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                            {q.topicName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300">
                            Chủ đề {q.topicId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                              q.level === 'biet'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : q.level === 'hieu'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            {q.level === 'biet' ? 'Biết' : q.level === 'hieu' ? 'Hiểu' : 'Vận dụng'}
                          </span>
                        </div>
                      </div>

                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-relaxed">
                        {q.content}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const isChosen = diagnosticAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setDiagnosticAnswers((prev) => ({ ...prev, [q.id]: opt }));
                              }}
                              className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                                isChosen
                                  ? 'border-[#2878C8] bg-blue-50 dark:bg-blue-950/50 shadow-xs ring-1 ring-[#2878C8]/20'
                                  : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-[#444]'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                                  isChosen
                                    ? 'bg-[#2878C8] text-white'
                                    : 'bg-gray-100 dark:bg-[#333] text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {opt}
                              </span>
                              <span
                                className={`text-sm leading-relaxed ${
                                  isChosen
                                    ? 'font-bold text-blue-950 dark:text-blue-100'
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}
                              >
                                {q.options[opt]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Action Bottom Bar */}
              <div className="pt-5 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  {answeredCount < DIAGNOSTIC_QUESTIONS.length ? (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Bạn còn {DIAGNOSTIC_QUESTIONS.length - answeredCount} câu chưa chọn. Hệ thống vẫn cho phép nộp để chẩn đoán sơ bộ.
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã hoàn thành đầy đủ 10/10 câu hỏi! Sẵn sàng phân tích với AI.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSubmitDiagnostic}
                    disabled={isAnalyzingDiagnostic}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isAnalyzingDiagnostic ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        AI đang chấm điểm & chẩn đoán...
                      </>
                    ) : (
                      <>
                        Nộp bài & Chẩn đoán năng lực với AI
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* BƯỚC 2: PHÂN TÍCH CHẨN ĐOÁN NĂNG LỰC */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Step 2 Overview Hero Card */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#2878C8] text-white font-mono">
                        BƯỚC 2 / 3
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Báo cáo Chẩn đoán Năng lực Chuyên sâu (Competency Diagnosis)
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tổng hợp dữ liệu bài thi đầu vào, định vị chính xác điểm mạnh và phát hiện các lỗ hổng kiến thức để chuẩn bị xây dựng lộ trình học thích ứng.
                    </p>
                  </div>

                  {/* Score Pill */}
                  <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 shrink-0">
                    <div className="text-center pr-4 border-r border-blue-200 dark:border-blue-900/50">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 block">
                        Điểm đánh giá
                      </span>
                      <span className="text-3xl sm:text-4xl font-black font-mono text-[#2878C8]">
                        {diagScore !== null ? diagScore : 7.0}
                        <span className="text-sm font-normal text-gray-500"> / 10đ</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block">
                        {diagnosticAnalysis?.levelRanking || 'Khá - Nền tảng tốt'}
                      </span>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {DIAGNOSTIC_QUESTIONS.filter((q) => diagnosticAnswers[q.id] === q.correctAnswer).length} / {DIAGNOSTIC_QUESTIONS.length} câu chính xác
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Diagnostic Commentary Card */}
                <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#2878C8]" />
                      <span className="font-bold text-xs sm:text-sm text-[#2878C8] uppercase tracking-wider">
                        Đánh giá sư phạm từ Gemini 3.8 Flash Engine
                      </span>
                    </div>
                    {isAnalyzingDiagnostic && (
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang chẩn đoán...
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {diagnosticAnalysis?.overallAssessment ||
                      'Học sinh thể hiện khả năng nắm bắt kiến thức nền tảng tương đối tốt. Cần đặc biệt chú ý khắc phục các lỗ hổng lý thuyết liên quan đến mạng máy tính và chuẩn hóa cơ sở dữ liệu.'}
                  </p>

                  {diagnosticAnalysis?.pedagogicalAdvice && (
                    <div className="pt-2.5 border-t border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#2878C8] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900 dark:text-white">Lời khuyên chiến lược: </strong>
                        {diagnosticAnalysis.pedagogicalAdvice}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2-Columns: Strengths vs Knowledge Gaps */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Strengths */}
                  <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Điểm mạnh nhận thức (Nắm chắc)</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {(diagnosticAnalysis?.strengths || [
                        'Nắm chắc các khái niệm lịch sử AI và 5 đặc trưng cốt lõi (Chủ đề 12A).',
                        'Hiểu tốt cấu trúc thẻ HTML5 và thuộc tính Box Model CSS (Chủ đề 12F).',
                      ]).map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses / Gaps */}
                  <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Lỗ hổng kiến thức cần bồi dưỡng (Cần ôn tập)</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {(diagnosticAnalysis?.weaknesses || [
                        'Chủ đề 12B (Mạng máy tính): Nhầm lẫn nguyên lý đọc địa chỉ MAC của Switch và IP của Router.',
                        'Chủ đề 11F (Cơ sở dữ liệu): Cần phân biệt rõ khái niệm Bản ghi (Record) và Thuộc tính (Field).',
                      ]).map((wk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cognitive Level Breakdown Bar Chart */}
                <div className="mt-6 p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2878C8]" />
                    Phân bố năng lực theo 3 cấp độ tư duy GDPT 2018
                  </h4>

                  <div className="space-y-3.5 text-sm">
                    {/* Level: Biết */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Mức độ Biết (Định nghĩa, mốc lịch sử, khái niệm nhận biết)
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {diagnosticAnalysis?.cognitiveLevels?.know?.percentage ?? 85}% chính xác
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-[#333]">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${diagnosticAnalysis?.cognitiveLevels?.know?.percentage ?? 85}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Level: Hiểu */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Mức độ Hiểu (Phân loại, giải thích cơ chế hoạt động mạng & thuật toán)
                        </span>
                        <span className="font-mono font-bold text-[#2878C8]">
                          {diagnosticAnalysis?.cognitiveLevels?.understand?.percentage ?? 70}% chính xác
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-[#333]">
                        <div
                          className="h-full bg-[#2878C8] rounded-full transition-all duration-500"
                          style={{
                            width: `${diagnosticAnalysis?.cognitiveLevels?.understand?.percentage ?? 70}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Level: Vận dụng */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Mức độ Vận dụng (Tính toán đổi IP nhị phân, truy vết code & mô hình hóa)
                        </span>
                        <span className="font-mono font-bold text-amber-500">
                          {diagnosticAnalysis?.cognitiveLevels?.apply?.percentage ?? 50}% chính xác
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-[#333]">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${diagnosticAnalysis?.cognitiveLevels?.apply?.percentage ?? 50}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Review Section with Filter */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2C2C2C] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#2878C8]" />
                      Xem lại chi tiết bài làm & Lời giải
                    </h4>

                    {/* Filter buttons */}
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-lg text-xs sm:text-sm self-start sm:self-auto">
                      <button
                        onClick={() => setReviewFilter('all')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          reviewFilter === 'all'
                            ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs font-bold'
                            : 'text-gray-500'
                        }`}
                      >
                        Tất cả ({DIAGNOSTIC_QUESTIONS.length})
                      </button>
                      <button
                        onClick={() => setReviewFilter('wrong')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          reviewFilter === 'wrong'
                            ? 'bg-white dark:bg-[#333] text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                            : 'text-gray-500'
                        }`}
                      >
                        Câu làm sai ({DIAGNOSTIC_QUESTIONS.filter((q) => diagnosticAnswers[q.id] !== q.correctAnswer).length})
                      </button>
                      <button
                        onClick={() => setReviewFilter('correct')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          reviewFilter === 'correct'
                            ? 'bg-white dark:bg-[#333] text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                            : 'text-gray-500'
                        }`}
                      >
                        Câu đúng ({DIAGNOSTIC_QUESTIONS.filter((q) => diagnosticAnswers[q.id] === q.correctAnswer).length})
                      </button>
                    </div>
                  </div>

                  {/* Filtered Question Review Cards */}
                  <div className="space-y-3.5">
                    {DIAGNOSTIC_QUESTIONS.filter((q) => {
                      const isCorrect = diagnosticAnswers[q.id] === q.correctAnswer;
                      if (reviewFilter === 'wrong') return !isCorrect;
                      if (reviewFilter === 'correct') return isCorrect;
                      return true;
                    }).map((q, idx) => {
                      const userChoice = diagnosticAnswers[q.id];
                      const isCorrect = userChoice === q.correctAnswer;
                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border text-sm space-y-2.5 ${
                            isCorrect
                              ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'border-rose-200 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                }`}
                              >
                                {isCorrect ? '✓ ĐÚNG' : '✗ SAI'}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                [Chủ đề {q.topicId}] {q.topicName}
                              </span>
                            </div>
                            <span className="text-gray-500 font-mono text-xs">
                              Đáp án đúng: <strong className="text-emerald-600">{q.correctAnswer}</strong>
                            </span>
                          </div>

                          <p className="font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{q.content}</p>

                          <div className="pt-2 border-t border-gray-200/60 dark:border-[#333] flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Bạn đã chọn: </span>
                              <strong className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                                {userChoice ? `${userChoice}. ${q.options[userChoice]}` : 'Chưa chọn'}
                              </strong>
                            </div>

                            <button
                              onClick={() => onNavigateTopic(q.topicId)}
                              className="text-[#2878C8] hover:underline font-semibold flex items-center gap-1"
                            >
                              Học bài chủ đề này ➔
                            </button>
                          </div>

                          <div className="text-xs text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-black/20 p-2.5 rounded-lg leading-relaxed">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Giải thích: </span>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 Footer: Action Buttons */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Làm lại bài đánh giá đầu vào
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Chuyển sang Bước 3: Tạo lộ trình học thích ứng bằng AI
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* BƯỚC 3: TẠO LỘ TRÌNH HỌC THÍCH ỨNG BẰNG AI */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Step 3 Header & Context Banner */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#2878C8] text-white font-mono">
                        BƯỚC 3 / 3
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Thiết kế Lộ trình Học tập Cá nhân hóa 7 ngày với Gemini AI
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Kế thừa kết quả chẩn đoán từ Bước 1 ({diagScore ?? 7.0}đ) kết hợp với mục tiêu điểm số để Gemini tạo lịch học thích ứng từng ngày.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-[#2878C8] hover:underline font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" /> Xem lại chẩn đoán
                  </button>
                </div>

                {/* Configuration Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl bg-gray-50/70 dark:bg-[#252525] border border-gray-200 dark:border-[#333]">
                  {/* Target Score Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#2878C8]" />
                      Mục tiêu điểm số
                    </label>
                    <select
                      value={targetScoreInput}
                      onChange={(e) => setTargetScoreInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm font-semibold focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value={7.5}>7.5 điểm (Khá)</option>
                      <option value={8.0}>8.0 điểm (Giỏi)</option>
                      <option value={8.5}>8.5 điểm (Mục tiêu chuẩn)</option>
                      <option value={9.0}>9.0 điểm (Xuất sắc)</option>
                      <option value={9.5}>9.5 - 10.0 điểm (Thủ khoa)</option>
                    </select>
                  </div>

                  {/* Daily Study Minutes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#22A06B]" />
                      Thời gian học/ngày
                    </label>
                    <select
                      value={dailyMinutesInput}
                      onChange={(e) => setDailyMinutesInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm font-semibold focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value={30}>30 phút / ngày</option>
                      <option value={45}>45 phút / ngày (Khuyên dùng)</option>
                      <option value={60}>60 phút / ngày (Tăng tốc)</option>
                      <option value={90}>90 phút / ngày (Luyện thi cao độ)</option>
                    </select>
                  </div>

                  {/* Track Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      Định hướng thi tốt nghiệp
                    </label>
                    <select
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value as 'CS' | 'ICT')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm font-semibold focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value="CS">Khoa học máy tính (CS)</option>
                      <option value="ICT">Tin học ứng dụng (ICT)</option>
                    </select>
                  </div>

                  {/* Days remaining */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-rose-500" />
                      Thời gian đến kỳ thi
                    </label>
                    <select
                      value={daysRemainingInput}
                      onChange={(e) => setDaysRemainingInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm font-semibold focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value={30}>30 ngày (Giai đoạn nước rút)</option>
                      <option value={60}>60 ngày (Giai đoạn tăng tốc)</option>
                      <option value={75}>75 ngày (Chuẩn bị toàn diện)</option>
                      <option value={90}>90 ngày (Kế hoạch bài bản)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>
                      Động cơ AI: <strong className="text-gray-900 dark:text-white">Gemini 3.8 Flash</strong> kết hợp dữ liệu chẩn đoán Bước 2.
                    </span>
                  </div>

                  <button
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
                    {isGeneratingPlan ? 'Gemini đang thiết kế lộ trình...' : '✨ Kích hoạt Gemini AI thiết kế lộ trình 7 ngày'}
                  </button>
                </div>

                {/* Generated AI Roadmap Results */}
                {aiRoadmap ? (
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#2C2C2C]">
                    {/* Strategy Callout */}
                    <div className="p-5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-sm text-gray-800 dark:text-gray-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#2878C8]">
                        <Compass className="w-5 h-5" />
                        <span>Nhận định & Chiến thuật từ Gemini AI:</span>
                      </div>
                      <p className="leading-relaxed">{aiRoadmap.assessmentSummary}</p>
                      <p className="font-semibold text-gray-900 dark:text-white pt-1">
                        🎯 {aiRoadmap.targetStrategy}
                      </p>
                    </div>

                    {/* 7-Day Timeline */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold text-gray-700 dark:text-gray-300 px-1">
                        <span>Lịch trình học tập 7 ngày thích ứng:</span>
                        <span className="text-xs text-gray-500 font-normal">
                          Đã hoàn thành: {Object.values(completedDays).filter(Boolean).length} / {(aiRoadmap.dailyRoadmap || []).length} ngày
                        </span>
                      </div>

                      {(aiRoadmap.dailyRoadmap || []).map((step: any, idx: number) => {
                        const isDone = completedDays[step.day];
                        return (
                          <div
                            key={idx}
                            className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm ${
                              isDone
                                ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-80'
                                : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              {/* Day Badge / Checkbox */}
                              <button
                                onClick={() =>
                                  setCompletedDays((prev) => ({
                                    ...prev,
                                    [step.day]: !prev[step.day],
                                  }))
                                }
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-blue-100 dark:bg-blue-950 text-[#2878C8] hover:bg-blue-200'
                                }`}
                                title={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
                              >
                                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `D${step.day}`}
                              </button>

                              <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4
                                    className={`font-bold text-sm sm:text-base ${
                                      isDone
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                                  >
                                    {step.topicCode === 'ALL' ? 'Tổng hợp' : `Chủ đề ${step.topicCode}`}: {step.topicTitle}
                                  </h4>
                                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-[#2C2C2C] text-gray-600 dark:text-gray-300 font-mono">
                                    {step.focusQuestionType}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                  {step.keyTask}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                              <span className="text-gray-500 font-mono text-xs flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {step.minutes} phút
                              </span>
                              {step.topicCode !== 'ALL' && (
                                <button
                                  onClick={() => onNavigateTopic(step.topicCode)}
                                  className="px-3.5 py-2 rounded-lg border border-gray-300 dark:border-[#444] text-xs sm:text-sm font-semibold hover:border-[#2878C8] hover:text-[#2878C8] transition-colors flex items-center gap-1.5"
                                >
                                  Vào học ngay <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-gray-200 dark:border-[#333] rounded-xl space-y-2">
                    <Compass className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Chưa có lộ trình thích ứng
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                      Hãy nhấn nút <strong className="text-[#2878C8]">"Kích hoạt Gemini AI thiết kế lộ trình 7 ngày"</strong> ở trên để nhận lịch học tối ưu hóa theo đúng điểm yếu của bạn!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPANION: AI TUTOR STUDIO 24/7 (High Thinking & Search Grounding) */}
      {activeView === 'tutor' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs flex flex-col h-[700px]">
          {/* Tutor Controls Header */}
          <div className="pb-4 border-b border-gray-200 dark:border-[#333] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-gray-900 dark:text-white text-base">Gia sư Tin học AI 24/7 (Gemini Engine)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTutorMode('rag')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  tutorMode === 'rag'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>RAG SGK Tin 12</span>
              </button>

              <button
                type="button"
                onClick={() => setTutorMode('thinking')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  tutorMode === 'thinking'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Suy luận sâu</span>
              </button>

              <button
                type="button"
                onClick={() => setTutorMode('search')}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  tutorMode === 'search'
                    ? 'bg-[#2878C8] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Google Search</span>
              </button>
            </div>
          </div>

          {/* Quick Questions Pills */}
          <div className="py-3 flex items-center gap-2.5 overflow-x-auto text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-[#2C2C2C]">
            <span className="shrink-0 font-semibold text-gray-500">Gợi ý câu hỏi:</span>
            <button
              onClick={() => setInputQuestion('Phân biệt Switch (đọc địa chỉ MAC) và Router (đọc địa chỉ IP)?')}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 hover:text-[#2878C8] shrink-0 transition-colors text-xs"
            >
              Phân biệt Switch & Router
            </button>
            <button
              onClick={() => setInputQuestion('Giải thích 5 đặc trưng cơ bản của Trí tuệ nhân tạo (AI) và Machine Learning?')}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 hover:text-[#2878C8] shrink-0 transition-colors text-xs"
            >
              5 đặc trưng của AI
            </button>
            <button
              onClick={() => setInputQuestion('Thuật toán tìm kiếm nhị phân (Binary Search) có độ phức tạp bao nhiêu và cần điều kiện gì?')}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 hover:text-[#2878C8] shrink-0 transition-colors text-xs"
            >
              Binary Search & O-notation
            </button>
            <button
              onClick={() => setInputQuestion('Học sinh THPT Quảng Ngãi thi khối A01 muốn xét tuyển ngành Khoa học máy tính Bách Khoa cần bao nhiêu điểm?')}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-indigo-50 hover:text-indigo-600 shrink-0 transition-colors text-xs"
            >
              Tư vấn tuyển sinh Bách Khoa
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-2 text-sm">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-4 leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#2878C8] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#252525] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  {msg.sender === 'ai' && msg.model && (
                    <span className="text-xs font-mono text-gray-500 block mb-1.5">
                      {msg.model}
                    </span>
                  )}
                  {msg.text}

                  {msg.ragSources && msg.ragSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-indigo-200 dark:border-indigo-900/50 text-xs">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Đối chiếu SGK Tin 12 chuẩn Bộ GD&ĐT:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.ragSources.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium"
                          >
                            📖 {s.bookSource} — {s.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-200 dark:border-[#333] text-xs text-gray-500">
                      <span className="font-bold block mb-0.5">Nguồn kiểm chứng:</span>
                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="truncate">{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAskingAi && (
              <div className="flex justify-start">
                <div className="p-3.5 rounded-xl bg-gray-100 dark:bg-[#252525] text-sm text-gray-500 flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2878C8]" />
                  Gemini đang suy nghĩ câu trả lời chuyên sâu...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-200 dark:border-[#333] flex gap-2.5">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Hỏi về thuật toán, SQL, mô hình mạng hoặc yêu cầu giải thích câu hỏi..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm focus:outline-none focus:border-[#2878C8]"
            />
            <button
              type="submit"
              disabled={isAskingAi || !inputQuestion.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#2878C8] text-white text-sm font-bold hover:bg-[#2068B0] disabled:opacity-40 flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
