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
    await new Promise((r) => setTimeout(r, 600));

    const existingUser = storageService.getUserProfile();
    let displayName = existingUser.displayName;
    let schoolName = existingUser.schoolName || 'THPT chuyên Lê Khiết';

    if (roleToUse === 'teacher') {
      displayName = 'Thầy Nguyễn Trọng Bình';
      schoolName = 'THPT chuyên Lê Khiết';
    } else if (roleToUse === 'admin') {
      displayName = 'Quản trị viên TinPath';
      schoolName = 'Sở GD&ĐT Quảng Ngãi';
    } else if (!displayName || displayName === 'Học sinh') {
      displayName = 'Nguyễn Văn An';
      schoolName = 'THPT chuyên Lê Khiết';
    }

    const loginUser: UserProfile = {
      ...existingUser,
      role: roleToUse as UserRole,
      email: emailToUse || (roleToUse === 'teacher' ? 'giaovien@tinpath.edu.vn' : roleToUse === 'admin' ? 'admin@tinpath.edu.vn' : 'hocsinh@tinpath.edu.vn'),
      displayName,
      schoolName,
      onboardingCompleted: true,
    };
    storageService.saveUserProfile(loginUser);
    setIsLoading(false);
    setStep('success');
    setTimeout(() => { onLoginSuccess(loginUser); onClose(); }, 1200);
  };

  const buildUserProfile = (): UserProfile => {
    const existing = storageService.getUserProfile();
    return {
      ...existing,
      id: `user_${Date.now()}`,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out' }}>
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* ── ROLE SELECT ── */}
        {step === 'role_select' && (
          <div className="p-7">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chào mừng đến TinPath!</h2>
              <p className="text-sm text-gray-500 mt-1">Bạn tham gia với tư cách nào?</p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => { setForm((f) => ({ ...f, role: 'student' })); setStep('register'); }}
                className="group flex items-center gap-4 p-5 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0">
                  <GraduationCap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-base">Học sinh THPT</div>
                  <div className="text-xs text-gray-500 mt-0.5">Ôn thi tốt nghiệp, luyện đề, theo dõi tiến độ học tập</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </button>

              <button
                onClick={() => { setForm((f) => ({ ...f, role: 'teacher' })); setStep('register'); }}
                className="group flex items-center gap-4 p-5 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-600 flex items-center justify-center transition-colors shrink-0">
                  <BookOpen className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-base">Giáo viên</div>
                  <div className="text-xs text-gray-500 mt-0.5">Quản lý lớp học, giao bài tập, phân tích phổ điểm</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500">Đã có tài khoản? </span>
              <button onClick={() => { setStep('login'); setMode('login'); }} className="text-sm text-blue-600 font-semibold hover:underline">
                Đăng nhập ngay
              </button>
            </div>
          </div>
        )}

        {/* ── REGISTER FORM ── */}
        {step === 'register' && (
          <div className="p-7">
            <button onClick={() => setStep('role_select')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Quay lại
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${form.role === 'teacher' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                {form.role === 'teacher' ? <BookOpen className="w-5 h-5 text-emerald-600" /> : <GraduationCap className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Đăng ký — {form.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</h2>
                <p className="text-xs text-gray-500">Điền đầy đủ thông tin để tạo tài khoản</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[58vh] overflow-y-auto pr-0.5">
              {/* Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Họ <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Nguyễn" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Tên <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Văn An" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="ten@email.com" value={form.email} onChange={(e) => setField('email', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                <p className="text-[11px] text-gray-400 mt-0.5">Mã OTP xác thực sẽ được gửi đến email này</p>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Mật khẩu <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" value={form.password} onChange={(e) => setField('password', e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword}</p>}
              </div>

              {/* School */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {form.role === 'teacher' ? 'Đơn vị công tác (Trường)' : 'Trường THPT đang học'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Tìm trường THPT Quảng Ngãi..."
                    value={form.school || schoolQuery}
                    onChange={(e) => { setSchoolQuery(e.target.value); setField('school', ''); setShowSchoolDropdown(true); }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.school ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`}
                  />
                </div>
                {errors.school && <p className="text-xs text-red-500 mt-0.5">{errors.school}</p>}
                {showSchoolDropdown && filteredSchools.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-44 overflow-y-auto">
                    {filteredSchools.map((school) => (
                      <button key={school} type="button"
                        onClick={() => { setField('school', school); setSchoolQuery(''); setShowSchoolDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        {school}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grade (student only) */}
              {form.role === 'student' && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">Lớp đang học <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['10', '11', '12'] as const).map((g) => (
                      <button key={g} type="button" onClick={() => setField('grade', g)}
                        className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${form.grade === g ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                        Lớp {g}
                      </button>
                    ))}
                  </div>
                  {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade}</p>}
                </div>
              )}
            </div>

            <button onClick={handleSendOTP} disabled={isLoading}
              className={`w-full mt-5 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-white ${form.role === 'teacher' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {isLoading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP xác thực email'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Đã có tài khoản?{' '}
              <button onClick={() => { setStep('login'); setMode('login'); }} className="text-blue-600 font-semibold hover:underline">Đăng nhập</button>
            </p>
          </div>
        )}

        {/* ── OTP VERIFICATION ── */}
        {step === 'otp' && (
          <div className="p-7">
            <button onClick={() => setStep('register')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Quay lại
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4">
                <KeyRound className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Xác thực email</h2>
              <p className="text-sm text-gray-500 mt-1">Mã OTP đã được gửi đến</p>
              <p className="text-sm font-bold text-blue-600">{form.email}</p>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-600 mb-2 block text-center">Nhập mã OTP 6 chữ số</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text" maxLength={6} placeholder="• • • • • •"
                  value={form.otp} onChange={(e) => setField('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full pl-10 pr-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border-2 ${errors.otp ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`}
                />
              </div>
              {errors.otp && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />{errors.otp}
                </div>
              )}
            </div>

            {/* Demo OTP hint */}
            {mockOTP && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-700">Chế độ demo — Mã OTP thử nghiệm:</p>
                  <p className="text-xl font-mono font-bold text-amber-800 tracking-[0.3em] mt-0.5">{mockOTP}</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Trong production, mã thực sẽ được gửi về email</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-5 text-xs text-gray-500">
              <span>
                {otpTimer > 0
                  ? `Mã hết hạn sau: ${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, '0')}`
                  : 'Mã OTP đã hết hạn'}
              </span>
              <button onClick={handleResendOTP} disabled={otpTimer > 0 || isLoading}
                className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline">
                {isLoading ? 'Đang gửi...' : 'Gửi lại mã'}
              </button>
            </div>

            <button onClick={handleVerifyOTP} disabled={isLoading || form.otp.length !== 6}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isLoading ? 'Đang xác thực...' : 'Xác nhận & Tạo tài khoản'}
            </button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <div className="p-7">
            <button onClick={() => setStep('role_select')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Quay lại
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Đăng nhập TinPath</h2>
              <p className="text-sm text-gray-500 mt-1">Nhập thông tin tài khoản của bạn</p>
            </div>

            {/* Quick Demo Accounts */}
            <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl mb-4 text-left">
              <div className="text-[11px] font-bold text-blue-900 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">⚡ <span>Tài khoản trải nghiệm mẫu:</span></span>
                <span className="text-[10px] text-blue-600 font-normal">Bấm để điền nhanh</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, role: 'student', email: 'hocsinh@tinpath.edu.vn', password: 'password123' }));
                    setErrors({});
                  }}
                  className="flex items-center justify-between text-left px-2.5 py-1.5 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-lg text-xs transition-colors cursor-pointer group"
                >
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    🎓 <span>Học sinh:</span>
                    <span className="font-mono text-blue-600 group-hover:underline">hocsinh@tinpath.edu.vn</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">12345678</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, role: 'teacher', email: 'giaovien@tinpath.edu.vn', password: 'password123' }));
                    setErrors({});
                  }}
                  className="flex items-center justify-between text-left px-2.5 py-1.5 bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg text-xs transition-colors cursor-pointer group"
                >
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    👨‍🏫 <span>Giáo viên:</span>
                    <span className="font-mono text-emerald-600 group-hover:underline">giaovien@tinpath.edu.vn</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">12345678</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, role: 'admin', email: 'admin@tinpath.edu.vn', password: 'password123' }));
                    setErrors({});
                  }}
                  className="flex items-center justify-between text-left px-2.5 py-1.5 bg-white hover:bg-purple-100/60 border border-purple-200 rounded-lg text-xs transition-colors cursor-pointer group"
                >
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    🛡️ <span>Quản trị:</span>
                    <span className="font-mono text-purple-600 group-hover:underline">admin@tinpath.edu.vn</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">12345678</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Đăng nhập với tư cách</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { id: 'student', label: 'Học sinh', icon: GraduationCap, activeClass: 'border-blue-500 bg-blue-50 text-blue-700' },
                  { id: 'teacher', label: 'Giáo viên', icon: BookOpen, activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                  { id: 'admin', label: 'Quản trị', icon: Shield, activeClass: 'border-purple-500 bg-purple-50 text-purple-700' },
                ] as const).map(({ id, label, icon: Icon, activeClass }) => (
                  <button key={id} type="button" onClick={() => setForm((f) => ({ ...f, role: id as UserRole }))}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border-2 text-xs font-semibold transition-all ${
                      form.role === id ? activeClass : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="ten@email.com" value={form.email} onChange={(e) => setField('email', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => setField('password', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'} outline-none transition-colors`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button onClick={() => handleLogin()} disabled={isLoading || !form.role}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 mb-3">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Chưa có tài khoản?{' '}
              <button onClick={() => { setStep('role_select'); setMode('register'); }} className="text-blue-600 font-semibold hover:underline">Đăng ký ngay</button>
            </p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {mode === 'register' ? 'Tạo tài khoản thành công!' : 'Đăng nhập thành công!'}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              Xin chào, <span className="font-semibold text-gray-700">{form.firstName} {form.lastName || ''}</span>!
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Đang chuyển đến giao diện {form.role === 'teacher' ? 'giáo viên' : 'học sinh'}...
            </p>
            <div className="mt-5 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
