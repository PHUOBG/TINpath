import React, { useMemo, useState } from 'react';
import {
  Flame,
  Award,
  Bookmark,
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
  AlertCircle,
} from 'lucide-react';
import { UserProfile, Assignment, ExamAttempt, ExamComment } from '../../types';
import { TOPIC_LESSONS } from '../../data/topicsData';
import { getSchoolRankings } from '../../data/schoolsData';
import { storageService } from '../../services/storageService';
import { OFFICIAL_NEWS_ARTICLES } from '../../data/newsData';
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
  const [selectedNewsId, setSelectedNewsId] = useState<'all' | string>('all');
  const [newsUpvotes, setNewsUpvotes] = useState<{ [id: string]: { count: number; userVoted: boolean } }>({
    'pho-diem-tin-hoc-thpt-2026': { count: 0, userVoted: false },
    'cau-truc-de-thi-tin-hoc-thpt-2026': { count: 0, userVoted: false },
  });

  const handleToggleNewsUpvote = (articleId: string) => {
    setNewsUpvotes((prev) => {
      const current = prev[articleId] || { count: 0, userVoted: false };
      const nextVoted = !current.userVoted;
      return {
        ...prev,
        [articleId]: {
          count: nextVoted ? current.count + 1 : Math.max(0, current.count - 1),
          userVoted: nextVoted,
        },
      };
    });
  };

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

  const displayedNewsArticles = useMemo(() => {
    if (selectedNewsId === 'all') return OFFICIAL_NEWS_ARTICLES;
    return OFFICIAL_NEWS_ARTICLES.filter((a) => a.id === selectedNewsId);
  }, [selectedNewsId]);

  return (
    <div className="space-y-4">
      {/* KHU VỰC A — TỔNG QUAN CÁ NHÂN (Thiết kế tinh gọn, cỡ chữ chuẩn VNOI 13-14px) */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-lg sm:text-xl font-bold text-[#202020] dark:text-white hover:text-[#2878C8] dark:hover:text-[#38BDF8] transition-colors text-left flex items-center gap-1.5"
                title="Xem hồ sơ cá nhân"
              >
                Xin chào, {user.displayName}
              </button>
              <span className="text-[12px] px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
                {user.schoolName}
              </span>
            </div>
            <p className="text-[13.5px] text-gray-600 dark:text-gray-400 mt-1">
              Chương trình GDPT 2018 · Định hướng{' '}
              <strong className="text-gray-800 dark:text-gray-200 font-semibold">
                {user.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
              </strong>
            </p>
          </div>

          {/* Key Metrics Strip - Unified font strictly matching reference */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-2.5 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-[#2C2C2C]">
            <div>
              <span className="text-[13.5px] sm:text-sm text-gray-500 dark:text-gray-400 block font-medium">Mục tiêu điểm</span>
              <div className="text-xl font-bold text-[#1d4ed8] dark:text-[#3b82f6] tabular-nums mt-0.5">
                {user.targetScore.toFixed(1)} <span className="text-gray-400 dark:text-gray-500 font-normal text-sm">/ 10</span>
              </div>
            </div>

            <div>
              <span className="text-[13.5px] sm:text-sm text-gray-500 dark:text-gray-400 block font-medium">Điểm XP</span>
              <div className="text-xl font-bold text-amber-500 tabular-nums flex items-center gap-1.5 mt-0.5">
                <Bookmark className="w-[18px] h-[18px] text-amber-500" />
                <span>{user.xp}</span>
              </div>
            </div>

            <div>
              <span className="text-[13.5px] sm:text-sm text-gray-500 dark:text-gray-400 block font-medium">Chuỗi streak</span>
              <div className="text-xl font-bold text-amber-500 tabular-nums flex items-center gap-1.5 mt-0.5">
                <Flame className="w-[18px] h-[18px] text-amber-500 fill-amber-500" />
                <span>{user.streakDays}</span>
                <span className="text-sm font-normal text-gray-700 dark:text-gray-300 ml-0.5">ngày</span>
              </div>
            </div>

            <div>
              <span className="text-[13.5px] sm:text-sm text-gray-500 dark:text-gray-400 block font-medium">Tiến độ mục tiêu</span>
              <div className="text-xl font-bold text-[#059669] dark:text-[#10b981] tabular-nums mt-0.5">
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-[#2C2C2C]">
          <div className="flex items-center justify-between text-[13px] text-gray-600 dark:text-gray-400 mb-1 font-medium">
            <span>Tiến độ chinh phục mục tiêu thi tốt nghiệp</span>
            <span className="tabular-nums font-semibold text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white font-bold">{user.xp}</strong> / {targetXP} XP
            </span>
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
                {/* 1. Article Switcher / Pagination Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[#2C2C2C] pb-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedNewsId('all')}
                      className={`px-2.5 py-1 rounded text-[12px] font-semibold transition-colors ${
                        selectedNewsId === 'all'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] border border-transparent'
                      }`}
                    >
                      Tất cả bài viết ({OFFICIAL_NEWS_ARTICLES.length})
                    </button>
                    {OFFICIAL_NEWS_ARTICLES.map((art, idx) => (
                      <button
                        key={art.id}
                        onClick={() => setSelectedNewsId(art.id)}
                        className={`px-2.5 py-1 rounded text-[12px] font-semibold transition-colors ${
                          selectedNewsId === art.id
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] border border-transparent'
                        }`}
                      >
                        Bài {idx + 1}: {art.badge.split('·')[0].trim()}
                      </button>
                    ))}
                  </div>

                  <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                    {selectedNewsId === 'all' ? (
                      <span>Hiển thị cả 2 bài</span>
                    ) : (
                      <span>
                        Bài {OFFICIAL_NEWS_ARTICLES.findIndex((a) => a.id === selectedNewsId) + 1} / {OFFICIAL_NEWS_ARTICLES.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Official News Articles Display */}
                <div className="space-y-4">
                  {displayedNewsArticles.map((article, index) => {
                    const upvoteState = newsUpvotes[article.id] || { count: 0, userVoted: false };
                    return (
                      <article
                        key={article.id}
                        className={`${
                          index > 0 ? 'pt-4 border-t border-dashed border-gray-200 dark:border-[#333]' : ''
                        }`}
                      >
                        {/* Headline & Upvote Section */}
                        <div className="flex items-start gap-3.5">
                          {/* Upvote Counter */}
                          <div className="flex flex-col items-center shrink-0 pt-0.5">
                            <button
                              onClick={() => handleToggleNewsUpvote(article.id)}
                              className={`flex flex-col items-center justify-center w-8 h-10 rounded hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors ${
                                upvoteState.userVoted ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'
                              }`}
                              title="Bình chọn bài viết này"
                            >
                              <span className="text-[15px] leading-none select-none">▲</span>
                              <span className="text-[12px] font-bold mt-0.5 select-none">{upvoteState.count}</span>
                            </button>
                          </div>

                          {/* Title & Badges */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                {article.badge}
                              </span>
                              <span className="text-[11.5px] text-gray-500 dark:text-gray-400">
                                Danh mục: <strong className="font-semibold text-gray-700 dark:text-gray-300">{article.category}</strong>
                              </span>
                            </div>
                            <h2 className="text-[18px] sm:text-[21px] font-bold text-[#1a56db] dark:text-[#60a5fa] leading-snug tracking-tight">
                              {article.title}
                            </h2>
                          </div>
                        </div>

                        {/* Short Description */}
                        <div className="mt-2 pl-0 sm:pl-11">
                          <div className="p-2.5 sm:p-3 bg-blue-50/60 dark:bg-blue-950/20 border-l-4 border-[#2878C8] rounded-r-md text-[13px] text-gray-700 dark:text-gray-200 leading-snug font-normal">
                            <span className="font-semibold text-gray-900 dark:text-white">Mô tả ngắn: </span>
                            {article.shortDescription}
                          </div>

                          {/* Body Sections */}
                          <div className="mt-3 space-y-3 text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                            {article.sections.map((sec, sIdx) => (
                              <div key={sIdx} className="space-y-1.5">
                                <h3 className="text-[13.5px] font-bold text-gray-900 dark:text-white">
                                  {sec.heading}
                                </h3>

                                {sec.paragraphs &&
                                  sec.paragraphs.map((p, pIdx) => (
                                    <p key={pIdx} className="leading-relaxed">
                                      {p}
                                    </p>
                                  ))}

                                {sec.numberedSteps && (
                                  <div className="space-y-1.5 mt-1">
                                    {sec.numberedSteps.map((step, nIdx) => (
                                      <div
                                        key={nIdx}
                                        className="p-2.5 rounded-md bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333]"
                                      >
                                        <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">
                                          {step.title}
                                        </h4>
                                        <p className="text-[12.5px] text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">
                                          {step.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {sec.bullets && (
                                  <ul className="space-y-1.5 mt-1">
                                    {sec.bullets.map((b, bIdx) => (
                                      <li key={bIdx} className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {sec.note && (
                                  <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[12.5px] text-amber-900 dark:text-amber-200 leading-snug">
                                    <div className="font-bold flex items-center gap-1 mb-0.5 text-amber-800 dark:text-amber-300">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                      <span>Lưu ý về thông tin cấu trúc đề:</span>
                                    </div>
                                    <p>{sec.note}</p>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Official Source Link */}
                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-1.5 text-[12px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">
                                  {article.sourceLabel}:
                                </span>
                                <a
                                  href={article.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 break-all"
                                >
                                  <span>{article.sourceUrl}</span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              </div>
                            </div>

                            {/* Quick Action Bar */}
                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-2">
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
                                      id: article.id,
                                      title: `${article.title} - Thảo luận`,
                                    })
                                  }
                                  className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                                  <span>Bình luận ({storageService.getComments(article.id).length})</span>
                                </button>
                              </div>

                              <span className="text-[12px] text-gray-500 italic">
                                Cập nhật thông tin tuyển sinh & thi tốt nghiệp THPT 2026
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* 3. Bottom Pagination Controls */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#333] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedNewsId('pho-diem-tin-hoc-thpt-2026')}
                      className={`px-3 py-1.5 rounded border font-medium transition-colors ${
                        selectedNewsId === 'pho-diem-tin-hoc-thpt-2026'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525]'
                      }`}
                    >
                      Trang 1: Phổ điểm THPT 2026
                    </button>
                    <button
                      onClick={() => setSelectedNewsId('cau-truc-de-thi-tin-hoc-thpt-2026')}
                      className={`px-3 py-1.5 rounded border font-medium transition-colors ${
                        selectedNewsId === 'cau-truc-de-thi-tin-hoc-thpt-2026'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525]'
                      }`}
                    >
                      Trang 2: Cấu trúc đề thi 2026
                    </button>
                    <button
                      onClick={() => setSelectedNewsId('all')}
                      className={`px-3 py-1.5 rounded border font-medium transition-colors ${
                        selectedNewsId === 'all'
                          ? 'bg-[#2878C8] text-white border-[#2878C8]'
                          : 'border-gray-200 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525]'
                      }`}
                    >
                      Xem tất cả (2 bài)
                    </button>
                  </div>

                  {selectedNewsId !== 'all' && (
                    <div className="flex items-center gap-2">
                      {selectedNewsId === 'cau-truc-de-thi-tin-hoc-thpt-2026' && (
                        <button
                          onClick={() => setSelectedNewsId('pho-diem-tin-hoc-thpt-2026')}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          ← Bài trước: Phổ điểm môn Tin học
                        </button>
                      )}
                      {selectedNewsId === 'pho-diem-tin-hoc-thpt-2026' && (
                        <button
                          onClick={() => setSelectedNewsId('cau-truc-de-thi-tin-hoc-thpt-2026')}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          Bài tiếp theo: Cấu trúc đề thi →
                        </button>
                      )}
                    </div>
                  )}
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
                <span className="text-[12px] text-[#2878C8] font-bold">
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
                className={`p-3.5 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                  user.completedDailyToday
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#333]'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {user.completedDailyToday ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13.5px] font-bold text-gray-900 dark:text-white truncate">
                      Thử thách 10 câu hằng ngày
                    </h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Rèn phản xạ, giữ streak (+30–80 XP)
                    </p>
                  </div>
                </div>

                {!user.completedDailyToday ? (
                  <button
                    onClick={onStartDailyChallenge}
                    className="shrink-0 px-3 py-1.5 rounded bg-[#2878C8] text-white text-[12px] font-semibold hover:bg-[#2068B0] transition-colors shadow-2xs"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  <span className="shrink-0 text-[12px] text-[#22A06B] font-semibold flex items-center gap-1">
                    Đã xong
                  </span>
                )}
              </div>

              {/* Bài kiểm tra / bài tập giáo viên */}
              {pendingAssignment ? (
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="mt-0.5 shrink-0">
                      <Circle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-[13.5px] font-bold text-gray-900 dark:text-white truncate"
                        title={pendingAssignment.title}
                      >
                        {pendingAssignment.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                        <span>Bài tập giáo viên ({pendingAssignment.questionCount} câu)</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-medium text-[11px]">
                          <Clock className="w-3 h-3" />
                          Hạn: {pendingAssignment.dueDate.split('-').reverse().join('/')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onTakeExam('de_so_1')}
                    className="shrink-0 px-3 py-1.5 rounded bg-[#2878C8] text-white text-[12px] font-semibold hover:bg-[#2068B0] transition-colors shadow-2xs"
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
                    <span className="text-[12px] text-[#2878C8] font-bold">
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
            <div className="bg-[#181818] dark:bg-[#181818] text-white px-3.5 py-2.5 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide uppercase font-bold">TOP THÀNH VIÊN</span>
              <Trophy className="w-4 h-4 text-[#FFC928]" />
            </div>

            {/* Table */}
            <div className="p-0">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-[#f8f9fa] dark:bg-[#252525] text-gray-500 dark:text-gray-400 text-[11.5px] font-semibold border-b border-gray-200 dark:border-[#333]">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center text-gray-500 dark:text-gray-400 font-semibold">#</th>
                    <th className="py-2 px-3 text-gray-500 dark:text-gray-400 font-semibold">Tên truy cập</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {top5Students.map((st) => (
                    <tr
                      key={st.rank}
                      className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-2 px-3 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {st.rank}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1 ${st.username === 'Hollowed' ? 'underline' : ''}`}>
                          {st.hasFlame && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          {st.username}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-red-600 dark:text-red-400 tabular-nums">
                        {st.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer action links matching VNOI screenshot */}
              <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between text-[11.5px] font-semibold">
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Tổ chức
                </button>
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Xem đầy đủ &gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 2. TOP ĐÓNG GÓP (Chuẩn bảng VNOI trong ảnh tham khảo) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#181818] dark:bg-[#181818] text-white px-3.5 py-2.5 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide uppercase font-bold">Top đóng góp</span>
              <Trophy className="w-4 h-4 text-[#FFC928]" />
            </div>

            <div className="p-0">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-[#f8f9fa] dark:bg-[#252525] text-gray-500 dark:text-gray-400 text-[11.5px] font-semibold border-b border-gray-200 dark:border-[#333]">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center text-gray-500 dark:text-gray-400 font-semibold">#</th>
                    <th className="py-2 px-3 text-gray-500 dark:text-gray-400 font-semibold">Tên truy cập</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400 font-semibold">Đóng góp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {top5Contributors.map((ct) => (
                    <tr
                      key={ct.rank}
                      className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-2 px-3 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {ct.rank}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-[#202020] dark:text-gray-200 hover:underline cursor-pointer flex items-center gap-1">
                          {ct.hasFlame && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          {ct.username}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                        {ct.contributions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-center text-[11.5px] font-semibold">
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Xem đầy đủ &gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 3. DÒNG BÌNH LUẬN (Với badge Discord matching screenshot) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#181818] dark:bg-[#181818] text-white px-3.5 py-2.5 flex items-center justify-between text-[13px] font-bold">
              <span className="tracking-wide uppercase font-bold">Dòng bình luận</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#5865F2] text-white text-[10.5px] font-normal">
                <span>Discord</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>861 online</span>
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
