import React, { useState, useMemo } from 'react';
import {
  User as UserIcon,
  Copy,
  Check,
  CheckCircle2,
  BookOpen,
  Award,
  Zap,
  Trophy,
  MessageSquare,
  Flame,
  Settings,
  Info,
  Edit3,
  Calendar,
  School as SchoolIcon,
  Target,
  Clock,
  Sparkles,
  Save,
  GraduationCap,
  FileCheck,
} from 'lucide-react';
import { UserProfile, ExamAttempt, SubjectTopicId } from '../../types';
import { QUANG_NGAI_DISTRICTS, getSchoolsByDistrict } from '../../data/schoolsData';
import { storageService } from '../../services/storageService';

interface UserProfileViewProps {
  user: UserProfile;
  examAttempts: ExamAttempt[];
  completedTopics: Record<SubjectTopicId, boolean>;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateTab: (tabId: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  examAttempts,
  completedTopics,
  onUpdateUser,
  onNavigateTab,
}) => {
  // Tab state: Only 'about' (Giới thiệu) and 'settings' (Cài đặt) as requested
  const [activeTab, setActiveTab] = useState<'about' | 'settings'>('about');
  const [hasCopied, setHasCopied] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Settings form local state
  const [displayName, setDisplayName] = useState(user.displayName || 'fuongchuche');
  const [username, setUsername] = useState(user.username || 'fuongchuche');
  const [bio, setBio] = useState(
    user.bio || 'Học sinh lớp 12 định hướng ôn thi tốt nghiệp THPT môn Tin học GDPT 2018.'
  );
  const [district, setDistrict] = useState(user.district || 'TP. Quảng Ngãi');
  const [schoolId, setSchoolId] = useState(user.schoolId || 'qn_tran_quoc_tuan');
  const [grade, setGrade] = useState(user.grade || '12');
  const [track, setTrack] = useState<'CS' | 'ICT'>(user.track || 'CS');
  const [targetScore, setTargetScore] = useState<number>(user.targetScore || 8.5);
  const [dailyMinutes, setDailyMinutes] = useState<number>(user.dailyStudyMinutes || 45);

  // Schools for current district
  const availableSchools = useMemo(() => getSchoolsByDistrict(district), [district]);

  // Derived user statistics
  // 1. Số đề giải được (từ examAttempts)
  const solvedExamsCount = useMemo(() => {
    const uniqueIds = new Set(examAttempts.map((a) => a.examId));
    return uniqueIds.size > 0 ? uniqueIds.size : examAttempts.length;
  }, [examAttempts]);

  // 2. Số chủ đề đã học (từ completedTopics)
  const completedTopicsCount = useMemo(() => {
    return Object.values(completedTopics).filter(Boolean).length;
  }, [completedTopics]);

  // 3. Số bình luận
  const commentsCount = useMemo(() => {
    const allComments = storageService.getComments();
    const userComments = allComments.filter(
      (c) => c.userName === user.displayName || c.userName === displayName || c.userName === username
    );
    return Math.max(userComments.length, 3); // Seed with reasonable active count
  }, [user.displayName, displayName, username]);

  // 4. Điểm tích lũy (XP)
  const userXp = user.xp || 240;

  // 5. Thứ hạng
  const userRank = useMemo(() => {
    if (userXp >= 800) return '#1';
    if (userXp >= 600) return '#3';
    if (userXp >= 400) return '#4';
    if (userXp >= 200) return '#5';
    return '#8';
  }, [userXp]);

  // Handle Copy username
  const handleCopyUsername = () => {
    const textToCopy = `@${username}`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Handle District change in Settings
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const schools = getSchoolsByDistrict(newDistrict);
    if (schools.length > 0) {
      setSchoolId(schools[0].id);
    } else {
      setSchoolId('');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchool = availableSchools.find((s) => s.id === schoolId) || {
      name: user.schoolName || 'Trường THPT Trần Quốc Tuấn',
    };

    const updated: UserProfile = {
      ...user,
      displayName,
      username,
      bio,
      district,
      schoolId,
      schoolName: selectedSchool.name,
      grade,
      track,
      targetScore: Number(targetScore),
      dailyStudyMinutes: Number(dailyMinutes),
    };

    onUpdateUser(updated);
    storageService.saveUserProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      setActiveTab('about');
    }, 1200);
  };

  // Generate 12-month Activity Heatmap Data (52 weeks x 7 days)
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days: Array<{
      dateStr: string;
      dayOfWeek: number; // 0 = Mon, ..., 6 = Sun
      count: number;
      formattedDate: string;
    }> = [];

    // Map existing exam attempts to date strings
    const attemptDateCounts: Record<string, number> = {};
    examAttempts.forEach((a) => {
      const d = a.submittedAt.split('T')[0];
      attemptDateCounts[d] = (attemptDateCounts[d] || 0) + 1;
    });

    // Generate 52 weeks = 364 days
    const totalDays = 52 * 7;
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6

      // Activity count: exam attempts on this day, plus study streak
      let count = attemptDateCounts[dateStr] || 0;

      // Realistic activity distribution for demo:
      // Recent days within streak have activities
      const daysAgo = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < (user.streakDays || 5)) {
        count = Math.max(count, 1 + (daysAgo % 3));
      } else if (i % 7 === 1 || i % 13 === 0 || i % 29 === 0) {
        // Sporadic past study sessions
        count = Math.max(count, 1);
      }

      days.push({
        dateStr,
        dayOfWeek,
        count,
        formattedDate: d.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      });
    }

    // Group into 52 weeks (each week has 7 days from Mon to Sun)
    const weeks: Array<typeof days> = [];
    for (let w = 0; w < 52; w++) {
      weeks.push(days.slice(w * 7, (w + 1) * 7));
    }

    const totalCount = days.reduce((acc, cur) => acc + cur.count, 0);

    return { weeks, totalCount };
  }, [examAttempts, user.streakDays]);

  // Get Initials for avatar
  const avatarInitials = useMemo(() => {
    const name = displayName || username || 'FU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [displayName, username]);

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <UserIcon className="w-6 h-6 text-[#2878C8]" />
            Hồ sơ học sinh TinPath
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Theo dõi tiến độ học tập, thành tích luyện thi và độ chuyên cần cá nhân
          </p>
        </div>

        {/* Tab Switcher: Only 'Giới thiệu' & 'Cài đặt' */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-xl text-xs sm:text-sm self-start sm:self-auto shadow-xs border border-gray-200/60 dark:border-[#333]">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-[#2878C8] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            Giới thiệu
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#2878C8] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Profile Identity Card */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
          {/* Avatar Circle */}
          <div className="flex flex-col items-center text-center space-y-3.5">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#2878C8] text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md ring-4 ring-blue-100 dark:ring-blue-950/60 select-none overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{avatarInitials}</span>
                )}
              </div>
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center text-white"
                title="Đang hoạt động"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Display Name & Username */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {displayName}
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                <span>@{username}</span>
                <button
                  onClick={handleCopyUsername}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  title="Sao chép tên người dùng"
                >
                  {hasCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {hasCopied && <span className="text-[11px] text-emerald-600 font-sans font-semibold">Đã chép!</span>}
              </div>
            </div>

            {/* Role Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/50">
              <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{user.role === 'teacher' ? 'Giáo viên Tin học' : 'Học sinh / Thí sinh'}</span>
            </div>
          </div>

          {/* School & Organization Section */}
          <div className="pt-5 border-t border-gray-100 dark:border-[#2C2C2C] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block text-center">
              TỔ CHỨC / ĐƠN VỊ
            </span>
            <div className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-[#252525] border border-gray-200/70 dark:border-[#333] text-center space-y-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <SchoolIcon className="w-4 h-4 text-[#2878C8] shrink-0" />
                {user.schoolName || 'Trường THPT Trần Quốc Tuấn'}
              </span>
              <span className="text-xs text-gray-500 block">
                {user.district || 'TP. Quảng Ngãi'} • Tỉnh Quảng Ngãi
              </span>
            </div>
          </div>

          {/* Academic Meta List */}
          <div className="pt-4 border-t border-gray-100 dark:border-[#2C2C2C] space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2878C8]" /> Khối lớp:
              </span>
              <strong className="font-mono text-gray-900 dark:text-white">Lớp {user.grade}</strong>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Phân ban ôn thi:
              </span>
              <strong className="font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2878C8] font-bold">
                {user.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-500" /> Mục tiêu điểm:
              </span>
              <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold text-sm">
                {user.targetScore || 8.5}đ THPTQG
              </strong>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-500" /> Thời gian tự học:
              </span>
              <strong className="font-mono text-gray-900 dark:text-white">
                {user.dailyStudyMinutes || 45} phút / ngày
              </strong>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525] text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Chỉnh sửa thông tin cá nhân
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Metrics, Bio & Activity Heatmap */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: ABOUT VIEW */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* 5 METRIC CARDS (Số đề giải được, Số chủ đề đã học, Số bình luận, Điểm tích lũy, Thứ hạng) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {/* 1. Số đề giải được */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs space-y-1.5 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold uppercase tracking-wider text-[11px]">SỐ ĐỀ GIẢI ĐƯỢC</span>
                    <FileCheck className="w-4 h-4 text-[#2878C8]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-gray-900 dark:text-white">
                    {solvedExamsCount}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {solvedExamsCount > 0 ? `${solvedExamsCount} đề hoàn thành` : 'Chưa thi đề nào'}
                  </div>
                </div>

                {/* 2. Số chủ đề đã học */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs space-y-1.5 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold uppercase tracking-wider text-[11px]">CHỦ ĐỀ ĐÃ HỌC</span>
                    <BookOpen className="w-4 h-4 text-[#22A06B]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {completedTopicsCount}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {completedTopicsCount} / 10 chủ đề SGK
                  </div>
                </div>

                {/* 3. Số bình luận */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs space-y-1.5 hover:border-sky-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold uppercase tracking-wider text-[11px]">SỐ BÌNH LUẬN</span>
                    <MessageSquare className="w-4 h-4 text-[#0284c7]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#0284c7]">
                    {commentsCount}
                  </div>
                  <div className="text-[11px] text-gray-500">Trao đổi & thảo luận</div>
                </div>

                {/* 4. Điểm tích lũy */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs space-y-1.5 hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold uppercase tracking-wider text-[11px]">ĐIỂM TÍCH LŨY</span>
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
                    {userXp.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-500">XP kinh nghiệm</div>
                </div>

                {/* 5. Thứ hạng */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-4 shadow-xs space-y-1.5 hover:border-purple-300 transition-colors col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold uppercase tracking-wider text-[11px]">THỨ HẠNG</span>
                    <Trophy className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
                    {userRank}
                  </div>
                  <div className="text-[11px] text-gray-500">Bảng thi đua tỉnh</div>
                </div>
              </div>

              {/* INTRODUCTION BLOCK */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#2878C8]" />
                    Giới thiệu
                  </h3>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-xs text-[#2878C8] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </button>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                  {bio || 'Chưa có thông tin giới thiệu.'}
                </p>
              </div>

              {/* ACTIVITY HEATMAP: LƯỢT HOẠT ĐỘNG CHUYÊN CẦN TRONG 12 THÁNG QUA */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Flame className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                      {heatmapData.totalCount} lượt chuyên cần học tập & làm đề trong 12 tháng qua
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Đo lường mức độ đều đặn giải đề thi, ôn luyện chủ đề và duy trì chuỗi học mỗi ngày
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-[#252525] px-2.5 py-1 rounded-md self-start sm:self-auto font-mono">
                    12 tháng gần nhất
                  </span>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-2">
                  <div className="inline-flex gap-2">
                    {/* Days of week labels */}
                    <div className="flex flex-col justify-between text-[10px] text-gray-400 font-mono py-1 pr-1 select-none">
                      <span>Th 2</span>
                      <span>Th 3</span>
                      <span>Th 4</span>
                      <span>Th 5</span>
                      <span>Th 6</span>
                      <span>Th 7</span>
                      <span>CN</span>
                    </div>

                    {/* 52 Weeks Columns */}
                    <div className="grid grid-flow-col grid-rows-7 gap-1">
                      {heatmapData.weeks.map((week, wIdx) =>
                        week.map((day, dIdx) => {
                          // Color mapping matching web tone (TinPath Blue & Sky palette)
                          let bgClass = 'bg-gray-100 dark:bg-[#252525]';
                          if (day.count === 1) {
                            bgClass = 'bg-[#bae6fd] dark:bg-[#0369a1]/50';
                          } else if (day.count === 2) {
                            bgClass = 'bg-[#38bdf8] dark:bg-[#0284c7]';
                          } else if (day.count >= 3) {
                            bgClass = 'bg-[#2878C8] dark:bg-[#2878C8] shadow-xs';
                          }

                          return (
                            <div
                              key={`${wIdx}-${dIdx}`}
                              className={`w-3 h-3 rounded-xs ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
                              title={`${day.count} hoạt động vào ${day.formattedDate}`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend Bottom Bar */}
                <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono">{heatmapData.totalCount} lượt chuyên cần</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span>ÍT</span>
                    <div className="w-3 h-3 rounded-xs bg-gray-100 dark:bg-[#252525]" />
                    <div className="w-3 h-3 rounded-xs bg-[#bae6fd] dark:bg-[#0369a1]/50" />
                    <div className="w-3 h-3 rounded-xs bg-[#38bdf8] dark:bg-[#0284c7]" />
                    <div className="w-3 h-3 rounded-xs bg-[#2878C8] dark:bg-[#2878C8]" />
                    <span>NHIỀU</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#2878C8]" />
                    Cài đặt tài khoản & Thông tin học tập
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Cập nhật thông tin trường học, phân ban ôn thi THPT và mục tiêu điểm số của bạn
                  </p>
                </div>
                {isSavedNotice && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 animate-pulse">
                    <Check className="w-4 h-4 stroke-[3]" /> Đã lưu thành công!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Họ và tên hiển thị
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Tên người dùng (Username)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-gray-400 font-mono text-sm">@</span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="fuongchuche"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio / Giới thiệu */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Giới thiệu bản thân & Mục tiêu
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Giới thiệu ngắn gọn về bản thân, sở thích công nghệ và mục tiêu đại học..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm leading-relaxed"
                  />
                </div>

                {/* District & School */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-[#2C2C2C]">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Huyện / Thị xã / Thành phố (Quảng Ngãi)
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm"
                    >
                      {QUANG_NGAI_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Trường THPT trực thuộc
                    </label>
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm"
                    >
                      {availableSchools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grade & Track */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-[#2C2C2C]">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Khối lớp
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm"
                    >
                      <option value="12">Lớp 12 (Ôn thi THPT)</option>
                      <option value="11">Lớp 11</option>
                      <option value="10">Lớp 10</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Phân ban định hướng
                    </label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value as 'CS' | 'ICT')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm"
                    >
                      <option value="CS">Khoa học máy tính (CS)</option>
                      <option value="ICT">Tin học ứng dụng (ICT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Mục tiêu điểm số
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="5"
                      max="10"
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2878C8] text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('about')}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu thông tin hồ sơ
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
