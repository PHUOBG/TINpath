import React, { useState } from 'react';
import {
  Flame,
  Award,
  Sun,
  Moon,
  User as UserIcon,
  BookOpen,
  Sparkles,
  Trophy,
  GraduationCap,
  Shield,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Bell,
  X,
  Send,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenGoogleHub: () => void;
  onOpenAuth: () => void;
  isGoogleAuthenticated: boolean;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  themeMode,
  onToggleTheme,
  onOpenProfile,
  onSwitchRole,
  onOpenGoogleHub,
  onOpenAuth,
  isGoogleAuthenticated,
  onSignOut,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('question_error');
  const [reportContent, setReportContent] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Nav links based on current role - Styled exactly like VNOI (Uppercase, clean, compact)
  const getNavLinks = () => {
    if (user.role === 'teacher') {
      return [
        { id: 'teacher_overview', label: 'TỔNG QUAN' },
        { id: 'teacher_classes', label: 'LỚP HỌC' },
        { id: 'teacher_assignments', label: 'BÀI TẬP' },
        { id: 'teacher_tests', label: 'KIỂM TRA' },
        { id: 'teacher_materials', label: 'HỌC LIỆU' },
        { id: 'teacher_analytics', label: 'THỐNG KÊ' },
      ];
    }
    if (user.role === 'admin') {
      return [
        { id: 'admin_dashboard', label: 'DASHBOARD' },
        { id: 'admin_users', label: 'NGƯỜI DÙNG' },
        { id: 'admin_exams', label: 'NGÂN HÀNG ĐỀ' },
        { id: 'admin_ai', label: 'QUẢN LÝ AI' },
        { id: 'admin_xp', label: 'QUY TẮC XP' },
      ];
    }
    // Student role - Matches VNOI Navigation bar directly
    return [
      { id: 'home', label: 'TRANG CHỦ' },
      { id: 'learning', label: 'DANH SÁCH BÀI' },
      { id: 'practice', label: 'CÁC BÀI NỘP' },
      { id: 'leaderboard', label: 'THÀNH VIÊN' },
      { id: 'practice', label: 'CÁC KỲ THI' },
      { id: 'personalized_ai', label: 'GIA SƯ AI' },
    ];
  };

  const navLinks = getNavLinks();

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) return;
    setReportSent(true);
    setTimeout(() => {
      setReportSent(false);
      setIsReportModalOpen(false);
      setReportContent('');
    }, 1400);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#212529] text-white border-b border-[#2d3238] shadow-sm select-none h-[50px]">
        <div className="w-full h-full mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
          {/* LEFT ZONE: VNOI Exact Geometric Logo & Online Judge Branding */}
          <div className="flex items-center gap-1 sm:gap-2 h-full shrink-0">
            <button
              onClick={() =>
                onSelectTab(
                  user.role === 'teacher'
                    ? 'teacher_overview'
                    : user.role === 'admin'
                    ? 'admin_dashboard'
                    : 'home'
                )
              }
              className="flex items-center gap-2.5 h-full focus:outline-none hover:opacity-95 transition-opacity pr-2"
              title="TinPath - VNOI Online Judge Edition"
            >
              {/* TinPath Official Logo Emblem */}
              <img
                src="/images/logo/tinpath_logo.png"
                alt="TinPath Logo"
                className="w-7 h-7 rounded-lg object-contain shadow-sm shrink-0"
              />

              {/* Brand title & school subtitle */}
              <div className="flex flex-col justify-center leading-none tracking-tight text-left">
                <div className="flex items-baseline font-black leading-none text-[15px]">
                  <span className="text-white">Tin</span>
                  <span className="text-[#38BDF8]">Path</span>
                </div>
                <span className="text-[9.5px] text-gray-300 font-medium tracking-tight mt-0.5">
                  - THPT Trần Quốc Tuấn
                </span>
              </div>
            </button>

            {/* MAIN NAVIGATION LINKS (VNOI Style: Compact uppercase, neutral gray-300 hover white) */}
            <nav className="hidden lg:flex items-center h-full ml-3 text-[13px] font-medium tracking-wide">
              {navLinks.map((item, idx) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`h-full px-3 xl:px-3.5 flex items-center transition-colors whitespace-nowrap text-[12.5px] font-semibold uppercase ${
                      isActive
                        ? 'text-white font-bold bg-white/10 border-b-2 border-[#2878C8]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Google Suite quick tab */}
              <button
                onClick={onOpenGoogleHub}
                className="h-full px-3 xl:px-3.5 flex items-center gap-1.5 transition-colors whitespace-nowrap text-[12.5px] font-semibold uppercase text-gray-300 hover:text-white hover:bg-white/5"
                title="Trung tâm tích hợp Google Suite (Gemini, Drive, Sheets, Docs...)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>GOOGLE SUITE</span>
              </button>
            </nav>
          </div>

          {/* RIGHT ZONE: VNOI Right Actions (Report issue, Theme, Flag, Bell, User) */}
          <div className="flex items-center gap-2 sm:gap-3 h-full shrink-0">
            {/* 1. Báo cáo vấn đề (Yellow warning icon + text) */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors text-[12px] sm:text-[12.5px] font-medium py-1 px-1.5 sm:px-2 rounded hover:bg-white/5"
              title="Báo cáo câu hỏi lỗi hoặc vấn đề kỹ thuật"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 fill-amber-300/20 shrink-0" />
              <span className="hidden md:inline">Báo cáo vấn đề</span>
            </button>

            {/* 2. Theme Mode Toggle (Moon / Sun) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title={themeMode === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFC928]" />
              ) : (
                <Moon className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* 3. Language Flag (Vietnam Flag) */}
            <div
              className="flex items-center justify-center cursor-pointer p-1 rounded hover:bg-white/10 transition-colors"
              title="Ngôn ngữ: Tiếng Việt"
            >
              <span className="text-[17px] leading-none select-none">🇻🇳</span>
            </div>

            {/* 4. Notification Bell with dot indicator */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors relative"
                title="Thông báo"
              >
                <Bell className="w-4 h-4 text-gray-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#212529]" />
              </button>

              {isNotificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl bg-[#212529] border border-[#3A3A3A] py-2 text-xs z-50 text-gray-200 divide-y divide-[#2D3238]"
                  onMouseLeave={() => setIsNotificationsOpen(false)}
                >
                  <div className="px-3.5 py-2 font-bold text-white flex items-center justify-between text-[13px]">
                    <span>Thông báo mới</span>
                    <span className="text-[11px] text-blue-400 font-normal">Đánh dấu đã đọc</span>
                  </div>
                  <div className="py-1">
                    <div className="px-3.5 py-2 hover:bg-white/5 cursor-pointer">
                      <p className="font-semibold text-white text-[12px]">Đề thi thử 2025 - Đợt 1 đã mở</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">Thời gian làm bài: 50 phút · 28 câu hỏi chuẩn Bộ GD&ĐT.</p>
                      <span className="text-[10px] text-gray-500 mt-1 block">15 phút trước</span>
                    </div>
                    <div className="px-3.5 py-2 hover:bg-white/5 cursor-pointer">
                      <p className="font-semibold text-white text-[12px]">Chuỗi streak: {user.streakDays} ngày liên tiếp!</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">Hãy hoàn thành 10 câu trắc nghiệm hôm nay để duy trì streak.</p>
                      <span className="text-[10px] text-gray-500 mt-1 block">2 giờ trước</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. User Account Greeting & Dropdown (VNOI Style: Square Avatar + "Xin chào, {displayName}.") */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded hover:bg-white/10 transition-colors focus:outline-none"
              >
                {/* Square Avatar with softly rounded corners */}
                <div className="w-6 h-6 rounded bg-[#2878C8] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-xs">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* VNOI Exact greeting format: "Xin chào, {displayName}." */}
                <span className="text-[12.5px] font-normal text-gray-200 hidden sm:inline max-w-[130px] truncate">
                  Xin chào, <strong className="font-semibold text-white">{user.displayName}.</strong>
                </span>

                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-md shadow-2xl bg-[#212529] border border-[#3A3A3A] py-1 text-xs z-50 divide-y divide-[#2D3238]"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {/* User Profile Summary */}
                  <div className="px-4 py-3">
                    <p className="font-bold text-white text-[13.5px] truncate">{user.displayName}</p>
                    <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-300">
                      <span>{user.schoolName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#2878C8] text-white font-mono uppercase text-[10px] font-semibold">
                        Lớp {user.grade}
                      </span>
                    </div>
                  </div>

                  {/* Role Switch */}
                  <div className="py-1">
                    <div className="px-4 py-1 text-[10px] uppercase font-semibold text-gray-400">
                      Chuyển chế độ xem (Role)
                    </div>
                    <button
                      onClick={() => {
                        onSwitchRole('student');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-white/5 ${
                        user.role === 'student' ? 'text-[#38BDF8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Học sinh
                      </span>
                      {user.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('teacher');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-white/5 ${
                        user.role === 'teacher' ? 'text-[#38BDF8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> Giáo viên
                      </span>
                      {user.role === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('admin');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-white/5 ${
                        user.role === 'admin' ? 'text-[#38BDF8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Quản trị viên (Admin)
                      </span>
                      {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
                    </button>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-gray-400" /> Hồ sơ & Trường học
                    </button>
                    <button
                      onClick={() => {
                        onOpenGoogleHub();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> Bộ công cụ Google
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSignOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex overflow-x-auto border-t border-[#2D3238] bg-[#1E2226] px-2 py-1 gap-1 text-xs">
          {navLinks.map((item, idx) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={`mob-${item.id}-${idx}`}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1 rounded whitespace-nowrap text-[12px] font-semibold uppercase ${
                  isActive
                    ? 'bg-[#2878C8] text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={onOpenGoogleHub}
            className="px-3 py-1 rounded whitespace-nowrap text-[12px] font-semibold uppercase text-amber-300 hover:text-white flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" /> Google Suite
          </button>
        </div>
      </header>

      {/* Modal: Báo cáo vấn đề (Matching VNOI Problem Reporter) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-xl border border-gray-200 dark:border-[#333] shadow-2xl p-5 text-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Báo cáo vấn đề / Góp ý
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#22A06B] mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Đã tiếp nhận báo cáo!
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cảm ơn bạn đã đóng góp giúp hệ thống TinPath ngày càng hoàn thiện hơn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Loại vấn đề
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#2878C8]"
                  >
                    <option value="question_error">Sai sót câu hỏi / Đáp án đề thi</option>
                    <option value="ui_bug">Lỗi hiển thị giao diện hoặc chức năng</option>
                    <option value="speed">Tốc độ phản hồi chậm</option>
                    <option value="suggestion">Đề xuất tính năng mới</option>
                    <option value="other">Vấn đề khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    rows={4}
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Mô tả cụ thể câu hỏi hoặc thao tác bạn gặp sự cố..."
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#2878C8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#2878C8] hover:bg-[#2068B0] rounded-lg transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi báo cáo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
