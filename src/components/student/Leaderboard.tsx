import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Users,
  Building2,
  Search,
  X,
  Award,
  Flame,
  CheckCircle2,
  Info,
  ShieldCheck,
  ChevronRight,
  Filter,
  Crown,
  Medal,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { QUANG_NGAI_DISTRICTS, getSchoolRankings, SchoolRankingItem } from '../../data/schoolsData';

interface LeaderboardProps {
  currentUser: UserProfile;
  initialTab?: 'organizations' | 'individual';
  onClose?: () => void;
  isModal?: boolean;
}

interface RankedStudent {
  rank: number;
  username: string;
  fullName: string;
  schoolName: string;
  rating: number;
  score: number;
  problemsSolved: number;
  isCurrentUser: boolean;
  hasFlame?: boolean;
  avatarUrl?: string;
  title?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUser,
  initialTab = 'organizations',
  onClose,
  isModal = false,
}) => {
  const [activeTab, setActiveTab] = useState<'organizations' | 'individual'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [showRules, setShowRules] = useState(false);

  // Helper for student initials
  const getInitials = (fullName: string, username: string) => {
    const clean = fullName.replace(/\(.*\)/, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };

  // Schools / Organizations ranking from data
  const schoolRankings = useMemo(() => {
    return getSchoolRankings(currentUser.schoolName, currentUser.xp);
  }, [currentUser.schoolName, currentUser.xp]);

  // Current user's school item
  const userSchool = useMemo(() => {
    return schoolRankings.find((s) => s.isUserSchool) || schoolRankings[0];
  }, [schoolRankings]);

  // Filtered Schools
  const filteredSchools = useMemo(() => {
    return schoolRankings.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDistrict = selectedDistrict === 'all' || s.district === selectedDistrict;
      return matchSearch && matchDistrict;
    });
  }, [schoolRankings, searchQuery, selectedDistrict]);

  // VNOI-style Top Students Data
  const baseStudents: RankedStudent[] = [
    {
      rank: 1,
      username: 'fextivity',
      fullName: 'Trần Xuân Bách',
      schoolName: 'THPT chuyên Lê Khiết',
      rating: 3236,
      score: 88.18,
      problemsSolved: 332,
      isCurrentUser: false,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
      title: 'Kiện tướng Olympic',
    },
    {
      rank: 2,
      username: 'hollwo_pelw',
      fullName: 'Phạm Quốc Hùng',
      schoolName: 'THPT Trần Quốc Tuấn',
      rating: 2814,
      score: 44.60,
      problemsSolved: 139,
      isCurrentUser: false,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=c0aede',
      title: 'Cao thủ Bậc 1',
    },
    {
      rank: 3,
      username: 'Hollowed',
      fullName: 'Lê Bảo Anh',
      schoolName: 'THPT Bình Sơn',
      rating: 2785,
      score: 66.56,
      problemsSolved: 110,
      isCurrentUser: false,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
      title: 'Tinh anh Bậc 2',
    },
    {
      rank: 4,
      username: 'marvinthang',
      fullName: 'Nguyễn Đức Thắng',
      schoolName: 'THPT Ba Gia',
      rating: 2759,
      score: 148.46,
      problemsSolved: 1059,
      isCurrentUser: false,
      hasFlame: true,
    },
    {
      rank: 5,
      username: 'BaoJiaoPisu',
      fullName: 'Lê Ngọc Bảo Anh',
      schoolName: 'THPT Số 1 Tư Nghĩa',
      rating: 2745,
      score: 98.13,
      problemsSolved: 334,
      isCurrentUser: false,
    },
    {
      rank: 6,
      username: 'minhcool',
      fullName: 'Nguyễn Quang Minh',
      schoolName: 'THPT Chu Văn An',
      rating: 2702,
      score: 72.56,
      problemsSolved: 210,
      isCurrentUser: false,
      hasFlame: true,
    },
    {
      rank: 7,
      username: 'LeKienThanh69',
      fullName: 'Lê Kiến Thành',
      schoolName: 'THPT Mộ Đức 1',
      rating: 2702,
      score: 114.21,
      problemsSolved: 688,
      isCurrentUser: false,
    },
    {
      rank: 8,
      username: 'noobcoder',
      fullName: 'Lê Hoàng Nam',
      schoolName: 'THPT Số 1 Đức Phổ',
      rating: 2693,
      score: 53.27,
      problemsSolved: 128,
      isCurrentUser: false,
    },
    {
      rank: 9,
      username: 'socpite',
      fullName: 'Trần Minh Quân',
      schoolName: 'THPT Lý Sơn',
      rating: 2687,
      score: 50.14,
      problemsSolved: 95,
      isCurrentUser: false,
    },
    {
      rank: 10,
      username: 'duongnc000',
      fullName: 'Nguyễn Cảnh Dương',
      schoolName: 'THPT chuyên Lê Khiết',
      rating: 2672,
      score: 50.67,
      problemsSolved: 134,
      isCurrentUser: false,
    },
    {
      rank: 11,
      username: 'huyhau6a2',
      fullName: 'Đặng Huy Hậu',
      schoolName: 'THPT Huỳnh Thúc Kháng',
      rating: 2644,
      score: 94.97,
      problemsSolved: 412,
      isCurrentUser: false,
      hasFlame: true,
    },
    {
      rank: 12,
      username: 'gawr_gura',
      fullName: 'Võ Thị Thanh Thảo',
      schoolName: 'THPT Sơn Hà',
      rating: 2643,
      score: 9.33,
      problemsSolved: 47,
      isCurrentUser: false,
    },
  ];

  // Insert current user in student list
  const studentList: RankedStudent[] = useMemo(() => {
    return [
      ...baseStudents.slice(0, 4),
      {
        rank: 5,
        username: currentUser.displayName.toLowerCase().replace(/\s+/g, '_') || 'van_an_tin12',
        fullName: `${currentUser.displayName} (Bạn)`,
        schoolName: currentUser.schoolName,
        rating: 2400 + Math.round(currentUser.xp * 0.8),
        score: Number((currentUser.xp * 0.25).toFixed(2)),
        problemsSolved: Math.max(12, currentUser.streakDays * 3),
        isCurrentUser: true,
        hasFlame: currentUser.streakDays >= 5,
        avatarUrl: currentUser.avatarUrl,
        title: 'Chiến binh Tin học',
      },
      ...baseStudents.slice(4).map((s, idx) => ({ ...s, rank: idx + 6 })),
    ];
  }, [currentUser, baseStudents]);

  // Top 3 Podium Students
  const top1 = studentList[0];
  const top2 = studentList[1];
  const top3 = studentList[2];

  const filteredStudents = useMemo(() => {
    return studentList.filter(
      (s) =>
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [studentList, searchQuery]);

  return (
    <div className={`space-y-5 text-[#202020] dark:text-[#E0E0E0] ${isModal ? 'p-1' : ''}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-[#333] gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Bảng xếp hạng & Thi đua học tập
            </h2>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
              Phong trào thi đua học tập và ôn thi tốt nghiệp THPT môn Tin học tỉnh Quảng Ngãi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Switch Tab buttons */}
          <div className="inline-flex rounded-lg p-1.5 bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#383838]">
            <button
              onClick={() => {
                setActiveTab('organizations');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'organizations'
                  ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Tổ chức (Trường học)
            </button>
            <button
              onClick={() => {
                setActiveTab('individual');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'individual'
                  ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Cá nhân học sinh
            </button>
          </div>

          {/* Close button if in modal mode */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-gray-200 dark:border-[#3A3A3A] text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
              title="Đóng bảng xếp hạng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TỔ CHỨC (TRƯỜNG HỌC) */}
      {/* ========================================================================= */}
      {activeTab === 'organizations' && (
        <div className="space-y-5">
          {/* Highlight card for User's School */}
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 text-white">
                    HẠNG #{userSchool.rank} TOÀN TỈNH
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    Trường của bạn
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
                  {userSchool.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  Địa bàn: {userSchool.district} · Tỉnh Quảng Ngãi
                </p>
              </div>

              {/* School Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-emerald-500/20 text-center sm:text-right">
                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-500/20">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                    Số học sinh
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {userSchool.studentCount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-500/20">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                    Tổng số điểm
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {userSchool.totalPoints.toLocaleString()} đ
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-500/20">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                    Điểm TB thi thử
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                    {userSchool.avgScore.toFixed(2)} / 10
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & District Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trường THPT hoặc huyện..."
                className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* District dropdown filter */}
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 shrink-0 font-medium">Huyện/Thị xã:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả huyện/thị (Toàn tỉnh Quảng Ngãi)</option>
                {QUANG_NGAI_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School Rankings Table */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#202020] text-white font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Hạng</th>
                    <th className="py-3.5 px-5">Tổ chức (Trường THPT)</th>
                    <th className="py-3.5 px-5 text-center w-36">Số học sinh</th>
                    <th className="py-3.5 px-5 text-right w-40">Tổng số điểm</th>
                    <th className="py-3.5 px-5 text-center w-32">Điểm TB</th>
                    <th className="py-3.5 px-5 text-right w-36">Số bài thi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {filteredSchools.map((item) => {
                    const isTop1 = item.rank === 1;
                    const isTop2 = item.rank === 2;
                    const isTop3 = item.rank === 3;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          item.isUserSchool
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-medium'
                            : 'hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }`}
                      >
                        {/* Rank Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs sm:text-sm ${
                              isTop1
                                ? 'bg-amber-400 text-amber-950 shadow-xs'
                                : isTop2
                                ? 'bg-slate-300 text-slate-800'
                                : isTop3
                                ? 'bg-amber-700/80 text-amber-100'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {item.rank}
                          </span>
                        </td>

                        {/* School Name & District */}
                        <td className="py-3.5 px-5">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({item.district})
                            </span>
                            {item.isUserSchool && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Trường bạn
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Student Count */}
                        <td className="py-3.5 px-5 text-center font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                          {item.studentCount.toLocaleString()} em
                        </td>

                        {/* Total Points */}
                        <td className="py-3.5 px-5 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm sm:text-base">
                          {item.totalPoints.toLocaleString()} đ
                        </td>

                        {/* Avg Score */}
                        <td className="py-3.5 px-5 text-center font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                          {item.avgScore.toFixed(2)}
                        </td>

                        {/* Exams Taken */}
                        <td className="py-3.5 px-5 text-right text-gray-600 dark:text-gray-400 tabular-nums">
                          {item.examsTaken.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CÁ NHÂN HỌC SINH */}
      {/* ========================================================================= */}
      {activeTab === 'individual' && (
        <div className="space-y-5">
          {/* TOP 3 PODIUM HALL OF FAME (COMPACT HEADER) */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-50/70 via-white to-gray-50/40 dark:from-[#24221b] dark:via-[#1E1E1E] dark:to-[#1A1A1A] border border-amber-200/80 dark:border-amber-900/40 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/50 dark:border-amber-900/30 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>BẢNG VÀNG VINH DANH • HALL OF FAME</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-1 tracking-tight">
                  Top 3 Học Sinh Xuất Sắc Nhất
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Vinh danh các hạt giống tài năng dẫn đầu bảng vàng giải thuật toán & điểm rèn luyện
                </p>
              </div>

              <div className="self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white dark:bg-[#252525] border border-amber-200/60 dark:border-[#383838] text-amber-800 dark:text-amber-300 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Chu kỳ đánh giá: Đợt thi thử THPT 2026
                </span>
              </div>
            </div>

            {/* 3-Column Podium */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 items-end pt-2 pb-0 max-w-2xl mx-auto">
              {/* TOP 2 (HẠNG 2) - LEFT */}
              {top2 && (
                <div className="flex flex-col items-center">
                  {/* Medal Icon on top */}
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-500 flex items-center justify-center text-xs shadow-xs -mb-2 z-10">
                    🥈
                  </div>
                  {/* Avatar */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#1b4d3e] text-white font-bold text-lg sm:text-xl flex items-center justify-center ring-3 sm:ring-4 ring-slate-300 dark:ring-slate-500 shadow-md overflow-hidden relative">
                    {top2.avatarUrl ? (
                      <img src={top2.avatarUrl} alt={top2.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(top2.fullName, top2.username)}</span>
                    )}
                  </div>
                  {/* Badge */}
                  <div className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-[9px] sm:text-[10px] -mt-2 z-10 shadow-xs uppercase tracking-wider flex items-center gap-0.5">
                    🥈 HẠNG 2
                  </div>
                  {/* Meta */}
                  <div className="text-center mt-1 w-full px-1">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white block truncate">
                      {top2.fullName}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                      @{top2.username}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2A2A2A] px-1.5 py-0.5 rounded-full inline-block truncate max-w-full mt-0.5">
                      {top2.schoolName.replace('Trường THPT ', '')}
                    </span>
                  </div>
                  {/* Pedestal Box */}
                  <div className="w-full h-22 sm:h-26 rounded-t-2xl border-2 border-b-0 border-slate-300 dark:border-slate-600 bg-gradient-to-b from-slate-100/90 via-slate-50/50 to-white dark:from-slate-800/40 dark:via-slate-900/10 dark:to-[#1E1E1E] p-2 flex flex-col justify-between items-center text-center shadow-xs mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-400 dark:text-slate-500 leading-none pt-0.5">
                      2
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 block">
                        {top2.score} pts
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600 dark:text-slate-400 block truncate">
                        🥋 {top2.title || 'Cao thủ Bậc 1'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TOP 1 (QUÁN QUÂN) - CENTER (ELEVATED) */}
              {top1 && (
                <div className="flex flex-col items-center">
                  {/* Crown Icon on top */}
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 border border-amber-300 flex items-center justify-center text-xs sm:text-sm shadow-md -mb-2 z-10 animate-bounce"
                    style={{ animationDuration: '2.5s' }}
                  >
                    👑
                  </div>
                  {/* Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1b4d3e] text-white font-black text-xl sm:text-2xl flex items-center justify-center ring-4 ring-amber-400 shadow-xl overflow-hidden relative">
                    {top1.avatarUrl ? (
                      <img src={top1.avatarUrl} alt={top1.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(top1.fullName, top1.username)}</span>
                    )}
                  </div>
                  {/* Badge */}
                  <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-[10px] sm:text-xs -mt-2.5 z-10 shadow-sm uppercase tracking-wider flex items-center gap-1">
                    🏆 QUÁN QUÂN
                  </div>
                  {/* Meta */}
                  <div className="text-center mt-1 w-full px-1">
                    <span className="font-black text-xs sm:text-base text-gray-900 dark:text-white block truncate">
                      {top1.fullName}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 block truncate">
                      @{top1.username}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 px-2 py-0.5 rounded-full inline-block truncate max-w-full mt-0.5">
                      {top1.schoolName.replace('Trường THPT ', '')}
                    </span>
                  </div>
                  {/* Pedestal Box */}
                  <div className="w-full h-30 sm:h-34 rounded-t-2xl border-2 border-b-0 border-amber-400 dark:border-amber-500 bg-gradient-to-b from-amber-100/90 via-amber-50/40 to-white dark:from-amber-950/50 dark:via-amber-900/10 dark:to-[#1E1E1E] p-2.5 flex flex-col justify-between items-center text-center shadow-md mt-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-500 dark:text-amber-400 leading-none pt-0.5">
                      1
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200 block">
                        {top1.score} pts
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 block truncate">
                        👑 {top1.title || 'Kiện tướng Olympic'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TOP 3 (HẠNG 3) - RIGHT */}
              {top3 && (
                <div className="flex flex-col items-center">
                  {/* Medal Icon on top */}
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-600/50 flex items-center justify-center text-xs shadow-xs -mb-2 z-10">
                    🥉
                  </div>
                  {/* Avatar */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#1b4d3e] text-white font-bold text-lg sm:text-xl flex items-center justify-center ring-3 sm:ring-4 ring-amber-700/60 dark:ring-amber-700/70 shadow-md overflow-hidden relative">
                    {top3.avatarUrl ? (
                      <img src={top3.avatarUrl} alt={top3.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(top3.fullName, top3.username)}</span>
                    )}
                  </div>
                  {/* Badge */}
                  <div className="px-2.5 py-0.5 rounded-full bg-amber-800 text-amber-100 font-extrabold text-[9px] sm:text-[10px] -mt-2 z-10 shadow-xs uppercase tracking-wider flex items-center gap-0.5">
                    🥉 HẠNG 3
                  </div>
                  {/* Meta */}
                  <div className="text-center mt-1 w-full px-1">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white block truncate">
                      {top3.fullName}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                      @{top3.username}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2A2A2A] px-1.5 py-0.5 rounded-full inline-block truncate max-w-full mt-0.5">
                      {top3.schoolName.replace('Trường THPT ', '')}
                    </span>
                  </div>
                  {/* Pedestal Box */}
                  <div className="w-full h-18 sm:h-22 rounded-t-2xl border-2 border-b-0 border-amber-700/50 dark:border-amber-700/60 bg-gradient-to-b from-amber-100/60 via-orange-50/30 to-white dark:from-amber-950/30 dark:via-orange-950/10 dark:to-[#1E1E1E] p-2 flex flex-col justify-between items-center text-center shadow-xs mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-600 leading-none pt-0.5">
                      3
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 block">
                        {top3.score} pts
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-amber-800 dark:text-amber-300 block truncate">
                        🎖️ {top3.title || 'Tinh anh Bậc 2'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search student */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm username, họ tên hoặc trường..."
                className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Điểm được xác thực độc lập từ các bài thi thử và thử thách hàng ngày
            </p>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#202020] text-white font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Hạng</th>
                    <th className="py-3.5 px-4 w-28 text-center">Rating</th>
                    <th className="py-3.5 px-5">Học sinh</th>
                    <th className="py-3.5 px-5 text-right w-32">Điểm</th>
                    <th className="py-3.5 px-5 text-right w-28">Số bài giải</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
                  {filteredStudents.map((st) => (
                    <tr
                      key={st.rank}
                      className={`transition-colors ${
                        st.isCurrentUser
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-semibold'
                          : 'hover:bg-gray-50 dark:hover:bg-[#252525]'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-medium text-gray-700 dark:text-gray-300">
                        #{st.rank}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400 text-sm">
                          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                          {st.rating}
                        </span>
                      </td>

                      {/* Avatar, Username, Name, School */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0c4a6e] to-[#2878C8] text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-xs ring-1 ring-gray-200 dark:ring-gray-700">
                            {st.avatarUrl ? (
                              <img src={st.avatarUrl} alt={st.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{getInitials(st.fullName, st.username)}</span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 flex-1 min-w-0">
                            <div>
                              <span className="font-bold text-sm sm:text-base text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1.5 truncate">
                                {st.hasFlame && <span title="Chuỗi ngày liên tục">🔥</span>}
                                {st.username}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-400 block mt-0.5 truncate">
                                {st.fullName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic truncate sm:ml-4">
                              {st.schoolName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-5 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm sm:text-base">
                        {st.score.toFixed(2)} đ
                      </td>

                      {/* Problems */}
                      <td className="py-3.5 px-5 text-right text-gray-700 dark:text-gray-300 tabular-nums">
                        {st.problemsSolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Privacy collapsible card */}
      <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/70 dark:bg-[#1E1E1E]">
        <button
          type="button"
          onClick={() => setShowRules(!showRules)}
          className="w-full flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
              Quy tắc thi đua điểm số & Cam kết bảo mật
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-emerald-600 hover:underline">
            {showRules ? 'Thu gọn' : 'Xem chi tiết'}
          </span>
        </button>

        {showRules && (
          <div className="mt-3.5 pt-3 border-t border-gray-200 dark:border-[#2C2C2C] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong>Cách tính điểm trường:</strong> Tổng hợp từ toàn bộ học sinh của trường qua các đề thi thử, bài tập về nhà và thử thách 10 câu mỗi ngày.
              </p>
              <p>
                <strong>Chống gian lận:</strong> Điểm số được hệ thống máy chủ tự động xác nhận sau khi nộp bài.
              </p>
            </div>
            <div className="space-y-1.5 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong>Bảo mật:</strong> Chỉ công khai tên trường, số lượng học sinh và tổng điểm chung. Dữ liệu tài khoản cá nhân, mật khẩu, email được bảo vệ tuyệt đối.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
