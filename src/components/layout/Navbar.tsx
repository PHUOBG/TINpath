import React, { useState } from 'react';
import {
  Flame,
  Award,
  Sun,
  Moon,
  User as UserIcon,
  BookOpen,
  FileText,
  Sparkles,
  Trophy,
  GraduationCap,
  Shield,
  Layers,
  LogOut,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { TinPathLogo } from '../common/TinPathLogo';

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

  // Nav links based on current role
  const getNavLinks = () => {
    if (user.role === 'teacher') {
      return [
        { id: 'teacher_overview', label: 'Tổng quan' },
        { id: 'teacher_classes', label: 'Lớp học' },
        { id: 'teacher_assignments', label: 'Bài tập' },
        { id: 'teacher_tests', label: 'Kiểm tra' },
        { id: 'teacher_materials', label: 'Học liệu' },
        { id: 'teacher_analytics', label: 'Thống kê' },
      ];
    }
    if (user.role === 'admin') {
      return [
        { id: 'admin_dashboard', label: 'Dashboard' },
        { id: 'admin_users', label: 'Người dùng' },
        { id: 'admin_exams', label: 'Ngân hàng đề' },
        { id: 'admin_ai', label: 'Quản lý AI' },
        { id: 'admin_xp', label: 'Quy tắc XP' },
      ];
    }
    // Student role (Focused layout with compact ranking widget on dashboard)
    return [
      { id: 'home', label: 'Trang chủ' },
      { id: 'learning', label: 'Học tập' },
      { id: 'practice', label: 'Luyện đề' },
      { id: 'personalized_ai', label: 'AI cá nhân hóa' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#202020] text-white border-b border-[#2C2C2C] shadow-sm select-none">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 gap-4 md:gap-8">
          {/* Zone 1: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab(user.role === 'teacher' ? 'teacher_overview' : user.role === 'admin' ? 'admin_dashboard' : 'home')}
              className="flex items-center text-left focus:outline-none hover:opacity-95 transition-opacity"
            >
              <TinPathLogo
                size={38}
                textColor="text-white"
                subtextColor="text-blue-300 font-medium"
              />
            </button>
          </div>

          {/* Zone 2: Navigation Links (VNOI Style with bottom green indicator line) */}
          <nav className="hidden md:flex items-center h-14 gap-0.5 text-[13px] font-medium tracking-wide">
            {navLinks.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`h-full px-3.5 flex items-center transition-all whitespace-nowrap text-[13px] uppercase font-medium border-b-[3px] ${
                    isActive
                      ? 'border-[#22A06B] text-white font-bold bg-white/5'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & User Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Google Tools Quick Hub Button */}
            <button
              onClick={onOpenGoogleHub}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-[#2A2A2A] border border-[#3A3A3A] text-gray-200 hover:border-[#2878C8] hover:text-white transition-colors"
              title="Mở Trung tâm tích hợp công cụ Google (Gemini, Drive, Sheets, Docs, Calendar, Veo...)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
              <span className="hidden lg:inline">Google Suite</span>
            </button>

            {/* Streak & XP for Students */}
            {user.role === 'student' && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#2A2A2A] text-[#FFC928]"
                  title={`Chuỗi ${user.streakDays} ngày học liên tiếp`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#FFC928] fill-[#FFC928]" />
                  <span className="font-bold">{user.streakDays}d</span>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#2A2A2A] text-white"
                  title={`Tổng điểm XP: ${user.xp}`}
                >
                  <Award className="w-3.5 h-3.5 text-[#2878C8]" />
                  <span className="font-bold">{user.xp} XP</span>
                </div>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
              title={themeMode === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFC928]" />
              ) : (
                <Moon className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* User Account Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded bg-[#2A2A2A] hover:bg-[#333333] transition-colors border border-[#3A3A3A]"
              >
                <div className="w-6 h-6 rounded-full bg-[#2878C8] text-white flex items-center justify-center text-xs font-bold">
                  {user.displayName.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-gray-200 max-w-[100px] truncate">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-md shadow-xl bg-[#202020] border border-[#333333] py-1 text-xs z-50 divide-y divide-[#2C2C2C]"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {/* User Profile Summary */}
                  <div className="px-4 py-3">
                    <p className="font-bold text-white text-sm truncate">{user.displayName}</p>
                    <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-300">
                      <span>{user.schoolName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#2878C8] text-white font-mono uppercase text-[10px]">
                        Lớp {user.grade}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role Quick Section */}
                  <div className="py-1">
                    <div className="px-4 py-1 text-[10px] uppercase font-semibold text-gray-400">
                      Chuyển chế độ xem (Role)
                    </div>
                    <button
                      onClick={() => {
                        onSwitchRole('student');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-[#2A2A2A] ${
                        user.role === 'student' ? 'text-[#2878C8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Học sinh
                      </span>
                      {user.role === 'student' && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('teacher');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-[#2A2A2A] ${
                        user.role === 'teacher' ? 'text-[#2878C8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> Giáo viên
                      </span>
                      {user.role === 'teacher' && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('admin');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-[#2A2A2A] ${
                        user.role === 'admin' ? 'text-[#2878C8] font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Quản trị viên (Admin)
                      </span>
                      {user.role === 'admin' && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Navigation Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-gray-300 hover:text-white hover:bg-[#2A2A2A] flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Hồ sơ & Trường học
                    </button>
                    <button
                      onClick={() => {
                        onOpenGoogleHub();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-gray-300 hover:text-white hover:bg-[#2A2A2A] flex items-center gap-2"
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
                      className="w-full text-left px-4 py-1.5 text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-[#2A2A2A] px-2 py-1 gap-1 text-xs">
        {navLinks.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1 rounded whitespace-nowrap ${
                isActive
                  ? 'bg-[#2878C8] text-white font-medium'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
