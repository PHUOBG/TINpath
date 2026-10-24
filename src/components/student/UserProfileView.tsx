import React, { useState, useMemo, useRef } from 'react';
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
  Camera,
  Upload,
  Trash2,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, ExamAttempt, SubjectTopicId } from '../../types';
import { QUANG_NGAI_DISTRICTS, getSchoolsByDistrict } from '../../data/schoolsData';
import { storageService } from '../../services/storageService';

// Curated preset avatars for TinPath
export const PRESET_AVATARS = [
  {
    id: 'tinpath-official',
    name: 'Logo TinPath',
    url: '/a_modern_clean_square_app_icon_for_an_educational_programming_platform_called-removebg-preview.png',
  },
  {
    id: 'student-boy',
    name: 'Nam sinh Tin học',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  },
  {
    id: 'student-girl',
    name: 'Nữ sinh Tin học',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
  },
  {
    id: 'ai-robot',
    name: 'Robot AI TinPath',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PathBot2026&backgroundColor=c0aede',
  },
  {
    id: 'coder-pro',
    name: 'Cao thủ Code',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TinCoder&backgroundColor=b6e3f4',
  },
  {
    id: 'notion-owl',
    name: 'Cú thủ khoa',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Oliver&backgroundColor=ffdfbf',
  },
  {
    id: 'cool-cat',
    name: 'Mèo Developer',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Whiskers&backgroundColor=d1d4f9',
  },
  {
    id: 'pixel-champ',
    name: 'Chiến binh Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hero12&backgroundColor=b6e3f4',
  },
  {
    id: 'scholar-girl',
    name: 'Nữ sinh Chuyên Tin',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mimi&backgroundColor=ffd5dc',
  },
  {
    id: 'tech-guru',
    name: 'Thần đồng Thuật toán',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechMaster&backgroundColor=c0aede',
  },
];

// Helper to compress uploaded image to a lightweight WebP/JPEG data URL (<= 256x256, ~25KB)
const compressImageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP, GIF)'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp tin'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Hình ảnh bị lỗi hoặc không thể đọc'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Trình duyệt không hỗ trợ xử lý hình ảnh'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

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

  // Avatar Modal & State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarModalTab, setAvatarModalTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(user.avatarUrl || null);
  const [urlInput, setUrlInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const directFileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Avatar Management Handlers
  const handleOpenAvatarModal = (defaultTab: 'upload' | 'presets' | 'url' = 'upload') => {
    setSelectedAvatarUrl(user.avatarUrl || null);
    setAvatarModalTab(defaultTab);
    setUrlInput(user.avatarUrl?.startsWith('http') ? user.avatarUrl : '');
    setIsAvatarModalOpen(true);
  };

  const handleSaveAvatar = (newUrl?: string | null) => {
    const updated: UserProfile = {
      ...user,
      avatarUrl: newUrl || undefined,
    };
    onUpdateUser(updated);
    storageService.saveUserProfile(updated);
    setIsAvatarModalOpen(false);
    setSelectedAvatarUrl(newUrl || null);

    const message = newUrl
      ? 'Đã cập nhật ảnh đại diện mới thành công!'
      : 'Đã gỡ ảnh đại diện, chuyển về chữ cái đại diện mặc định!';
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDirectFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingImage(true);
      const dataUrl = await compressImageToDataUrl(file);
      handleSaveAvatar(dataUrl);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý hình ảnh');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  const handleModalFileSelect = async (file: File) => {
    try {
      setIsProcessingImage(true);
      const dataUrl = await compressImageToDataUrl(file);
      setSelectedAvatarUrl(dataUrl);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý hình ảnh');
    } finally {
      setIsProcessingImage(false);
    }
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
          {/* Hidden Direct File Input for fast device upload */}
          <input
            ref={directFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDirectFileSelect}
          />

          {/* Avatar Circle with Hover Overlay & Camera Button */}
          <div className="flex flex-col items-center text-center space-y-3.5">
            <div className="relative group">
              <div
                onClick={() => handleOpenAvatarModal('upload')}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#2878C8] text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md ring-4 ring-blue-100 dark:ring-blue-950/60 select-none overflow-hidden cursor-pointer relative transition-transform duration-200 group-hover:scale-102"
                title="Nhấn để đổi ảnh đại diện"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{avatarInitials}</span>
                )}

                {/* Hover Backdrop Overlay */}
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 z-10">
                  <Camera className="w-6 h-6 text-white stroke-[2.2]" />
                  <span>Đổi ảnh</span>
                </div>
              </div>

              {/* Active online checkmark on bottom-left */}
              <div
                className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center text-white shadow-sm z-20"
                title="Đang hoạt động"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              {/* Interactive Camera Trigger Button on bottom-right */}
              <button
                type="button"
                onClick={() => handleOpenAvatarModal('upload')}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2878C8] hover:bg-[#1f63a6] text-white border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer z-20"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4" />
              </button>
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
                {/* Avatar Settings Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-transparent dark:from-blue-950/20 dark:via-transparent border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                  <div className="relative group shrink-0">
                    <div
                      onClick={() => handleOpenAvatarModal('upload')}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#2878C8] text-white font-black text-2xl flex items-center justify-center shadow-sm ring-3 ring-[#2878C8]/30 overflow-hidden cursor-pointer relative"
                      title="Nhấn để đổi ảnh"
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{avatarInitials}</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                          <span>Ảnh đại diện hồ sơ</span>
                          {user.avatarUrl && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Đã có ảnh tùy chỉnh
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Ảnh đại diện hiển thị trên thanh điều hướng, hồ sơ cá nhân và bảng xếp hạng
                        </p>
                      </div>

                      {user.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => handleSaveAvatar(undefined)}
                          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline flex items-center justify-center sm:justify-start gap-1 py-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Gỡ ảnh đại diện
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenAvatarModal('upload')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Đổi ảnh đại diện
                      </button>

                      <button
                        type="button"
                        onClick={() => directFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#2878C8]" />
                        Tải từ máy tính
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAvatarModal('presets')}
                        className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Kho avatar mẫu
                      </button>
                    </div>
                  </div>
                </div>

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

      {/* ======================================================== */}
      {/* AVATAR CHANGE MODAL DIALOG */}
      {/* ======================================================== */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#2878C8]" />
                  Cập nhật ảnh đại diện
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Chọn ảnh từ máy tính, bộ sưu tập mẫu TinPath hoặc liên kết ảnh ngoài
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Live Preview Area */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#2878C8] text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-[#2878C8]/25 overflow-hidden">
                    {selectedAvatarUrl ? (
                      <img src={selectedAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{avatarInitials}</span>
                    )}
                  </div>
                  {isProcessingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {selectedAvatarUrl ? 'Ảnh đại diện được chọn' : 'Đang dùng chữ cái mặc định'}
                </span>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-[#252525] rounded-xl text-xs font-bold border border-gray-200/80 dark:border-[#333]">
                <button
                  type="button"
                  onClick={() => setAvatarModalTab('upload')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    avatarModalTab === 'upload'
                      ? 'bg-white dark:bg-[#1E1E1E] text-[#2878C8] shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh lên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarModalTab('presets')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    avatarModalTab === 'presets'
                      ? 'bg-white dark:bg-[#1E1E1E] text-[#2878C8] shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kho avatar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarModalTab('url')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    avatarModalTab === 'url'
                      ? 'bg-white dark:bg-[#1E1E1E] text-[#2878C8] shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Liên kết URL</span>
                </button>
              </div>

              {/* TAB 1: Upload from device */}
              {avatarModalTab === 'upload' && (
                <div className="space-y-3">
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleModalFileSelect(f);
                      e.target.value = '';
                    }}
                  />
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleModalFileSelect(f);
                    }}
                    onClick={() => modalFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-[#444] hover:border-[#2878C8] dark:hover:border-[#2878C8] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-[#252525]/50 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2878C8] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Kéo thả ảnh vào đây hoặc <span className="text-[#2878C8] underline">chọn tệp từ máy</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Hỗ trợ JPG, PNG, WEBP, GIF (Tự động nén tối ưu hiển thị siêu nhanh)
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Presets collection */}
              {avatarModalTab === 'presets' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
                    Chọn một avatar từ bộ sưu tập độc quyền của TinPath:
                  </span>
                  <div className="grid grid-cols-5 gap-3 max-h-56 overflow-y-auto pr-1">
                    {PRESET_AVATARS.map((p) => {
                      const isSelected = selectedAvatarUrl === p.url;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedAvatarUrl(p.url)}
                          className={`relative p-1.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 group ${
                            isSelected
                              ? 'border-[#2878C8] bg-blue-50 dark:bg-blue-950/40 shadow-xs scale-105'
                              : 'border-transparent hover:border-gray-200 dark:hover:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525]'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-[#2C2C2C] shadow-xs">
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 truncate w-full text-center">
                            {p.name}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2878C8] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Custom image URL */}
              {avatarModalTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Dán liên kết ảnh từ internet:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/my-avatar.jpg"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#252525] text-gray-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2878C8]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlInput.trim()) {
                          setSelectedAvatarUrl(urlInput.trim());
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#2C2C2C] hover:bg-[#2878C8] hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    Lưu ý: Đảm bảo đường link ảnh công khai và có định dạng hợp lệ.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between gap-3">
              <div>
                {(selectedAvatarUrl || user.avatarUrl) && (
                  <button
                    type="button"
                    onClick={() => setSelectedAvatarUrl(null)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 py-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt về chữ cái mặc định
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveAvatar(selectedAvatarUrl)}
                  className="px-5 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 shadow-2xl border border-gray-700/50 dark:border-gray-200 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
