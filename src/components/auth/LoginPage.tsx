import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, BookOpen, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { signInWithEmail } from '../../services/supabaseAuthService';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState<string>('hocsinh@tinpath.edu.vn');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Switch role tab and prefill demo credentials
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError(null);
    if (newRole === 'student') {
      setEmail('hocsinh@tinpath.edu.vn');
    } else {
      setEmail('giaovien@tinpath.edu.vn');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Vui lòng nhập Email hoặc Tên đăng nhập');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập Mật khẩu');
      return;
    }

    // 1. Kiểm tra tài khoản mẫu / trải nghiệm (Demo Accounts)
    const isDemoStudent = cleanEmail.toLowerCase() === 'hocsinh@tinpath.edu.vn';
    const isDemoTeacher = cleanEmail.toLowerCase() === 'giaovien@tinpath.edu.vn';

    if (isDemoStudent || isDemoTeacher) {
      // Chỉ cho phép mật khẩu đúng của tài khoản trải nghiệm
      if (password !== 'password123' && password !== '12345678') {
        setError('Mật khẩu không đúng cho tài khoản trải nghiệm này (Gợi ý: password123)');
        return;
      }

      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 450));
      const existingUser = storageService.getUserProfile();
      const loginRole: UserRole = isDemoTeacher ? 'teacher' : 'student';
      const loginUser: UserProfile = {
        ...existingUser,
        role: loginRole,
        email: cleanEmail,
        displayName: isDemoTeacher ? 'Thầy Nguyễn Trọng Bình' : 'Nguyễn Văn An',
        schoolName: 'THPT Chuyên Lê Khiết',
        onboardingCompleted: true,
      };
      storageService.saveUserProfile(loginUser);
      setIsLoading(false);
      onLoginSuccess(loginUser);
      return;
    }

    // 2. Với các tài khoản thật: Bắt buộc xác thực qua Supabase hoặc từ chối nếu không hợp lệ
    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const { user: authUser, error: authError } = await signInWithEmail(cleanEmail, password);

        if (authError || !authUser) {
          setIsLoading(false);
          let viMsg = authError || 'Email hoặc mật khẩu không chính xác.';
          if (viMsg.toLowerCase().includes('invalid login credentials')) {
            viMsg = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
          } else if (viMsg.toLowerCase().includes('email not confirmed')) {
            viMsg = 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn!';
          }
          setError(viMsg);
          return;
        }

        const existingUser = storageService.getUserProfile();
        const loginUser: UserProfile = {
          ...existingUser,
          id: authUser.id,
          email: authUser.email,
          displayName: authUser.displayName || existingUser.displayName,
          avatarUrl: authUser.avatarUrl,
          role,
          onboardingCompleted: true,
        };
        storageService.saveUserProfile(loginUser);
        setIsLoading(false);
        onLoginSuccess(loginUser);
        return;
      }

      // 3. Chế độ Local: Chỉ cho phép tài khoản đã đăng ký trước đó trong localStorage
      await new Promise((r) => setTimeout(r, 450));
      const existingUser = storageService.getUserProfile();
      if (
        existingUser.email &&
        existingUser.email.toLowerCase() === cleanEmail.toLowerCase()
      ) {
        const loginUser: UserProfile = {
          ...existingUser,
          role,
          onboardingCompleted: true,
        };
        storageService.saveUserProfile(loginUser);
        setIsLoading(false);
        onLoginSuccess(loginUser);
      } else {
        setIsLoading(false);
        setError('Tài khoản không tồn tại trên hệ thống. Vui lòng kiểm tra lại hoặc bấm "Đăng ký ngay"!');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errMsg = err instanceof Error ? err.message : 'Đăng nhập không thành công';
      setError(errMsg);
    }
  };

  return (
    <div className="relative w-full z-10 select-none">
      {/* Ambient Halo behind Card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-sky-400/20 to-indigo-500/30 rounded-[34px] blur-2xl opacity-60 -z-10" />

      {/* Thẻ đăng nhập chính */}
      <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.5),0_10px_30px_-5px_rgba(29,123,242,0.2)] border border-white/70 px-8 py-9 sm:px-10 sm:py-10 transition-all">

        {/* Nút đóng / Về trang chủ (góc trên phải) */}
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
          aria-label="Đóng"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo & Nhãn thương hiệu TinPath */}
        <div className="flex items-center justify-center gap-3.5 mb-3">
          <img
            src="/images/logo/tinpath_logo.png"
            alt="TinPath Logo"
            className="w-12 h-12 object-contain drop-shadow-sm"
          />
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold tracking-tight text-[#1D7BF2] leading-none">
              TinPath
            </span>
            <span className="text-[12px] font-medium text-gray-500 mt-1 leading-none">
              Giáo dục Quảng Ngãi
            </span>
          </div>
        </div>

        {/* Tiêu đề & mô tả */}
        <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 text-center mt-2">
          Đăng nhập
        </h1>
        <p className="text-[13px] text-gray-500 text-center mt-1">
          Hệ thống luyện thi Tin học & Chuyên Tin Quảng Ngãi
        </p>

        {/* Chọn tư cách đăng nhập (Segmented Control) */}
        <div className="mt-6 mb-5">
          <label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase block mb-2">
            ĐĂNG NHẬP VỚI TƯ CÁCH
          </label>
          <div className="bg-[#f1f5f9] p-1 rounded-2xl grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Học sinh</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Giáo viên</span>
            </button>
          </div>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          {/* Email / Username */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Email hoặc Tên đăng nhập
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hocsinh@tinpath.edu.vn"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Ghi nhớ & Quên mật khẩu */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 accent-blue-600 cursor-pointer"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Vui lòng liên hệ quản trị viên nhà trường hoặc kiểm tra email của bạn để thiết lập lại mật khẩu.')}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 mt-2"
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
        </form>

        {/* Chưa có tài khoản? Đăng ký ngay */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 font-semibold hover:underline cursor-pointer ml-1"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
