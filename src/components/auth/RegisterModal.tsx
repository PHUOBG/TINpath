import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User,
  Building2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../../services/supabaseAuthService';
import { isSupabaseConfigured } from '../../services/supabaseClient';

// ─── Quảng Ngãi Schools Data ───────────────────────────────────────────────
const QN_SCHOOLS = [
  'THPT Chuyên Lê Khiết',
  'THPT Trần Quốc Tuấn',
  'THPT Võ Nguyên Giáp',
  'THPT Huỳnh Thúc Kháng',
  'THPT Bình Sơn',
  'THPT Ba Gia',
  'THPT Mộ Đức 1',
  'THPT Lý Sơn',
  'THPT Sơn Tịnh',
  'THPT Tư Nghĩa 1',
  'THPT Tư Nghĩa 2',
  'THPT Nghĩa Hành',
  'THPT Minh Long',
  'THPT Ba Tơ',
  'THPT Trà Bồng',
  'THPT Sơn Hà',
  'THPT Sơn Tây',
  'THPT Đức Phổ 1',
  'THPT Đức Phổ 2',
  'THPT Mộ Đức 2',
  'THPT Đinh Tiên Hoàng',
  'THPT Bùi Thị Xuân',
  'THPT An Hải',
  'THPT Quảng Ngãi',
  'THPT Bình Minh',
  'THPT Chu Văn An',
  'THPT Nguyễn Trãi',
  'THPT Tây Trà',
  'THPT Sơn Tây 2',
  'THPT Nghĩa Hành 2',
  'THPT Đức Nhuận',
  'THPT Trà Phong',
  'THPT Tịnh Kỳ',
  'THPT Lê Quý Đôn',
];

type AuthStep = 'role_select' | 'register' | 'otp' | 'login' | 'success';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
  onSwitchToLogin?: () => void;
}

function generateMockOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

interface FormData {
  role: UserRole | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  school: string;
  grade: '10' | '11' | '12' | '';
  otp: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'register',
  onSwitchToLogin,
}) => {
  const [step, setStep] = useState<AuthStep>(initialMode === 'login' ? 'login' : 'role_select');
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  const [form, setForm] = useState<FormData>({
    role: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    grade: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mockOTP, setMockOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(initialMode === 'login' ? 'login' : 'role_select');
      setMode(initialMode);
      setForm({ role: null, firstName: '', lastName: '', email: '', password: '', confirmPassword: '', school: '', grade: '', otp: '' });
      setErrors({});
      setMockOTP('');
      setOtpTimer(0);
      setSchoolQuery('');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer((t) => {
          if (t <= 1) { clearInterval(timerRef.current!); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [otpTimer]);

  const filteredSchools = QN_SCHOOLS.filter((s) =>
    s.toLowerCase().includes(schoolQuery.toLowerCase())
  );

  const setField = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateRegister = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Vui lòng nhập họ';
    if (!form.lastName.trim()) errs.lastName = 'Vui lòng nhập tên';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email không hợp lệ';
    if (form.password.length < 8) errs.password = 'Mật khẩu tối thiểu 8 ký tự';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    if (!form.school) errs.school = 'Vui lòng chọn trường';
    if (form.role === 'student' && !form.grade) errs.grade = 'Vui lòng chọn lớp';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLogin = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email không hợp lệ';
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateRegister()) return;
    setIsLoading(true);

    // Nếu Supabase đã cấu hình → đăng ký thật, không cần OTP mock
    if (isSupabaseConfigured()) {
      const displayName = `${form.firstName} ${form.lastName}`.trim();
      const { user: authUser, error } = await signUpWithEmail({
        email: form.email,
        password: form.password,
        displayName,
        role: form.role as 'student' | 'teacher',
      });

      if (error || !authUser) {
        setErrors({ email: error || 'Đăng ký thất bại. Vui lòng thử lại.' });
        setIsLoading(false);
        return;
      }

      // Tạo profile local và báo thành công
      const newUser = buildUserProfile(authUser.id);
      storageService.saveUserProfile(newUser);
      setIsLoading(false);
      setStep('success');
      setTimeout(() => { onLoginSuccess(newUser); onClose(); }, 1800);
      return;
    }

    // Fallback: Mock OTP khi chưa có Supabase
    await new Promise((r) => setTimeout(r, 1200));
    const otp = generateMockOTP();
    setMockOTP(otp);
    setOtpTimer(120);
    setIsLoading(false);
    setStep('otp');
  };

  const handleVerifyOTP = async () => {
    if (form.otp.length !== 6) { setErrors({ otp: 'Mã OTP gồm 6 chữ số' }); return; }
    if (form.otp !== mockOTP) { setErrors({ otp: 'Mã OTP không đúng. Thử lại hoặc gửi lại mã.' }); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newUser = buildUserProfile();
    storageService.saveUserProfile(newUser);
    setIsLoading(false);
    setStep('success');
    setTimeout(() => { onLoginSuccess(newUser); onClose(); }, 1800);
  };

  const handleLogin = async (customRole?: UserRole, customEmail?: string) => {
    const roleToUse = customRole || form.role;
    const emailToUse = customEmail || form.email;

    if (!customRole && !validateLogin()) return;
    setIsLoading(true);

    // Supabase Auth thật
    if (isSupabaseConfigured() && !customRole) {
      const { user: authUser, error } = await signInWithEmail(
        emailToUse || form.email,
        form.password
      );

      if (error || !authUser) {
        setErrors({ password: error || 'Email hoặc mật khẩu không đúng.' });
        setIsLoading(false);
        return;
      }

      const existingUser = storageService.getUserProfile();
      const loginUser: UserProfile = {
        ...existingUser,
        id: authUser.id,
        email: authUser.email,
        displayName: authUser.displayName || existingUser.displayName,
        avatarUrl: authUser.avatarUrl,
        onboardingCompleted: true,
      };
      storageService.saveUserProfile(loginUser);
      setIsLoading(false);
      setStep('success');
      setTimeout(() => { onLoginSuccess(loginUser); onClose(); }, 1200);
      return;
    }

    // Fallback mock login (demo / dev mode)
    await new Promise((r) => setTimeout(r, 600));

    const isDemo =
      emailToUse?.toLowerCase() === 'hocsinh@tinpath.edu.vn' ||
      emailToUse?.toLowerCase() === 'giaovien@tinpath.edu.vn';

    if (isDemo && !customRole) {
      if (form.password !== 'password123' && form.password !== '12345678') {
        setErrors({ password: 'Mật khẩu không đúng cho tài khoản trải nghiệm (password123)' });
        setIsLoading(false);
        return;
      }
    } else if (!isDemo && !customRole) {
      const saved = storageService.getUserProfile();
      if (!saved.email || saved.email.toLowerCase() !== emailToUse?.toLowerCase()) {
        setErrors({ password: 'Tài khoản không tồn tại trên hệ thống. Vui lòng đăng ký mới.' });
        setIsLoading(false);
        return;
      }
    }

    const existingUser = storageService.getUserProfile();
    let displayName = existingUser.displayName;
    let schoolName = existingUser.schoolName || 'THPT Chuyên Lê Khiết';

    if (roleToUse === 'teacher') {
      displayName = 'Thầy Nguyễn Trọng Bình';
      schoolName = 'THPT Chuyên Lê Khiết';
    } else if (!displayName || displayName === 'Học sinh') {
      displayName = 'Nguyễn Văn An';
      schoolName = 'THPT Chuyên Lê Khiết';
    }

    const loginUser: UserProfile = {
      ...existingUser,
      role: roleToUse as UserRole,
      email: emailToUse || (roleToUse === 'teacher' ? 'giaovien@tinpath.edu.vn' : 'hocsinh@tinpath.edu.vn'),
      displayName,
      schoolName,
      onboardingCompleted: true,
    };
    storageService.saveUserProfile(loginUser);
    setIsLoading(false);
    setStep('success');
    setTimeout(() => { onLoginSuccess(loginUser); onClose(); }, 1200);
  };

  const buildUserProfile = (authId?: string): UserProfile => {
    const existing = storageService.getUserProfile();
    return {
      ...existing,
      id: authId || `user_${Date.now()}`,
      email: form.email,
      displayName: `${form.firstName} ${form.lastName}`.trim(),
      role: form.role as UserRole,
      schoolName: form.school,
      grade: (form.grade as '10' | '11' | '12') || '12',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const otp = generateMockOTP();
    setMockOTP(otp);
    setOtpTimer(120);
    setErrors({});
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      {/* ── Ambient Glow Background behind modal ── */}
      <div
        className={`absolute w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse ${
          form.role === 'teacher' ? 'bg-emerald-500/15' : 'bg-blue-500/15'
        }`}
        style={{ animationDuration: '8s' }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[480px] my-auto">
        {/* Ambient Halo Ring behind Card */}
        <div
          className={`absolute -inset-1.5 rounded-[34px] blur-xl opacity-75 -z-10 transition-all ${
            form.role === 'teacher'
              ? 'bg-gradient-to-r from-emerald-500/25 via-teal-400/25 to-blue-500/25'
              : 'bg-gradient-to-r from-blue-500/25 via-sky-400/25 to-indigo-500/25'
          }`}
        />

        {/* Modal Card chính */}
        <div className="w-full bg-white/98 dark:bg-[#1E1E1E]/98 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(29,123,242,0.15),0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-white/80 dark:border-white/10 overflow-hidden transition-all relative">
          {/* Close button (ở mọi bước) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ── BƯỚC 1: ROLE SELECT (CHỌN VAI TRÒ) ── */}
          {step === 'role_select' && (
            <div className="p-7 sm:p-9">
              {/* Header thương hiệu */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/images/logo/tinpath_logo.png"
                  alt="TinPath"
                  className="w-10 h-10 object-contain drop-shadow-sm"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xl font-bold text-[#1D7BF2] leading-none">
                    TinPath
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-none mt-1">
                    Giáo dục Quảng Ngãi
                  </span>
                </div>
              </div>

              <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Đăng ký tài khoản
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chọn tư cách bạn muốn tham gia nền tảng luyện thi
                </p>
              </div>

              {/* 2 Lựa chọn vai trò */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, role: 'student' }));
                    setStep('register');
                  }}
                  className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-base">
                      Học sinh THPT
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Ôn thi tốt nghiệp 2026, luyện đề, thi thử theo chuẩn GDPT 2018
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, role: 'teacher' }));
                    setStep('register');
                  }}
                  className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-600 flex items-center justify-center transition-colors shrink-0">
                    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-base">
                      Giáo viên
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Quản lý lớp học, giao đề thi, phân tích phổ điểm & kết quả
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>

              {/* Chuyển sang đăng nhập */}
              <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToLogin) {
                      onSwitchToLogin();
                    } else {
                      setStep('login');
                      setMode('login');
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          )}

          {/* ── BƯỚC 2: FORM ĐĂNG KÝ (HỌC SINH / GIÁO VIÊN) ── */}
          {step === 'register' && (
            <div className="p-7 sm:p-9">
              {/* Nút quay lại */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setStep('role_select')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors py-1.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer -ml-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              {/* Header tiêu đề bước đăng ký */}
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    form.role === 'teacher'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600'
                      : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600'
                  }`}
                >
                  {form.role === 'teacher' ? (
                    <BookOpen className="w-6 h-6" />
                  ) : (
                    <GraduationCap className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    Đăng ký — {form.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Điền đầy đủ thông tin để tạo tài khoản
                  </p>
                </div>
              </div>

              {/* Cuộn form điền thông tin */}
              <div className="flex flex-col gap-3.5 max-h-[58vh] overflow-y-auto pr-1">
                {/* Họ & Tên */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nguyễn"
                        value={form.firstName}
                        onChange={(e) => setField('firstName', e.target.value)}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.firstName
                            ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                            : form.role === 'teacher'
                            ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Văn An"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.lastName
                          ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                          : form.role === 'teacher'
                          ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="ten@email.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                          : form.role === 'teacher'
                          ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  {errors.email ? (
                    <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                  ) : (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      Mã OTP xác thực sẽ được gửi đến email này
                    </p>
                  )}
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      value={form.password}
                      onChange={(e) => setField('password', e.target.value)}
                      className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                          : form.role === 'teacher'
                          ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={(e) => setField('confirmPassword', e.target.value)}
                      className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword
                          ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                          : form.role === 'teacher'
                          ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Trường học */}
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    {form.role === 'teacher' ? 'Đơn vị công tác (Trường)' : 'Trường THPT đang học'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 z-10" />
                    <input
                      type="text"
                      placeholder="Tìm trường THPT Quảng Ngãi..."
                      value={form.school || schoolQuery}
                      onChange={(e) => {
                        setSchoolQuery(e.target.value);
                        setField('school', '');
                        setShowSchoolDropdown(true);
                      }}
                      onFocus={() => setShowSchoolDropdown(true)}
                      className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.school
                          ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                          : form.role === 'teacher'
                          ? 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  {errors.school && <p className="text-[11px] text-red-500 mt-1">{errors.school}</p>}

                  {/* Dropdown danh sách trường */}
                  {showSchoolDropdown && filteredSchools.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#222222] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto p-1">
                      {filteredSchools.map((school) => (
                        <button
                          key={school}
                          type="button"
                          onClick={() => {
                            setField('school', school);
                            setSchoolQuery('');
                            setShowSchoolDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {school}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lớp đang học (Chỉ dành cho Học sinh) */}
                {form.role === 'student' && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Lớp đang học <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['10', '11', '12'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setField('grade', g)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                            form.grade === g
                              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e2e]'
                          }`}
                        >
                          Lớp {g}
                        </button>
                      ))}
                    </div>
                    {errors.grade && <p className="text-[11px] text-red-500 mt-1">{errors.grade}</p>}
                  </div>
                )}
              </div>

              {/* Nút gửi OTP */}
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className={`w-full mt-5 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-white cursor-pointer shadow-md ${
                  form.role === 'teacher'
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/25'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP xác thực email'}</span>
              </button>

              {/* Chuyển sang đăng nhập */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToLogin) {
                      onSwitchToLogin();
                    } else {
                      setStep('login');
                      setMode('login');
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          )}

          {/* ── BƯỚC 3: XÁC THỰC MÃ OTP ── */}
          {step === 'otp' && (
            <div className="p-7 sm:p-9">
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors py-1.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer -ml-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 mb-3.5">
                  <KeyRound className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Xác thực email
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mã OTP đã được gửi đến
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {form.email}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block text-center">
                  Nhập mã OTP 6 chữ số
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={form.otp}
                    onChange={(e) =>
                      setField('otp', e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    className={`w-full py-3.5 text-center text-2xl font-bold tabular-nums tracking-[0.5em] rounded-2xl border-2 bg-white dark:bg-[#141414] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.otp
                        ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {errors.otp && (
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-red-500 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.otp}</span>
                  </div>
                )}
              </div>

              {/* Gợi ý mã demo */}
              {mockOTP && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mb-5 flex items-start gap-2.5 text-left">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Mã OTP thử nghiệm (Demo):
                    </p>
                    <p className="text-xl font-bold text-amber-900 dark:text-amber-300 tracking-[0.3em] tabular-nums mt-0.5">
                      {mockOTP}
                    </p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                      Hệ thống tự động kích hoạt mã xác nhận thử nghiệm
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-5 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {otpTimer > 0
                    ? `Mã hết hạn sau: ${Math.floor(otpTimer / 60)}:${String(
                        otpTimer % 60
                      ).padStart(2, '0')}`
                    : 'Mã OTP đã hết hạn'}
                </span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpTimer > 0 || isLoading}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi lại mã'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || form.otp.length !== 6}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-md shadow-blue-500/25 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Đang xác thực...' : 'Xác nhận & Tạo tài khoản'}</span>
              </button>
            </div>
          )}

          {/* ── BƯỚC 4: LOGIN MODAL VIEW (ĐỒNG BỘ VỚI LOGIN PAGE) ── */}
          {step === 'login' && (
            <div className="p-7 sm:p-9">
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setStep('role_select')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors py-1.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer -ml-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              {/* Header Logo */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <img
                  src="/images/logo/tinpath_logo.png"
                  alt="TinPath"
                  className="w-10 h-10 object-contain drop-shadow-sm"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xl font-bold text-[#1D7BF2] leading-none">
                    TinPath
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-none mt-1">
                    Giáo dục Quảng Ngãi
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mt-2">
                Đăng nhập TinPath
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Hệ thống luyện thi Tin học & Chuyên Tin Quảng Ngãi
              </p>

              {/* Segmented Switcher Role */}
              <div className="mt-5 mb-4">
                <label className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase block mb-1.5">
                  ĐĂNG NHẬP VỚI TƯ CÁCH
                </label>
                <div className="bg-[#f1f5f9] dark:bg-[#2A2A2A] p-1 rounded-2xl grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        role: 'student',
                        email: 'hocsinh@tinpath.edu.vn',
                        password: 'password123',
                      }));
                      setErrors({});
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      form.role === 'student'
                        ? 'bg-white dark:bg-[#1E1E1E] text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        role: 'teacher',
                        email: 'giaovien@tinpath.edu.vn',
                        password: 'password123',
                      }));
                      setErrors({});
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      form.role === 'teacher'
                        ? 'bg-white dark:bg-[#1E1E1E] text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Giáo viên</span>
                  </button>
                </div>
              </div>

              {/* Form inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Email hoặc Tên đăng nhập
                  </label>
                  <input
                    type="email"
                    placeholder="ten@email.com"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setField('password', e.target.value)}
                      className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border bg-white dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleLogin()}
                  disabled={isLoading || !form.role}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setStep('role_select');
                    setMode('register');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}

          {/* ── BƯỚC 5: THÀNH CÔNG (SUCCESS) ── */}
          {step === 'success' && (
            <div className="p-9 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 mb-5 text-green-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                {mode === 'register' ? 'Tạo tài khoản thành công!' : 'Đăng nhập thành công!'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Xin chào, <span className="font-bold text-blue-600 dark:text-blue-400">{form.firstName} {form.lastName || ''}</span>!
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Đang chuyển đến giao diện {form.role === 'teacher' ? 'giáo viên' : 'học sinh'}...
              </p>
              <div className="mt-6 flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
