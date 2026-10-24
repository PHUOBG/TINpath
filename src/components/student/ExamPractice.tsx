import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  Clock,
  BookOpen,
  CheckCircle2,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart2,
  Calendar,
  Layers,
  MessageSquare,
  FileQuestion,
  Users,
  History,
  Brain,
  Zap,
  Sliders,
  Check,
  RefreshCw,
  Wand2,
} from 'lucide-react';
import { Exam, SubjectTopicId, ExamAttempt } from '../../types';
import { OFFICIAL_EXAMS } from '../../data/officialExamsData';
import { getExams } from '../../services/supabaseDbService';
import { TOPIC_LESSONS } from '../../data/topicsData';
import { storageService } from '../../services/storageService';
import { ExamCommentModal } from './ExamCommentModal';
import { createRemedialExam, WrongQuestionInput } from '../../services/remedialExamService';

interface ExamPracticeProps {
  onStartExam: (examId: string, isRetake?: boolean) => void;
  onStartCustomExam?: (exam: Exam) => void;
  onStartDailyChallenge: () => void;
  onStartTopicQuiz: (topicId: SubjectTopicId, questionCount: number, level: string) => void;
  completedDailyToday: boolean;
  streakDays: number;
  examAttempts: ExamAttempt[];
}

export const ExamPractice: React.FC<ExamPracticeProps> = ({
  onStartExam,
  onStartCustomExam,
  onStartDailyChallenge,
  onStartTopicQuiz,
  completedDailyToday,
  streakDays,
  examAttempts,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'topic' | 'exams' | 'submissions'>('exams');
  const [commentModalExam, setCommentModalExam] = useState<{ id: string; title: string } | null>(null);
  const [commentsVersion, setCommentsVersion] = useState(0);
  const currentUser = storageService.getUserProfile();

  // Topic practice configuration state
  const [selectedTopic, setSelectedTopic] = useState<SubjectTopicId>('12B');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficultyLevel, setDifficultyLevel] = useState<string>('all');

  // Exam bank filter state
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [examsList, setExamsList] = useState<Exam[]>(OFFICIAL_EXAMS);

  useEffect(() => {
    getExams().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setExamsList(loaded);
      }
    });
  }, []);

  const filteredExams = examsList.filter((ex) => {
    if (difficultyFilter === 'all') return true;
    return ex.difficulty === difficultyFilter;
  });

  const getExamTeacher = (exam: Exam): string => {
    if (exam.source) {
      if (exam.source.toLowerCase().includes('thi247')) return 'Giáo Viên - Thi247.vn';
      if (exam.source.includes('Thu Xà')) return 'Giáo Viên - THPT Thu Xà';
      if (exam.source.includes('Bình Sơn')) return 'Giáo Viên - THPT Bình Sơn';
      if (exam.source.includes('Lê Khiết')) return 'Giáo Viên - Chuyên Lê Khiết';
      if (exam.source.includes('Quang Trung')) return 'Giáo Viên - THPT Quang Trung';
      if (exam.source.includes('Lê Trung Đình')) return 'Giáo Viên - THPT Lê Trung Đình';
      if (exam.source.includes('Bộ GD&ĐT') || exam.source.includes('Bộ Giáo Dục')) return 'Bộ GD&ĐT - Đề Minh Họa';
      const clean = exam.source.replace(/^Trường\s+/, '').split(',')[0].trim();
      return `Giáo Viên - ${clean}`;
    }
    return 'Giáo Viên Tin Học';
  };

  const getExamTakers = (examId: string): number => {
    const seedTakers: Record<string, number> = {
      thpt_thu_xa_2026: 18,
      thuxa_p1_c1: 32,
      bso_p1_c1: 54,
      lkh_p1_c1: 27,
      qtr_p1_c1: 39,
    };
    const base = seedTakers[examId] || 18;
    const attempts = examAttempts.filter((a) => a.examId === examId).length;
    return base + attempts;
  };

  // ---------------------------------------------------------------------------
  // AI REMEDIAL EXAM GENERATOR STATE & LOGIC (Khắc phục câu sai qua Gemini AI)
  // ---------------------------------------------------------------------------
  const [isGeneratingRemedial, setIsGeneratingRemedial] = useState(false);
  const [remedialMode, setRemedialMode] = useState<'variation' | 'retest'>('variation');
  const [remedialSource, setRemedialSource] = useState<string>('all');
  const [remedialCount, setRemedialCount] = useState<number>(10);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  // Extract all wrong questions across exam attempts
  const allWrongQuestions = React.useMemo<WrongQuestionInput[]>(() => {
    const result: WrongQuestionInput[] = [];
    const seen = new Set<string>();

    examAttempts.forEach((attempt) => {
      const exam =
        examsList.find((e) => e.id === attempt.examId) ||
        OFFICIAL_EXAMS.find((e) => e.id === attempt.examId);
      if (!exam) return;

      exam.part1Questions.forEach((q) => {
        const studentAns = attempt.answers[q.id]?.selectedOption;
        if (!studentAns || studentAns !== q.correctAnswer) {
          const key = `${attempt.id}_${q.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            result.push({
              id: q.id,
              topicId: q.topicId as SubjectTopicId,
              content: q.content,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              userAnswer: studentAns,
              examId: attempt.examId,
              examTitle: attempt.examTitle,
            });
          }
        }
      });
    });

    return result;
  }, [examAttempts, examsList]);

  // Active pool based on selected source exam
  const activeWrongQuestions = React.useMemo(() => {
    if (remedialSource === 'all') return allWrongQuestions;
    return allWrongQuestions.filter((q) => q.examId === remedialSource);
  }, [allWrongQuestions, remedialSource]);

  // Handle generation action
  const handleGenerateRemedialExam = async (specificAttemptExamId?: string) => {
    const sourceId = specificAttemptExamId || remedialSource;
    const questionsPool = sourceId === 'all'
      ? allWrongQuestions
      : allWrongQuestions.filter((q) => q.examId === sourceId);

    if (questionsPool.length === 0) {
      alert('Không tìm thấy câu làm sai nào trong bài thi được chọn.');
      return;
    }

    setIsGeneratingRemedial(true);
    setGenerationFeedback(
      remedialMode === 'variation'
        ? 'Gemini AI đang phân tích lỗi sai và tiến hành biến tấu câu hỏi (đổi số liệu & ngữ cảnh)...'
        : 'Hệ thống đang xáo trộn phương án các câu sai để bạn kiểm tra lại phản xạ...'
    );

    try {
      const { exam, modelUsed } = await createRemedialExam({
        wrongQuestions: questionsPool,
        mode: remedialMode,
        questionCount: remedialCount,
        studentTrack: (currentUser.track as 'CS' | 'ICT') || 'CS',
      });

      setGenerationFeedback(`Đã tạo thành công đề thi bằng ${modelUsed}! Đang chuyển vào phòng thi...`);

      setTimeout(() => {
        setIsGeneratingRemedial(false);
        setGenerationFeedback(null);
        if (onStartCustomExam) {
          onStartCustomExam(exam);
        } else {
          onStartExam(exam.id, true);
        }
      }, 700);
    } catch (err) {
      console.error('Failed to generate remedial exam:', err);
      setIsGeneratingRemedial(false);
      setGenerationFeedback('Đã có lỗi xảy ra khi tạo đề thi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation (Anti-slop clean segmented button bar) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202020] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2878C8]" />
              Trung tâm Luyện đề Tin học THPT
            </h2>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-1">
              Rèn luyện theo chuẩn cấu trúc đề thi tốt nghiệp THPT từ năm 2025 của Bộ Giáo dục & Đào tạo
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-lg flex-wrap">
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'exams'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#22A06B]" />
              Ngân hàng đề thi
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'submissions'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4 text-[#2878C8]" />
              Các bài nộp {examAttempts.length > 0 && `(${examAttempts.length})`}
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'daily'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FFC928]" />
              Thử thách hằng ngày
            </button>

            <button
              onClick={() => setActiveTab('topic')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'topic'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4 text-[#2878C8]" />
              Luyện theo chủ đề
            </button>
          </div>
        </div>
      </div>

      {/* TAB A: THỬ THÁCH HẰNG NGÀY */}
      {activeTab === 'daily' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50 dark:border-amber-900/40">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-lg bg-amber-500 text-white shadow-xs">
                  <Flame className="w-6 h-6 fill-white" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Thử thách 10 câu trắc nghiệm mỗi ngày
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    Duy trì chuỗi ngày học liên tục · Nhận tối đa 80 XP mỗi ngày
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <div className="text-right">
                <span className="text-xs text-gray-500 block font-medium">Chuỗi hiện tại</span>
                <span className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
                  {streakDays} ngày liên tiếp
                </span>
              </div>

              {!completedDailyToday ? (
                <button
                  onClick={onStartDailyChallenge}
                  className="px-6 py-3 rounded-lg bg-[#2878C8] text-white text-sm font-bold hover:bg-[#2068B0] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Play className="w-4.5 h-4.5 fill-white" /> Bắt đầu thử thách hôm nay
                </button>
              ) : (
                <div className="px-4.5 py-2.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-sm font-bold flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Đã hoàn thành hôm nay (+80 XP)
                </div>
              )}
            </div>
          </div>

          {/* Rules and Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Quy định nhận điểm XP</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Mỗi ngày được tính điểm 1 lần duy nhất để bảo đảm tính công bằng. Bạn nhận 30 XP cơ bản khi nộp bài và 5 XP cho mỗi câu trả lời đúng (tối đa 80 XP).
              </p>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Mốc thưởng chuỗi ngày</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Đạt mốc 7 ngày: thưởng +50 XP. Mốc 14 ngày: thưởng +100 XP. Mốc 30 ngày: thưởng +200 XP được xác minh bảo mật phía máy chủ.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Xem lại câu hỏi</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Sau khi hoàn thành, bạn vẫn có thể xem lại đáp án và lời giải chi tiết bất cứ lúc nào mà không sợ ảnh hưởng đến tiến độ chuỗi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: LUYỆN THEO CHỦ ĐỀ */}
      {activeTab === 'topic' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Tùy chỉnh phòng luyện tập theo chủ đề
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Tập trung khắc phục chủ đề yếu hoặc luyện tập chuyên sâu các dạng câu hỏi cụ thể
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Topic selector */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                1. Chọn chủ đề kiến thức
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value as SubjectTopicId)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm font-medium focus:outline-none focus:border-[#2878C8]"
              >
                {Object.values(TOPIC_LESSONS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} — {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Question count */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                2. Số lượng câu hỏi
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm font-medium focus:outline-none focus:border-[#2878C8]"
              >
                <option value={5}>5 câu (Khởi động nhanh - 7 phút)</option>
                <option value={10}>10 câu (Tiêu chuẩn - 15 phút)</option>
                <option value={15}>15 câu (Chuyên sâu - 22 phút)</option>
                <option value={20}>20 câu (Thử thách - 30 phút)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                3. Cấp độ tư duy
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm font-medium focus:outline-none focus:border-[#2878C8]"
              >
                <option value="all">Tất cả mức độ (Biết, Hiểu, Vận dụng)</option>
                <option value="biet">Mức độ Biết (Nhận biết khái niệm)</option>
                <option value="hieu">Mức độ Hiểu (Thông hiểu, đọc code)</option>
                <option value="van_dung">Mức độ Vận dụng (Tình huống thực tiễn)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={() => onStartTopicQuiz(selectedTopic, questionCount, difficultyLevel)}
              className="px-7 py-3 rounded-lg bg-[#2878C8] text-white text-sm font-bold hover:bg-[#2068B0] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Play className="w-4.5 h-4.5 fill-white" /> Bắt đầu làm bài luyện tập
            </button>
          </div>
        </div>
      )}

      {/* TAB C: NGÂN HÀNG ĐỀ THI TỐT NGHIỆP */}
      {activeTab === 'exams' && (
        <div className="space-y-5">
          {/* Exam Filter strip */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-1 font-medium">
            <span>DANH SÁCH ĐỀ THI ({filteredExams.length} đề chuẩn Bộ GD&ĐT)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">Lọc độ khó:</span>
              {(['all', 'Thi thử tốt nghiệp', 'Cơ bản', 'Nâng cao'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm transition-colors ${
                    difficultyFilter === lvl
                      ? 'bg-[#2878C8] text-white font-bold'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const attempt = examAttempts.find((a) => a.examId === exam.id);
              const totalQuestions = (exam.part1Questions?.length || 0) + (exam.part2Questions?.length || 0) || 28;
              const takersCount = getExamTakers(exam.id);
              const teacherName = getExamTeacher(exam);

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 dark:hover:border-[#444] transition-all"
                >
                  <div>
                    {/* Header tags: Độ khó & XP */}
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#2878C8] dark:text-blue-300 font-semibold border border-blue-200/50 dark:border-blue-900/40">
                        {exam.difficulty}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-500">
                        +{exam.baseXP} XP
                      </span>
                    </div>

                    {/* Tiêu đề đề thi */}
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mt-2.5 leading-snug">
                      {exam.title}
                    </h3>

                    {/* Khung thông số theo yêu cầu: Năm, Số câu, Thời gian thi, Số lượt thi, Giáo viên up đề */}
                    <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-[#2C2C2C] space-y-3">
                      {/* Năm */}
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Năm {exam.year}
                      </div>

                      {/* 2 cột thông số: Số câu, Thời gian, Số lượt */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        {/* Số câu */}
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                          <FileQuestion className="w-4.5 h-4.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                          <span>
                            <strong className="font-bold text-gray-900 dark:text-white">{totalQuestions}</strong> câu
                          </span>
                        </div>

                        {/* Thời gian thi */}
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                          <Clock className="w-4.5 h-4.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                          <span>
                            <strong className="font-bold text-gray-900 dark:text-white">{exam.durationMinutes}</strong> phút
                          </span>
                        </div>

                        {/* Số lượng người thi */}
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                          <Users className="w-4.5 h-4.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                          <span>
                            <strong className="font-bold text-gray-900 dark:text-white">{takersCount}</strong> lượt
                          </span>
                        </div>
                      </div>

                      {/* Đường phân cách và Giáo viên up đề */}
                      <div className="pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs shrink-0">
                          G
                        </div>
                        <span className="truncate font-medium">{teacherName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      {attempt ? (
                        <span className="text-sm text-[#22A06B] font-semibold flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> Điểm cao nhất: {attempt.totalScore.toFixed(2)}đ
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-400 italic">Chưa làm bài</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() =>
                          setCommentModalExam({
                            id: exam.id,
                            title: exam.title,
                          })
                        }
                        className="px-3.5 py-2 rounded-lg border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                        title="Xem và gửi ý kiến thảo luận đề thi"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span>Thảo luận ({storageService.getComments(exam.id).length})</span>
                      </button>

                      <button
                        onClick={() => onStartExam(exam.id, Boolean(attempt))}
                        className="px-5 py-2 rounded-lg bg-[#2878C8] text-white text-xs sm:text-sm font-bold hover:bg-[#2068B0] transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-white" /> {attempt ? 'Luyện lại' : 'Bắt đầu làm bài'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB D: CÁC BÀI NỘP (LỊCH SỬ THI) */}
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#2C2C2C]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#2878C8]">
                  <History className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Lịch sử các bài thi đã nộp
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tổng hợp tất cả các lần làm bài thi trắc nghiệm tốt nghiệp THPT của bạn
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span>
                Tổng số bài nộp: <strong className="text-gray-900 dark:text-white font-mono">{examAttempts.length}</strong>
              </span>
              {examAttempts.length > 0 && (
                <>
                  <span>•</span>
                  <span>
                    Điểm cao nhất: <strong className="text-emerald-600 font-mono font-bold">
                      {Math.max(...examAttempts.map((a) => a.totalScore)).toFixed(2)}đ
                    </strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* AI REMEDIAL GENERATOR FEATURE BANNER & WORKSPACE */}
          {examAttempts.length > 0 && (
            <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white border border-indigo-500/30 shadow-lg relative overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Gemini AI Studio • Khắc phục lỗ hổng
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                      {allWrongQuestions.length} câu làm sai
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    AI Sinh Đề Mới Từ Các Câu Làm Sai
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                    Mô hình AI của web sẽ quét lại những câu bạn đã chọn sai trong các đề đã nộp, sau đó tạo ra đề thi mới: 
                    <strong> làm lại trực diện</strong> hoặc <strong> biến tấu số liệu, đổi thứ tự, đổi ngữ cảnh thực tế & kiến thức liên quan</strong> để đảm bảo bạn nắm chắc bản chất, không học vẹt!
                  </p>
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2">
                  <span className="text-[11px] text-gray-400">Định hướng hiện tại</span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white font-mono font-bold text-xs">
                    {currentUser.track === 'CS' ? 'Khoa học Máy tính (CS)' : 'Tin học Ứng dụng (ICT)'}
                  </span>
                </div>
              </div>

              {/* Configuration Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {/* 1. Generation Mode Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    1. Chế độ sinh đề AI:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRemedialMode('variation')}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        remedialMode === 'variation'
                          ? 'bg-indigo-600/50 border-indigo-400 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs flex items-center gap-1">
                          <Wand2 className="w-3 h-3 text-amber-300" /> Biến tấu
                        </span>
                        {remedialMode === 'variation' && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-2 leading-tight">
                        Đổi số liệu IP, bảng SQL, đổi ngữ cảnh & kiến thức tương đương.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRemedialMode('retest')}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        remedialMode === 'retest'
                          ? 'bg-indigo-600/50 border-indigo-400 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-blue-300" /> Làm lại
                        </span>
                        {remedialMode === 'retest' && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-2 leading-tight">
                        Giữ nguyên câu hỏi cũ nhưng xáo trộn 4 đáp án A/B/C/D.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Source Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-400" />
                    2. Nguồn câu hỏi sai:
                  </label>
                  <select
                    value={remedialSource}
                    onChange={(e) => setRemedialSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/20 text-xs text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="all">
                      Tất cả bài thi đã nộp ({allWrongQuestions.length} câu làm sai)
                    </option>
                    {examAttempts.map((att) => {
                      const countForAtt = allWrongQuestions.filter((q) => q.examId === att.examId).length;
                      return (
                        <option key={att.id} value={att.examId}>
                          {att.examTitle} ({countForAtt} câu sai)
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[10.5px] text-gray-400">
                    Đang có <strong className="text-white font-mono">{activeWrongQuestions.length}</strong> câu sai trong nguồn đã chọn.
                  </p>
                </div>

                {/* 3. Question Count & Action */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      3. Số lượng câu ôn tập:
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[10, 15, 20].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRemedialCount(num)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            remedialCount === num
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-white/10 text-gray-300 hover:bg-white/15'
                          }`}
                        >
                          {num} câu
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setRemedialCount(Math.max(activeWrongQuestions.length, 5))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          remedialCount === Math.max(activeWrongQuestions.length, 5)
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-white/10 text-gray-300 hover:bg-white/15'
                        }`}
                      >
                        Tất cả ({activeWrongQuestions.length})
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateRemedialExam()}
                    disabled={isGeneratingRemedial || activeWrongQuestions.length === 0}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGeneratingRemedial ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Đang sinh đề AI...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>AI Tạo Đề & Vào Thi Ngay ➔</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status & Feedback message */}
              {generationFeedback && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-amber-200 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                  <span>{generationFeedback}</span>
                </div>
              )}
            </div>
          )}

          {examAttempts.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#252525] text-gray-400 mx-auto flex items-center justify-center">
                <History className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Bạn chưa nộp bài thi nào
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Hãy chuyển sang tab &quot;Ngân hàng đề thi&quot; và bắt đầu làm một đề thi thử THPTQG để lưu lại bài nộp và tích lũy điểm kinh nghiệm XP.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('exams')}
                  className="px-5 py-2.5 rounded-lg bg-[#2878C8] text-white text-xs sm:text-sm font-bold hover:bg-[#2068B0] transition-colors"
                >
                  Xem Ngân hàng đề thi ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                <span>DANH SÁCH BÀI THI ĐÃ NỘP</span>
                <span>NHẤN &quot;AI BIẾN TẤU&quot; ĐỂ ÔN LẠI CÁC CÂU BỊ MẤT ĐIỂM</span>
              </div>

              {examAttempts.map((attempt) => {
                const durationMin = Math.floor(attempt.durationSeconds / 60);
                const durationSec = attempt.durationSeconds % 60;
                const formattedDate = new Date(attempt.submittedAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                // Wrong questions for this single attempt
                const wrongInThisAttempt = allWrongQuestions.filter((q) => q.examId === attempt.examId).length;

                return (
                  <div
                    key={attempt.id}
                    className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/40 dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-[#444] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                          {attempt.examTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-[#2878C8]">
                          Định hướng {attempt.track || 'CS'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        {wrongInThisAttempt > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                            {wrongInThisAttempt} câu làm sai
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 flex-wrap">
                        <span>
                          Thời gian làm bài: <strong className="font-mono text-gray-900 dark:text-white">{durationMin}p {durationSec}s</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Phần I: <strong className="text-gray-900 dark:text-white">{attempt.correctPart1Count}/24 câu</strong> ({attempt.part1Score.toFixed(2)}đ)
                        </span>
                        <span>•</span>
                        <span>
                          Phần II: <strong className="text-gray-900 dark:text-white">{attempt.part2Score.toFixed(2)}đ</strong>
                        </span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                          +{attempt.xpEarned || 50} XP
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="text-right mr-1">
                        <span className="text-[11px] text-gray-500 block">Tổng điểm</span>
                        <span
                          className={`text-2xl font-black font-mono ${
                            attempt.totalScore >= 8.0
                              ? 'text-emerald-600'
                              : attempt.totalScore >= 6.5
                              ? 'text-[#2878C8]'
                              : attempt.totalScore >= 5.0
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}
                        >
                          {attempt.totalScore.toFixed(2)}
                          <span className="text-xs font-normal text-gray-500"> / 10đ</span>
                        </span>
                      </div>

                      {/* AI Remedial Trigger Button for this specific attempt */}
                      {wrongInThisAttempt > 0 && (
                        <button
                          type="button"
                          onClick={() => handleGenerateRemedialExam(attempt.examId)}
                          disabled={isGeneratingRemedial}
                          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                          title="Dùng AI biến tấu các câu bạn đã làm sai ở đề này thành đề luyện tập mới"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI Biến tấu</span>
                        </button>
                      )}

                      <button
                        onClick={() => onStartExam(attempt.examId, true)}
                        className="px-3.5 py-2 rounded-lg bg-gray-200 dark:bg-[#333] hover:bg-gray-300 dark:hover:bg-[#444] text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                        title="Làm lại nguyên vẹn đề thi này"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Thi lại
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal bình luận và thảo luận đề thi */}
      {commentModalExam && (
        <ExamCommentModal
          isOpen={Boolean(commentModalExam)}
          onClose={() => setCommentModalExam(null)}
          examId={commentModalExam.id}
          examTitle={commentModalExam.title}
          currentUser={currentUser}
          onCommentAdded={() => setCommentsVersion((v) => v + 1)}
        />
      )}
    </div>
  );
};
