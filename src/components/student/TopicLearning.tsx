import React, { useState, useEffect } from 'react';
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
  Award,
  List,
  ShieldCheck,
  Cpu,
  Network,
  Database,
  Globe,
  Binary
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

/**
 * Topic Visual Illustration Component
 * Renders tailored diagrams/visual charts for each topic
 */
const TopicIllustration: React.FC<{ topicId: SubjectTopicId }> = ({ topicId }) => {
  if (topicId === '12A') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <Cpu className="w-4 h-4" /> Sơ đồ minh hoạ: 5 Đặc trưng cốt lõi của Trí tuệ Nhân tạo (AI)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          {[
            { title: '1. Khả năng Học', sub: 'Trích rút tri thức từ dữ liệu lớn (Dịch tự động, OCR)', color: 'bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200' },
            { title: '2. Khả năng Suy luận', sub: 'Quy tắc logic NẾU-THÌ (Hệ chuyên gia MYCIN)', color: 'bg-indigo-100/90 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200' },
            { title: '3. Khả năng Nhận thức', sub: 'Cảm nhận qua sensor, LiDAR, camera (Xe tự lái)', color: 'bg-sky-100/90 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
            { title: '4. Hiểu Ngôn ngữ', sub: 'NLP đàm thoại tự nhiên (Siri, Google Assistant)', color: 'bg-cyan-100/90 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200' },
            { title: '5. Giải quyết Vấn đề', sub: 'Tối ưu hóa tình huống phức tạp (Xếp thời khóa biểu)', color: 'bg-violet-100/90 text-violet-900 border-violet-300 dark:bg-violet-950 dark:text-violet-200' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${item.color} shadow-xs flex flex-col justify-between`}>
              <div className="font-bold text-xs sm:text-sm">{item.title}</div>
              <div className="text-[11px] opacity-80 mt-1 leading-snug">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topicId === '12B') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <Network className="w-4 h-4" /> Mô hình cấu trúc mạng LAN kết nối Internet qua Router & Switch
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white/80 dark:bg-[#1A1A1A] rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-center font-medium">
          <div className="p-2.5 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
            Internet toàn cầu (WAN)
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 rotate-90 sm:rotate-0" />
          <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold shrink-0">
            Modem & Router (Định tuyến IP)
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 rotate-90 sm:rotate-0" />
          <div className="p-2.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold shrink-0">
            Switch (Chuyển mạch MAC)
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 rotate-90 sm:rotate-0" />
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333]">
              Máy trạm PC / Laptop (LAN)
            </div>
            <div className="p-2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Access Point (Wi-Fi WLAN)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '12D') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4" /> Nguyên tắc 5 KHÔNG ứng xử nhân văn & Tuân thủ Luật An ninh mạng
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs text-center font-medium">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
            <span className="font-bold block">1. KHÔNG tung tin giả</span>
            <span className="text-[11px] opacity-80">Chỉ chia sẻ tin từ nguồn kiểm chứng</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
            <span className="font-bold block">2. KHÔNG mạo danh</span>
            <span className="text-[11px] opacity-80">Cảnh giác bẫy lừa đảo Deepfake</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300">
            <span className="font-bold block">3. KHÔNG quấy rối</span>
            <span className="text-[11px] opacity-80">Chấm dứt bạo lực mạng, châm chọc</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="font-bold block">4. KHÔNG lộ dữ liệu</span>
            <span className="text-[11px] opacity-80">Bảo mật mật khẩu và CCCD</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="font-bold block">5. LAN TOẢ điều tốt</span>
            <span className="text-[11px] opacity-80">Ủng hộ thiện nguyện, việc tử tế</span>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '12F') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <Globe className="w-4 h-4" /> Mô hình hộp CSS Box Model (4 Lớp từ ngoài vào trong)
        </div>
        <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-center font-bold text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Margin (Khoảng cách lề ngoài ngăn cách các phần tử lân cận)
          <div className="p-3.5 my-2 rounded-lg bg-emerald-100/80 border border-emerald-400 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200">
            Border (Đường viền bao bọc phần tử)
            <div className="p-3 my-2 rounded-md bg-sky-100 border border-sky-300 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200">
              Padding (Vùng đệm bên trong đường viền)
              <div className="p-2.5 my-1.5 rounded bg-blue-600 text-white font-black text-sm shadow-xs">
                Content (Nội dung văn bản, hình ảnh)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '11F') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <Database className="w-4 h-4" /> Liên kết CSDL Quan hệ: Khoá chính (Primary Key) và Khoá ngoại (Foreign Key)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-blue-200 dark:border-[#333]">
            <div className="font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <span>BẢNG LỚP (Bảng Cha)</span>
            </div>
            <div className="font-mono text-[11.5px] p-2 bg-blue-50/50 dark:bg-blue-950/30 rounded border border-blue-100 dark:border-blue-900/30">
              <div>🔑 <strong className="text-blue-800 dark:text-blue-300">MaLop</strong> (Khoá chính)</div>
              <div className="text-gray-600 dark:text-gray-400">· TenLop, GiaoVienCN</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-indigo-200 dark:border-[#333]">
            <div className="font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
              <span>BẢNG HỌC SINH (Bảng Con)</span>
            </div>
            <div className="font-mono text-[11.5px] p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded border border-indigo-100 dark:border-indigo-900/30">
              <div>🔑 <strong>MaHS</strong> (Khoá chính)</div>
              <div>🔗 <strong className="text-indigo-800 dark:text-indigo-300">MaLop</strong> (Khoá ngoại tham chiếu)</div>
              <div className="text-gray-600 dark:text-gray-400">· HoTen, NgaySinh, Diem</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '11F_CS') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider font-mono">
          <Binary className="w-4 h-4" /> So sánh độ phức tạp thuật toán tìm kiếm và sắp xếp
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200">
            <span className="font-bold block text-sm">O(log n)</span>
            <span className="text-[11px]">Tìm kiếm nhị phân (Chia đôi mảng đã sắp xếp)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200">
            <span className="font-bold block text-sm">O(n)</span>
            <span className="text-[11px]">Tìm kiếm tuần tự (Duyệt lần lượt từ đầu)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200">
            <span className="font-bold block text-sm">O(n log n)</span>
            <span className="text-[11px]">Sắp xếp tối ưu (Merge Sort, Quick Sort)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200">
            <span className="font-bold block text-sm">O(n²)</span>
            <span className="text-[11px]">Sắp xếp nổi bọt, chèn, chọn</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const TopicLearning: React.FC<TopicLearningProps> = ({
  initialTopicId = '12D',
  completedTopics,
  onToggleCompleteTopic,
  onPracticeTopicQuiz,
  onOpenLeaderboard,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<SubjectTopicId>(initialTopicId);
  const [sidebarView, setSidebarView] = useState<'topics_list' | 'lesson_outline'>('lesson_outline');
  const [activeSectionId, setActiveSectionId] = useState<string>('muc-tieu');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '12' | '11' | '10'>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'ALL' | 'CS' | 'ICT'>('all');

  // Interactive Quiz state
  const [viewMode, setViewMode] = useState<'reading' | 'quiz'>('reading');
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const topicsList = Object.values(TOPIC_LESSONS);

  // Filter topics
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
    setSidebarView('lesson_outline');
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
      {/* 1. TOP HEADER BANNER (Bao gồm ô tìm kiếm và bộ lọc đưa về chỗ cũ) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA]">
                Chuẩn SGK & Sách Hướng Dẫn Ôn Thi Tốt Nghiệp THPT (Bộ GD&ĐT)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#202020] dark:text-white flex items-center gap-2 mt-1.5">
              <BookOpen className="w-5 h-5 text-[#2878C8]" />
              Học tập kiến thức Tin học THPT
            </h2>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
              Hệ thống hóa toàn bộ kiến thức theo chuẩn chương trình GDPT 2018 (Lớp 10, 11, 12)
            </p>
          </div>

          {/* Ô tìm kiếm đưa về chỗ cũ */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tra cứu bài học, khái niệm (SQL, TCP, AI...)"
              className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm focus:outline-none focus:border-[#2878C8]"
            />
          </div>
        </div>

        {/* Bộ lọc Segmented Controls đưa về chỗ cũ */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Lọc Khối */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-lg">
            <span className="text-xs text-gray-600 dark:text-gray-400 px-2.5 font-medium">Khối:</span>
            {(['all', '12', '11', '10'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                  gradeFilter === g
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
              </button>
            ))}
          </div>

          {/* Lọc Định hướng */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-lg">
            <span className="text-xs text-gray-600 dark:text-gray-400 px-2.5 font-medium">Định hướng:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'ALL', label: 'Chung (80%)' },
              { id: 'CS', label: 'Khoa học máy tính' },
              { id: 'ICT', label: 'Tin học ứng dụng' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTrackFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                  trackFilter === t.id
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: LEFT SIDEBAR & RIGHT DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Danh sách chủ đề & Bài học navigation */}
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3.5 space-y-3">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs sticky top-20">
            {/* Top switcher: Danh sách chủ đề vs Bài học */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded-xl mb-3">
              <button
                onClick={() => setSidebarView('topics_list')}
                className={`flex-1 py-1.5 text-center text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sidebarView === 'topics_list'
                    ? 'bg-white text-[#2878C8] shadow-xs dark:bg-[#333] dark:text-[#60A5FA]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Danh sách chủ đề
              </button>
              <button
                onClick={() => setSidebarView('lesson_outline')}
                className={`flex-1 py-1.5 text-center text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sidebarView === 'lesson_outline'
                    ? 'bg-white text-[#2878C8] shadow-xs dark:bg-[#333] dark:text-[#60A5FA]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Bài học
              </button>
            </div>

            {/* VIEW A: BÀI HỌC (Outline cấu trúc bài học hiện tại) */}
            {sidebarView === 'lesson_outline' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <div>
                    <span className="text-[11px] font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase font-mono">
                      {activeTopic.code} · LỚP {activeTopic.grade}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      {activeTopic.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSidebarView('topics_list')}
                    className="text-[11px] font-semibold text-gray-500 hover:text-[#2878C8] shrink-0"
                    title="Xem tất cả chủ đề"
                  >
                    Đổi bài
                  </button>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[520px] pr-1 pt-1">
                  {activeTopic.outline?.map((item) => {
                    const isActive = activeSectionId === item.id && viewMode === 'reading';
                    const isSubItem = item.level === 2;

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left transition-all rounded-lg ${
                          isSubItem ? 'pl-6 pr-3 py-1.5 text-xs text-gray-600 dark:text-gray-400' : 'px-3 py-2 text-xs sm:text-[13px] font-medium'
                        } ${
                          isActive
                            ? 'bg-blue-50 text-[#2878C8] font-bold dark:bg-blue-950/50 dark:text-[#60A5FA] ring-1 ring-[#2878C8]/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-[#2878C8]'
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW B: DANH SÁCH CHỦ ĐỀ (Bỏ danh sách chủ đề ra ngoài) */}
            {sidebarView === 'topics_list' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1 pb-1">
                  <span>TẤT CẢ CHỦ ĐỀ ({filteredTopics.length})</span>
                  <span>Trạng thái</span>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[520px] pr-1">
                  {filteredTopics.map((topic) => {
                    const isSelected = topic.id === selectedTopicId;
                    const completed = Boolean(completedTopics[topic.id]);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setSidebarView('lesson_outline'); // Click vào chuyển ngay sang "Bài học"
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-[#2878C8] ring-1 ring-[#2878C8]/20'
                            : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#333] hover:border-gray-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span className="font-bold text-[#2878C8]">{topic.code}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500">Lớp {topic.grade}</span>
                            {topic.track && topic.track !== 'ALL' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                {topic.track}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white truncate mt-0.5">
                            {topic.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {topic.summary}
                          </p>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
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
        </div>

        {/* RIGHT PANEL: NỘI DUNG BÀI HỌC HOẶC BÀI LUYỆN TRẮC NGHIỆM */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-8.5 space-y-6">
          {/* VIEW MODE 1: NỘI DUNG BÀI HỌC (Trình bày tách ra từng mục, màu xanh nhạt trùng màu web) */}
          {viewMode === 'reading' && (
            <div className="space-y-6">
              {/* Card tiêu đề bài học */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2C2C2C] pb-4">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA] font-bold">
                      {activeTopic.code}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Khối Lớp {activeTopic.grade}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{activeTopic.examWeight}</span>
                  </div>

                  {/* Toggle đã học xong */}
                  <button
                    onClick={() => onToggleCompleteTopic(activeTopic.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-[#22A06B] border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                        : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-[#22A06B]" /> Đã hoàn thành (+20 XP)
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" /> Đánh dấu đã học xong
                      </>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-3.5">
                  {activeTopic.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  {activeTopic.summary}
                </p>

                {/* Sơ đồ hình ảnh minh hoạ cho chủ đề */}
                <TopicIllustration topicId={activeTopic.id} />
              </div>

              {/* Mục tiêu bài học (Tách thành Card riêng) */}
              <section id="muc-tieu" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2878C8]">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Mục tiêu bài học
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 pt-1">
                  {activeTopic.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#2878C8] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mức độ kiến thức và kĩ năng cần đạt (Tách thành Card riêng) */}
              <section id="muc-do" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2878C8]">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Mức độ kiến thức và kĩ năng cần đạt
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                  {activeTopic.standards?.map((std, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/70 dark:bg-[#252525] space-y-1.5"
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

              {/* Hoạt động khởi động (Tách thành Card riêng) */}
              <section id="khoi-dong" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
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

              {/* Các phần lý thuyết chính (Mỗi mục tách thành Card độc lập rõ ràng) */}
              {activeTopic.mainSections?.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
                  <div className="border-b border-gray-100 dark:border-[#2C2C2C] pb-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                      <span className="text-[#2878C8] font-mono">{sec.number}</span>
                      <span>{sec.title.replace(/^[0-9]+\.\s*/, '')}</span>
                    </h3>
                  </div>

                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-3">
                    {sec.content}
                  </div>

                  {sec.table && (
                    <div className="overflow-x-auto my-3 border border-gray-200 dark:border-[#333] rounded-xl">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-blue-50/90 dark:bg-blue-950/50 text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#333]">
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
                    <pre className="p-4 rounded-xl bg-[#1E1E1E] text-sky-400 font-mono text-xs sm:text-sm overflow-x-auto border border-[#333] leading-relaxed">
                      <code>{sec.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Các tiểu mục a, b... */}
                  {sec.subSections?.map((sub) => (
                    <div
                      key={sub.id}
                      id={sub.id}
                      className="scroll-mt-24 p-4.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/60 dark:bg-[#222] space-y-2 mt-3"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                        <span className="text-[#2878C8] font-mono">{sub.letter}</span>
                        <span>{sub.title.replace(/^[a-z]\)\s*/, '')}</span>
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {sub.content}
                      </p>
                      {sub.codeSnippet && (
                        <pre className="p-3 rounded-lg bg-[#181818] text-sky-400 font-mono text-xs overflow-x-auto border border-[#333] mt-2">
                          <code>{sub.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </section>
              ))}

              {/* Ghi nhớ cốt lõi (Tách thành Card riêng) */}
              <section id="ghi-nho" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2878C8]">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Ghi nhớ
                  </h3>
                </div>
                <div className="p-4.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                  <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    {activeTopic.memoryNotes?.map((note, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed font-medium">
                        <Sparkles className="w-4 h-4 text-[#2878C8] shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Luyện tập (Tách thành Card riêng với nút làm bài trắc nghiệm chuẩn sách) */}
              <section id="luyen-tap" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2878C8]">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        Luyện tập
                      </h3>
                      <p className="text-xs text-gray-500">
                        {activeTopic.practiceQuestions?.length || 0} câu hỏi trắc nghiệm trích từ Sách Hướng dẫn ôn thi (Bộ GD&ĐT)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewMode('quiz')}
                    className="px-5 py-2.5 rounded-xl bg-[#2878C8] text-white hover:bg-[#1D7BF2] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
                  >
                    Luyện trắc nghiệm chủ đề này <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {activeTopic.practiceQuestions?.slice(0, 3).map((q) => (
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

              {/* Vận dụng (Tách thành Card riêng) */}
              <section id="van-dung" className="scroll-mt-24 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Vận dụng
                  </h3>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/70 dark:bg-[#252525] text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white mr-1.5">Tình huống thực tế:</span>
                  {activeTopic.application?.realLife}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                    <h4 className="text-sm font-bold text-[#2878C8] flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4" /> Kinh nghiệm làm bài
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 list-disc pl-4.5 leading-relaxed">
                      {activeTopic.application?.tips?.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" /> Bẫy đề thi hay nhầm lẫn
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 list-disc pl-4.5 leading-relaxed">
                      {activeTopic.application?.examTraps?.map((trap, i) => (
                        <li key={i}>{trap}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Chuyển chủ đề trước / sau */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  disabled={!prevTopicId}
                  onClick={() => prevTopicId && setSelectedTopicId(prevTopicId)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    prevTopicId
                      ? 'border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      : 'opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Bài trước
                </button>

                <button
                  disabled={!nextTopicId}
                  onClick={() => nextTopicId && setSelectedTopicId(nextTopicId)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    nextTopicId
                      ? 'border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      : 'opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                >
                  Bài sau <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: INTERACTIVE PRACTICE QUIZ (Tone màu xanh nhạt trùng web) */}
          {viewMode === 'quiz' && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
              {/* Quiz Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA]">
                      Đề Chuẩn Trích 100% Sách Ôn Thi Tốt Nghiệp (Bộ GD&ĐT)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#2878C8]" />
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

              {/* Score result banner */}
              {submittedQuiz && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#2878C8] text-white flex items-center justify-center font-black text-xl shadow-xs">
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

                  <span className="px-4 py-2 rounded-xl bg-[#2878C8] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs">
                    <Award className="w-4.5 h-4.5 text-amber-300" /> +20 XP Đạt Được
                  </span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {activeTopic.practiceQuestions?.map((q) => {
                  const selected = userAnswers[q.id];
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 sm:p-6 rounded-xl border transition-all ${
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

                          let optionStyle = 'border-gray-200 dark:border-[#333] hover:border-[#2878C8] text-gray-800 dark:text-gray-200';
                          if (submittedQuiz) {
                            if (isOptionCorrectAnswer) {
                              optionStyle = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                            } else if (isOptionSelected && !isCorrect) {
                              optionStyle = 'border-rose-400 bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200';
                            } else {
                              optionStyle = 'opacity-60 border-gray-200 dark:border-[#333]';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'border-[#2878C8] bg-blue-50 dark:bg-blue-950/40 text-[#2878C8] dark:text-[#60A5FA] font-bold ring-1 ring-[#2878C8]';
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

                      {/* Lời giải chi tiết từ sách */}
                      {submittedQuiz && (
                        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#2878C8]">
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

              {/* Nút nộp bài */}
              {!submittedQuiz && (
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Đã chọn {Object.keys(userAnswers).length} / {activeTopic.practiceQuestions?.length} câu hỏi
                  </span>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-all ${
                      Object.keys(userAnswers).length > 0
                        ? 'bg-[#2878C8] text-white hover:bg-[#1D7BF2]'
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
