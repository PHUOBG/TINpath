import React, { useState } from 'react';
import { X, Check, School as SchoolIcon, Target, Clock, ShieldCheck, Mail } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { QUANG_NGAI_DISTRICTS, getSchoolsByDistrict, PROVINCE_NAME } from '../../data/schoolsData';
import { TinPathLogo } from '../common/TinPathLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onGoogleSignIn: () => Promise<void>;
  isSigningIn: boolean;
  isLoggedIn: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
  onGoogleSignIn,
  isSigningIn,
  isLoggedIn,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [district, setDistrict] = useState(user.district);
  const [schoolId, setSchoolId] = useState(user.schoolId);
  const [grade, setGrade] = useState(user.grade);
  const [track, setTrack] = useState(user.track);
  const [targetScore, setTargetScore] = useState(user.targetScore);
  const [dailyMinutes, setDailyMinutes] = useState(user.dailyStudyMinutes);
  const [role, setRole] = useState<UserRole>(user.role);

  if (!isOpen) return null;

  // Filter schools dynamically by selected district
  const availableSchools = getSchoolsByDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const schools = getSchoolsByDistrict(newDistrict);
    if (schools.length > 0) {
      setSchoolId(schools[0].id);
    } else {
      setSchoolId('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchool = availableSchools.find((s) => s.id === schoolId) || {
      name: user.schoolName,
    };

    onSaveProfile({
      ...user,
      displayName,
      district,
      schoolId,
      schoolName: selectedSchool.name,
      grade,
      track,
      targetScore: Number(targetScore),
      dailyStudyMinutes: Number(dailyMinutes),
      role,
      onboardingCompleted: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg max-w-lg w-full border border-gray-200 dark:border-[#333333] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#202020] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TinPathLogo
              size={36}
              textColor="text-white"
              subtextColor="text-blue-300 font-medium"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-sm text-[#202020] dark:text-[#E0E0E0]">
          {/* Google Sign-in Section */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333333]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#22A06B]" />
                  Tài khoản Google & Dịch vụ liên kết
                </p>
                <p className="text-[11px] text-gray-700 dark:text-gray-400 mt-0.5">
                  {isLoggedIn
                    ? `Đã đăng nhập: ${user.email}`
                    : 'Đăng nhập Google để đồng bộ Drive, Sheets, Docs, Calendar'}
                </p>
              </div>

              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 dark:bg-[#1A1A1A] dark:text-gray-200 border border-gray-300 dark:border-[#444] rounded text-xs font-medium hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  {isSigningIn ? 'Đang kết nối...' : 'Đăng nhập Google'}
                </button>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">
                  Đã kết nối
                </span>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold mb-1">Họ và tên hiển thị</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8]"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Province & District (Dependent selection) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Tỉnh / Thành phố</label>
              <input
                type="text"
                disabled
                value={PROVINCE_NAME}
                className="w-full px-3 py-2 rounded border border-gray-200 dark:border-[#333] bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 cursor-not-allowed text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Quận / Huyện</label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs"
              >
                {QUANG_NGAI_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School (Dynamically dependent on District) */}
          <div>
            <label className="block text-xs font-semibold mb-1">Trường THPT ({availableSchools.length} trường)</label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs"
            >
              {availableSchools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {availableSchools.find((s) => s.id === schoolId)?.address && (
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 italic">
                Địa chỉ: {availableSchools.find((s) => s.id === schoolId)?.address}
              </p>
            )}
          </div>

          {/* Grade and Track */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Khối lớp</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs"
              >
                <option value="12">Lớp 12 (Thi Tốt Nghiệp)</option>
                <option value="11">Lớp 11</option>
                <option value="10">Lớp 10</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Định hướng thi</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs font-medium"
              >
                <option value="CS">Khoa học máy tính (CS)</option>
                <option value="ICT">Tin học ứng dụng (ICT)</option>
              </select>
            </div>
          </div>

          {/* Target Score & Daily Study Minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-[#2878C8]" />
                Mục tiêu điểm thi
              </label>
              <select
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs font-bold text-[#2878C8]"
              >
                <option value="10.0">10.0 Điểm (Thủ khoa)</option>
                <option value="9.5">9.5 Điểm</option>
                <option value="9.0">9.0 Điểm</option>
                <option value="8.5">8.5 Điểm</option>
                <option value="8.0">8.0 Điểm</option>
                <option value="7.5">7.5 Điểm</option>
                <option value="7.0">7.0 Điểm</option>
                <option value="6.0">6.0 Điểm</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FFC928]" />
                Thời gian học / ngày
              </label>
              <select
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] focus:outline-none focus:border-[#2878C8] text-xs"
              >
                <option value="15">15 phút / ngày</option>
                <option value="30">30 phút / ngày</option>
                <option value="45">45 phút / ngày (Khuyên dùng)</option>
                <option value="60">60 phút / ngày</option>
                <option value="90">90 phút / ngày</option>
              </select>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold mb-1">Vai trò hệ thống</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                  role === 'student'
                    ? 'bg-[#2878C8] text-white border-[#2878C8]'
                    : 'border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300'
                }`}
              >
                Học sinh
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                  role === 'teacher'
                    ? 'bg-[#2878C8] text-white border-[#2878C8]'
                    : 'border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300'
                }`}
              >
                Giáo viên
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                  role === 'admin'
                    ? 'bg-[#2878C8] text-white border-[#2878C8]'
                    : 'border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300'
                }`}
              >
                Quản trị viên
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#333]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded text-xs font-bold text-white bg-[#2878C8] hover:bg-[#2068B0] transition-colors shadow-sm"
            >
              Lưu thiết lập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
