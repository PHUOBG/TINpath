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
      },
      ...baseStudents.slice(4).map((s, idx) => ({ ...s, rank: idx + 6 })),
    ];
  }, [currentUser, baseStudents]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 dark:border-[#333] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Bảng xếp hạng & Thi đua học tập
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Phong trào thi đua học tập và ôn thi tốt nghiệp THPT môn Tin học tỉnh Quảng Ngãi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Switch Tab buttons */}
          <div className="inline-flex rounded-md p-1 bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#383838]">
            <button
              onClick={() => {
                setActiveTab('organizations');
                setSearchQuery('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === 'organizations'
                  ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Tổ chức (Trường học)
            </button>
            <button
              onClick={() => {
                setActiveTab('individual');
                setSearchQuery('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === 'individual'
                  ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Cá nhân học sinh
            </button>
          </div>

          {/* Close button if in modal mode */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-[#3A3A3A] text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
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
        <div className="space-y-4">
          {/* Highlight card for User's School */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white font-mono">
                    HẠNG #{userSchool.rank} TOÀN TỈNH
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Trường của bạn
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {userSchool.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Địa bàn: {userSchool.district} · Tỉnh Quảng Ngãi
                </p>
              </div>

              {/* School Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-500/20 text-center sm:text-right">
                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                    Số học sinh
                  </span>
                  <span className="text-base font-bold font-mono text-gray-900 dark:text-white tabular-nums">
                    {userSchool.studentCount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                    Tổng số điểm
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {userSchool.totalPoints.toLocaleString()} đ
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xs p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                    Điểm TB thi thử
                  </span>
                  <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                    {userSchool.avgScore.toFixed(2)} / 10
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & District Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trường THPT hoặc huyện..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* District dropdown filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 shrink-0">Huyện/Thị xã:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
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
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202020] text-white font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-16 text-center">Hạng</th>
                    <th className="py-3 px-4">Tổ chức (Trường THPT)</th>
                    <th className="py-3 px-4 text-center w-36">Số học sinh</th>
                    <th className="py-3 px-4 text-right w-36">Tổng số điểm</th>
                    <th className="py-3 px-4 text-center w-28">Điểm TB</th>
                    <th className="py-3 px-4 text-right w-32">Số bài thi</th>
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
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono font-bold text-xs ${
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
                        <td className="py-3 px-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                              ({item.district})
                            </span>
                            {item.isUserSchool && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Trường bạn
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Student Count */}
                        <td className="py-3 px-4 text-center font-mono font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                          {item.studentCount.toLocaleString()} em
                        </td>

                        {/* Total Points */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {item.totalPoints.toLocaleString()} đ
                        </td>

                        {/* Avg Score */}
                        <td className="py-3 px-4 text-center font-mono font-medium text-blue-600 dark:text-blue-400 tabular-nums">
                          {item.avgScore.toFixed(2)}
                        </td>

                        {/* Exams Taken */}
                        <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-400 tabular-nums">
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
        <div className="space-y-4">
          {/* Search student */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm username, họ tên hoặc trường..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#1A1A1A] text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Điểm được xác thực độc lập từ các bài thi thử và thử thách hàng ngày
            </p>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202020] text-white font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-16 text-center">Hạng</th>
                    <th className="py-3 px-3 w-24 text-center">Rating</th>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4 text-right w-28">Điểm</th>
                    <th className="py-3 px-4 text-right w-24">Số bài giải</th>
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
                      <td className="py-3 px-3 text-center font-mono font-medium text-gray-700 dark:text-gray-300">
                        #{st.rank}
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-red-600 dark:text-red-400 text-xs">
                          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                          {st.rating}
                        </span>
                      </td>

                      {/* Username, Name, School */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <span className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1">
                              {st.hasFlame && <span title="Chuỗi ngày liên tục">🔥</span>}
                              {st.username}
                            </span>
                            <span className="text-[11px] text-gray-600 dark:text-gray-400 block mt-0.5">
                              {st.fullName}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                            {st.schoolName}
                          </span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {st.score.toFixed(2)} đ
                      </td>

                      {/* Problems */}
                      <td className="py-3 px-4 text-right font-mono text-gray-700 dark:text-gray-300 tabular-nums">
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
      <div className="p-3 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#1E1E1E]">
        <button
          type="button"
          onClick={() => setShowRules(!showRules)}
          className="w-full flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Quy tắc thi đua điểm số & Cam kết bảo mật
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 hover:underline">
            {showRules ? 'Thu gọn' : 'Xem chi tiết'}
          </span>
        </button>

        {showRules && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-[#2C2C2C] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
              <p>
                <strong>Cách tính điểm trường:</strong> Tổng hợp từ toàn bộ học sinh của trường qua các đề thi thử, bài tập về nhà và thử thách 10 câu mỗi ngày.
              </p>
              <p>
                <strong>Chống gian lận:</strong> Điểm số được hệ thống máy chủ tự động xác nhận sau khi nộp bài.
              </p>
            </div>
            <div className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
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
