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

  // Active comments from storage
  const allComments = useMemo(() => {
    return storageService.getComments();
  }, [commentsVersion]);

  // Current active assignment from teacher
  const pendingAssignment = assignments.find((a) => a.status === 'active');

  // Last active or unfinished content
  const lastAttempt = examAttempts[0];
  const continueTopic = TOPIC_LESSONS['12B']; // Default or ongoing topic

  // Top 5 members data (matching VNOI reference layout)
  const top5Students = [
    { rank: 1, username: 'fextivity', rating: 3236, hasFlame: false },
    { rank: 2, username: 'hollwo_pelw', rating: 2814, hasFlame: false },
    { rank: 3, username: 'Hollowed', rating: 2785, hasFlame: false },
    { rank: 4, username: 'marvinthang', rating: 2759, hasFlame: true },
    { rank: 5, username: 'BaoJiaoPisu', rating: 2745, hasFlame: false },
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

  return (
    <div className="space-y-6">
      {/* KHU VỰC A — TỔNG QUAN CÁ NHÂN */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#202020] dark:text-white">
                Xin chào, {user.displayName}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] dark:bg-blue-900/40 dark:text-blue-300 font-semibold font-mono">
                {user.schoolName}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Chương trình GDPT 2018 · Định hướng{' '}
              <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                {user.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
              </strong>
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-[#2C2C2C]">
            <div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 block">Mục tiêu điểm</span>
              <span className="text-lg font-bold text-[#2878C8] font-mono tabular-nums">
                {user.targetScore.toFixed(1)} / 10
              </span>
            </div>

            <div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 block">Điểm XP</span>
              <span className="text-lg font-bold text-[#FFC928] font-mono tabular-nums flex items-center gap-1">
                <Award className="w-4 h-4 text-[#FFC928]" />
                {user.xp}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 block">Chuỗi ngày học</span>
              <span className="text-lg font-bold text-amber-500 font-mono tabular-nums flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                {user.streakDays} ngày
              </span>
            </div>

            <div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 block">Tiến độ mục tiêu</span>
              <span className="text-lg font-bold text-[#22A06B] font-mono tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
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

      {/* 2-COLUMN MAIN WORKSPACE (Layout chuẩn VNOI: Bên trái nội dung chính, Bên phải Sidebar Rank + Thảo luận) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* CỘT TRÁI (8 CỘT): KHÔNG GIAN HỌC TẬP & ĐỀ THI TRỌNG TÂM */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* KHỐI 1: TIẾP TỤC HỌC & LUYỆN TẬP */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2878C8]" />
                <h3 className="text-sm font-bold text-[#202020] dark:text-white uppercase tracking-wider">
                  Tiến độ học tập & Luyện đề
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('learning')}
                className="text-xs text-[#2878C8] hover:underline flex items-center gap-1 font-semibold"
              >
                Tất cả chủ đề <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chủ đề đang học */}
            <div className="p-4 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#2878C8] font-bold">
                  {continueTopic.code} · Lớp {continueTopic.grade}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{continueTopic.examWeight}</span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                {continueTopic.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                {continueTopic.summary}
              </p>

              <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-blue-100 dark:border-blue-900/30">
                <span className="text-xs text-gray-500">Trạng thái: <strong>Đang học dở</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContinueTopic('12B')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors shadow-xs"
                  >
                    Học tiếp chủ đề này <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                  <div className="mt-0.5">
                    {user.completedDailyToday ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Thử thách 10 câu hằng ngày
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                      Rèn phản xạ, giữ streak (+30–80 XP)
                    </p>
                  </div>
                </div>

                {!user.completedDailyToday ? (
                  <button
                    onClick={onStartDailyChallenge}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0] transition-colors"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  <span className="shrink-0 text-[11px] text-[#22A06B] font-semibold flex items-center gap-1 font-mono">
                    Đã xong
                  </span>
                )}
              </div>

              {/* Bài kiểm tra / bài tập giáo viên */}
              {pendingAssignment ? (
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      <Circle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                          {pendingAssignment.title}
                        </h4>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
                          Hạn: {pendingAssignment.dueDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                        Bài tập giáo viên ({pendingAssignment.questionCount} câu)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onTakeExam('de_so_1')}
                    className="shrink-0 px-2.5 py-1 rounded bg-gray-800 text-white dark:bg-gray-700 text-xs font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Làm bài
                  </button>
                </div>
              ) : lastAttempt ? (
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-between gap-2.5">
                  <div className="truncate max-w-[170px]">
                    <span className="text-[10px] text-gray-500 block">Lần thi gần nhất:</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs truncate block">
                      {lastAttempt.examTitle}
                    </span>
                    <span className="text-xs text-[#2878C8] font-mono font-bold">
                      Điểm: {lastAttempt.totalScore.toFixed(2)}đ
                    </span>
                  </div>
                  <button
                    onClick={() => onTakeExam(lastAttempt.examId)}
                    className="px-2.5 py-1 text-xs border border-gray-300 dark:border-[#444] rounded hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors shrink-0 font-medium"
                  >
                    Luyện lại
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg border border-dashed border-gray-200 dark:border-[#333] text-center text-xs text-gray-400 flex items-center justify-center">
                  Chưa có bài tập giáo viên mới
                </div>
              )}
            </div>
          </section>

          {/* KHỐI 2: ĐỀ THI NỔI BẬT & BÌNH LUẬN THẢO LUẬN (Theo phong cách bài viết VNOI chuẩn Image 2) */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] text-xs font-bold font-mono">
                  Tin tức & Đề thi 2025
                </span>
                <span className="text-xs text-gray-500">★ Bộ GD&ĐT GDPT 2018</span>
              </div>
              <button
                onClick={() => onNavigateTab('practice')}
                className="text-xs text-[#2878C8] hover:underline font-semibold"
              >
                Xem ngân hàng đề →
              </button>
            </div>

            {/* Main Article style */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                ĐỀ THI THỬ TỐT NGHIỆP THPT MÔN TIN HỌC 2025 - ĐỀ SỐ 1
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Biên soạn bởi Hội đồng chuyên môn TinPath Quảng Ngãi · Cập nhật cấu trúc chuẩn Bộ GD&ĐT
              </p>

              <div className="mt-3.5 space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-[#fbfbfb] dark:bg-[#252525] p-3.5 rounded-lg border border-gray-200 dark:border-[#333]">
                <p>
                  🌟 <strong>Cấu trúc chuẩn hóa 2 phần:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Phần I (24 câu):</strong> Trắc nghiệm nhiều lựa chọn (4 phương án chọn 1 đáp án đúng), bao phủ kiến thức Mạng máy tính, Hệ CSDL và Trí tuệ nhân tạo.
                  </li>
                  <li>
                    <strong>Phần II (4 câu):</strong> Trắc nghiệm Đúng/Sai đa tầng, mỗi câu có 4 ý a/b/c/d đánh giá tư duy sâu về đọc code SQL và thuật toán logic.
                  </li>
                </ul>
                <p className="text-[11px] text-gray-500 pt-1">
                  ⏱️ Thời gian: 50 phút · Thang điểm: 10 điểm chuẩn hóa · Điểm thưởng XP: +50 XP
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTakeExam('de_so_1')}
                    className="px-4 py-2 rounded bg-[#2878C8] hover:bg-[#2068B0] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Bắt đầu làm đề này
                  </button>

                  <button
                    onClick={() =>
                      setCommentModalExam({
                        id: 'de_so_1',
                        title: 'Đề số 1: Đề chuẩn Bộ GD&ĐT 2025',
                      })
                    }
                    className="px-3 py-2 rounded border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>Bình luận thảo luận ({storageService.getComments('de_so_1').length})</span>
                  </button>
                </div>

                <span className="text-[11px] text-gray-500 italic">
                  Đã có 348 lượt học sinh Quảng Ngãi thi thử
                </span>
              </div>
            </div>
          </section>

          {/* KHỐI 3: GỢI Ý HỌC TẬP MANG TÍNH HÀNH ĐỘNG */}
          <section className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#202020] dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FFC928]" />
              Gợi ý học tập mang tính hành động
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex flex-col justify-between"
                >
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                  <div className="mt-3 pt-2 border-t border-gray-200/50 dark:border-[#333] flex justify-end">
                    <button
                      onClick={item.onClick}
                      className="text-xs text-[#2878C8] hover:text-[#2068B0] font-bold flex items-center gap-1"
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
        {/* CỘT PHẢI (4 CỘT): SIDEBAR VNOI STYLE (Rank Top + Dòng bình luận + QR Zalo) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. TOP THÀNH VIÊN (Chuẩn bảng VNOI trong ảnh tham khảo) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            {/* Header Dark VNOI Style */}
            <div className="bg-[#202020] text-white px-3 py-2 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-wide">Top thành viên</span>
              </div>
              <Trophy className="w-4 h-4 text-[#FFC928]" />
            </div>

            {/* Table */}
            <div className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2c2c2c] text-gray-200 text-[11px] font-semibold border-b border-[#3a3a3a]">
                  <tr>
                    <th className="py-1.5 px-2.5 w-8 text-center">#</th>
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
                      <td className="py-1.5 px-2.5 text-center font-mono text-gray-600 dark:text-gray-400 font-medium">
                        {st.rank}
                      </td>
                      <td className="py-1.5 px-3">
                        <span className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1">
                          {st.hasFlame && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          {st.username}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-red-600 dark:text-red-400 tabular-nums">
                        {st.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer action links matching VNOI */}
              <div className="px-3 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between text-[11px]">
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

          {/* 2. TOP ĐÓNG GÓP / TRƯỜNG DẪN ĐẦU (Chuẩn VNOI Style) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#202020] text-white px-3 py-2 flex items-center justify-between text-xs font-bold">
              <span className="uppercase tracking-wide">Top trường dẫn đầu</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2c2c2c] text-gray-200 text-[11px] font-semibold border-b border-[#3a3a3a]">
                  <tr>
                    <th className="py-1.5 px-2.5 w-8 text-center">#</th>
                    <th className="py-1.5 px-3">Trường THPT</th>
                    <th className="py-1.5 px-3 text-right">Tổng điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {top5Schools.map((sc) => (
                    <tr
                      key={sc.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-1.5 px-2.5 text-center font-mono text-gray-600 dark:text-gray-400 font-medium">
                        {sc.rank}
                      </td>
                      <td className="py-1.5 px-3">
                        <span className="font-medium text-gray-900 dark:text-white truncate block max-w-[170px]">
                          {sc.name}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {sc.totalPoints.toLocaleString()} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-3 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-end text-[11px]">
                <button
                  onClick={onOpenLeaderboard}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Xem đầy đủ &gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 3. BẢNG "DÒNG BÌNH LUẬN" (Theo yêu cầu người dùng) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="bg-[#202020] text-white px-3 py-2 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase tracking-wide">Dòng bình luận</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-300 font-mono">
                {allComments.length} bài
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-[#2A2A2A] max-h-72 overflow-y-auto">
              {allComments.slice(0, 6).map((cm) => (
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
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      {cm.userName}
                    </span>
                    <span className="text-[10px] text-gray-400">{cm.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                    → <span className="text-gray-700 dark:text-gray-300">{cm.examTitle}</span>
                  </p>
                  <p className="text-[11px] text-gray-800 dark:text-gray-200 line-clamp-1 mt-0.5">
                    "{cm.content}"
                  </p>
                </div>
              ))}
            </div>

            <div className="px-3 py-2 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between text-[11px]">
              <span className="text-gray-400 text-[10px]">Cập nhật liên tục</span>
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

          {/* 4. BẢNG NHỎ CHỨA MÃ QR NHÓM ZALO THẢO LUẬN (Theo yêu cầu người dùng) */}
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
