import React, { useMemo, useState } from 'react';
import {
  Flame,
  Award,
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Trophy,
  Building2,
  Users,
  MessageSquare,
  Play,
  Share2,
  HelpCircle,
  ExternalLink,
  Newspaper,
  User as UserIcon,
  ThumbsUp,
} from 'lucide-react';
import { UserProfile, Assignment, ExamAttempt, ExamComment } from '../../types';
import { TOPIC_LESSONS } from '../../data/topicsData';
import { getSchoolRankings } from '../../data/schoolsData';
import { storageService } from '../../services/storageService';
import { ZaloCommunityCard } from '../common/ZaloCommunityCard';
import { ExamCommentModal } from './ExamCommentModal';

interface StudentDashboardProps {
  user: UserProfile;
  assignments: Assignment[];
  examAttempts: ExamAttempt[];
  onStartDailyChallenge: () => void;
  onContinueTopic: (topicId: string) => void;
  onTakeExam: (examId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenLeaderboard: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  assignments,
  examAttempts,
  onStartDailyChallenge,
  onContinueTopic,
  onTakeExam,
  onNavigateTab,
  onOpenLeaderboard,
}) => {
  // Comment modal state
  const [commentModalExam, setCommentModalExam] = useState<{ id: string; title: string } | null>(null);
  const [commentsVersion, setCommentsVersion] = useState(0);

  // Tab switch for News vs Blog (matching VNOI screenshot)
  const [newsTab, setNewsTab] = useState<'news' | 'blog'>('news');
  const [upvotes, setUpvotes] = useState(9);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  // Active comments from storage
  const allComments = useMemo(() => {
    return storageService.getComments();
  }, [commentsVersion]);

  // Current active assignment from teacher
  const pendingAssignment = assignments.find((a) => a.status === 'active');

  // Last active or unfinished content
  const lastAttempt = examAttempts[0];
  const continueTopic = TOPIC_LESSONS['12B']; // Default or ongoing topic

  // Top 5 members data (matching VNOI reference screenshot)
  const top5Students = [
    { rank: 1, username: 'fextivity', rating: 3236, hasFlame: false },
    { rank: 2, username: 'hollwo_pelw', rating: 2814, hasFlame: false },
    { rank: 3, username: 'Hollowed', rating: 2785, hasFlame: false },
    { rank: 4, username: 'marvinthang', rating: 2759, hasFlame: true },
    { rank: 5, username: 'BaoJiaoPisu', rating: 2745, hasFlame: false },
  ];

  // Top 5 contributors data (matching VNOI reference screenshot)
  const top5Contributors = [
    { rank: 1, username: 'dquynh_2811', contributions: 1478, hasFlame: false },
    { rank: 2, username: 'I_love_Hoang_Yen', contributions: 673, hasFlame: false },
    { rank: 3, username: 'Mike4235', contributions: 582, hasFlame: false },
    { rank: 4, username: 'ntkwan', contributions: 546, hasFlame: true },
    { rank: 5, username: 'PhuocThien', contributions: 531, hasFlame: false },
  ];

  // Top 5 schools rankings for sidebar
  const schoolRankings = useMemo(() => {
    return getSchoolRankings(user.schoolName, user.xp);
  }, [user.schoolName, user.xp]);

  const top5Schools = useMemo(() => {
    return schoolRankings.slice(0, 5);
  }, [schoolRankings]);

  // Actionable simple suggestions based on rules
  const suggestions = [];
  if (!user.completedDailyToday) {
    suggestions.push({
      text: 'Hôm nay bạn chưa hoàn thành thử thách 10 câu trắc nghiệm.',
      actionText: 'Làm ngay',
      onClick: onStartDailyChallenge,
    });
  }
  if (pendingAssignment) {
    suggestions.push({
      text: `Bạn còn một bài tập "${pendingAssignment.title}" chưa hoàn thành.`,
      actionText: 'Vào làm bài',
      onClick: () => onTakeExam('de_so_1'),
    });
  }
  suggestions.push({
    text: 'Bạn nên ôn tập thêm chủ đề 12B (Kết nối mạng và giao thức TCP/IP) để củng cố điểm số phần trắc nghiệm đúng/sai.',
    actionText: 'Học bài',
    onClick: () => onContinueTopic('12B'),
  });

  // Calculate completion percentage towards target
  const targetXP = 1000;
  const progressPercent = Math.min(Math.round((user.xp / targetXP) * 100), 100);

  const handleToggleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((v) => v - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((v) => v + 1);
      setHasUpvoted(true);
    }
  };

  return (
    <div className="space-y-5">
      {/* KHU VỰC A — TỔNG QUAN CÁ NHÂN (Thiết kế tinh gọn, cỡ chữ chuẩn VNOI 13-14px) */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-[#202020] dark:text-white">
                Xin chào, {user.displayName}
              </h2>
              <span className="text-[11.5px] px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] dark:bg-blue-900/40 dark:text-blue-300 font-semibold font-mono">
                {user.schoolName}
              </span>
            </div>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-1">
              Chương trình GDPT 2018 · Định hướng{' '}
              <strong className="text-gray-800 dark:text-gray-200 font-semibold">
                {user.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
              </strong>
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-[#2C2C2C]">
            <div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 block font-medium">Mục tiêu điểm</span>
              <span className="text-base sm:text-lg font-bold text-[#2878C8] font-mono tabular-nums">
                {user.targetScore.toFixed(1)} / 10
              </span>
            </div>

            <div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 block font-medium">Điểm XP</span>
              <span className="text-base sm:text-lg font-bold text-[#FFC928] font-mono tabular-nums flex items-center gap-1">
                <Award className="w-4 h-4 text-[#FFC928]" />
                {user.xp}
              </span>
            </div>

            <div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 block font-medium">Chuỗi streak</span>
              <span className="text-base sm:text-lg font-bold text-amber-500 font-mono tabular-nums flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                {user.streakDays} ngày
              </span>
            </div>

            <div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 block font-medium">Tiến độ mục tiêu</span>
              <span className="text-base sm:text-lg font-bold text-[#22A06B] font-mono tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
          <div className="flex items-center justify-between text-[12.5px] text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Tiến độ chinh phục mục tiêu thi tốt nghiệp</span>
            <span className="font-mono tabular-nums font-semibold">{user.xp} / {targetXP} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-[#2C2C2C] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2878C8] to-[#22A06B] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2-COLUMN MAIN WORKSPACE (Layout chuẩn VNOI: Bên trái bài viết & bài tập, Bên phải Sidebar Rank + Thảo luận) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* CỘT TRÁI (8 CỘT): KHÔNG GIAN BÀI VIẾT VNOI & HỌC TẬP TRỌNG TÂM */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* VNOI STYLE ARTICLE CARD: Top Tabs [Tin tức] [Blog] + Upvote + Headline + Formatted Content */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 sm:p-6 shadow-xs">
            {/* 1. VNOI Top Tabs: [Tin tức] [Blog] */}
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#333] pb-3 mb-4">
              <button
                onClick={() => setNewsTab('news')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-semibold transition-colors border ${
                  newsTab === 'news'
                    ? 'bg-white dark:bg-[#252525] border-gray-300 dark:border-[#444] text-[#212529] dark:text-white shadow-2xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 text-[#2878C8]" />
                <span>Tin tức</span>
              </button>

              <button
                onClick={() => setNewsTab('blog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-semibold transition-colors border ${
                  newsTab === 'blog'
                    ? 'bg-white dark:bg-[#252525] border-gray-300 dark:border-[#444] text-[#212529] dark:text-white shadow-2xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>Blog</span>
              </button>
            </div>

            {newsTab === 'news' ? (
              <div>
                {/* 2. Headline & Upvote Section (Exact VNOI Layout from Screenshot) */}
                <div className="flex items-start gap-3.5">
                  {/* Upvote Counter */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <button
                      onClick={handleToggleUpvote}
                      className={`flex flex-col items-center justify-center w-8 h-10 rounded hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors ${
                        hasUpvoted ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'
                      }`}
                      title="Bình chọn bài viết này"
                    >
                      <span className="text-[15px] leading-none select-none">▲</span>
                      <span className="text-[12.5px] font-bold font-mono mt-0.5 select-none">{upvotes}</span>
                    </button>
                  </div>

                  {/* Main Title & Meta */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-[18px] sm:text-[21px] font-bold text-[#1a56db] dark:text-[#60a5fa] leading-snug uppercase tracking-tight">
                      GIA HẠN ĐĂNG KÝ BẢNG MỞ RỘNG VÒNG CHUNG KẾT VNOI CUP 2026
                    </h1>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                      <span className="text-amber-500">★</span>
                      <span className="text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer">
                        dvtd
                      </span>
                      <span>đã đăng 12:44:55 ch, 09/07/2026</span>
                    </div>
                  </div>
                </div>

                {/* 3. Post Body (Exact match with bullet emojis from VNOI screenshot) */}
                <div className="mt-4 space-y-2.5 text-[13.5px] text-gray-700 dark:text-gray-300 leading-relaxed font-normal pl-0 sm:pl-11">
                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🌟</span>
                    <span>
                      Sau khi mở đăng ký Bảng Mở rộng Vòng Chung kết VNOI CUP 2026, Ban Tổ chức đã nhận được sự quan tâm từ đông đảo các bạn học sinh, sinh viên và những người yêu thích Lập trình Thi đấu trên cả nước. Để tạo thêm cơ hội cho các bạn chưa kịp đăng ký, Ban Tổ chức quyết định gia hạn thời gian đăng ký tham gia Bảng Mở rộng.
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🚀</span>
                    <span>
                      Bảng Mở rộng sẽ diễn ra đồng thời với Vòng Chung kết chính thức của VNOI CUP 2026. Đây là cơ hội để các thí sinh trực tiếp trải nghiệm không khí của ngày hội thuật toán lớn nhất trong năm, thử sức với bộ đề chất lượng cao và giao lưu cùng cộng đồng Lập trình Thi đấu trên toàn quốc.
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">📅</span>
                    <span>
                      <strong className="text-gray-900 dark:text-white">Thời gian thi:</strong> 9h00 - 14h00, Thứ Sáu, ngày 24/07/2026
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">📍</span>
                    <span>
                      <strong className="text-gray-900 dark:text-white">Địa điểm thi:</strong> Trường THPT chuyên Trần Phú, 10A Lê Hồng Phong, Phường Hải An, Hải Phòng
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🚌</span>
                    <span>
                      Nhằm hỗ trợ các thí sinh ở xa, Ban Tổ chức sẽ bố trí xe đưa đón miễn phí từ Hà Nội đến Hải Phòng và ngược lại trong ngày thi. Thông tin chi tiết về thời gian và địa điểm tập trung sẽ được gửi tới các thí sinh sau khi hoàn tất đăng ký.
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">⌛</span>
                    <span>
                      <strong className="text-gray-900 dark:text-white">Hạn chót đăng ký mới:</strong> 23h59 ngày 12/07/2026
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🔗</span>
                    <span>
                      <strong className="text-gray-900 dark:text-white">Đường link đăng ký tại:</strong>{' '}
                      <a
                        href="https://s.vnoi.info/dang-ky-open-VNOI-CUP-2026"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        https://s.vnoi.info/dang-ky-open-VNOI-CUP-2026
                      </a>
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🎁</span>
                    <span>
                      Bên cạnh cơ hội được trải nghiệm một kỳ thi chất lượng và gặp gỡ những người cùng đam mê, các thí sinh đạt thành tích xuất sắc tại Bảng Mở rộng cũng sẽ nhận được những phần quà hấp dẫn từ Ban Tổ chức.
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <span className="shrink-0 text-base">🔥</span>
                    <span>
                      Nếu bạn muốn thử sức với những bài toán thú vị, cảm nhận bầu không khí của một vòng chung kết quốc gia và trở thành một phần của VNOI CUP 2026, đừng bỏ lỡ cơ hội này. Hẹn gặp các bạn tại Hải Phòng!
                    </span>
                  </p>

                  {/* Graphic banner section matching screenshot visual */}
                  <div className="mt-4 pt-2">
                    <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden relative bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-900 flex items-center justify-center text-white border border-teal-600/40 shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                      <div className="relative text-center px-4">
                        <div className="text-[12px] uppercase tracking-widest text-emerald-300 font-semibold mb-1">
                          Vòng Chung Kết Quốc Gia
                        </div>
                        <div className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                          VNOI CUP 2026 · BẢNG MỞ RỘNG
                        </div>
                        <div className="text-[12px] text-teal-100 mt-1">
                          Tranh tài thuật toán · Tôn vinh tài năng Tin học Việt Nam
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick action bar */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onTakeExam('de_so_1')}
                        className="px-3.5 py-1.5 rounded bg-[#2878C8] hover:bg-[#2068B0] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Làm bài thi thử mẫu
                      </button>

                      <button
                        onClick={() =>
                          setCommentModalExam({
                            id: 'de_so_1',
                            title: 'VNOI CUP 2026 - Thảo luận chung',
                          })
                        }
                        className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Bình luận ({storageService.getComments('de_so_1').length})</span>
                      </button>
                    </div>

                    <span className="text-[12px] text-gray-500 italic">
                      Cập nhật bởi Ban tổ chức VNOI & Hội đồng GDPT TinPath
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* BLOG TAB CONTENT */
              <div className="py-6 text-center space-y-3">
                <p className="text-[13.5px] text-gray-600 dark:text-gray-400">
                  Chuyên mục Blog chia sẻ kinh nghiệm học tập, chiến thuật làm bài trắc nghiệm GDPT 2018 và giải mã thuật toán của học sinh & giáo viên.
                </p>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="px-4 py-2 rounded bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0] transition-colors"
                >
                  Xem các bài học chuyên đề
                </button>
              </div>
            )}
          </section>

          {/* KHỐI 2: TIẾP TỤC HỌC TẬP & LUYỆN ĐỀ (TinPath Core Module) */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2878C8]" />
                <h3 className="text-[14px] font-bold text-[#202020] dark:text-white uppercase tracking-wider">
                  Tiến độ học tập & Luyện đề THPT
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('learning')}
                className="text-[12.5px] text-[#2878C8] hover:underline flex items-center gap-0.5 font-semibold"
              >
                Tất cả chủ đề <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chủ đề đang học */}
            <div className="p-3.5 sm:p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono text-[#2878C8] font-bold">
                  {continueTopic.code} · Lớp {continueTopic.grade}
                </span>
                <span className="text-[11.5px] text-gray-500 dark:text-gray-400 font-medium">
                  {continueTopic.examWeight}
                </span>
              </div>
              <h4 className="font-bold text-[15px] text-gray-900 dark:text-white mt-1">
                {continueTopic.title}
              </h4>
              <p className="text-[13px] text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                {continueTopic.summary}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-blue-100 dark:border-blue-900/30">
                <span className="text-[12px] text-gray-600 dark:text-gray-300">
                  Trạng thái: <strong className="text-gray-900 dark:text-white">Đang ôn tập</strong>
                </span>
                <button
                  onClick={() => onContinueTopic('12B')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2878C8] text-white text-[12.5px] font-bold hover:bg-[#2068B0] transition-colors shadow-2xs"
                >
                  Học tiếp chủ đề này <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dải 2 tác vụ: Thử thách 10 câu & Bài tập giáo viên */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Thử thách 10 câu */}
              <div
                className={`p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-2.5 ${
                  user.completedDailyToday
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#333]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {user.completedDailyToday ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-gray-900 dark:text-white">
                      Thử thách 10 câu hằng ngày
                    </h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Rèn phản xạ, giữ streak (+30–80 XP)
                    </p>
                  </div>
                </div>

                {!user.completedDailyToday ? (
                  <button
                    onClick={onStartDailyChallenge}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#2878C8] text-white text-[12px] font-semibold hover:bg-[#2068B0] transition-colors"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  <span className="shrink-0 text-[12px] text-[#22A06B] font-semibold flex items-center gap-1 font-mono">
                    Đã xong
                  </span>
                )}
              </div>

              {/* Bài kiểm tra / bài tập giáo viên */}
              {pendingAssignment ? (
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      <Circle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-[13.5px] font-bold text-gray-900 dark:text-white truncate flex-1 min-w-0">
                          {pendingAssignment.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-medium">
                          Hạn: {pendingAssignment.dueDate}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Bài tập giáo viên ({pendingAssignment.questionCount} câu)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onTakeExam('de_so_1')}
                    className="shrink-0 px-2.5 py-1 rounded bg-gray-800 text-white dark:bg-gray-700 text-[12px] font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Làm bài
                  </button>
                </div>
              ) : lastAttempt ? (
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[11px] text-gray-500 block">Lần thi gần nhất:</span>
                    <span className="font-bold text-gray-900 dark:text-white text-[13px] truncate block mt-0.5">
                      {lastAttempt.examTitle}
                    </span>
                    <span className="text-[12px] text-[#2878C8] font-mono font-bold">
                      Điểm: {lastAttempt.totalScore.toFixed(2)}đ
                    </span>
                  </div>
                  <button
                    onClick={() => onTakeExam(lastAttempt.examId)}
                    className="px-2.5 py-1 text-[12px] border border-gray-300 dark:border-[#444] rounded hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors shrink-0 font-medium"
                  >
                    Luyện lại
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg border border-dashed border-gray-200 dark:border-[#333] text-center text-[12px] text-gray-400 flex items-center justify-center">
                  Chưa có bài tập giáo viên mới
                </div>
              )}
            </div>
          </section>

          {/* KHỐI 3: GỢI Ý HỌC TẬP MANG TÍNH HÀNH ĐỘNG */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs">
            <h3 className="text-[13.5px] font-bold text-[#202020] dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-[#FFC928]" />
              Gợi ý học tập mang tính hành động
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex flex-col justify-between"
                >
                  <p className="text-[12.5px] text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                  <div className="mt-2.5 pt-2 border-t border-gray-200/50 dark:border-[#333] flex justify-end">
                    <button
                      onClick={item.onClick}
                      className="text-[12px] text-[#2878C8] hover:text-[#2068B0] font-bold flex items-center gap-1"
                    >
                      {item.actionText} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI (4 CỘT): SIDEBAR VNOI STYLE (Top thành viên, Top đóng góp, Dòng bình luận) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. TOP THÀNH VIÊN (Chuẩn bảng VNOI trong ảnh tham khảo) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            {/* Header Dark VNOI Style */}
            <div className="bg-[#212529] text-white px-3.5 py-2 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide">Top thành viên</span>
              <Trophy className="w-4 h-4 text-[#FFC928]" />
            </div>

            {/* Table */}
            <div className="p-0">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-[#2a2e33] text-gray-200 text-[11.5px] font-semibold border-b border-[#3a3f45]">
                  <tr>
                    <th className="py-1.5 px-3 w-8 text-center">#</th>
                    <th className="py-1.5 px-3">Tên truy cập</th>
                    <th className="py-1.5 px-3 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {top5Students.map((st) => (
                    <tr
                      key={st.rank}
                      className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-2 px-3 text-center font-mono text-gray-500 dark:text-gray-400 font-medium">
                        {st.rank}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1">
                          {st.hasFlame && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          {st.username}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-red-600 dark:text-red-400 tabular-nums">
                        {st.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer action links matching VNOI screenshot */}
              <div className="px-3.5 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between text-[11.5px] font-semibold">
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Tổ chức
                </button>
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem đầy đủ &gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 2. TOP ĐÓNG GÓP (Chuẩn bảng VNOI trong ảnh tham khảo) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#212529] text-white px-3.5 py-2 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide">Top đóng góp</span>
              <Trophy className="w-4 h-4 text-[#FFC928]" />
            </div>

            <div className="p-0">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-[#2a2e33] text-gray-200 text-[11.5px] font-semibold border-b border-[#3a3f45]">
                  <tr>
                    <th className="py-1.5 px-3 w-8 text-center">#</th>
                    <th className="py-1.5 px-3">Tên truy cập</th>
                    <th className="py-1.5 px-3 text-right">Đóng góp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {top5Contributors.map((ct) => (
                    <tr
                      key={ct.rank}
                      className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-2 px-3 text-center font-mono text-gray-500 dark:text-gray-400 font-medium">
                        {ct.rank}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-[#202020] dark:text-gray-200 hover:underline cursor-pointer flex items-center gap-1">
                          {ct.hasFlame && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          {ct.username}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                        {ct.contributions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-3.5 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-center text-[11.5px] font-semibold">
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem đầy đủ &gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 3. DÒNG BÌNH LUẬN (Với badge Discord matching screenshot) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#212529] text-white px-3.5 py-2 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide">Dòng bình luận</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#5865F2] text-white text-[10.5px] font-sans font-normal">
                <span>Discord</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono">861 online</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-[#2A2A2A] max-h-72 overflow-y-auto">
              <div
                onClick={() =>
                  setCommentModalExam({
                    id: 'de_so_1',
                    title: 'Educational Backtracking: Xâu đầy đủ',
                  })
                }
                className="p-2.5 hover:bg-blue-50/50 dark:hover:bg-[#252525] transition-colors cursor-pointer group"
              >
                <p className="text-[12.5px] leading-snug">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    vancongloc1234
                  </span>{' '}
                  <span className="text-gray-500">→</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
                    Hướng giải cho Educational Backtracking: Xâu đầy đủ
                  </span>
                </p>
              </div>

              <div
                onClick={() =>
                  setCommentModalExam({
                    id: 'de_so_2',
                    title: 'ICPC 2026 miền Bắc - N: Subspace Manifold Equilibrium',
                  })
                }
                className="p-2.5 hover:bg-blue-50/50 dark:hover:bg-[#252525] transition-colors cursor-pointer group"
              >
                <p className="text-[12.5px] leading-snug">
                  <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                    vudinhlong
                  </span>{' '}
                  <span className="text-gray-500">→</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
                    ICPC 2026 miền Bắc - N: Subspace Manifold Equilibrium
                  </span>
                </p>
              </div>

              {allComments.slice(0, 3).map((cm) => (
                <div
                  key={cm.id}
                  onClick={() =>
                    setCommentModalExam({
                      id: cm.examId,
                      title: cm.examTitle,
                    })
                  }
                  className="p-2.5 hover:bg-blue-50/50 dark:hover:bg-[#252525] transition-colors cursor-pointer group"
                >
                  <p className="text-[12.5px] leading-snug">
                    <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      {cm.userName}
                    </span>{' '}
                    <span className="text-gray-500">→</span>{' '}
                    <span className="text-gray-700 dark:text-gray-300 group-hover:underline font-medium">
                      {cm.examTitle}
                    </span>
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    "{cm.content}"
                  </p>
                </div>
              ))}
            </div>

            <div className="px-3.5 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between text-[11.5px] font-semibold">
              <span className="text-gray-400 font-normal">Cập nhật trực tiếp</span>
              <button
                onClick={() =>
                  setCommentModalExam({
                    id: 'de_so_1',
                    title: 'Đề số 1: Đề chuẩn Bộ GD&ĐT 2025',
                  })
                }
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                + Viết bình luận
              </button>
            </div>
          </div>

          {/* 4. BẢNG NHỎ CHỨA MÃ QR NHÓM ZALO THẢO LUẬN */}
          <ZaloCommunityCard />
        </div>
      </div>

      {/* Modal bình luận đề thi */}
      {commentModalExam && (
        <ExamCommentModal
          isOpen={Boolean(commentModalExam)}
          onClose={() => setCommentModalExam(null)}
          examId={commentModalExam.id}
          examTitle={commentModalExam.title}
          currentUser={user}
          onCommentAdded={() => setCommentsVersion((v) => v + 1)}
        />
      )}
    </div>
  );
};
