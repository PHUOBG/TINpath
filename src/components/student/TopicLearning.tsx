import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle,
  Circle,
  Code,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Share2,
  FileText,
  CheckCircle2,
  Layers,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Edit3,
  Trophy,
  HelpCircle,
  Sparkles,
  Bookmark,
  Target,
  BarChart2,
  Compass,
  RotateCcw,
  Award
} from 'lucide-react';
import { SubjectTopicId } from '../../types';
import { TOPIC_LESSONS, TopicLesson, PracticeQuizQuestion } from '../../data/topicsData';

interface TopicLearningProps {
  initialTopicId?: SubjectTopicId;
  completedTopics: Record<SubjectTopicId, boolean>;
  onToggleCompleteTopic: (topicId: SubjectTopicId) => void;
  onPracticeTopicQuiz: (topicId: SubjectTopicId) => void;
  onOpenLeaderboard?: () => void;
}

export const TopicLearning: React.FC<TopicLearningProps> = ({
  initialTopicId = '12D',
  completedTopics,
  onToggleCompleteTopic,
  onPracticeTopicQuiz,
  onOpenLeaderboard,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<SubjectTopicId>(initialTopicId);
  const [sidebarTab, setSidebarTab] = useState<'in_lesson' | 'course'>('in_lesson');
  const [activeSectionId, setActiveSectionId] = useState<string>('muc-tieu');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '12' | '11' | '10'>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'ALL' | 'CS' | 'ICT'>('all');

  // Interactive Quiz state within the topic
  const [viewMode, setViewMode] = useState<'reading' | 'quiz'>('reading');
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const topicsList = Object.values(TOPIC_LESSONS);

  // Filter topics for the 'Khóa học' tab
  const filteredTopics = topicsList.filter((topic) => {
    const matchSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'all' || topic.grade === gradeFilter;
    const matchTrack = trackFilter === 'all' || topic.track === trackFilter || topic.track === 'ALL';
    return matchSearch && matchGrade && matchTrack;
  });

  const activeTopic: TopicLesson = TOPIC_LESSONS[selectedTopicId] || TOPIC_LESSONS['12D'] || TOPIC_LESSONS['12A'];
  const isCompleted = Boolean(completedTopics[selectedTopicId]);

  // Topic order helpers
  const allTopicKeys = Object.keys(TOPIC_LESSONS) as SubjectTopicId[];
  const currentIndex = allTopicKeys.indexOf(selectedTopicId);
  const prevTopicId = currentIndex > 0 ? allTopicKeys[currentIndex - 1] : null;
  const nextTopicId = currentIndex < allTopicKeys.length - 1 ? allTopicKeys[currentIndex + 1] : null;

  // Reset quiz when topic changes
  useEffect(() => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
    setViewMode('reading');
    setActiveSectionId('muc-tieu');
  }, [selectedTopicId]);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    if (viewMode === 'quiz') {
      setViewMode('reading');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll spy to update active outline item
  useEffect(() => {
    if (viewMode !== 'reading') return;

    const handleScroll = () => {
      const outline = activeTopic.outline || [];
      const scrollPosition = window.scrollY + 200;

      for (let i = outline.length - 1; i >= 0; i--) {
        const item = outline[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTopic, viewMode]);

  // Quiz submission handler
  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    const questions = activeTopic.practiceQuestions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setSubmittedQuiz(true);

    // Auto mark as completed if >= 70% correct
    if (correctCount / questions.length >= 0.7 && !isCompleted) {
      onToggleCompleteTopic(activeTopic.id);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F2F1] text-[#00695C] dark:bg-[#004D40] dark:text-[#80CBC4]">
                Chuẩn SGK & Sách Hướng Dẫn Ôn Thi Tốt Nghiệp THPT (Bộ GD&ĐT)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#202020] dark:text-white flex items-center gap-2.5 mt-1.5">
              <BookOpen className="w-6 h-6 text-[#00897B]" />
              Hệ Thống Bài Học & Luyện Đề Chuẩn Bộ GD&ĐT
            </h2>
            <p className="text-[13px] sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Nội dung trích xuất chi tiết 80-90% từ Sách Hướng dẫn ôn thi tốt nghiệp môn Tin học và bộ SGK Kết Nối Tri Thức.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onToggleCompleteTopic(activeTopic.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-50 text-[#00897B] border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00897B]" /> Đã hoàn thành (+20 XP)
                </>
              ) : (
                <>
                  <Circle className="w-4.5 h-4.5" /> Đánh dấu đã học xong
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Navigation Panel Styled Exactly like User's Image */}
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3.5 space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-4 shadow-sm sticky top-20 flex flex-col justify-between min-h-[620px]">
            {/* Top Navigation Tabs */}
            <div>
              <div className="bg-[#E6F4F1] dark:bg-[#17302c] p-1.5 rounded-2xl flex items-center mb-4">
                <button
                  onClick={() => setSidebarTab('in_lesson')}
                  className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all ${
                    sidebarTab === 'in_lesson'
                      ? 'bg-white text-[#00695C] shadow-sm dark:bg-[#22443e] dark:text-[#80CBC4]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Trong bài này
                </button>
                <button
                  onClick={() => setSidebarTab('course')}
                  className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all ${
                    sidebarTab === 'course'
                      ? 'bg-white text-[#00695C] shadow-sm dark:bg-[#22443e] dark:text-[#80CBC4]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Khóa học
                </button>
              </div>

              {/* TAB 1: TRONG BÀI NÀY (Lesson Outline Subsections) */}
              {sidebarTab === 'in_lesson' && (
                <div className="space-y-1 overflow-y-auto max-h-[460px] pr-1">
                  <div className="px-2 py-1 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                      {activeTopic.code} · LỚP {activeTopic.grade}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {activeTopic.title}
                    </h3>
                  </div>

                  {activeTopic.outline?.map((item) => {
                    const isActive = activeSectionId === item.id && viewMode === 'reading';
                    const isSubItem = item.level === 2;

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left text-[13.5px] transition-all rounded-lg ${
                          isSubItem ? 'pl-6 pr-3 py-1.5 text-xs sm:text-[13px]' : 'px-3 py-2 font-medium'
                        } ${
                          isActive
                            ? 'bg-[#E0F2F1] text-[#00796B] font-bold dark:bg-[#004D40]/50 dark:text-[#80CBC4] ring-1 ring-[#00897B]/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-[#00897B]'
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: KHÓA HỌC (Topics Catalog List) */}
              {sidebarTab === 'course' && (
                <div className="space-y-3">
                  {/* Search bar */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm chủ đề, khái niệm..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs sm:text-sm focus:outline-none focus:border-[#00897B]"
                    />
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {(['all', '12', '11', '10'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGradeFilter(g)}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                          gradeFilter === g
                            ? 'bg-[#00897B] text-white'
                            : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
                      </button>
                    ))}
                  </div>

                  {/* Topic items */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
                    {filteredTopics.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      const completed = Boolean(completedTopics[topic.id]);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setSidebarTab('in_lesson');
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#E0F2F1] dark:bg-[#004D40]/30 border-[#00897B] ring-1 ring-[#00897B]/20'
                              : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#333] hover:border-gray-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              <span className="font-bold text-[#00897B]">{topic.code}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500">Lớp {topic.grade}</span>
                            </div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white truncate mt-0.5">
                              {topic.title}
                            </h4>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00897B]" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons (Exactly matching the user screenshot) */}
            <div className="pt-4 border-t border-gray-100 dark:border-[#2A2A2A] grid grid-cols-4 gap-1.5 mt-4">
              {/* Button 1: Bài trước */}
              <button
                disabled={!prevTopicId}
                onClick={() => prevTopicId && setSelectedTopicId(prevTopicId)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  prevTopicId
                    ? 'bg-gray-100 dark:bg-[#252525] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]'
                    : 'bg-gray-50 dark:bg-[#1A1A1A] text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title="Quay lại bài học trước"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-semibold mt-0.5">Bài trước</span>
              </button>

              {/* Button 2: Làm bài (Highlighted in Teal/Green as in screenshot) */}
              <button
                onClick={() => setViewMode(viewMode === 'quiz' ? 'reading' : 'quiz')}
                className="py-2 px-1 rounded-xl bg-[#00897B] text-white hover:bg-[#00796B] shadow-sm flex flex-col items-center justify-center transition-all group"
                title="Luyện trắc nghiệm chủ đề này (Trích từ sách)"
              >
                <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold mt-0.5">Làm bài</span>
              </button>

              {/* Button 3: Xếp hạng */}
              <button
                onClick={() => {
                  if (onOpenLeaderboard) {
                    onOpenLeaderboard();
                  } else {
                    alert('Bảng xếp hạng chủ đề: Bạn đang xếp thứ 1 trong lớp!');
                  }
                }}
                className="py-2 px-1 rounded-xl bg-gray-100 dark:bg-[#252525] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333] flex flex-col items-center justify-center transition-all"
                title="Bảng xếp hạng thành tích học sinh"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-semibold mt-0.5">Xếp hạng</span>
              </button>

              {/* Button 4: Bài sau */}
              <button
                disabled={!nextTopicId}
                onClick={() => nextTopicId && setSelectedTopicId(nextTopicId)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  nextTopicId
                    ? 'bg-gray-100 dark:bg-[#252525] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]'
                    : 'bg-gray-50 dark:bg-[#1A1A1A] text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title="Chuyển sang bài học tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="text-[11px] font-semibold mt-0.5">Bài sau</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Lesson Content or Practice Quiz Mode */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-8.5 space-y-6">
          {/* VIEW MODE 1: DETAILED READING LESSON (80-90% Textbook Content) */}
          {viewMode === 'reading' && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 sm:p-9 shadow-sm space-y-8">
              {/* Lesson Header */}
              <div className="border-b border-gray-200 dark:border-[#333] pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-[#E0F2F1] text-[#00796B] dark:bg-[#004D40] dark:text-[#80CBC4] font-bold">
                      {activeTopic.code}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Khối Lớp {activeTopic.grade}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{activeTopic.examWeight}</span>
                  </div>

                  <button
                    onClick={() => setViewMode('quiz')}
                    className="px-4 py-1.5 rounded-lg bg-[#00897B] text-white hover:bg-[#00796B] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Làm bài trắc nghiệm ngay
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3.5 tracking-tight">
                  {activeTopic.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2.5 leading-relaxed">
                  {activeTopic.summary}
                </p>
              </div>

              {/* 1. MỤC TIÊU BÀI HỌC (#muc-tieu) */}
              <section id="muc-tieu" className="scroll-mt-24 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E0F2F1] dark:bg-[#004D40]/50 flex items-center justify-center text-[#00897B]">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Mục tiêu bài học
                  </h3>
                </div>
                <div className="p-4.5 rounded-xl bg-gray-50/80 dark:bg-[#252525] border border-gray-200 dark:border-[#333]">
                  <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                    {activeTopic.objectives?.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#00897B] shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 2. MỨC ĐỘ KIẾN THỨC VÀ KĨ NĂNG CẦN ĐẠT (#muc-do) */}
              <section id="muc-do" className="scroll-mt-24 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Mức độ kiến thức và kĩ năng cần đạt (Chuẩn ma trận đề thi)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {activeTopic.standards?.map((std, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] space-y-1.5"
                    >
                      <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {std.level}
                      </span>
                      <p className="text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                        {std.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. HOẠT ĐỘNG KHỞI ĐỘNG (#khoi-dong) */}
              <section id="khoi-dong" className="scroll-mt-24 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Hoạt động khởi động
                  </h3>
                </div>
                <div className="p-4.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed italic">
                    "{activeTopic.warmUp?.context}"
                  </p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2 pt-1">
                    <HelpCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{activeTopic.warmUp?.question}</span>
                  </p>
                </div>
              </section>

              {/* 4. MAIN THEORETICAL SECTIONS (Detailed 80-90% Textbook Content) */}
              {activeTopic.mainSections?.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4 pt-2">
                  <div className="border-b border-gray-100 dark:border-[#2C2C2C] pb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                      <span className="text-[#00897B] font-mono">{sec.number}</span>
                      <span>{sec.title.replace(/^[0-9]+\.\s*/, '')}</span>
                    </h3>
                  </div>

                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-3">
                    {sec.content}
                  </div>

                  {sec.table && (
                    <div className="overflow-x-auto my-3 border border-gray-200 dark:border-[#333] rounded-xl">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#E0F2F1] dark:bg-[#004D40]/40 text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#333]">
                          <tr>
                            {sec.table.headers.map((h, idx) => (
                              <th key={idx} className="p-3 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2C2C2C]">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-[#252525]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 text-gray-700 dark:text-gray-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sec.codeSnippet && (
                    <pre className="p-4 rounded-xl bg-[#1E1E1E] text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto border border-[#333] leading-relaxed">
                      <code>{sec.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Subsections (a, b...) */}
                  {sec.subSections?.map((sub) => (
                    <div
                      key={sub.id}
                      id={sub.id}
                      className="scroll-mt-24 p-4.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/60 dark:bg-[#222] space-y-2.5 mt-3"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                        <span className="text-[#00897B] font-mono">{sub.letter}</span>
                        <span>{sub.title.replace(/^[a-z]\)\s*/, '')}</span>
                      </h4>
                      <p className="text-sm sm:text-[14.5px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {sub.content}
                      </p>
                      {sub.codeSnippet && (
                        <pre className="p-3.5 rounded-lg bg-[#181818] text-sky-400 font-mono text-xs overflow-x-auto border border-[#333] mt-2">
                          <code>{sub.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </section>
              ))}

              {/* 5. GHI NHỚ (#ghi-nho) */}
              <section id="ghi-nho" className="scroll-mt-24 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00897B]">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Ghi nhớ cốt lõi
                  </h3>
                </div>
                <div className="p-5 rounded-xl border border-[#00897B]/40 bg-[#E0F2F1]/40 dark:bg-[#004D40]/20 space-y-2.5">
                  <ul className="space-y-2 text-sm sm:text-[14.5px] text-gray-800 dark:text-gray-200">
                    {activeTopic.memoryNotes?.map((note, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed font-medium">
                        <Sparkles className="w-4 h-4 text-[#00897B] shrink-0 mt-1" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 6. LUYỆN TẬP (#luyen-tap) */}
              <section id="luyen-tap" className="scroll-mt-24 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E0F2F1] dark:bg-[#004D40]/50 flex items-center justify-center text-[#00897B]">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Luyện tập (Trích 100% từ Sách Hướng dẫn ôn thi)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Có sẵn {activeTopic.practiceQuestions?.length || 0} câu hỏi trắc nghiệm chuẩn kì thi tốt nghiệp THPT
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewMode('quiz')}
                    className="px-4 py-2 rounded-xl bg-[#00897B] text-white hover:bg-[#00796B] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                  >
                    Bắt đầu làm bài trắc nghiệm <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {activeTopic.practiceQuestions?.slice(0, 2).map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#222]"
                    >
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                        {Object.entries(q.options).map(([key, val]) => (
                          <div
                            key={key}
                            className="text-xs sm:text-sm p-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300"
                          >
                            <span className="font-bold mr-1.5">{key}.</span> {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. VẬN DỤNG (#van-dung) */}
              <section id="van-dung" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Vận dụng & Kinh nghiệm phòng tránh bẫy đề thi
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                    <h4 className="text-sm font-bold text-[#00897B] flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4.5 h-4.5" /> Kinh nghiệm làm bài thi
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 list-disc pl-4.5 leading-relaxed">
                      {activeTopic.application?.tips?.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4.5 h-4.5" /> Bẫy đề thi hay nhầm lẫn
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 list-disc pl-4.5 leading-relaxed">
                      {activeTopic.application?.examTraps?.map((trap, i) => (
                        <li key={i}>{trap}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white mr-1.5">Liên hệ thực tế:</span>
                  {activeTopic.application?.realLife}
                </div>
              </section>

              {/* Bottom Navigation between topics */}
              <div className="pt-6 border-t border-gray-200 dark:border-[#333] flex flex-wrap items-center justify-between gap-3">
                <button
                  disabled={!prevTopicId}
                  onClick={() => prevTopicId && setSelectedTopicId(prevTopicId)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    prevTopicId
                      ? 'border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      : 'opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Chủ đề trước
                </button>

                <button
                  onClick={() => setViewMode('quiz')}
                  className="px-6 py-2.5 rounded-xl bg-[#00897B] text-white text-sm font-bold hover:bg-[#00796B] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Luyện trắc nghiệm chủ đề này
                </button>

                <button
                  disabled={!nextTopicId}
                  onClick={() => nextTopicId && setSelectedTopicId(nextTopicId)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    nextTopicId
                      ? 'border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      : 'opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                >
                  Chủ đề tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: INTERACTIVE PRACTICE QUIZ (Trắc nghiệm chuẩn sách) */}
          {viewMode === 'quiz' && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 sm:p-9 shadow-sm space-y-6">
              {/* Quiz Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F2F1] text-[#00695C] dark:bg-[#004D40] dark:text-[#80CBC4]">
                      Đề Chuẩn Trích 100% Sách Ôn Thi Tốt Nghiệp (Bộ GD&ĐT)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#00897B]" />
                    Luyện trắc nghiệm: {activeTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setViewMode('reading')}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> Đọc lý thuyết bài học
                  </button>

                  {submittedQuiz && (
                    <button
                      onClick={handleResetQuiz}
                      className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" /> Làm lại đề này
                    </button>
                  )}
                </div>
              </div>

              {/* Score result banner if submitted */}
              {submittedQuiz && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#E0F2F1] to-emerald-100 dark:from-[#004D40]/40 dark:to-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#00897B] text-white flex items-center justify-center font-black text-xl shadow-sm">
                      {Math.round((quizScore / (activeTopic.practiceQuestions?.length || 1)) * 10)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">
                        Kết quả bài luyện: {quizScore} / {activeTopic.practiceQuestions?.length} câu đúng
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        {quizScore === activeTopic.practiceQuestions?.length
                          ? 'Xuất sắc! Bạn đã nắm vững 100% kiến thức của chủ đề này.'
                          : 'Rất tốt! Hãy đọc kĩ phần lời giải thích từ sách để khắc phục các câu chưa đúng.'}
                      </p>
                    </div>
                  </div>

                  <span className="px-4 py-2 rounded-xl bg-[#00897B] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm">
                    <Award className="w-4.5 h-4.5 text-amber-300" /> +20 XP Đạt Được
                  </span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {activeTopic.practiceQuestions?.map((q, idx) => {
                  const selected = userAnswers[q.id];
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        submittedQuiz
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                            : 'border-rose-300 bg-rose-50/30 dark:border-rose-800 dark:bg-rose-950/20'
                          : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                          {q.question}
                        </h3>

                        {submittedQuiz && (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
                            }`}
                          >
                            {isCorrect ? 'Đúng' : 'Chưa đúng'}
                          </span>
                        )}
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="grid grid-cols-1 gap-2.5 mt-4">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                          const optText = q.options[optKey];
                          const isOptionSelected = selected === optKey;
                          const isOptionCorrectAnswer = q.correctAnswer === optKey;

                          let optionStyle = 'border-gray-200 dark:border-[#333] hover:border-[#00897B] text-gray-800 dark:text-gray-200';
                          if (submittedQuiz) {
                            if (isOptionCorrectAnswer) {
                              optionStyle = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                            } else if (isOptionSelected && !isCorrect) {
                              optionStyle = 'border-rose-400 bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200';
                            } else {
                              optionStyle = 'opacity-60 border-gray-200 dark:border-[#333]';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'border-[#00897B] bg-[#E0F2F1] dark:bg-[#004D40]/40 text-[#00796B] dark:text-[#80CBC4] font-bold ring-1 ring-[#00897B]';
                          }

                          return (
                            <button
                              key={optKey}
                              disabled={submittedQuiz}
                              onClick={() => handleSelectOption(q.id, optKey)}
                              className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all ${optionStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-xs shrink-0">
                                  {optKey}
                                </span>
                                <span>{optText}</span>
                              </div>

                              {submittedQuiz && isOptionCorrectAnswer && (
                                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation from Book (Phần Ba. Đáp án và Hướng dẫn giải) */}
                      {submittedQuiz && (
                        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#00897B]">
                            <BookOpen className="w-4 h-4" /> Lời giải chi tiết từ Sách Ôn thi (Đáp án {q.correctAnswer}):
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!submittedQuiz && (
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Đã chọn {Object.keys(userAnswers).length} / {activeTopic.practiceQuestions?.length} câu hỏi
                  </span>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all ${
                      Object.keys(userAnswers).length > 0
                        ? 'bg-[#00897B] text-white hover:bg-[#00796B]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Nộp bài và chấm điểm ngay <CheckCircle2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicLearning;
