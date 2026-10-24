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
  Lock,
} from 'lucide-react';
import {
  UserProfile,
  ExamAttempt,
  SubjectTopicId,
  CognitiveLevel,
  Exam,
  DiagnosticReport,
  CognitiveLevelStat,
  CompetencyStat,
  TopicDiagnosticDetail,
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

type StepNumber = 1 | 2 | 3 | 4;

// Helper to determine Competency Code according to MOET Table 1
const getCompetencyCode = (topicId: string): 'NLa' | 'NLb' | 'NLc' => {
  if (['12B', '12F', '12E_ICT'].includes(topicId)) return 'NLa';
  if (['12A', '12D', '12G'].includes(topicId)) return 'NLb';
  return 'NLc'; // 11F, 11E_ICT, 11F_CS, 10_PYTHON, 12F_CS
};

// Curriculum Lesson Titles & Specific Gaps mapping from Book
const CURRICULUM_TOPIC_GAPS: Record<string, { lessons: string[]; defaultTraps: string }> = {
  '12A': {
    lessons: [
      'Bài 1: Khái niệm & 5 đặc trưng cơ bản của AI (Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề)',
      'Bài 1: Phân loại AI hẹp (ANI) vs AI tổng quát (AGI) & Ý nghĩa bài kiểm tra Turing (Turing Test 1950)',
      'Bài 2: Tác động của AI đối với việc làm, cảnh báo xã hội và an ninh mạng (Deepfake, bảo vệ dữ liệu cá nhân)',
    ],
    defaultTraps: 'Dễ nhầm lẫn giữa AI hẹp (thực hiện nhiệm vụ cụ thể) với AI tổng quát (AGI - tự suy nghĩ và thích ứng như con người).',
  },
  '12B': {
    lessons: [
      'Bài 1: Phân biệt thiết bị mạng: Switch (đọc địa chỉ MAC) vs Router (đọc địa chỉ IP để định tuyến)',
      'Bài 2: Chuyển đổi nhị phân IPv4 (32 bit, 4 octet) và cấu trúc địa chỉ IPv6 (128 bit hexa)',
      'Bài 2: Vai trò máy chủ phân giải tên miền DNS và cơ chế bắt tay 3 bước của giao thức TCP/IP',
    ],
    defaultTraps: 'Nhầm lẫn phạm vi hoạt động của Switch (tầng Data Link, dùng MAC) với Router (tầng Network, dùng IP).',
  },
  '12D': {
    lessons: [
      'Bài 1: Đạo đức, tính nhân văn và hành vi ứng xử văn minh trong môi trường số',
      'Bài 2: Quyền tác giả, bản quyền phần mềm và phòng chống xâm phạm dữ liệu cá nhân',
    ],
    defaultTraps: 'Nhầm lẫn giữa phần mềm nguồn mở (Open Source) và phần mềm miễn phí (Freeware).',
  },
  '12G': {
    lessons: [
      'Bài 1: Phân loại nhóm nghề dịch vụ: Hỗ trợ kỹ thuật CNTT, quản trị hệ thống và vận hành mạng',
      'Bài 2: Xu hướng nghề nghiệp trong kỷ nguyên Trí tuệ nhân tạo và chuyển đổi số',
    ],
    defaultTraps: 'Nhầm lẫn nhiệm vụ của chuyên viên Quản trị mạng với Lập trình viên phần mềm.',
  },
  '12F': {
    lessons: [
      'Bài 1: Cấu trúc thẻ ngữ nghĩa semantic HTML5 (header, nav, section, article, table, form)',
      'Bài 2: Mô hình hộp CSS Box Model (phân biệt margin viền ngoài và padding vùng đệm bên trong)',
    ],
    defaultTraps: 'Nhầm lẫn giữa Margin (khoảng cách bên ngoài đường viền) và Padding (khoảng cách giữa nội dung và đường viền).',
  },
  '11F': {
    lessons: [
      'Bài 1: Mô hình CSDL quan hệ: Bản ghi (Record), Thuộc tính (Field), Khóa chính (Primary Key) & Khóa ngoại (Foreign Key)',
      'Bài 2: Cú pháp truy vấn SQL: Mệnh đề WHERE lọc dòng vs HAVING lọc nhóm sau GROUP BY',
      'Bài 2: Quy tắc toàn vẹn dữ liệu và liên kết quan hệ 1 - Nhiều (1-N) giữa các bảng',
    ],
    defaultTraps: 'Nhầm lẫn mệnh đề WHERE (lọc dữ liệu từng dòng trước khi gộp) với HAVING (lọc nhóm sau khi GROUP BY).',
  },
  '11F_CS': {
    lessons: [
      'Bài 1: Thuật toán tìm kiếm nhị phân (Binary Search) - điều kiện mảng đã sắp xếp và độ phức tạp O(log n)',
      'Bài 2: Kĩ thuật lập trình đệ quy, sắp xếp chọn / chèn / nổi bọt và truy vết từng bước chạy',
    ],
    defaultTraps: 'Quên điều kiện tiên quyết của tìm kiếm nhị phân: Mảng bắt buộc phải được sắp xếp theo thứ tự.',
  },
  '10_PYTHON': {
    lessons: [
      'Bài 1: Chỉ số mảng âm, cú pháp cắt lát chuỗi/danh sách (slicing [start:stop:step])',
      'Bài 2: Phạm vi biến cục bộ (local) và toàn cục (global) trong hàm Python',
    ],
    defaultTraps: 'Nhầm lẫn quy tắc stop trong hàm range(start, stop): giá trị stop không bao giờ được lấy.',
  },
};

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
  // Stored diagnostic report & AI roadmap
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(() => {
    return storageService.getDiagnosticReport();
  });

  const [aiRoadmap, setAiRoadmap] = useState<AiRoadmapPlan | null>(() => {
    return storageService.getRoadmapPlan();
  });

  // Step-by-step progress tracking (1 -> 2 -> 3 -> 4)
  const [currentStep, setCurrentStep] = useState<StepNumber>(() => {
    if (storageService.getRoadmapPlan()) return 4;
    if (storageService.getDiagnosticReport()) return 2;
    return 1;
  });

  // Sub-view inside Step 4
  const [step4SubView, setStep4SubView] = useState<'roadmap' | 'knowledge_map' | 'tutor'>('roadmap');

  // Examination countdown calculation (THPTQG 2026: 27/06/2026)
  const examDateStr = '2026-06-27';
  const daysRemaining = useMemo(() => {
    const diff = new Date(examDateStr).getTime() - Date.now();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

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

  // =========================================================================
  // STEP 1 STATE: COMPETENCY ASSESSMENT
  // =========================================================================
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

  // =========================================================================
  // STEP 3 STATE: SET GOALS
  // =========================================================================
  const [targetScoreInput, setTargetScoreInput] = useState<number>(user.targetScore || 8.5);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(user.dailyStudyMinutes || 45);
  const [trackInput, setTrackInput] = useState<'CS' | 'ICT'>(user.track || 'CS');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // =========================================================================
  // STEP 4 STATE: ROADMAP & TUTOR
  // =========================================================================
  const [masteryFilter, setMasteryFilter] = useState<'all' | TopicMasteryStatus>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | '10' | '11' | '12'>('all');

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
      text: `Xin chào ${user.displayName}! Mình là Trợ lý Gia sư AI Tin học THPT TinPath. Mình luôn đồng hành cùng bạn trong suốt lộ trình ôn luyện, giúp bạn giải đáp mọi thắc mắc lý thuyết SGK Tin học 10, 11, 12 và phân tích lỗi sai đề thi!`,
      model: 'Gemini Flash + RAG SGK GDPT 2018',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);

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

  // Comprehensive calculation of Cognitive Levels & MOET Competency Matrix
  const runAiAnalysisOnExam = async (
    exam: Exam,
    p1Ans: Record<string, 'A' | 'B' | 'C' | 'D'>,
    p2Ans: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>,
    finalScore: number,
    scoresData: any
  ) => {
    setIsAnalyzingDiagnostic(true);

    // 1. Tallying Cognitive Levels (Biết, Hiểu, Vận dụng)
    const cogStats: Record<CognitiveLevel, { correct: number; total: number }> = {
      biet: { correct: 0, total: 0 },
      hieu: { correct: 0, total: 0 },
      van_dung: { correct: 0, total: 0 },
    };

    // 2. Tallying MOET Competencies (NLa, NLb, NLc)
    const compStats: Record<'NLa' | 'NLb' | 'NLc', { correct: number; total: number }> = {
      NLa: { correct: 0, total: 0 },
      NLb: { correct: 0, total: 0 },
      NLc: { correct: 0, total: 0 },
    };

    // 3. Tallying Topic Lessons
    const topicStats: Record<
      string,
      {
        topicName: string;
        correct: number;
        total: number;
        knowCorrect: number;
        knowTotal: number;
        undCorrect: number;
        undTotal: number;
        appCorrect: number;
        appTotal: number;
      }
    > = {};

    const wrongQuestions: Array<{
      id: string;
      topicId: SubjectTopicId;
      topicName: string;
      level: CognitiveLevel;
      content: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
      conceptualTrap?: string;
    }> = [];

    // Part 1 Questions Evaluation
    for (const q of exam.part1Questions) {
      const level: CognitiveLevel = q.level || 'biet';
      const comp = getCompetencyCode(q.topicId);

      cogStats[level].total += 1;
      compStats[comp].total += 1;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = {
          topicName: q.topicName,
          correct: 0,
          total: 0,
          knowCorrect: 0,
          knowTotal: 0,
          undCorrect: 0,
          undTotal: 0,
          appCorrect: 0,
          appTotal: 0,
        };
      }
      topicStats[q.topicId].total += 1;
      if (level === 'biet') topicStats[q.topicId].knowTotal += 1;
      else if (level === 'hieu') topicStats[q.topicId].undTotal += 1;
      else topicStats[q.topicId].appTotal += 1;

      const userChoice = p1Ans[q.id];
      const isCorrect = userChoice === q.correctAnswer;

      if (isCorrect) {
        cogStats[level].correct += 1;
        compStats[comp].correct += 1;
        topicStats[q.topicId].correct += 1;
        if (level === 'biet') topicStats[q.topicId].knowCorrect += 1;
        else if (level === 'hieu') topicStats[q.topicId].undCorrect += 1;
        else topicStats[q.topicId].appCorrect += 1;
      } else {
        const userChoiceText = userChoice ? `${userChoice}. ${q.options[userChoice]}` : 'Chưa chọn';
        const correctChoiceText = `${q.correctAnswer}. ${q.options[q.correctAnswer]}`;
        const trap = CURRICULUM_TOPIC_GAPS[q.topicId]?.defaultTraps || 'Cần chú ý phân tích từ khóa kỹ thuật trong đề.';

        wrongQuestions.push({
          id: q.id,
          topicId: q.topicId,
          topicName: q.topicName,
          level,
          content: `[Phần I] ${q.content}`,
          userAnswer: userChoiceText,
          correctAnswer: correctChoiceText,
          explanation: q.explanation || 'Đối chiếu chuẩn kiến thức SGK GDPT 2018.',
          conceptualTrap: trap,
        });
      }
    }

    // Part 2 Questions Evaluation
    const p2Filtered = exam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === user.track
    );

    for (const q of p2Filtered) {
      const level: CognitiveLevel = q.level || 'hieu';
      const comp = getCompetencyCode(q.topicId);

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = {
          topicName: q.topicName,
          correct: 0,
          total: 0,
          knowCorrect: 0,
          knowTotal: 0,
          undCorrect: 0,
          undTotal: 0,
          appCorrect: 0,
          appTotal: 0,
        };
      }

      const selections = p2Ans[q.id] || {};
      for (const stmt of q.statements) {
        cogStats[level].total += 1;
        compStats[comp].total += 1;
        topicStats[q.topicId].total += 1;

        if (level === 'biet') topicStats[q.topicId].knowTotal += 1;
        else if (level === 'hieu') topicStats[q.topicId].undTotal += 1;
        else topicStats[q.topicId].appTotal += 1;

        const userStatementVal = selections[stmt.id];
        const isCorrect = userStatementVal === stmt.isCorrect;

        if (isCorrect) {
          cogStats[level].correct += 1;
          compStats[comp].correct += 1;
          topicStats[q.topicId].correct += 1;
          if (level === 'biet') topicStats[q.topicId].knowCorrect += 1;
          else if (level === 'hieu') topicStats[q.topicId].undCorrect += 1;
          else topicStats[q.topicId].appCorrect += 1;
        } else {
          wrongQuestions.push({
            id: `${q.id}_${stmt.id}`,
            topicId: q.topicId,
            topicName: q.topicName,
            level,
            content: `[Phần II - ${q.context}] Ý ${stmt.id.toUpperCase()}: "${stmt.statement}"`,
            userAnswer: userStatementVal === undefined ? 'Chưa trả lời' : userStatementVal ? 'Chọn Đúng' : 'Chọn Sai',
            correctAnswer: stmt.isCorrect ? 'Đáp án Đúng' : 'Đáp án Sai',
            explanation: stmt.explanation || 'Xem lại bài học chuyên đề trong SGK.',
            conceptualTrap: 'Phát biểu đúng/sai thường có bẫy từ khóa tuyệt đối (chỉ, luôn luôn, hoàn toàn).',
          });
        }
      }
    }

    // Build CognitiveLevelStat matching Image 2
    const knowPct = cogStats.biet.total > 0 ? Math.round((cogStats.biet.correct / cogStats.biet.total) * 100) : 0;
    const undPct = cogStats.hieu.total > 0 ? Math.round((cogStats.hieu.correct / cogStats.hieu.total) * 100) : 0;
    const appPct = cogStats.van_dung.total > 0 ? Math.round((cogStats.van_dung.correct / cogStats.van_dung.total) * 100) : 0;

    const cognitiveLevels = {
      biet: {
        level: 'biet' as CognitiveLevel,
        name: 'Mức độ Biết (Định nghĩa, mốc lịch sử, khái niệm nhận biết)',
        scopeDesc: 'Nhận diện thuật ngữ, các mốc lịch sử phát triển máy tính & chuẩn mạng',
        correctCount: cogStats.biet.correct,
        totalCount: cogStats.biet.total,
        percentage: knowPct,
        avgTimeSec: 18,
        statusLabel: knowPct >= 85 ? 'Đạt chuẩn A+' : knowPct >= 70 ? 'Mức Khá' : knowPct >= 50 ? 'Trung bình' : 'Báo động',
        pedagogicalRemark:
          knowPct >= 80
            ? 'Học sinh phản xạ lập tức với thuật ngữ Tin học cơ bản. Gần như tuyệt đối không mất điểm câu nhận biết.'
            : knowPct >= 60
            ? 'Nắm được các định nghĩa cốt lõi, nhưng còn do dự khi đề bài sử dụng các thuật ngữ chuyên ngành tiếng Anh tương đồng.'
            : 'Mất nhiều điểm ở các câu hỏi định nghĩa và mốc lịch sử cơ bản. Cần ưu tiên đọc lại phần ghi nhớ trong SGK để lấy trọn vẹn điểm nhận biết.',
      },
      hieu: {
        level: 'hieu' as CognitiveLevel,
        name: 'Mức độ Hiểu (Phân loại, giải thích cơ chế hoạt động mạng & thuật toán)',
        scopeDesc: 'Phân biệt thiết bị, giải thích cơ chế định tuyến, mô hình CSDL và vòng lặp',
        correctCount: cogStats.hieu.correct,
        totalCount: cogStats.hieu.total,
        percentage: undPct,
        avgTimeSec: 45,
        statusLabel: undPct >= 85 ? 'Đạt chuẩn A+' : undPct >= 70 ? 'Mức Khá' : undPct >= 50 ? 'Trung bình' : 'Báo động',
        pedagogicalRemark:
          undPct >= 70
            ? 'Hiểu nguyên lý ở mức trung bình - khá. Có hiện tượng do dự khi các đáp án nhiễu có chung từ khóa kỹ thuật.'
            : 'Khả năng phân tích quy trình và cơ chế mạng, CSDL còn yếu. Dễ bị đề thi đánh lạc hướng ở các câu hỏi Đúng/Sai đa ý.',
      },
      van_dung: {
        level: 'van_dung' as CognitiveLevel,
        name: 'Mức độ Vận dụng (Tính toán IP nhị phân, thiết kế bảng CSDL, truy vết gói tin)',
        scopeDesc: 'Chuyển đổi nhị phân, viết câu lệnh SQL, truy vết thuật toán tìm kiếm và xử lý tình huống thực tế',
        correctCount: cogStats.van_dung.correct,
        totalCount: cogStats.van_dung.total,
        percentage: appPct,
        avgTimeSec: 95,
        statusLabel: appPct >= 75 ? 'Đạt chuẩn A+' : appPct >= 60 ? 'Mức Khá' : 'Báo động',
        pedagogicalRemark:
          appPct >= 70
            ? 'Vận dụng tốt kiến thức vào các bài toán thực tiễn, tính toán và xử lý tình huống mạng/CSDL chuẩn xác.'
            : 'Điểm nghẽn cần can thiệp gấp: Khi gặp tình huống mạng thực tế hoặc yêu cầu xác định khóa liên kết giữa nhiều bảng, học sinh thường chọn theo cảm tính.',
      },
    };

    // Build Competencies matching Image 3 (Bảng 1)
    const nlaPct = compStats.NLa.total > 0 ? Math.round((compStats.NLa.correct / compStats.NLa.total) * 100) : 0;
    const nlbPct = compStats.NLb.total > 0 ? Math.round((compStats.NLb.correct / compStats.NLb.total) * 100) : 0;
    const nlcPct = compStats.NLc.total > 0 ? Math.round((compStats.NLc.correct / compStats.NLc.total) * 100) : 0;

    const competencies = {
      nla: {
        code: 'NLa' as const,
        title: 'Sử dụng và quản lí các phương tiện ICT (NLa)',
        focusDesc: 'Mạng máy tính (12B), Thiết bị Switch/Router, Địa chỉ IPv4/IPv6 & Thiết kế web HTML/CSS (12F)',
        correctCount: compStats.NLa.correct,
        totalCount: compStats.NLa.total,
        percentage: nlaPct,
        statusLabel: nlaPct >= 75 ? 'Nắm rất vững' : nlaPct >= 55 ? 'Đạt yêu cầu' : 'Cần củng cố gấp',
        pedagogicalRemark:
          nlaPct >= 70
            ? 'Kỹ năng làm chủ phương tiện ICT tốt, hiểu rõ cơ chế truyền thông và thiết kế web.'
            : 'Cần ôn sâu lại thiết bị kết nối mạng (Switch/Router) và các phép tính địa chỉ IP trong mạng cục bộ.',
      },
      nlb: {
        code: 'NLb' as const,
        title: 'Ứng xử phù hợp trong môi trường số (NLb)',
        focusDesc: 'Trí tuệ nhân tạo (12A), Tính nhân văn & Đạo đức số (12D), Nhóm nghề dịch vụ Tin học (12G)',
        correctCount: compStats.NLb.correct,
        totalCount: compStats.NLb.total,
        percentage: nlbPct,
        statusLabel: nlbPct >= 75 ? 'Nắm rất vững' : nlbPct >= 55 ? 'Đạt yêu cầu' : 'Cần củng cố gấp',
        pedagogicalRemark:
          nlbPct >= 70
            ? 'Nhận thức đầy đủ về đạo đức công nghệ, bản quyền phần mềm và phân loại nghề nghiệp số.'
            : 'Chú ý các bẫy liên quan đến phân biệt AI hẹp (ANI) và AI tổng quát (AGI), bài kiểm tra Turing.',
      },
      nlc: {
        code: 'NLc' as const,
        title: 'Giải quyết vấn đề với sự trợ giúp của máy tính (NLc)',
        focusDesc: 'Cơ sở dữ liệu quan hệ & SQL (11F), Thuật toán tìm kiếm/sắp xếp (11F_CS) & Lập trình Python (10)',
        correctCount: compStats.NLc.correct,
        totalCount: compStats.NLc.total,
        percentage: nlcPct,
        statusLabel: nlcPct >= 75 ? 'Nắm rất vững' : nlcPct >= 55 ? 'Đạt yêu cầu' : 'Cần can thiệp gấp',
        pedagogicalRemark:
          nlcPct >= 70
            ? 'Tư duy logic giải thuật và truy vấn CSDL sắc sảo, tự tin làm các câu hỏi phân hóa cao.'
            : 'Điểm yếu trọng điểm: Cần củng cố lại các mệnh đề SQL (GROUP BY, HAVING) và truy vết thuật toán tìm kiếm nhị phân.',
      },
    };

    // Build Topic Diagnostic Details mapped to Curriculum Lessons
    const topicDetails: TopicDiagnosticDetail[] = Object.entries(topicStats).map(([tId, stat]) => {
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      const compCode = getCompetencyCode(tId);
      const gapsMeta = CURRICULUM_TOPIC_GAPS[tId] || { lessons: ['Ôn tập kiến thức trọng tâm SGK'], defaultTraps: 'Tránh chọn theo cảm tính.' };

      let status: 'mastered' | 'acceptable' | 'urgent_gap' = 'urgent_gap';
      let label = 'Báo động - Cần can thiệp gấp';
      if (pct >= 75) {
        status = 'mastered';
        label = 'Nắm rất tốt (≥ 75%)';
      } else if (pct >= 60) {
        status = 'acceptable';
        label = 'Đạt yêu cầu (60% - 74%)';
      }

      return {
        topicId: tId as SubjectTopicId,
        topicName: stat.topicName,
        competencyCode: compCode,
        totalQuestions: stat.total,
        correctQuestions: stat.correct,
        percentage: pct,
        knowCorrect: stat.knowCorrect,
        knowTotal: stat.knowTotal,
        understandCorrect: stat.undCorrect,
        understandTotal: stat.undTotal,
        applyCorrect: stat.appCorrect,
        applyTotal: stat.appTotal,
        masteryStatus: status,
        masteryLabel: label,
        specificMissingGaps: gapsMeta.lessons,
        examTrapWarning: gapsMeta.defaultTraps,
      };
    });

    const topicBreakdown = topicDetails.map((td) => ({
      topicId: td.topicId,
      topicName: td.topicName,
      correct: td.correctQuestions,
      total: td.totalQuestions,
      percentage: td.percentage,
    }));

    // AI Overview & Advice
    let ranking = 'Khá - Nền tảng tốt, cần nâng cao vận dụng';
    let assessment = `Học sinh đạt ${finalScore.toFixed(2)}/10 điểm trong đề thi tốt nghiệp THPT chuẩn (Phần I: ${scoresData.part1Score}đ, Phần II: ${scoresData.part2Score}đ). Nắm được kiến thức cốt lõi nhưng còn thiếu sót ở các câu hỏi phân hóa thực tiễn.`;

    if (finalScore >= 9.0) {
      ranking = 'Xuất sắc - Nền tảng vững vàng toàn diện';
      assessment = `Học sinh có tư duy Tin học xuất sắc với ${finalScore.toFixed(2)}/10 điểm trong đề thi tốt nghiệp THPTQG chuẩn. Làm chủ cả phần trắc nghiệm nhiều phương án lẫn đúng/sai.`;
    } else if (finalScore >= 8.0) {
      ranking = 'Giỏi - Nắm chắc kiến thức cốt lõi';
      assessment = `Kết quả thi THPTQG đạt ${finalScore.toFixed(2)}/10 điểm rất ấn tượng. Nền tảng kiến thức vững vàng, chỉ gặp một vài sai sót nhỏ ở các câu hỏi bẫy hoặc vận dụng thực tiễn.`;
    } else if (finalScore < 5.0) {
      ranking = 'Cần củng cố nền tảng kiến thức';
      assessment = `Kết quả đạt ${finalScore.toFixed(2)}/10 điểm cho thấy học sinh còn bị hổng kiến thức nền tảng trong chương trình lớp 11 và 12. Cần bám sát lộ trình từng ngày của TinPath để ôn tập lại.`;
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
      cognitiveLevels,
      competencies,
      topicDetails,
      topicBreakdown,
      wrongQuestions,
      analysis: {
        overallAssessment: assessment,
        levelRanking: ranking,
        strengths: topicDetails.filter((t) => t.percentage >= 70).map((t) => `Nắm vững chuyên đề ${t.topicName} (${t.percentage}% chính xác).`),
        weaknesses: topicDetails
          .filter((t) => t.percentage < 70)
          .map((t) => `Lỗ hổng [${t.topicName}]: ${t.specificMissingGaps[0]} (Độ chính xác: ${t.percentage}%).`),
        pedagogicalAdvice: `Dành ${dailyMinutesInput} phút mỗi ngày theo lộ trình: 20 phút đọc lại lý thuyết các bài học bị hổng, 20 phút giải bài tập trắc nghiệm và 5 phút đối chiếu lời giải chi tiết.`,
        recommendedWeakTopics: topicDetails.filter((t) => t.percentage < 70).map((t) => t.topicId),
      },
    };

    storageService.saveDiagnosticReport(report);
    setDiagnosticReport(report);

    onUpdateUser({
      ...user,
      diagnosticScore: finalScore,
    });

    setIsAnalyzingDiagnostic(false);
    setCurrentStep(2);
  };

  // Submit assessment from Step 1
  const handleSubmitDiagnostic = async () => {
    const scores = calculateExamScore(currentExam, part1Answers, part2Answers);
    await runAiAnalysisOnExam(currentExam, part1Answers, part2Answers, scores.totalScore, scores);
  };

  // Use existing attempt from history in Step 1
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

  // Quick fill sample answers for testing
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

  // Generate Roadmap in Step 3 based on Diagnosed Gaps and Advance to Step 4
  const handleGeneratePlanAndAdvance = async () => {
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

      const plan: AiRoadmapPlan = {
        id: `plan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        track: trackInput,
        daysRemaining,
        examDate: examDateStr,
        assessmentSummary: parsed.assessmentSummary || `Lộ trình bứt phá mục tiêu ${targetScoreInput} điểm dựa trên ma trận năng lực.`,
        targetStrategy: parsed.targetStrategy || `Tập trung khắc phục các lỗ hổng Vận dụng và củng cố kiến thức NLa/NLc.`,
        dailyRoadmap: (parsed.dailyRoadmap || []).map((item: any, idx: number) => ({
          day: item.day || idx + 1,
          topicCode: item.topicCode || '12B',
          topicTitle: item.topicTitle || 'Chuyên đề Tin học',
          keyTask: item.keyTask || 'Ôn tập lý thuyết và giải 10 câu trắc nghiệm',
          minutes: item.minutes || dailyMinutesInput,
          focusQuestionType: item.focusQuestionType || 'Trắc nghiệm nhiều lựa chọn',
          status: 'todo',
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

      setCurrentStep(4);
    } catch {
      const fallback = generateDynamicFallbackRoadmap(targetScoreInput, weakList);
      storageService.saveRoadmapPlan(fallback);
      setAiRoadmap(fallback);
      setCurrentStep(4);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Helper for dynamic fallback roadmap
  function generateDynamicFallbackRoadmap(target: number, weaks: string[]): AiRoadmapPlan {
    const items: RoadmapDayItem[] = [
      {
        day: 1,
        topicCode: '12B',
        topicTitle: 'Mạng máy tính: Thiết bị Switch & Router (NLa - Mức Biết & Hiểu)',
        keyTask: 'Ôn tập Bài 1: Nắm chắc nguyên lý địa chỉ MAC của Switch và IP của Router, phân biệt Hub/AP',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Đọc sơ đồ & Trắc nghiệm lý thuyết',
        status: 'todo',
      },
      {
        day: 2,
        topicCode: '12B',
        topicTitle: 'Địa chỉ IPv4, IPv6 & Phân giải tên miền DNS (NLa - Mức Vận dụng)',
        keyTask: 'Rèn luyện Bài 2: Bài tập tính toán đổi nhị phân IPv4 và cấu trúc địa chỉ IPv6',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Bài tập tính toán & Câu hỏi Đúng/Sai',
        status: 'todo',
      },
      {
        day: 3,
        topicCode: '11F',
        topicTitle: 'Mô hình CSDL quan hệ: Khóa chính & Khóa ngoại (NLc - Mức Hiểu)',
        keyTask: 'Củng cố Bài 1: Bản ghi (Record), Thuộc tính (Field), Khóa chính và toàn vẹn tham chiếu',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Lý thuyết CSDL & Phân tích bảng',
        status: 'todo',
      },
      {
        day: 4,
        topicCode: '11F',
        topicTitle: 'Truy vấn SQL: SELECT, WHERE, GROUP BY & HAVING (NLc - Mức Vận dụng)',
        keyTask: 'Thực hành Bài 2: Phân biệt điều kiện lọc dòng WHERE và lọc nhóm HAVING trong SQL',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Viết câu truy vấn & Trắc nghiệm đúng/sai',
        status: 'todo',
      },
      {
        day: 5,
        topicCode: '12A',
        topicTitle: 'Trí tuệ nhân tạo: 5 Đặc trưng & Bài kiểm tra Turing (NLb - Mức Biết & Hiểu)',
        keyTask: 'Ôn tập Bài 1 & 2: Phân biệt ANI vs AGI, đạo đức công nghệ và cảnh báo Deepfake',
        minutes: Math.max(30, dailyMinutesInput - 10),
        focusQuestionType: 'Trắc nghiệm nhiều lựa chọn',
        status: 'todo',
      },
      {
        day: 6,
        topicCode: '11F_CS',
        topicTitle: 'Thuật toán Tìm kiếm nhị phân & Độ phức tạp O(log n) (NLc - Mức Vận dụng)',
        keyTask: 'Luyện tập Bài 1: Truy vết từng bước chạy thuật toán Binary Search và xử lý mảng sắp xếp',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Truy vết mã nguồn Python',
        status: 'todo',
      },
      {
        day: 7,
        topicCode: 'ALL',
        topicTitle: 'Thi thử Đề tổng hợp 28 câu chuẩn ma trận Bộ GD&ĐT (Đánh giá lại tiến độ)',
        keyTask: 'Làm bài thi thử 50 phút đúng cấu trúc: 24 câu nhiều lựa chọn + 4 câu đúng/sai',
        minutes: 50,
        focusQuestionType: 'Đề thi thử tổng hợp',
        status: 'todo',
      },
    ];

    return {
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetScore: target,
      dailyStudyMinutes: dailyMinutesInput,
      track: trackInput,
      daysRemaining,
      examDate: examDateStr,
      assessmentSummary: `Lộ trình bứt phá mục tiêu ${target} điểm dựa trên ma trận năng lực và 3 cấp độ tư duy.`,
      targetStrategy: `Tập trung bù đắp các lỗ hổng cấp độ Vận dụng ở chuyên đề 12B, 11F và củng cố chắc chắn điểm Nhận biết.`,
      dailyRoadmap: items,
    };
  }

  // Toggle Roadmap Item Completion in Step 4
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

  // AI Chat handler in Step 4 Tutor
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

  // Filtered topics for Knowledge Map in Step 4
  const filteredTopics = useMemo(() => {
    return Object.values(topicMastery).filter((t) => {
      if (masteryFilter !== 'all' && t.status !== masteryFilter) return false;
      const lesson = TOPIC_LESSONS[t.topicId];
      if (gradeFilter !== 'all' && lesson && lesson.grade !== gradeFilter) return false;
      return true;
    });
  }, [topicMastery, masteryFilter, gradeFilter]);

  // Stepper items definition
  const stepsConfig = [
    {
      number: 1 as StepNumber,
      title: 'Đánh giá năng lực',
      description: 'Làm đề thi THPTQG chuẩn',
      isCompleted: Boolean(diagnosticReport),
    },
    {
      number: 2 as StepNumber,
      title: 'Phân tích kiến thức',
      description: 'Ma trận năng lực & 3 cấp độ tư duy',
      isCompleted: Boolean(diagnosticReport),
    },
    {
      number: 3 as StepNumber,
      title: 'Thiết lập mục tiêu',
      description: 'Điểm số & Thời gian học',
      isCompleted: Boolean(aiRoadmap),
    },
    {
      number: 4 as StepNumber,
      title: 'Lộ trình & Tiến độ',
      description: 'Kế hoạch 7 ngày thích ứng',
      isCompleted: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* GUIDED STEPPER NAVIGATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-[#2878C8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  Quy trình Học tập Cá nhân hóa bằng AI
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/70 text-[#2878C8] dark:text-blue-400">
                  Bước {currentStep}/4
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Đánh giá theo Chuẩn ma trận Bảng 1 Sách Hướng dẫn ôn thi tốt nghiệp THPT môn Tin học
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thi THPTQG 2026: còn {daysRemaining} ngày</span>
            </span>
          </div>
        </div>

        {/* 4 Interactive Progress Steps */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stepsConfig.map((s) => {
            const isCurrent = currentStep === s.number;
            const isUnlocked = s.number === 1 || diagnosticReport !== null || s.isCompleted;

            return (
              <button
                key={s.number}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) setCurrentStep(s.number);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#2878C8] shadow-sm'
                    : s.isCompleted
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-white dark:bg-[#202020] border-gray-200 dark:border-[#333] hover:border-gray-400'
                    : 'bg-gray-50 dark:bg-[#161616] border-gray-100 dark:border-[#282828] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isCurrent
                          ? 'bg-[#2878C8] text-white'
                          : s.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {s.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.number}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                      {s.title}
                    </span>
                  </div>

                  {!isUnlocked && <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 pl-8">
                  {s.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BƯỚC 1: ĐÁNH GIÁ NĂNG LỰC ĐẦU VÀO */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#2878C8] inline-block mb-2">
                  Bước 1 / 4: Đánh giá năng lực đầu vào
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Làm bài thi đánh giá năng lực THPT Quốc gia
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
                  Đề thi chuẩn cấu trúc Bộ GD&ĐT gồm 24 câu trắc nghiệm nhiều phương án (Phần I) và 4 câu trắc nghiệm Đúng/Sai đa ý (Phần II). Dữ liệu này là cơ sở để phân bổ theo 3 cấp độ tư duy và 3 thành phần năng lực.
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
                  Chọn đề thi đánh giá năng lực:
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
                  Hoặc sử dụng bài thi đã làm trong lịch sử:
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {q.level === 'biet' ? 'Nhận biết' : q.level === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}
                        </span>
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

            {/* Bottom Action Bar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h4 className="font-black text-gray-900 dark:text-white text-base">
                  Hoàn tất bài kiểm tra đánh giá năng lực?
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hệ thống sẽ tính điểm tự động và bóc tách theo <strong>3 cấp độ tư duy & ma trận năng lực GDPT 2018</strong>.
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
                    <span>Gemini đang phân tích ma trận năng lực...</span>
                  </>
                ) : (
                  <>
                    <span>Nộp bài & Phân tích ma trận năng lực</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 2: PHÂN TÍCH KIẾN THỨC ĐÃ VỮNG + CÒN YẾU (ENRICHED WITH IMAGES 2 & 3) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {diagnosticReport ? (
            <>
              {/* Header Overview Card */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 inline-block mb-1.5">
                      Bước 2 / 4: Báo cáo Chẩn đoán Năng lực Chuyên sâu
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      Phân tích kiến thức đã vững & Lỗ hổng cần bù đắp
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Bài thi: {diagnosticReport.examTitle} • Điểm đạt:{' '}
                      <strong className="text-blue-600 dark:text-blue-400 text-base">
                        {diagnosticReport.score.toFixed(2)}/10
                      </strong>{' '}
                      (Phần I: {diagnosticReport.part1Score}đ, Phần II: {diagnosticReport.part2Score}đ)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 text-[#2878C8] font-bold text-sm">
                      {diagnosticReport.analysis.levelRanking}
                    </span>
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
              </div>

              {/* ================================================================= */}
              {/* SECTION 1: PHÂN BỔ THEO 3 CẤP ĐỘ TƯ DUY GDPT 2018 (EXACT IMAGE 2) */}
              {/* ================================================================= */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 sm:p-7 shadow-xs">
                {/* Title & Legend */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 dark:border-[#262626]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                        Phân bổ Năng lực theo 3 Cấp độ Tư duy GDPT 2018
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-[#2878C8] tracking-wider uppercase border border-blue-200 dark:border-blue-900">
                        CHUẨN ĐỀ THI 2026
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Đối chiếu tỷ lệ trả lời đúng và thời gian tiêu thụ trung bình theo cấu trúc đề thi tốt nghiệp THPT mới.
                    </p>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#0A5296]"></span>
                      <span>Tỷ lệ chính xác</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#D0E1F9] dark:bg-[#1A385C]"></span>
                      <span>Chỉ số mục tiêu (≥80%)</span>
                    </div>
                  </div>
                </div>

                {/* 3 Cognitive Level Rows */}
                <div className="mt-6 space-y-6">
                  {/* Row 1: Mức độ Biết */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#2878C8] font-black text-xs flex items-center justify-center">
                          1
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Mức độ Biết (Định nghĩa, mốc lịch sử, khái niệm nhận biết)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 pl-7 sm:pl-0">
                        <span>TB: {diagnosticReport.cognitiveLevels?.biet?.avgTimeSec || 18}s/câu</span>
                        <span>•</span>
                        <span className="text-[#0A5296] dark:text-blue-400">
                          {diagnosticReport.cognitiveLevels?.biet?.percentage ?? 0}% chính xác ({diagnosticReport.cognitiveLevels?.biet?.statusLabel || 'Đạt chuẩn A+'})
                        </span>
                      </div>
                    </div>

                    {/* Dual Progress Bar with Benchmark */}
                    <div className="relative w-full h-3 bg-[#EAF2FB] dark:bg-[#222] rounded-full overflow-hidden">
                      {/* 80% Benchmark Line */}
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-gray-400 z-10" title="Chuẩn mục tiêu 80%"></div>
                      {/* Active Progress Bar */}
                      <div
                        className="h-full rounded-full bg-[#0A5296] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(3, diagnosticReport.cognitiveLevels?.biet?.percentage ?? 0))}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 pt-0.5 pl-0.5">
                      {diagnosticReport.cognitiveLevels?.biet?.pedagogicalRemark ||
                        'Học sinh phản xạ lập tức với thuật ngữ Tin học cơ bản. Gần như tuyệt đối không mất điểm câu nhận biết.'}
                    </p>
                  </div>

                  {/* Row 2: Mức độ Hiểu */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#2878C8] font-black text-xs flex items-center justify-center">
                          2
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Mức độ Hiểu (Phân loại, giải thích cơ chế hoạt động mạng & thuật toán)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 pl-7 sm:pl-0">
                        <span>TB: {diagnosticReport.cognitiveLevels?.hieu?.avgTimeSec || 45}s/câu</span>
                        <span>•</span>
                        <span className="text-[#1F618D] dark:text-cyan-400">
                          {diagnosticReport.cognitiveLevels?.hieu?.percentage ?? 0}% chính xác ({diagnosticReport.cognitiveLevels?.hieu?.statusLabel || 'Mức Khá'})
                        </span>
                      </div>
                    </div>

                    {/* Dual Progress Bar with Benchmark */}
                    <div className="relative w-full h-3 bg-[#EAF2FB] dark:bg-[#222] rounded-full overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-gray-400 z-10" title="Chuẩn mục tiêu 80%"></div>
                      <div
                        className="h-full rounded-full bg-[#1F618D] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(3, diagnosticReport.cognitiveLevels?.hieu?.percentage ?? 0))}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 pt-0.5 pl-0.5">
                      {diagnosticReport.cognitiveLevels?.hieu?.pedagogicalRemark ||
                        'Hiểu nguyên lý ở mức trung bình - khá. Có hiện tượng do dự khi các đáp án nhiễu có chung từ khóa kỹ thuật.'}
                    </p>
                  </div>

                  {/* Row 3: Mức độ Vận dụng */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 font-black text-xs flex items-center justify-center">
                          3
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Mức độ Vận dụng (Tính toán IP nhị phân, thiết kế bảng CSDL, truy vết gói tin)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 pl-7 sm:pl-0">
                        <span>TB: {diagnosticReport.cognitiveLevels?.van_dung?.avgTimeSec || 95}s/câu</span>
                        <span>•</span>
                        <span className={(diagnosticReport.cognitiveLevels?.van_dung?.percentage ?? 0) < 60 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                          {diagnosticReport.cognitiveLevels?.van_dung?.percentage ?? 0}% chính xác ({diagnosticReport.cognitiveLevels?.van_dung?.statusLabel || 'Báo động'})
                        </span>
                      </div>
                    </div>

                    {/* Dual Progress Bar with Benchmark */}
                    <div className="relative w-full h-3 bg-[#EAF2FB] dark:bg-[#222] rounded-full overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-gray-400 z-10" title="Chuẩn mục tiêu 80%"></div>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          (diagnosticReport.cognitiveLevels?.van_dung?.percentage ?? 0) < 60 ? 'bg-[#C5221F]' : 'bg-[#1F618D]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(3, diagnosticReport.cognitiveLevels?.van_dung?.percentage ?? 0))}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-rose-600 dark:text-rose-400 pt-0.5 pl-0.5 font-medium">
                      {diagnosticReport.cognitiveLevels?.van_dung?.pedagogicalRemark ||
                        'Điểm nghẽn cần can thiệp gấp: Khi gặp tình huống mạng thực tế hoặc yêu cầu xác định khóa liên kết giữa nhiều bảng, học sinh thường chọn theo cảm tính.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION 2: BẢNG 1 MA TRẬN NĂNG LỰC GDPT 2018 (EXACT IMAGE 3) */}
              {/* ================================================================= */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 sm:p-7 shadow-xs">
                <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Phân bổ theo 3 Thành phần Năng lực Tin học (Bảng 1 Ma trận GDPT 2018)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Đo lường năng lực theo Bảng 1 Sách Hướng dẫn ôn thi tốt nghiệp THPT môn Tin học của Bộ Giáo dục & Đào tạo.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* NLa */}
                  <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                          NLa
                        </span>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                          {diagnosticReport.competencies?.nla?.statusLabel || 'Đạt yêu cầu'}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        Sử dụng & Quản lí phương tiện ICT
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Mạng máy tính (12B), Thiết bị Switch/Router, Địa chỉ IPv4/IPv6 & Thiết kế web HTML/CSS (12F)
                      </p>

                      <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Độ chính xác:</span>
                          <span className="font-bold text-blue-600">
                            {diagnosticReport.competencies?.nla?.percentage ?? 0}% ({diagnosticReport.competencies?.nla?.correctCount ?? 0}/{diagnosticReport.competencies?.nla?.totalCount ?? 0} câu)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.max(5, diagnosticReport.competencies?.nla?.percentage ?? 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 pt-2 border-t border-blue-100 dark:border-blue-900/30">
                      {diagnosticReport.competencies?.nla?.pedagogicalRemark || 'Cần củng cố lại bài toán tính địa chỉ IP.'}
                    </p>
                  </div>

                  {/* NLb */}
                  <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs">
                          NLb
                        </span>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                          {diagnosticReport.competencies?.nlb?.statusLabel || 'Nắm rất vững'}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        Ứng xử phù hợp trong môi trường số
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Trí tuệ nhân tạo (12A), Đạo đức số & Nhân văn (12D), Nhóm nghề dịch vụ Tin học (12G)
                      </p>

                      <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Độ chính xác:</span>
                          <span className="font-bold text-purple-600">
                            {diagnosticReport.competencies?.nlb?.percentage ?? 0}% ({diagnosticReport.competencies?.nlb?.correctCount ?? 0}/{diagnosticReport.competencies?.nlb?.totalCount ?? 0} câu)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${Math.max(5, diagnosticReport.competencies?.nlb?.percentage ?? 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 pt-2 border-t border-purple-100 dark:border-purple-900/30">
                      {diagnosticReport.competencies?.nlb?.pedagogicalRemark || 'Nhận thức tốt về các vấn đề bản quyền và AI.'}
                    </p>
                  </div>

                  {/* NLc */}
                  <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs">
                          NLc
                        </span>
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          {diagnosticReport.competencies?.nlc?.statusLabel || 'Cần can thiệp gấp'}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                        Giải quyết vấn đề với sự trợ giúp máy tính
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Cơ sở dữ liệu quan hệ (11F), Thuật toán tìm kiếm (11F_CS) & Lập trình Python cơ bản (10)
                      </p>

                      <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/40">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Độ chính xác:</span>
                          <span className="font-bold text-indigo-600">
                            {diagnosticReport.competencies?.nlc?.percentage ?? 0}% ({diagnosticReport.competencies?.nlc?.correctCount ?? 0}/{diagnosticReport.competencies?.nlc?.totalCount ?? 0} câu)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-indigo-950 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.max(5, diagnosticReport.competencies?.nlc?.percentage ?? 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/30">
                      {diagnosticReport.competencies?.nlc?.pedagogicalRemark || 'Điểm yếu trọng điểm: Cần củng cố SQL và thuật toán.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION 3: MA TRẬN CHẨN ĐOÁN CHI TIẾT TỪNG CHUYÊN ĐỀ (DANH SÁCH BÀI HỌC) */}
              {/* ================================================================= */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 sm:p-7 shadow-xs">
                <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    Ma trận Chẩn đoán theo Danh sách Bài học chuẩn SGK GDPT 2018
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bóc tách mức độ hiểu biết trong từng chuyên đề: Nêu rõ bài học đang nắm tốt và các khái niệm còn thiếu hụt.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {diagnosticReport.topicDetails && diagnosticReport.topicDetails.length > 0 ? (
                    diagnosticReport.topicDetails.map((td) => {
                      const isUrgent = td.masteryStatus === 'urgent_gap';
                      const isMastered = td.masteryStatus === 'mastered';

                      return (
                        <div
                          key={td.topicId}
                          className={`p-5 rounded-2xl border transition-all ${
                            isUrgent
                              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                              : isMastered
                              ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                              : 'bg-blue-50/30 dark:bg-blue-950/15 border-blue-200 dark:border-blue-900/40'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-200/60 dark:border-[#333]">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2.5 py-1 rounded-lg bg-[#2878C8] text-white text-xs font-black">
                                {td.topicId}
                              </span>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                                {td.topicName}
                              </h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300">
                                {td.competencyCode}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  isUrgent
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                    : isMastered
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                }`}
                              >
                                {td.masteryLabel}
                              </span>
                              <span className="text-xs font-mono font-bold text-gray-500">
                                {td.correctQuestions}/{td.totalQuestions} câu ({td.percentage}%)
                              </span>
                            </div>
                          </div>

                          {/* 3 mini cognitive bars */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between">
                              <span className="text-gray-500">Biết:</span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {td.knowCorrect}/{td.knowTotal} câu
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between">
                              <span className="text-gray-500">Hiểu:</span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {td.understandCorrect}/{td.understandTotal} câu
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between">
                              <span className="text-gray-500">Vận dụng:</span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {td.applyCorrect}/{td.applyTotal} câu
                              </span>
                            </div>
                          </div>

                          {/* Specific Missing Gaps from Lessons */}
                          <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-[#333] space-y-1.5 text-xs">
                            <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                              <span>Kiến thức trọng tâm trong danh sách bài học SGK:</span>
                            </div>
                            <ul className="space-y-1 pl-5 list-disc text-gray-600 dark:text-gray-400">
                              {td.specificMissingGaps.map((gap, gIdx) => (
                                <li key={gIdx} className="leading-relaxed">
                                  {gap}
                                </li>
                              ))}
                            </ul>
                            {td.examTrapWarning && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>Bẫy đề thi: {td.examTrapWarning}</span>
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-[#333] flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (onStartTopicQuiz) onStartTopicQuiz(td.topicId, 10);
                                else onNavigateTopic(td.topicId);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Luyện tập bù đắp chuyên đề {td.topicId}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">Đang tổng hợp ma trận chuyên đề...</p>
                  )}
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION 4: CHI TIẾT CÂU LÀM SAI & LỖI TƯ DUY */}
              {/* ================================================================= */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <h3 className="font-black text-gray-900 dark:text-white text-lg">
                    Chi tiết các câu hỏi làm sai ({diagnosticReport.wrongQuestions.length} câu)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Phân tích nguyên nhân sai lầm và đối chiếu giải thích chuẩn SGK GDPT 2018
                  </p>
                </div>

                {diagnosticReport.wrongQuestions.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {diagnosticReport.wrongQuestions.map((wq, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-xs">
                              Câu hỏi #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-gray-500">[{wq.topicName}]</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300">
                              {wq.level === 'biet' ? 'Mức Biết' : wq.level === 'hieu' ? 'Mức Hiểu' : 'Mức Vận dụng'}
                            </span>
                          </div>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      Xuất sắc! Bạn làm đúng 100% tất cả các câu hỏi
                    </h4>
                  </div>
                )}
              </div>

              {/* Navigation to Next Step */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Làm lại bài đánh giá</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all"
                >
                  <span>Tiếp tục: Thiết lập mục tiêu học tập (Bước 3)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-black text-gray-900 dark:text-white text-lg">
                Chưa hoàn thành Bước 1
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-6">
                Bạn cần làm bài thi đánh giá năng lực ở Bước 1 trước khi xem phân tích kiến thức.
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-xl bg-[#2878C8] text-white font-bold text-sm shadow-md"
              >
                Quay lại Bước 1: Đánh giá năng lực
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 3: THIẾT LẬP MỤC TIÊU ĐIỂM + THỜI GIAN HỌC */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-gray-100 dark:border-[#262626]">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#2878C8] inline-block mb-2">
                Bước 3 / 4: Thiết lập mục tiêu học tập
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Thiết lập mục tiêu điểm thi & Thời gian rèn luyện
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                Dựa trên ma trận năng lực Bước 2 (Điểm đạt:{' '}
                <strong>{currentProficiency !== null ? `${currentProficiency.toFixed(1)}/10đ` : 'đã test'}</strong>), hãy chọn mục tiêu điểm số và thời gian học mỗi ngày để AI lên lộ trình khắc phục các lỗ hổng Vận dụng và chuyên đề yếu.
              </p>
            </div>

            {/* Inputs Form */}
            <div className="mt-8 space-y-8 max-w-3xl">
              {/* Target Score Input */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-gray-900 dark:text-white text-base">
                      1. Mục tiêu điểm thi Tốt nghiệp THPTQG
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Điểm mục tiêu bạn mong muốn đạt được trong kỳ thi chính thức
                    </p>
                  </div>
                  <span className="text-3xl font-black text-[#2878C8]">
                    {targetScoreInput} <span className="text-sm font-semibold text-gray-400">/ 10</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={targetScoreInput}
                  onChange={(e) => setTargetScoreInput(Number(e.target.value))}
                  className="w-full accent-[#2878C8] h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-xs text-gray-400 font-semibold px-1">
                  <span>6.0 (Cơ bản)</span>
                  <span>7.5 (Khá)</span>
                  <span>8.5 (Giỏi - Khuyên dùng)</span>
                  <span>10.0 (Xuất sắc)</span>
                </div>

                {currentProficiency !== null && (
                  <div className="pt-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                    <Target className="w-4 h-4 shrink-0" />
                    <span>
                      Cần bứt phá thêm: <strong>+{Math.max(0, Number((targetScoreInput - currentProficiency).toFixed(1)))} điểm</strong> so với bài test đầu vào.
                    </span>
                  </div>
                )}
              </div>

              {/* Daily Study Minutes Input */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-4">
                <div>
                  <label className="font-bold text-gray-900 dark:text-white text-base">
                    2. Quỹ thời gian tự học mỗi ngày
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Thời lượng bạn có thể dành ra mỗi ngày để ôn tập môn Tin học
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { mins: 30, label: '30 phút', desc: 'Nhẹ nhàng' },
                    { mins: 45, label: '45 phút', desc: 'Khuyên dùng' },
                    { mins: 60, label: '60 phút', desc: 'Tiêu chuẩn' },
                    { mins: 90, label: '90 phút', desc: 'Cấp tốc' },
                  ].map((item) => (
                    <button
                      key={item.mins}
                      type="button"
                      onClick={() => setDailyMinutesInput(item.mins)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        dailyMinutesInput === item.mins
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-[#2878C8] text-[#2878C8] font-bold shadow-xs'
                          : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-base font-black">{item.label}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Track Input */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-4">
                <div>
                  <label className="font-bold text-gray-900 dark:text-white text-base">
                    3. Định hướng chuyên đề THPT (Phân ban)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Chọn phân ban bạn đăng ký dự thi tốt nghiệp THPT
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTrackInput('CS')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      trackInput === 'CS'
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-[#2878C8] text-[#2878C8] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-black text-sm">Khoa học máy tính (CS)</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Thuật toán, lập trình Python, Học máy & Khoa học dữ liệu
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrackInput('ICT')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      trackInput === 'ICT'
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-[#2878C8] text-[#2878C8] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-black text-sm">Tin học ứng dụng (ICT)</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Thực hành phần mềm web, khai thác CSDL, ứng dụng văn phòng
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Xem lại ma trận phân tích năng lực</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPlan}
                onClick={handleGeneratePlanAndAdvance}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Gemini đang sinh lộ trình thích ứng...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Sinh lộ trình bám sát lỗ hổng bằng AI</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 4: LỘ TRÌNH CÁ NHÂN HÓA & THEO DÕI TIẾN ĐỘ HỌC TẬP */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Hero Overview Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Nhiệm vụ học tập hôm nay
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {todaysTask ? todaysTask.topicTitle : 'Lộ trình ôn tập TinPath AI'}
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {todaysTask
                    ? `${todaysTask.keyTask} (${todaysTask.minutes} phút - ${todaysTask.focusQuestionType})`
                    : 'Bám sát lộ trình 7 ngày dưới đây để từng bước nâng cao điểm số môn Tin học.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-white/80">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {todaysTask ? `${todaysTask.minutes} phút` : `${dailyMinutesInput} phút`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" /> {todaysTask ? `Chuyên đề: ${todaysTask.topicCode}` : 'Kiến thức trọng tâm'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Award className="w-3.5 h-3.5" /> +25 XP khi hoàn thành ngày
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                {todaysTask && (
                  <button
                    onClick={() => {
                      if (todaysTask.topicCode === 'ALL') {
                        if (onStartExam) onStartExam(selectedExamId);
                      } else {
                        if (onStartTopicQuiz) onStartTopicQuiz(todaysTask.topicCode as SubjectTopicId, 10);
                        else onNavigateTopic(todaysTask.topicCode as SubjectTopicId);
                      }
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-white text-[#2878C8] hover:bg-blue-50 font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Play className="w-5 h-5 fill-[#2878C8]" />
                    <span>Vào học ngay</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Chỉnh mục tiêu</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thi lại đầu vào</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Core Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 shadow-xs">
              <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Mục tiêu điểm</span>
              <div className="text-2xl font-black text-[#2878C8]">
                {aiRoadmap?.targetScore || user.targetScore || 8.5}/10
              </div>
              <span className="text-[11px] text-gray-500">Đầu vào: {currentProficiency ? `${currentProficiency.toFixed(1)}đ` : '--'}</span>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 shadow-xs">
              <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Thời gian học</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {aiRoadmap?.dailyStudyMinutes || 45} phút
              </div>
              <span className="text-[11px] text-gray-500">Mỗi ngày</span>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 shadow-xs">
              <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Tiến độ 7 ngày</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {aiRoadmap ? aiRoadmap.dailyRoadmap.filter((d) => d.status === 'completed').length : 0} / 7
              </div>
              <span className="text-[11px] text-gray-500">Ngày đã hoàn thành</span>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-4 shadow-xs">
              <span className="text-gray-400 text-xs font-bold uppercase block mb-1">Chuỗi Streak</span>
              <div className="text-2xl font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <Flame className="w-6 h-6 text-orange-500" />
                <span>{user.streakDays || 1}</span>
              </div>
              <span className="text-[11px] text-gray-500">Ngày liên tục</span>
            </div>
          </div>

          {/* Sub-view switcher inside Step 4 */}
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#2C2C2C] pb-3">
            <button
              onClick={() => setStep4SubView('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                step4SubView === 'roadmap'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'bg-white dark:bg-[#202020] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Lộ trình từng ngày (7 Days)</span>
            </button>

            <button
              onClick={() => setStep4SubView('knowledge_map')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                step4SubView === 'knowledge_map'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'bg-white dark:bg-[#202020] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Bản đồ tri thức (11 Chuyên đề)</span>
            </button>

            <button
              onClick={() => setStep4SubView('tutor')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                step4SubView === 'tutor'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'bg-white dark:bg-[#202020] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gia sư AI Đồng hành</span>
            </button>
          </div>

          {/* SUB-VIEW 1: ROADMAP */}
          {step4SubView === 'roadmap' && aiRoadmap && (
            <div className="space-y-4">
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
                                Đã hoàn thành (+25 XP)
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

          {/* SUB-VIEW 2: KNOWLEDGE MAP */}
          {step4SubView === 'knowledge_map' && (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    Bản đồ tri thức 11 chuyên đề GDPT 2018
                  </h3>
                  <p className="text-xs text-gray-500">Mức độ thành thạo và bẫy đề thi cần lưu ý</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-xs font-bold"
                  >
                    <option value="all">Tất cả khối lớp</option>
                    <option value="12">Lớp 12 (Trọng tâm)</option>
                    <option value="11">Lớp 11</option>
                    <option value="10">Lớp 10</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTopics.map((t) => {
                  const isNeedsImp = t.status === 'needs_improvement';
                  const isProf = t.status === 'proficient';

                  return (
                    <div
                      key={t.topicId}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        isNeedsImp
                          ? 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-200'
                          : isProf
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200'
                          : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-[#2878C8] text-white font-black text-[11px]">
                            {t.topicId}
                          </span>
                          <span className="text-[11px] font-bold text-gray-500">{t.statusLabel}</span>
                        </div>

                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                          {t.topicName}
                        </h4>

                        <div className="mt-2 text-xs text-gray-500">
                          Độ chính xác: <strong>{t.percentage}%</strong> ({t.totalCorrect}/{t.totalAnswered} câu)
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigateTopic(t.topicId)}
                          className="flex-1 py-1.5 rounded-lg bg-gray-100 dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold text-xs"
                        >
                          Lý thuyết
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onStartTopicQuiz) onStartTopicQuiz(t.topicId, 10);
                            else onNavigateTopic(t.topicId);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-[#2878C8] text-white font-bold text-xs"
                        >
                          Luyện 10 câu
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: TUTOR */}
          {step4SubView === 'tutor' && (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs flex flex-col h-[650px]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2878C8]" /> Gia sư AI TinPath SGK 12
                  </h3>
                  <p className="text-xs text-gray-500">RAG kết nối tri thức SGK GDPT 2018</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTutorMode('rag')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      tutorMode === 'rag' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-[#252525] text-gray-600'
                    }`}
                  >
                    SGK RAG
                  </button>
                  <button
                    type="button"
                    onClick={() => setTutorMode('thinking')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      tutorMode === 'thinking' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-[#252525] text-gray-600'
                    }`}
                  >
                    Suy luận sâu
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-sm">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#2878C8] text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-[#222] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#333]'
                      }`}
                    >
                      {msg.text}

                      {msg.ragSources && msg.ragSources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-indigo-200 text-[11px] text-indigo-600 font-semibold">
                          📖 Trích dẫn: {msg.ragSources.map((s) => `${s.bookSource} (${s.title})`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAskingAi && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-[#222] text-xs text-gray-500 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2878C8]" />
                      <span>Gemini đang phản hồi...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex gap-2">
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi cần Gia sư AI giải đáp..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs sm:text-sm focus:outline-none focus:border-[#2878C8]"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !inputQuestion.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
