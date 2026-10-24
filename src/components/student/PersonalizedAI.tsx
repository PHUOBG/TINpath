import React, { useState, useEffect, useMemo } from 'react';
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
  Flame,
  FileText,
  BarChart3,
  Play,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  X,
  Circle,
} from 'lucide-react';
import {
  UserProfile,
  ExamAttempt,
  SubjectTopicId,
  Exam,
  DiagnosticReport,
  AiRoadmapPlan,
  RoadmapDayItem,
  TopicMasteryInfo,
  TopicMasteryStatus,
} from '../../types';
import { OFFICIAL_EXAMS } from '../../data/officialExamsData';
import { TOPIC_LESSONS } from '../../data/topicsData';
import {
  askThinkingAiTutor,
  askSearchGroundedInfo,
  requestAdaptiveStudyPlan,
  requestDiagnosticAnalysis,
} from '../../services/geminiClient';
import { askRagTutor } from '../../services/ragService';
import { storageService } from '../../services/storageService';

interface PersonalizedAIProps {
  user: UserProfile;
  examAttempts: ExamAttempt[];
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateTopic: (topicId: SubjectTopicId) => void;
  onStartExam?: (examId: string) => void;
  onStartTopicQuiz?: (topicId: SubjectTopicId, count?: number) => void;
  onStartDailyChallenge?: () => void;
  onNavigateTab?: (tab: string) => void;
}

type ActiveTab = 'overview' | 'assessment' | 'knowledge_map' | 'diagnosis' | 'roadmap' | 'tutor';

export const PersonalizedAI: React.FC<PersonalizedAIProps> = ({
  user,
  examAttempts,
  onUpdateUser,
  onNavigateTopic,
  onStartExam,
  onStartTopicQuiz,
  onStartDailyChallenge,
  onNavigateTab,
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Stored diagnostic report & AI roadmap
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(() => {
    return storageService.getDiagnosticReport();
  });

  const [aiRoadmap, setAiRoadmap] = useState<AiRoadmapPlan | null>(() => {
    return storageService.getRoadmapPlan();
  });

  // Selected topic for detail modal drawer
  const [selectedTopicId, setSelectedTopicId] = useState<SubjectTopicId | null>(null);

  // Filter for knowledge map
  const [masteryFilter, setMasteryFilter] = useState<'all' | TopicMasteryStatus>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | '10' | '11' | '12'>('all');

  // Diagnostic Test Taking State
  const [selectedExamId, setSelectedExamId] = useState<string>(OFFICIAL_EXAMS[0].id);
  const currentExam = useMemo(() => {
    return OFFICIAL_EXAMS.find((e) => e.id === selectedExamId) || OFFICIAL_EXAMS[0];
  }, [selectedExamId]);

  const part2Questions = useMemo(() => {
    return currentExam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === user.track
    );
  }, [currentExam, user.track]);

  const [part1Answers, setPart1Answers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [part2Answers, setPart2Answers] = useState<Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>>({});
  const [isAnalyzingDiagnostic, setIsAnalyzingDiagnostic] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  // Roadmap generation inputs
  const [targetScoreInput, setTargetScoreInput] = useState<number>(user.targetScore || 8.5);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(user.dailyStudyMinutes || 45);
  const [trackInput, setTrackInput] = useState<'CS' | 'ICT'>(user.track || 'CS');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Examination countdown calculation
  const examDateStr = '2026-06-27';
  const daysRemaining = useMemo(() => {
    const diff = new Date(examDateStr).getTime() - Date.now();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  // AI Tutor Studio Chat State
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
      text: `Xin chào ${user.displayName}! Mình là Trợ lý Gia sư AI Tin học THPT TinPath. Bạn có thể hỏi bất kỳ khái niệm nào trong SGK Tin học 10, 11, 12, nhờ giải thích các lỗi sai trắc nghiệm hoặc tra cứu quy chế thi tốt nghiệp THPT mới nhất!`,
      model: 'Gemini Flash + RAG SGK GDPT 2018',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Compute live Topic Mastery using real student data
  const topicMastery = useMemo(() => {
    return storageService.calculateTopicMastery(examAttempts, diagnosticReport);
  }, [examAttempts, diagnosticReport]);

  // Derived metrics for overview
  const currentProficiency = useMemo(() => {
    if (diagnosticReport?.score !== undefined) {
      return diagnosticReport.score;
    }
    if (user.diagnosticScore !== undefined && user.diagnosticScore !== null) {
      return user.diagnosticScore;
    }
    if (examAttempts.length > 0) {
      const sum = examAttempts.reduce((acc, a) => acc + a.totalScore, 0);
      return Number((sum / examAttempts.length).toFixed(2));
    }
    return null;
  }, [diagnosticReport, user.diagnosticScore, examAttempts]);

  // Top strongest and weakest topics based on actual accuracy
  const { strongTopicsList, weakTopicsList } = useMemo(() => {
    const list = Object.values(topicMastery);
    const assessed = list.filter((t) => t.totalAnswered >= 2);
    const strong = assessed.filter((t) => t.percentage >= 70).sort((a, b) => b.percentage - a.percentage);
    const weak = assessed.filter((t) => t.percentage < 70).sort((a, b) => a.percentage - b.percentage);
    return {
      strongTopicsList: strong.length > 0 ? strong : list.slice(0, 2),
      weakTopicsList: weak.length > 0 ? weak : list.slice(2, 4),
    };
  }, [topicMastery]);

  // Active today's task from Roadmap
  const todaysTask = useMemo(() => {
    if (!aiRoadmap || !aiRoadmap.dailyRoadmap || aiRoadmap.dailyRoadmap.length === 0) {
      return null;
    }
    const inProgress = aiRoadmap.dailyRoadmap.find((d) => d.status === 'in_progress');
    if (inProgress) return inProgress;
    const nextTodo = aiRoadmap.dailyRoadmap.find((d) => d.status === 'todo');
    return nextTodo || aiRoadmap.dailyRoadmap[aiRoadmap.dailyRoadmap.length - 1];
  }, [aiRoadmap]);

  // Initialize or fallback Roadmap on load if not set
  useEffect(() => {
    if (!aiRoadmap) {
      const defaultPlan = generateDynamicFallbackRoadmap(user.targetScore || 8.5, weakTopicsList.map((w) => w.topicId));
      storageService.saveRoadmapPlan(defaultPlan);
      setAiRoadmap(defaultPlan);
    }
  }, []);

  // Calculate official Ministry exam score
  const calculateExamScore = (
    exam: Exam,
    p1Ans: Record<string, 'A' | 'B' | 'C' | 'D'>,
    p2Ans: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>
  ) => {
    let part1Score = 0;
    let part1Correct = 0;
    for (const q of exam.part1Questions) {
      if (p1Ans[q.id] === q.correctAnswer) {
        part1Score += 0.25;
        part1Correct += 1;
      }
    }

    const p2Filtered = exam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === user.track
    );

    let part2Score = 0;
    const part2Details = p2Filtered.map((q) => {
      const selections = p2Ans[q.id] || {};
      let correctStatements = 0;
      for (const stmt of q.statements) {
        if (selections[stmt.id] === stmt.isCorrect) {
          correctStatements += 1;
        }
      }
      let qScore = 0;
      if (correctStatements === 1) qScore = 0.1;
      else if (correctStatements === 2) qScore = 0.25;
      else if (correctStatements === 3) qScore = 0.5;
      else if (correctStatements === 4) qScore = 1.0;

      part2Score += qScore;
      return {
        questionId: q.id,
        correctStatements,
        score: qScore,
      };
    });

    const totalScore = Math.min(10, Number((part1Score + part2Score).toFixed(2)));

    return {
      totalScore,
      part1Score: Number(part1Score.toFixed(2)),
      part1Correct,
      part2Score: Number(part2Score.toFixed(2)),
      part2Details,
    };
  };

  // Local fallback diagnostic report
  const computeLocalAnalysis = (
    score: number,
    wrongQuestions: Array<{ topicId: SubjectTopicId; topicName: string; content: string; userAnswer: string; correctAnswer: string; explanation: string }>,
    topicBreakdown: Array<{ topicId: SubjectTopicId; topicName: string; correct: number; total: number; percentage: number }>,
    scores: { part1Correct: number; part1Score: number; part2Score: number }
  ) => {
    const weakTopics = topicBreakdown.filter((t) => t.percentage < 70).map((t) => t.topicId);
    const weakTopicNames = topicBreakdown.filter((t) => t.percentage < 70).map((t) => t.topicName);
    const strongTopicNames = topicBreakdown.filter((t) => t.percentage >= 70).map((t) => t.topicName);

    let ranking = 'Khá - Nền tảng tốt, cần nâng cao vận dụng';
    let assessment = `Học sinh đạt ${score.toFixed(2)}/10 điểm trong đề thi tốt nghiệp THPT chuẩn (Phần I: ${scores.part1Score}đ, Phần II: ${scores.part2Score}đ). Nắm được kiến thức cốt lõi nhưng còn thiếu sót ở các câu hỏi phân hóa thực tiễn.`;

    if (score >= 9.0) {
      ranking = 'Xuất sắc - Nền tảng vững vàng toàn diện';
      assessment = `Học sinh có tư duy Tin học xuất sắc với ${score.toFixed(2)}/10 điểm trong đề thi tốt nghiệp THPTQG chuẩn. Làm chủ cả phần trắc nghiệm nhiều phương án lẫn đúng/sai.`;
    } else if (score >= 8.0) {
      ranking = 'Giỏi - Nắm chắc kiến thức cốt lõi';
      assessment = `Kết quả thi THPTQG đạt ${score.toFixed(2)}/10 điểm rất ấn tượng. Nền tảng kiến thức vững vàng, chỉ gặp một vài sai sót nhỏ ở các câu hỏi bẫy hoặc vận dụng thực tiễn.`;
    } else if (score < 5.0) {
      ranking = 'Cần củng cố nền tảng kiến thức';
      assessment = `Kết quả đạt ${score.toFixed(2)}/10 điểm cho thấy học sinh còn bị hổng kiến thức nền tảng trong chương trình lớp 11 và 12. Cần bám sát lộ trình từng ngày của TinPath để ôn tập lại.`;
    }

    const weaknesses = wrongQuestions.slice(0, 4).map((w) => {
      return `Lỗ hổng [${w.topicName}]: ${w.content.slice(0, 90)}... (Bạn chọn: ${w.userAnswer} → Đáp án đúng: ${w.correctAnswer})`;
    });

    if (weaknesses.length === 0) {
      weaknesses.push('Cần rèn luyện thêm tốc độ phản xạ với các câu hỏi bẫy định nghĩa.');
    }

    const strengths = strongTopicNames.slice(0, 3).map((st) => `Nắm vững kiến thức chuyên đề ${st}.`);
    if (strengths.length === 0) {
      strengths.push('Có tinh thần làm bài nghiêm túc và sẵn sàng bồi đắp kiến thức.');
    }

    return {
      overallAssessment: assessment,
      levelRanking: ranking,
      strengths,
      weaknesses,
      cognitiveLevels: {
        know: { percentage: Math.min(100, Math.round(score * 10 + 10)), evaluation: 'Nắm chắc kiến thức định nghĩa nhận biết' },
        understand: { percentage: Math.min(100, Math.round(score * 10)), evaluation: 'Hiểu tốt cơ chế và quy trình mạng & CSDL' },
        apply: { percentage: Math.min(100, Math.max(30, Math.round(score * 10 - 15))), evaluation: 'Cần luyện thêm dạng bài đổi nhị phân & thuật toán' },
      },
      pedagogicalAdvice: `Dành 45 phút mỗi ngày theo lộ trình: 20 phút đọc lại lý thuyết các phần làm sai (${weakTopicNames.slice(0, 2).join(', ') || 'Mạng & CSDL'}), 20 phút giải bài tập trắc nghiệm và 5 phút đối chiếu lời giải chi tiết.`,
      recommendedWeakTopics: weakTopics.length > 0 ? weakTopics : ['12B', '11F'],
    };
  };

  // Run Real AI Diagnostic Analysis via Gemini
  const runAiAnalysisOnExam = async (
    exam: Exam,
    p1Ans: Record<string, 'A' | 'B' | 'C' | 'D'>,
    p2Ans: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>,
    finalScore: number,
    scoresData: any
  ) => {
    setIsAnalyzingDiagnostic(true);

    const wrongQuestions: Array<{
      id: string;
      topicId: SubjectTopicId;
      topicName: string;
      content: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }> = [];

    const topicStats: Record<string, { topicName: string; correct: number; total: number }> = {};

    // 1. Part 1 breakdown
    for (const q of exam.part1Questions) {
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { topicName: q.topicName, correct: 0, total: 0 };
      }
      topicStats[q.topicId].total += 1;

      const userChoice = p1Ans[q.id];
      if (userChoice === q.correctAnswer) {
        topicStats[q.topicId].correct += 1;
      } else {
        const userChoiceText = userChoice ? `${userChoice}. ${q.options[userChoice]}` : 'Chưa chọn';
        const correctChoiceText = `${q.correctAnswer}. ${q.options[q.correctAnswer]}`;
        wrongQuestions.push({
          id: q.id,
          topicId: q.topicId,
          topicName: q.topicName,
          content: `[Phần I] ${q.content}`,
          userAnswer: userChoiceText,
          correctAnswer: correctChoiceText,
          explanation: q.explanation || 'Đối chiếu chuẩn kiến thức SGK GDPT 2018.',
        });
      }
    }

    // 2. Part 2 breakdown
    const p2Filtered = exam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === user.track
    );

    for (const q of p2Filtered) {
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { topicName: q.topicName, correct: 0, total: 0 };
      }
      topicStats[q.topicId].total += 4;

      const selections = p2Ans[q.id] || {};
      for (const stmt of q.statements) {
        const userStatementVal = selections[stmt.id];
        if (userStatementVal === stmt.isCorrect) {
          topicStats[q.topicId].correct += 1;
        } else {
          wrongQuestions.push({
            id: `${q.id}_${stmt.id}`,
            topicId: q.topicId,
            topicName: q.topicName,
            content: `[Phần II - ${q.context}] Ý ${stmt.id.toUpperCase()}: "${stmt.statement}"`,
            userAnswer: userStatementVal === undefined ? 'Chưa trả lời' : userStatementVal ? 'Chọn Đúng' : 'Chọn Sai',
            correctAnswer: stmt.isCorrect ? 'Đáp án Đúng' : 'Đáp án Sai',
            explanation: stmt.explanation || 'Xem lại bài học chuyên đề trong SGK.',
          });
        }
      }
    }

    const topicBreakdown = Object.entries(topicStats).map(([topicId, val]) => ({
      topicId: topicId as SubjectTopicId,
      topicName: val.topicName,
      correct: val.correct,
      total: val.total,
      percentage: Math.round((val.correct / (val.total || 1)) * 100),
    }));

    let analysisResult: any;

    try {
      const res = await requestDiagnosticAnalysis({
        studentName: user.displayName,
        grade: user.grade,
        track: user.track,
        score: finalScore,
        totalQuestions: 28,
        correctCount: scoresData.part1Correct,
        topicBreakdown,
        wrongQuestions,
      });

      if (res && res.rawJson) {
        try {
          analysisResult = JSON.parse(res.rawJson);
        } catch {
          analysisResult = computeLocalAnalysis(finalScore, wrongQuestions, topicBreakdown, scoresData);
        }
      } else {
        analysisResult = computeLocalAnalysis(finalScore, wrongQuestions, topicBreakdown, scoresData);
      }
    } catch {
      analysisResult = computeLocalAnalysis(finalScore, wrongQuestions, topicBreakdown, scoresData);
    } finally {
      setIsAnalyzingDiagnostic(false);
    }

    const report: DiagnosticReport = {
      id: `diag_${Date.now()}`,
      score: finalScore,
      submittedAt: new Date().toISOString(),
      examId: exam.id,
      examTitle: exam.title,
      part1Score: scoresData.part1Score,
      part1Correct: scoresData.part1Correct,
      part2Score: scoresData.part2Score,
      part2Details: scoresData.part2Details,
      topicBreakdown,
      wrongQuestions,
      analysis: analysisResult,
    };

    storageService.saveDiagnosticReport(report);
    setDiagnosticReport(report);

    // Automatically trigger roadmap adaptation for this new diagnostic result
    const newRoadmap = generateDynamicFallbackRoadmap(user.targetScore || 8.5, analysisResult.recommendedWeakTopics || []);
    storageService.saveRoadmapPlan(newRoadmap);
    setAiRoadmap(newRoadmap);

    onUpdateUser({
      ...user,
      diagnosticScore: finalScore,
    });

    setActiveTab('diagnosis');
  };

  // Submit full THPTQG diagnostic test from Assessment Tab
  const handleSubmitDiagnostic = async () => {
    const scores = calculateExamScore(currentExam, part1Answers, part2Answers);
    await runAiAnalysisOnExam(currentExam, part1Answers, part2Answers, scores.totalScore, scores);
  };

  // Immediately use student's existing exam attempt for AI diagnosis
  const handleUseExistingExamAttempt = async (attempt: ExamAttempt) => {
    const matchingExam = OFFICIAL_EXAMS.find((e) => e.id === attempt.examId) || OFFICIAL_EXAMS[0];
    setSelectedExamId(matchingExam.id);

    const p1: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
    const p2: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }> = {};

    Object.values(attempt.answers || {}).forEach((ans) => {
      if (ans.type === 'single_choice' && ans.selectedOption) {
        p1[ans.questionId] = ans.selectedOption;
      } else if (ans.type === 'true_false_group' && ans.trueFalseSelections) {
        p2[ans.questionId] = ans.trueFalseSelections;
      }
    });

    const scores = calculateExamScore(matchingExam, p1, p2);
    setPart1Answers(p1);
    setPart2Answers(p2);

    await runAiAnalysisOnExam(matchingExam, p1, p2, attempt.totalScore, scores);
  };

  // Quick fill sample test answers for instant demo
  const handleQuickFillSampleAnswers = () => {
    const p1: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
    currentExam.part1Questions.forEach((q, idx) => {
      if (idx === 3 || idx === 7 || idx === 12 || idx === 18) {
        const wrongOpts = (['A', 'B', 'C', 'D'] as const).filter((o) => o !== q.correctAnswer);
        p1[q.id] = wrongOpts[0];
      } else {
        p1[q.id] = q.correctAnswer;
      }
    });

    const p2: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }> = {};
    part2Questions.forEach((q, qIdx) => {
      p2[q.id] = {};
      q.statements.forEach((stmt, sIdx) => {
        if ((qIdx === 0 && sIdx === 1) || (qIdx === 1 && sIdx === 2) || (qIdx === 2 && sIdx === 0)) {
          p2[q.id][stmt.id] = !stmt.isCorrect;
        } else {
          p2[q.id][stmt.id] = stmt.isCorrect;
        }
      });
    });

    setPart1Answers(p1);
    setPart2Answers(p2);
  };

  // Generate Personalized Learning Path with Gemini (Roadmap Tab)
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);

    const weakList = diagnosticReport?.analysis?.recommendedWeakTopics || weakTopicsList.map((w) => w.topicId);

    try {
      const res = await requestAdaptiveStudyPlan({
        studentName: user.displayName,
        grade: user.grade,
        track: trackInput,
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        diagnosticScore: currentProficiency ?? 7.0,
        weakTopics: weakList,
        daysRemaining,
      });

      let parsed: any;
      if (res && res.rawJson) {
        try {
          parsed = JSON.parse(res.rawJson);
        } catch {
          parsed = generateDynamicFallbackRoadmap(targetScoreInput, weakList);
        }
      } else {
        parsed = generateDynamicFallbackRoadmap(targetScoreInput, weakList);
      }

      // Preserve previously completed days if re-generating!
      const previousCompletedDays = new Set(
        aiRoadmap?.dailyRoadmap?.filter((d) => d.status === 'completed').map((d) => d.day) || []
      );

      const plan: AiRoadmapPlan = {
        id: `plan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        track: trackInput,
        daysRemaining,
        examDate: examDateStr,
        assessmentSummary: parsed.assessmentSummary || `Lộ trình bứt phá mục tiêu ${targetScoreInput} điểm.`,
        targetStrategy: parsed.targetStrategy || `Tập trung củng cố các chuyên đề trọng điểm và rèn phản xạ trắc nghiệm.`,
        dailyRoadmap: (parsed.dailyRoadmap || []).map((item: any, idx: number) => ({
          day: item.day || idx + 1,
          topicCode: item.topicCode || '12B',
          topicTitle: item.topicTitle || 'Chuyên đề Tin học',
          keyTask: item.keyTask || 'Ôn tập lý thuyết và giải 10 câu trắc nghiệm',
          minutes: item.minutes || dailyMinutesInput,
          focusQuestionType: item.focusQuestionType || 'Trắc nghiệm nhiều lựa chọn',
          status: previousCompletedDays.has(item.day || idx + 1) ? 'completed' : 'todo',
        })),
      };

      storageService.saveRoadmapPlan(plan);
      setAiRoadmap(plan);

      onUpdateUser({
        ...user,
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        track: trackInput,
      });
    } catch {
      const fallback = generateDynamicFallbackRoadmap(targetScoreInput, weakList);
      storageService.saveRoadmapPlan(fallback);
      setAiRoadmap(fallback);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Helper to construct dynamic 7-day plan
  function generateDynamicFallbackRoadmap(target: number, weaks: string[]): AiRoadmapPlan {
    const hasNetworkWeak = weaks.some((w) => w.includes('12B') || w.includes('Mạng') || w.includes('mạng'));
    const hasDbWeak = weaks.some((w) => w.includes('11F') || w.includes('Cơ sở dữ liệu') || w.includes('CSDL'));

    const items: RoadmapDayItem[] = [
      {
        day: 1,
        topicCode: '12B',
        topicTitle: 'Mạng máy tính & Thiết bị chuyển mạch (Switch/Router)',
        keyTask: hasNetworkWeak
          ? 'Khắc phục lỗ hổng bài test: Nắm chắc nguyên lý địa chỉ MAC của Switch và IP của Router'
          : 'Tổng ôn thiết bị kết nối mạng và phân biệt Hub, Switch, Access Point',
        minutes: 45,
        focusQuestionType: 'Đọc sơ đồ & Trắc nghiệm nhiều lựa chọn',
        status: 'todo',
      },
      {
        day: 2,
        topicCode: '12B',
        topicTitle: 'Địa chỉ IPv4, IPv6 & Phân giải tên miền DNS',
        keyTask: 'Luyện tập chuyển đổi nhị phân 8-bit sang thập phân và hiểu cơ chế hoạt động của DNS server',
        minutes: 40,
        focusQuestionType: 'Bài tập tính toán & Câu hỏi Đúng/Sai',
        status: 'todo',
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
        status: 'todo',
      },
      {
        day: 4,
        topicCode: '12A',
        topicTitle: 'Trí tuệ Nhân tạo: 5 Đặc trưng & Phân loại ANI/AGI',
        keyTask: 'Ôn lại 5 đặc trưng của AI, hội thảo Dartmouth 1956 và nhận diện các ứng dụng thực tế',
        minutes: 35,
        focusQuestionType: 'Lý thuyết nhận biết & thông hiểu',
        status: 'todo',
      },
      {
        day: 5,
        topicCode: '12F',
        topicTitle: 'Thiết kế trang web với HTML5 & CSS Box Model',
        keyTask: 'Nắm vững cấu trúc body, thẻ bảng, form input và thuộc tính margin vs padding',
        minutes: 40,
        focusQuestionType: 'Đọc mã HTML/CSS & Nhận diện lỗi',
        status: 'todo',
      },
      {
        day: 6,
        topicCode: '11F_CS',
        topicTitle: 'Thuật toán Tìm kiếm nhị phân & Độ phức tạp O(log n)',
        keyTask: 'Mã giả Binary Search, điều kiện mảng đã sắp xếp và truy vết từng bước chạy',
        minutes: 50,
        focusQuestionType: 'Truy vết mã nguồn & Phân tích thuật toán',
        status: 'todo',
      },
      {
        day: 7,
        topicCode: 'ALL',
        topicTitle: 'Thi thử Đề tổng hợp 28 câu chuẩn ma trận Bộ GD&ĐT',
        keyTask: 'Làm bài thi thử 50 phút đúng cấu trúc: 24 câu nhiều lựa chọn + 4 câu đúng/sai',
        minutes: 50,
        focusQuestionType: 'Đề thi thử tổng hợp',
        status: 'todo',
      },
    ];

    return {
      id: `plan_fallback_${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetScore: target,
      dailyStudyMinutes: 45,
      track: user.track || 'CS',
      daysRemaining,
      examDate: examDateStr,
      assessmentSummary: `Nền tảng kiến thức ở mức khá (${currentProficiency ?? 7.0}đ). Để bứt phá lên mục tiêu ${target} điểm, AI đã cá nhân hóa lộ trình 7 ngày tập trung ưu tiên bù đắp ${hasNetworkWeak ? 'chuyên đề Mạng máy tính 12B' : 'các chuyên đề trọng tâm'} và củng cố kỹ năng làm bài trắc nghiệm.`,
      targetStrategy: `Chiến thuật bứt phá: Dành 4 ngày đầu ôn sâu các phần làm sai ở bài test, 2 ngày tiếp theo luyện tập câu hỏi Đúng/Sai và hoàn thiện đề thi thử vào ngày thứ 7.`,
      dailyRoadmap: items,
    };
  }

  // Toggle Roadmap Item Completion
  const handleToggleDayStatus = (dayNumber: number) => {
    if (!aiRoadmap) return;
    const item = aiRoadmap.dailyRoadmap.find((d) => d.day === dayNumber);
    if (!item) return;

    const nextStatus: 'todo' | 'in_progress' | 'completed' =
      item.status === 'completed' ? 'todo' : item.status === 'todo' ? 'in_progress' : 'completed';

    const updated = storageService.updateRoadmapDayStatus(dayNumber, nextStatus);
    if (updated) {
      setAiRoadmap({ ...updated });
    }
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
          const fallbackRes = await askThinkingAiTutor({
            topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
            userQuestion: userText,
            studentContext: `Học sinh lớp ${user.grade}`,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: fallbackRes.text,
              model: 'Gemini Flash AI',
            },
          ]);
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Xin lỗi bạn, kết nối tới Gemini AI tạm thời bị gián đoạn. Bạn vui lòng thử lại sau ít giây nhé!',
          model: 'Gemini AI Assistant',
        },
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  // Filtered topics for Knowledge Map
  const filteredTopics = useMemo(() => {
    return Object.values(topicMastery).filter((t) => {
      if (masteryFilter !== 'all' && t.status !== masteryFilter) return false;
      const lesson = TOPIC_LESSONS[t.topicId];
      if (gradeFilter !== 'all' && lesson && lesson.grade !== gradeFilter) return false;
      return true;
    });
  }, [topicMastery, masteryFilter, gradeFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner Navigation: 6 Key Adaptive Learning Workflow Modules */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-[#2878C8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  TinPath AI Cá nhân hóa
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-[#2878C8] dark:text-blue-400">
                  Adaptive Learning
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Đánh giá năng lực $\rightarrow$ Chẩn đoán lỗ hổng $\rightarrow$ Sinh lộ trình ôn luyện riêng biệt cho học sinh THPT
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto text-xs sm:text-sm">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Thi THPTQG 2026: còn {daysRemaining} ngày</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center gap-1.5 text-[#2878C8] dark:text-blue-400 font-bold">
              <Target className="w-4 h-4" />
              <span>Mục tiêu: {user.targetScore || 8.5}/10</span>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng quan học tập</span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'assessment'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Đánh giá năng lực</span>
            {currentProficiency !== null && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('knowledge_map')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'knowledge_map'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Bản đồ tri thức (11 chuyên đề)</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'diagnosis'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Chẩn đoán lỗ hổng AI</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'roadmap'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lộ trình cá nhân hóa</span>
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'tutor'
                ? 'bg-[#2878C8] text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gia sư AI Studio</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE A: STUDENT LEARNING OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Primary Action Hero Card: "Tiếp tục học" */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Nhiệm vụ học tập hôm nay
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {todaysTask ? todaysTask.topicTitle : 'Bắt đầu làm bài đánh giá năng lực đầu vào'}
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {todaysTask
                    ? `${todaysTask.keyTask} (${todaysTask.minutes} phút - ${todaysTask.focusQuestionType})`
                    : 'Hãy làm bài kiểm tra THPTQG 28 câu chuẩn ma trận để AI phân tích chính xác lỗ hổng kiến thức và thiết kế lộ trình riêng cho bạn.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-white/80">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {todaysTask ? `${todaysTask.minutes} phút` : '50 phút'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" /> {todaysTask ? `Chuyên đề: ${todaysTask.topicCode}` : '24 câu trắc nghiệm + 4 câu đúng/sai'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Award className="w-3.5 h-3.5" /> +25 XP khi hoàn thành
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                {todaysTask ? (
                  <button
                    onClick={() => {
                      if (todaysTask.topicCode === 'ALL') {
                        if (onStartExam) onStartExam(selectedExamId);
                        else setActiveTab('assessment');
                      } else {
                        if (onStartTopicQuiz) onStartTopicQuiz(todaysTask.topicCode as SubjectTopicId, 10);
                        else onNavigateTopic(todaysTask.topicCode as SubjectTopicId);
                      }
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-white text-[#2878C8] hover:bg-blue-50 font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Play className="w-5 h-5 fill-[#2878C8]" />
                    <span>Tiếp tục học ngay</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="px-6 py-3.5 rounded-2xl bg-white text-[#2878C8] hover:bg-blue-50 font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Bắt đầu đánh giá</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Layers className="w-4 h-4" />
                  <span>Xem toàn bộ 7 ngày lộ trình</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Năng lực hiện tại */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Điểm đánh giá thực tế</span>
                <Award className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {currentProficiency !== null ? currentProficiency.toFixed(1) : '--'}
                </span>
                <span className="text-gray-400 text-sm font-semibold">/ 10 điểm</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {currentProficiency !== null
                  ? diagnosticReport?.analysis?.levelRanking || 'Đã kiểm tra qua bài thi THPTQG chuẩn'
                  : 'Chưa có kết quả. Cần làm bài test đầu vào.'}
              </p>
            </div>

            {/* Card 2: Mục tiêu điểm số */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Mục tiêu điểm số</span>
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {user.targetScore || 8.5}
                </span>
                <span className="text-gray-400 text-sm font-semibold">/ 10 điểm</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">Khoảng cách:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {currentProficiency !== null
                    ? `+${Math.max(0, Number(((user.targetScore || 8.5) - currentProficiency).toFixed(1)))} điểm`
                    : 'Cần xác định'}
                </span>
              </div>
            </div>

            {/* Card 3: Streak & Chuyên cần */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Chuỗi Streak học tập</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  {user.streakDays || 1}
                </span>
                <span className="text-gray-400 text-sm font-semibold">ngày liên tục</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">Thử thách hôm nay:</span>
                <span className={`font-bold ${user.completedDailyToday ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {user.completedDailyToday ? 'Đã hoàn thành' : 'Chưa làm 10 câu'}
                </span>
              </div>
            </div>

            {/* Card 4: Điểm XP & Trường học */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Điểm tích lũy XP</span>
                <Award className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {user.xp || 320}
                </span>
                <span className="text-gray-400 text-sm font-semibold">XP</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                {user.schoolName || 'THPT chuyên Lê Khiết'}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thế mạnh */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Chuyên đề thế mạnh của bạn
                  </h3>
                </div>
                <span className="text-xs text-gray-400">Dựa trên kết quả thật</span>
              </div>

              <div className="mt-4 space-y-3">
                {strongTopicsList.map((st) => (
                  <div
                    key={st.topicId}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {st.topicName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-[#2878C8]">
                          {st.topicId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Độ chính xác: {st.percentage}% ({st.totalCorrect}/{st.totalAnswered} câu đúng)
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateTopic(st.topicId)}
                      className="text-xs font-bold text-[#2878C8] hover:underline flex items-center gap-1"
                    >
                      <span>Xem lại</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lỗ hổng cần bù đắp */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Lỗ hổng kiến thức cần ưu tiên bù đắp
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  className="text-xs text-[#2878C8] font-bold hover:underline"
                >
                  Xem chi tiết AI chẩn đoán
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {weakTopicsList.map((wt) => (
                  <div
                    key={wt.topicId}
                    className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {wt.topicName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                          {wt.topicId}
                        </span>
                      </div>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        Độ chính xác: {wt.percentage}% • {wt.commonMistakes[0] || 'Dễ nhầm lẫn câu hỏi thực hành'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onStartTopicQuiz) onStartTopicQuiz(wt.topicId, 10);
                        else onNavigateTopic(wt.topicId);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0 flex items-center gap-1 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Luyện ngay</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                Bạn muốn rèn luyện kỹ năng nào tiếp theo?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Luyện tập có chủ đích theo khuyến nghị của gia sư AI để bứt phá điểm số
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onStartDailyChallenge) onStartDailyChallenge();
                }}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] hover:border-amber-500 font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span>10 câu Streak hôm nay</span>
              </button>

              <button
                onClick={() => setActiveTab('assessment')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] hover:border-blue-500 font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2 shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Làm đề thi thử THPTQG</span>
              </button>

              <button
                onClick={() => setActiveTab('tutor')}
                className="px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-[#2878C8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:opacity-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hỏi Gia sư AI SGK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE B: COMPETENCY ASSESSMENT */}
      {/* ========================================================================= */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#2878C8] inline-block mb-2">
                  Đánh giá năng lực đầu vào chuẩn hóa
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Làm đề thi THPT Quốc gia & Nhận diện ma trận năng lực
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
                  Học sinh làm đề thi chuẩn ma trận Bộ GD&ĐT gồm 24 câu trắc nghiệm nhiều lựa chọn (Phần I) và 4 câu trắc nghiệm Đúng/Sai đa ý (Phần II). AI tính điểm khách quan bằng thuật toán ứng dụng, sau đó phân tích lỗi tư duy.
                </p>
              </div>

              {/* Fast Sample Fill Button for Testing */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleQuickFillSampleAnswers}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Điền nhanh câu trả lời mẫu</span>
                </button>
              </div>
            </div>

            {/* Choose Exam or Use Previous Attempt */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Chọn đề thi thử nghiệm chuẩn:
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#2878C8]"
                >
                  {OFFICIAL_EXAMS.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} ({ex.part1Questions.length + ex.part2Questions.length} câu - 50 phút)
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Exam Attempts Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Hoặc chọn bài thi đã làm trong lịch sử:
                </label>
                {examAttempts.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <select
                      id="existing_attempt_select"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#2878C8]"
                    >
                      {examAttempts.map((att) => (
                        <option key={att.id} value={att.id}>
                          {att.examTitle} — {att.totalScore.toFixed(2)}đ ({new Date(att.submittedAt).toLocaleDateString('vi-VN')})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const selectEl = document.getElementById('existing_attempt_select') as HTMLSelectElement;
                        const found = examAttempts.find((a) => a.id === selectEl?.value);
                        if (found) handleUseExistingExamAttempt(found);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors"
                    >
                      Dùng kết quả này
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic pt-2">Chưa có bài thi nào trong lịch sử.</p>
                )}
              </div>
            </div>
          </div>

          {/* Exam Questions Workspace */}
          <div className="space-y-6">
            {/* Phần 1: 24 câu trắc nghiệm */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#262626]">
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg">
                    Phần I: Câu trắc nghiệm nhiều phương án lựa chọn (24 câu)
                  </h3>
                  <p className="text-xs text-gray-500">Mỗi câu trả lời đúng được 0.25 điểm. Tối đa 6.0 điểm.</p>
                </div>
                <span className="text-xs font-bold text-[#2878C8] px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60">
                  Đã chọn: {Object.keys(part1Answers).length} / {currentExam.part1Questions.length} câu
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {currentExam.part1Questions.map((q, idx) => (
                  <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333]">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#2878C8] text-white text-xs font-black">
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-bold">[{q.topicName}]</span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
                      {q.content}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPart1Answers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 ${
                            part1Answers[q.id] === opt
                              ? 'bg-blue-50 dark:bg-blue-950/70 border-[#2878C8] text-[#2878C8] font-bold shadow-xs'
                              : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            part1Answers[q.id] === opt ? 'bg-[#2878C8] text-white' : 'bg-gray-100 dark:bg-[#2A2A2A]'
                          }`}>
                            {opt}
                          </span>
                          <span className="leading-tight pt-0.5">{q.options[opt]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần 2: 4 câu đúng/sai */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
              <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                <h3 className="font-black text-gray-900 dark:text-white text-lg">
                  Phần II: Câu trắc nghiệm Đúng / Sai (4 câu)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Thang điểm lũy tiến: đúng 1 ý = 0.1đ | đúng 2 ý = 0.25đ | đúng 3 ý = 0.5đ | đúng 4 ý = 1.0đ. Tối đa 4.0 điểm.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {part2Questions.map((q, qIdx) => (
                  <div key={q.id} className="p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-black">
                        Câu {qIdx + 1}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">[{q.topicName}]</span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-4">
                      {q.context}
                    </p>

                    <div className="space-y-3">
                      {q.statements.map((stmt) => (
                        <div
                          key={stmt.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#333] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium">
                            <span className="font-bold text-[#2878C8] mr-2">Ý {stmt.id.toUpperCase()})</span>
                            {stmt.text}
                          </span>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setPart2Answers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [stmt.id]: true },
                                }));
                              }}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                part2Answers[q.id]?.[stmt.id] === true
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-gray-100 dark:bg-[#282828] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              ĐÚNG
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPart2Answers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [stmt.id]: false },
                                }));
                              }}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                part2Answers[q.id]?.[stmt.id] === false
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-gray-100 dark:bg-[#282828] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              SAI
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Diagnostic Assessment Button */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h4 className="font-black text-gray-900 dark:text-white text-base">
                  Sẵn sàng nộp bài để AI chẩn đoán?
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hệ thống sẽ tính điểm khách quan theo barem của Bộ GD&ĐT và gửi dữ liệu cho Gemini AI bóc tách năng lực.
                </p>
              </div>

              <button
                type="button"
                disabled={isAnalyzingDiagnostic}
                onClick={handleSubmitDiagnostic}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
              >
                {isAnalyzingDiagnostic ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Gemini đang phân tích ma trận...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Nộp bài & Chẩn đoán năng lực bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE C: KNOWLEDGE MAP */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge_map' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 inline-block mb-1.5">
                  Bản đồ năng lực 11 chuyên đề GDPT 2018
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Bản đồ tri thức môn Tin học THPT
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Đánh giá mức độ thành thạo dựa trên các câu hỏi đã làm thực tế. Click vào chuyên đề để xem bẫy đề thi và luyện tập ngay.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Mastery status filter */}
                <select
                  value={masteryFilter}
                  onChange={(e) => setMasteryFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="needs_improvement">Cần củng cố (&lt; 60%)</option>
                  <option value="learning">Đang học (60% - 84%)</option>
                  <option value="proficient">Thành thạo (&gt;= 85%)</option>
                  <option value="not_assessed">Chưa đánh giá</option>
                </select>

                {/* Grade filter */}
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  <option value="all">Tất cả khối lớp</option>
                  <option value="12">Lớp 12 (Trọng tâm THPTQG)</option>
                  <option value="11">Lớp 11 (CSDL & Lập trình)</option>
                  <option value="10">Lớp 10 (Python cơ bản)</option>
                </select>
              </div>
            </div>

            {/* Topics Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((t) => {
                const lesson = TOPIC_LESSONS[t.topicId];
                const isNeedsImp = t.status === 'needs_improvement';
                const isProf = t.status === 'proficient';
                const isLearning = t.status === 'learning';

                return (
                  <div
                    key={t.topicId}
                    className={`p-5 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between ${
                      isNeedsImp
                        ? 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40'
                        : isProf
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30'
                        : isLearning
                        ? 'bg-blue-50/30 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30'
                        : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#2878C8] text-white font-black text-xs">
                          {t.topicId}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isNeedsImp
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : isProf
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : isLearning
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {t.statusLabel}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-1">
                        {t.topicName}
                      </h4>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Độ chính xác:</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {t.percentage}% ({t.totalCorrect}/{t.totalAnswered} câu)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-[#333] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isNeedsImp ? 'bg-rose-500' : isProf ? 'bg-emerald-500' : 'bg-[#2878C8]'
                            }`}
                            style={{ width: `${Math.max(5, t.percentage)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] text-xs text-gray-500 space-y-1">
                        <p className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Trọng số: <strong className="text-gray-700 dark:text-gray-300">{t.examWeight}</strong></span>
                        </p>
                        {t.commonMistakes.length > 0 && (
                          <p className="flex items-center gap-1 text-amber-600 dark:text-amber-400 truncate">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Bẫy: {t.commonMistakes[0]}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateTopic(t.topicId)}
                        className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-[#282828] hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Học lý thuyết</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onStartTopicQuiz) onStartTopicQuiz(t.topicId, 10);
                          else onNavigateTopic(t.topicId);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Luyện 10 câu</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE D: EVIDENCE-BASED AI DIAGNOSIS */}
      {/* ========================================================================= */}
      {activeTab === 'diagnosis' && (
        <div className="space-y-6">
          {diagnosticReport ? (
            <>
              {/* AI Report Card */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 inline-block mb-1.5">
                      Báo cáo chẩn đoán AI chính xác
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      Kết quả & Khắc phục lỗ hổng kiến thức
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Bài thi: {diagnosticReport.examTitle} • Điểm số: <strong>{diagnosticReport.score.toFixed(2)}/10</strong> (Phần I: {diagnosticReport.part1Score}đ, Phần II: {diagnosticReport.part2Score}đ)
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 text-[#2878C8] font-bold text-sm">
                    {diagnosticReport.analysis.levelRanking}
                  </div>
                </div>

                {/* Overall Assessment */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333]">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" /> Nhận định tổng quan từ Gia sư AI:
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {diagnosticReport.analysis.overallAssessment}
                  </p>
                </div>

                {/* Cognitive Levels */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                    <span className="text-xs font-bold text-blue-600 uppercase">Mức độ Biết</span>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.know.percentage}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.know.evaluation}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-xs font-bold text-indigo-600 uppercase">Mức độ Hiểu</span>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.understand.percentage}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.understand.evaluation}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-xs font-bold text-emerald-600 uppercase">Mức độ Vận dụng</span>
                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.apply.percentage}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {diagnosticReport.analysis.cognitiveLevels.apply.evaluation}
                    </p>
                  </div>
                </div>

                {/* Pedagogical Advice */}
                <div className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                  <strong>💡 Lời khuyên sư phạm chiến lược: </strong>
                  {diagnosticReport.analysis.pedagogicalAdvice}
                </div>
              </div>

              {/* Wrong Questions Breakdown */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-lg">
                      Phân tích chi tiết các câu làm sai ({diagnosticReport.wrongQuestions.length} câu)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Bóc tách bản chất sai sót và hướng dẫn khắc phục bám sát SGK GDPT 2018
                    </p>
                  </div>

                  {diagnosticReport.wrongQuestions.length > 0 && (
                    <span className="text-xs font-bold text-rose-600 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60">
                      Cần rèn luyện lại
                    </span>
                  )}
                </div>

                {diagnosticReport.wrongQuestions.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {diagnosticReport.wrongQuestions.map((wq, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-xs">
                            Câu hỏi #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-500">[{wq.topicName}]</span>
                        </div>

                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {wq.content}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-rose-100/70 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900">
                            <strong>Bạn chọn: </strong> {wq.userAnswer}
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900">
                            <strong>Đáp án đúng: </strong> {wq.correctAnswer}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 text-xs text-blue-900 dark:text-blue-300">
                          <strong>🔍 Giải thích chuẩn mực SGK: </strong>
                          {wq.explanation}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (onStartTopicQuiz) onStartTopicQuiz(wq.topicId, 10);
                              else onNavigateTopic(wq.topicId);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Luyện tập bù đắp chuyên đề này ngay</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      Xuất sắc! Bạn làm đúng 100% tất cả các câu hỏi
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Hãy duy trì phong độ và chuyển sang luyện các đề thi nâng cao hơn nhé!
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-black text-gray-900 dark:text-white text-lg">
                Chưa có dữ liệu chẩn đoán AI
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-6">
                Bạn cần làm bài thi đánh giá năng lực đầu vào hoặc chọn bài thi đã làm trong lịch sử để AI phân tích.
              </p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="px-6 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-md transition-colors"
              >
                Làm bài đánh giá năng lực ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE E: PERSONALIZED LEARNING ROADMAP */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Target customizer panel */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#2878C8] inline-block mb-1.5">
                  Lộ trình 7 ngày thích ứng thông minh
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Thiết lập mục tiêu & Sinh lộ trình cá nhân hóa
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  AI tự động phân bổ thời gian và sắp xếp các chuyên đề yếu nhất lên trước để bạn bứt phá điểm số nhanh nhất.
                </p>
              </div>

              <button
                type="button"
                disabled={isGeneratingPlan}
                onClick={handleGeneratePlan}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingPlan ? 'Gemini đang tối ưu...' : 'Tối ưu lộ trình bằng Gemini'}</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  Mục tiêu điểm số: {targetScoreInput} / 10
                </label>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={targetScoreInput}
                  onChange={(e) => setTargetScoreInput(Number(e.target.value))}
                  className="w-full accent-[#2878C8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  Thời gian học mỗi ngày: {dailyMinutesInput} phút
                </label>
                <select
                  value={dailyMinutesInput}
                  onChange={(e) => setDailyMinutesInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value={30}>30 phút / ngày</option>
                  <option value={45}>45 phút / ngày (Khuyên dùng)</option>
                  <option value={60}>60 phút / ngày</option>
                  <option value={90}>90 phút / ngày (Cấp tốc)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  Định hướng ôn thi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTrackInput('CS')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      trackInput === 'CS'
                        ? 'bg-[#2878C8] text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Khoa học máy tính (CS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackInput('ICT')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      trackInput === 'ICT'
                        ? 'bg-[#2878C8] text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Tin học ứng dụng (ICT)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Timeline Cards */}
          {aiRoadmap && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Tiến độ hoàn thành:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {aiRoadmap.dailyRoadmap.filter((d) => d.status === 'completed').length} / {aiRoadmap.dailyRoadmap.length} ngày (
                  {Math.round(
                    (aiRoadmap.dailyRoadmap.filter((d) => d.status === 'completed').length /
                      aiRoadmap.dailyRoadmap.length) *
                      100
                  )}
                  %)
                </span>
              </div>

              <div className="space-y-3">
                {aiRoadmap.dailyRoadmap.map((item) => {
                  const isCompleted = item.status === 'completed';
                  const isInProgress = item.status === 'in_progress';

                  return (
                    <div
                      key={item.day}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                          : isInProgress
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-[#2878C8]'
                          : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2C2C2C]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggleDayStatus(item.day)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-gray-300 dark:border-gray-600 text-transparent hover:border-[#2878C8]'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 text-xs font-black">
                              Ngày {item.day}
                            </span>
                            <span className="text-xs font-bold text-[#2878C8]">[{item.topicCode}]</span>
                            <span className="text-xs text-gray-400 font-medium">• {item.minutes} phút</span>
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                Đã xong (+25 XP)
                              </span>
                            )}
                          </div>

                          <h4 className={`text-base font-bold mt-1 ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {item.topicTitle}
                          </h4>

                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.keyTask}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.topicCode === 'ALL') {
                              if (onStartExam) onStartExam(selectedExamId);
                              else setActiveTab('assessment');
                            } else {
                              if (onStartTopicQuiz) onStartTopicQuiz(item.topicCode as SubjectTopicId, 10);
                              else onNavigateTopic(item.topicCode as SubjectTopicId);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{item.topicCode === 'ALL' ? 'Thi thử tổng hợp' : 'Vào học ngay'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE H: AI TUTOR COMPANION */}
      {/* ========================================================================= */}
      {activeTab === 'tutor' && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs flex flex-col h-[700px]">
          {/* Header & Modes */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2878C8]" /> Gia sư AI TinPath
              </h3>
              <p className="text-xs text-gray-500">
                Đối chiếu trực tiếp tri thức Sách Giáo Khoa Tin học THPT GDPT 2018 (Supabase Vector)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTutorMode('rag')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  tutorMode === 'rag'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                }`}
              >
                Tri thức SGK (RAG)
              </button>
              <button
                type="button"
                onClick={() => setTutorMode('thinking')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  tutorMode === 'thinking'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                }`}
              >
                Suy luận sâu
              </button>
              <button
                type="button"
                onClick={() => setTutorMode('search')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  tutorMode === 'search'
                    ? 'bg-[#2878C8] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                }`}
              >
                Tra cứu Google
              </button>
            </div>
          </div>

          {/* Quick Context Pills */}
          <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs text-gray-500 border-b border-gray-100 dark:border-[#2C2C2C] no-scrollbar">
            <span className="font-bold shrink-0">Hỏi nhanh:</span>
            <button
              onClick={() => setInputQuestion('Phân biệt Switch (đọc địa chỉ MAC) và Router (đọc địa chỉ IP)?')}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 text-xs shrink-0"
            >
              Switch vs Router
            </button>
            <button
              onClick={() => setInputQuestion('Giải thích 5 đặc trưng cơ bản của Trí tuệ nhân tạo (AI)?')}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 text-xs shrink-0"
            >
              5 đặc trưng AI
            </button>
            <button
              onClick={() => setInputQuestion('Mô hình quan hệ CSDL: Khóa chính và Khóa ngoại khác nhau thế nào?')}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 text-xs shrink-0"
            >
              Khóa chính vs Khóa ngoại
            </button>
            <button
              onClick={() => setInputQuestion('Cấu trúc đề thi tốt nghiệp THPT môn Tin học năm 2026 gồm những phần nào?')}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#252525] hover:bg-blue-50 text-xs shrink-0"
            >
              Quy chế thi THPTQG 2026
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-sm">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed whitespace-pre-line text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#2878C8] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  {msg.sender === 'ai' && msg.model && (
                    <span className="text-[10px] font-mono text-gray-400 block mb-1">
                      {msg.model}
                    </span>
                  )}
                  {msg.text}

                  {msg.ragSources && msg.ragSources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-200 dark:border-indigo-900/50 text-[11px]">
                      <span className="font-bold text-indigo-600 block mb-1">
                        📖 Đối chiếu SGK Tin 12 chuẩn:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.ragSources.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200"
                          >
                            {s.bookSource} — {s.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-[#333] text-[10px] text-gray-400">
                      <strong>Nguồn: </strong>
                      {msg.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAskingAi && (
              <div className="flex justify-start">
                <div className="p-3.5 rounded-xl bg-gray-100 dark:bg-[#222] text-xs text-gray-500 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2878C8]" />
                  <span>Gemini đang phân tích và đối chiếu SGK...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Nhập thắc mắc về khái niệm, bài tập Tin học THPT..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs sm:text-sm focus:outline-none focus:border-[#2878C8]"
            />
            <button
              type="submit"
              disabled={isAskingAi || !inputQuestion.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs sm:text-sm disabled:opacity-40 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
