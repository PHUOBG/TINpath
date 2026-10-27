import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { TinPathLogo } from '../common/TinPathLogo';

interface LandingPageProps {
  user?: UserProfile;
  onNavigateTab: (tabId: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onStartDailyChallenge: () => void;
  onTakeExam: (examId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  onNavigateTab,
  onOpenAuth,
  onStartDailyChallenge,
  onTakeExam,
}) => {
  // Search school state for Section 8
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showAllSchools, setShowAllSchools] = useState(false);

  // Navbar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quangNgaiSchools = [
    'THPT Chuyên Lê Khiết',
    'THPT Trần Quốc Tuấn',
    'THPT Võ Nguyên Giáp',
    'THPT Huỳnh Thúc Kháng',
    'THPT Bình Sơn',
    'THPT Ba Gia',
    'THPT Mộ Đức 1',
    'THPT Lý Sơn',
    'THPT Số 1 Tư Nghĩa',
    'THPT Số 2 Tư Nghĩa',
    'THPT Số 1 Đức Phổ',
    'THPT Số 2 Đức Phổ',
    'THPT Chu Văn An',
    'THPT Sơn Hà',
    'THPT Trà Bồng',
    'THPT Ba Tơ',
    'THPT Minh Long',
    'THPT Tây Trà',
    'THPT Đinh Tiên Hoàng',
    'THPT Lê Trung Đình',
  ];

  const filteredSchools = quangNgaiSchools.filter((s) =>
    s.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-gradient-to-b from-[#1e6fb8] via-[#257dc9] to-[#1c66aa] text-slate-100 flex flex-col items-center selection:bg-cyan-500 selection:text-white min-h-screen">

      {/* ══════ LANDING NAVBAR ══════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071626]/96 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.4)] border-b border-white/10'
          : 'bg-[#071626]/88 backdrop-blur-md border-b border-white/8'
      }`}>
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <div className="flex items-center shrink-0">
              <TinPathLogo size={36} textColor="text-white" subtextColor="text-cyan-400" />
            </div>

            {/* Center Nav Links — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '#about-tinpath', label: 'Giới thiệu' },
                { href: '#features', label: 'Tính năng' },
                { href: '#schools', label: 'Trường học' },
                { href: '#cta-footer', label: 'Liên hệ' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-blue-100/90 hover:text-white hover:bg-white/10 rounded-md transition-all"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Login */}
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:flex items-center h-8 px-4 rounded-full border border-white/30 text-[13px] font-medium text-slate-100 hover:border-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
              >
                Đăng nhập
              </button>

              {/* Register — primary CTA */}
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center h-8 px-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[13px] font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                Đăng ký
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-1 p-1.5 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1b66a8] border-t border-cyan-300/25 px-4 py-3 flex flex-col gap-1">
            {[
              { href: '#about-tinpath', label: 'Giới thiệu' },
              { href: '#features', label: 'Tính năng' },
              { href: '#schools', label: 'Trường học' },
              { href: '#cta-footer', label: 'Liên hệ' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10 mt-1 flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="flex-1 h-9 rounded-full border border-white/30 text-white text-xs font-semibold transition-all text-center"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                className="flex-1 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold transition-all text-center"
              >
                Đăng ký
              </button>
            </div>
          </div>
        )}
      </header>
      {/* ══════ END NAVBAR ══════ */}

      {/* ══════ 1. EXPANSIVE HERO SECTION (Trọn vẹn 100vh màn hình đầu tiên) ══════ */}
      <section className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#0d2d52] via-[#1a4a7a] to-[#0d2d52] text-white flex flex-col justify-between pt-14 sm:pt-16 lg:pt-14 pb-2 select-none">
        {/* Subtle glowing ambient orbs */}
        <div className="absolute top-1/4 left-10 w-[520px] h-[520px] bg-cyan-300/30 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[520px] h-[520px] bg-blue-300/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-200/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10 flex-1 flex items-center my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full py-10 sm:py-14 lg:py-16">

            {/* ── Left Column: Content, CTAs & Tech Support ── */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#175388]/90 border border-cyan-300/40 text-xs font-medium text-cyan-200 shadow-sm mb-4 sm:mb-5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-blue-100">GDPT 2018</span>
                <span className="text-cyan-400">•</span>
                <span>Chuyên đề Tin học 12 &amp; Ôn thi Tốt nghiệp THPT</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[44px] font-extrabold text-white tracking-tight leading-[1.15] mb-3.5 sm:mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-100 to-white">TinPath:</span>{' '}
                Hành trình chinh phục Tin học THPT bắt đầu từ đây.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-blue-50/95 leading-relaxed max-w-2xl mb-5 sm:mb-6">
                Nền tảng đồng hành cùng học sinh Quảng Ngãi trong hành trình ôn thi tốt nghiệp THPT môn Tin học với hệ thống học theo chuyên đề, ngân hàng đề thi chuẩn hóa và lộ trình cá nhân hóa bằng Trí tuệ Nhân tạo.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 mb-5 sm:mb-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="h-11 sm:h-12 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] active:scale-98 transition-all cursor-pointer"
                >
                  <span>Bắt đầu học ngay</span>
                  <span className="text-lg">🎓</span>
                </button>
                <a
                  href="#about-tinpath"
                  className="h-11 sm:h-12 px-5 rounded-xl bg-[#165084]/90 hover:bg-[#1a5e9a] border border-cyan-300/40 hover:border-cyan-200 text-white font-semibold text-sm sm:text-base flex items-center gap-2 active:scale-98 transition-all"
                >
                  <span>🧭</span>
                  <span>Khám phá môn học &amp; Đề thi</span>
                </a>
              </div>

              {/* Tech Stack Pills: Python, C++, HTML5/CSS3, Gemini AI */}
              <div className="mb-5 sm:mb-6">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-cyan-200/90 mb-2.5 flex items-center gap-2">
                  <span>HỖ TRỢ TOÀN DIỆN CÔNG NGHỆ &amp; NGÔN NGỮ LẬP TRÌNH:</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {/* Python */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18538a] border border-[#2e74b5] hover:border-amber-300/70 text-xs font-semibold text-slate-100 transition-colors">
                    <span className="text-base">🐍</span>
                    <span className="text-amber-300 font-bold">Python 3.12</span>
                  </div>

                  {/* C++ */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18538a] border border-[#2e74b5] hover:border-cyan-300/70 text-xs font-semibold text-slate-100 transition-colors">
                    <span className="text-cyan-300 font-mono text-sm">&lt;/&gt;</span>
                    <span className="text-cyan-200 font-bold">C++ 20 / STL</span>
                  </div>

                  {/* HTML5 & CSS3 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18538a] border border-[#2e74b5] hover:border-orange-300/70 text-xs font-semibold text-slate-100 transition-colors">
                    <span className="text-orange-300 font-bold">🌐</span>
                    <span className="text-orange-200 font-bold">HTML5 / CSS3</span>
                  </div>

                  {/* Gemini AI Tutor */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#24427c] border border-[#496fb2] hover:border-purple-300/80 text-xs font-semibold text-slate-100 transition-colors">
                    <span className="text-base">🧠</span>
                    <span className="text-purple-200 font-bold">Gemini AI Tutor</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-4 border-t border-cyan-400/20">
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#12355e] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    QN
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-[#12355e] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    LK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-[#12355e] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    Tr
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-600 border-2 border-[#12355e] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    BSo
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Hơn 15.000+ Học sinh &amp; Thầy cô</span>
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-900 text-[9px] font-extrabold">✓</span>
                  </div>
                  <div className="text-blue-100/80 text-[11px] mt-0.5">
                    tại 34 trường THPT trên toàn tỉnh Quảng Ngãi cùng luyện tập mỗi ngày.
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: 3D Books Showcase & Floating Code Badges ── */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px] select-none">
              {/* Luminous circular glows behind the books */}
              <div className="absolute w-[380px] h-[380px] rounded-full bg-cyan-300/35 blur-[80px] pointer-events-none" />
              <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-300/30 blur-[60px] pointer-events-none" />

              {/* Network Globe Background with smooth blend */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-40 pointer-events-none">
                <img
                  src="/images/landing/network_globe_bg.png"
                  alt="Network Globe"
                  className="w-full h-full object-cover filter brightness-125 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2073bf]/90 via-transparent to-[#1e6fb8]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2073bf]/90 via-transparent to-[#2073bf]/90" />
              </div>

              {/* Floating Badge Top Left: binary_search.py */}
              <div className="animate-float-1 absolute top-2 left-0 sm:left-2 z-20 bg-[#175b98]/95 hover:bg-[#1d6bafe0] backdrop-blur-md border border-cyan-300/40 rounded-xl p-3 shadow-2xl max-w-[210px] sm:max-w-[230px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold mb-1.5">
                  <span>🔸</span>
                  <span>binary_search.py</span>
                </div>
                <div className="font-mono text-[10px] text-slate-100 leading-relaxed bg-[#104373]/90 p-2 rounded-lg border border-cyan-400/25 shadow-inner">
                  <div className="text-cyan-200"><span className="text-purple-300">def</span> search(arr, x):</div>
                  <div className="pl-3 text-slate-200">mid = (l + r) // 2</div>
                  <div className="text-emerald-300 font-medium text-[9px] pt-1"># Độ phức tạp O(log N)</div>
                </div>
              </div>

              {/* Floating Badge Top Right: TinPath AI Tutor */}
              <div className="animate-float-2 absolute top-0 right-0 sm:right-2 z-20 bg-[#175b98]/95 hover:bg-[#1d6bafe0] backdrop-blur-md border border-cyan-300/40 rounded-xl p-3 shadow-2xl max-w-[210px] sm:max-w-[220px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-400/25 flex items-center justify-center text-cyan-200 text-xs">
                    🤖
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">TinPath AI Tutor</div>
                    <div className="text-[9px] text-emerald-300 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Đang trực tuyến 24/7</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-blue-50 italic bg-[#104373]/90 p-2 rounded-lg border border-cyan-400/25 shadow-inner">
                  &quot;Đã gợi ý giải thuật Quy hoạch động cho đề thi thử số 08!&quot;
                </p>
              </div>

              {/* 3D Book Fan Display (3 Real Textbook Covers - Completely Uniform, Zero White Space) */}
              <div className="relative z-10 flex items-center justify-center py-6 sm:py-8">
                {/* Book 1 (Left): Tin học 11 KNTT - Tin học ứng dụng */}
                <div className="w-[136px] sm:w-[162px] lg:w-[182px] -mr-7 sm:-mr-9 transform -rotate-6 translate-y-2 hover:translate-y-0 hover:rotate-0 hover:z-30 transition-all duration-300 drop-shadow-[0_16px_30px_rgba(10,35,65,0.45)] cursor-pointer group">
                  <div className="relative aspect-[1/1.41] rounded-xl overflow-hidden border border-white/25 shadow-2xl bg-slate-900 p-0 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-r before:from-white/25 before:to-transparent before:z-10 before:pointer-events-none">
                    <img
                      src="/images/books/tin_hoc_11_kntt_ud.png"
                      alt="Tin học 11 - Định hướng Tin học ứng dụng"
                      className="w-full h-full object-cover block select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-950/90 text-amber-200 border border-amber-400/50 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md backdrop-blur-xs z-20 flex items-center gap-1">
                      <span>📖</span>
                      <span>Tin học 11 KNTT</span>
                    </div>
                  </div>
                </div>

                {/* Book 2 (Center): Tin học 12 KNTT - Khoa học máy tính (Featured Prominent) */}
                <div className="w-[158px] sm:w-[188px] lg:w-[210px] z-20 transform hover:scale-105 transition-all duration-300 drop-shadow-[0_22px_40px_rgba(6,182,212,0.45)] cursor-pointer group">
                  <div className="relative aspect-[1/1.41] rounded-xl overflow-hidden border-2 border-cyan-300/80 shadow-2xl bg-slate-900 ring-4 ring-cyan-400/25 p-0 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:z-10 before:pointer-events-none">
                    <img
                      src="/images/books/tin_hoc_12_kntt_cs.png"
                      alt="Tin học 12 - Định hướng Khoa học máy tính"
                      className="w-full h-full object-cover block select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white text-[10.5px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1.5 border border-cyan-200/70 z-20">
                      <span>⚡</span>
                      <span>Ôn Thi THPT 2025</span>
                    </div>
                  </div>
                </div>

                {/* Book 3 (Right): Hướng dẫn ôn thi tốt nghiệp THPT Môn Tin học */}
                <div className="w-[136px] sm:w-[162px] lg:w-[182px] -ml-7 sm:-ml-9 transform rotate-6 translate-y-2 hover:translate-y-0 hover:rotate-0 hover:z-30 transition-all duration-300 drop-shadow-[0_16px_30px_rgba(10,35,65,0.45)] cursor-pointer group">
                  <div className="relative aspect-[1/1.41] rounded-xl overflow-hidden border border-white/25 shadow-2xl bg-slate-900 p-0 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-r before:from-white/25 before:to-transparent before:z-10 before:pointer-events-none">
                    <img
                      src="/images/books/huong_dan_on_thi_tot_nghiep.png"
                      alt="Hướng dẫn ôn thi tốt nghiệp THPT Môn Tin học"
                      className="w-full h-full object-cover block select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-950/90 text-cyan-200 border border-cyan-400/50 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md backdrop-blur-xs z-20 flex items-center gap-1">
                      <span>🎯</span>
                      <span>Đề Thi Chuẩn Bộ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Bottom Left: Question Bank Trophy */}
              <div className="animate-float-3 absolute bottom-2 left-0 sm:left-2 z-20 bg-[#175b98]/95 hover:bg-[#1d6bafe0] backdrop-blur-md border border-amber-300/40 rounded-xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg sm:text-xl">
                  🏆
                </div>
                <div>
                  <div className="text-[10px] font-medium text-blue-100">Ngân hàng đề thi</div>
                  <div className="text-xs font-bold text-amber-200">2.500+ Câu trắc nghiệm</div>
                </div>
              </div>

              {/* Floating Badge Bottom Right: C++20 Standard */}
              <div className="animate-float-4 absolute bottom-0 right-0 sm:right-2 z-20 bg-[#175b98]/95 hover:bg-[#1d6bafe0] backdrop-blur-md border border-cyan-300/40 rounded-xl p-2.5 sm:p-3 shadow-2xl max-w-[190px] sm:max-w-[210px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-200 font-semibold mb-1">
                  <span>⚙️</span>
                  <span>C++20 Standard</span>
                </div>
                <div className="font-mono text-[9px] text-slate-100 bg-[#104373]/90 p-1.5 rounded border border-cyan-400/25 shadow-inner leading-tight">
                  <div>std::vector&lt;int&gt; v;</div>
                  <div className="text-cyan-200">sort(v.begin(), v.end());</div>
                  <div className="text-emerald-300 font-bold pt-0.5">Tối ưu 100 điểm test</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Scroll Down Indicator ── */}
        <div className="w-full relative z-10 flex flex-col items-center justify-center pb-6 select-none">
          <a
            href="#about-tinpath"
            className="flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300 group cursor-pointer"
          >
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-white/80 group-hover:text-white transition-colors drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Cuộn xuống khám phá</span>
            <div className="flex flex-col items-center gap-0.5 animate-bounce">
              <svg className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </a>
        </div>
      </section>

      {/* ══════ 2. BODY SECTIONS CONTAINER (Sắc xanh biển tươi sáng, liền mạch & cân bằng) ══════ */}
      <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#0f2d52] via-[#0c2444] to-[#081a32]">
        {/* Subtle ambient light glows for depth & continuous immersion */}
        <div className="absolute top-1/6 -left-32 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-cyan-500/12 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-blue-400/12 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 space-y-24 relative z-10">

          {/* 2. ABOUT TINPATH (Giới thiệu nền tảng) */}
          <section className="flex flex-col py-2 scroll-mt-28" id="about-tinpath">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-cyan-300 text-[22px]">flag</span>
              <span className="font-label-md text-cyan-200 uppercase tracking-wider font-bold">Về nền tảng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Sứ mệnh kiến tạo tương lai số cho học sinh Quảng Ngãi
            </h2>
            <p className="text-base sm:text-lg text-blue-50/90 mb-8 max-w-3xl leading-relaxed">
              Được thiết kế bám sát chương trình Giáo dục Phổ thông 2018, TinPath tối ưu hóa việc tự học và bồi dưỡng
              tư duy thuật toán cho kỳ thi tốt nghiệp THPT.
            </p>

            {/* 3 Core Values Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-4 group transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">navigation</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2 group-hover:text-cyan-200 transition-colors">
                    1. Học tập có định hướng
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Hệ thống hóa toàn diện kiến thức trọng tâm theo từng chủ đề chuẩn THPT từ lớp 10 đến lớp 12, phân tách
                    rõ Tin học ứng dụng và Khoa học máy tính.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-4 group transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">track_changes</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2 group-hover:text-cyan-200 transition-colors">
                    2. Luyện tập có mục tiêu
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Thực hành có phân cấp theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao với bộ câu hỏi
                    chuẩn quy cách Bộ GD&ĐT.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-4 group transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">monitoring</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2 group-hover:text-cyan-200 transition-colors">
                    3. Tiến bộ có thể theo dõi
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Phân tích chi tiết lịch sử làm bài, trực quan hóa radar kỹ năng và chỉ rõ lỗ hổng kiến thức để bù đắp
                    kịp thời trước kỳ thi thật.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. WHY CHOOSE TINPATH */}
          <section className="flex flex-col py-2 scroll-mt-28" id="features">
            <div className="text-center mb-8">
              <span className="font-label-sm text-cyan-300 uppercase font-bold tracking-widest text-xs">
                Đặc quyền học tập
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                Tại sao học sinh chọn TinPath?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 mb-3 group-hover:bg-cyan-400/30 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">source</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    Kho học liệu tập trung
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Tổng hợp lý thuyết chuẩn mực, bài giảng số và bộ đề tinh tuyển toàn tỉnh.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 mb-3 group-hover:bg-cyan-400/30 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">category</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    Học theo chủ đề
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Cấu trúc logic chuẩn GDPT 2018, chia nhỏ bài học giúp tiếp thu nhanh.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 mb-3 group-hover:bg-cyan-400/30 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">fact_check</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    Luyện đề chuyên sâu
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Chấm điểm tức thì, thống kê câu sai và kèm lời giải chi tiết từng bước.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/35 flex items-center justify-center text-amber-200 mb-3 group-hover:bg-amber-400/30 transition-colors">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    award_star
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    Thử thách 10 câu
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Mỗi ngày 10 câu ôn tập nhanh duy trì thói quen tư duy thuật toán.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 mb-3 group-hover:bg-cyan-400/30 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">neurology</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    AI cá nhân hóa
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Lộ trình học riêng biệt dựa trên năng lực và tốc độ giải bài thực tế.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col justify-between group transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200 mb-3 group-hover:bg-cyan-400/30 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">leaderboard</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[16px] mb-1.5 group-hover:text-cyan-200 transition-colors">
                    Bảng xếp hạng
                  </h4>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Tạo động lực thi đua học tập cùng sĩ tử từ 34 trường THPT Quảng Ngãi.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. AI PERSONALIZED LEARNING */}
          <section className="flex flex-col my-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2167a5] via-[#1b578c] to-[#164b7a] border border-cyan-300/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-300/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-200 text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Công nghệ Trợ lý AI Thông minh</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-snug">
              Mỗi học sinh một lộ trình. Mỗi bước học đều có định hướng.
            </h2>

            <p className="text-sm sm:text-base text-blue-50/90 mb-6 max-w-3xl leading-relaxed">
              Hệ sinh thái AI phân tích dữ liệu làm bài theo thời gian thực, chủ động chỉ dẫn và xây dựng kế hoạch bứt
              phá điểm số chuẩn hóa.
            </p>

            {/* AI Step Process */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#134878]/80 border border-cyan-300/25 backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/25 border border-cyan-300/40 flex items-center justify-center font-bold text-cyan-100 text-sm">
                  1
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white text-sm sm:text-base">Đánh giá kiến thức đầu vào</span>
                  <span className="text-blue-100/90 text-xs sm:text-sm truncate">
                    Định vị mục tiêu điểm số &amp; năng lực nền tảng.
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#134878]/80 border border-cyan-300/25 backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/25 border border-cyan-300/40 flex items-center justify-center font-bold text-cyan-100 text-sm">
                  2
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white text-sm sm:text-base">Phân tích điểm yếu chuyên sâu</span>
                  <span className="text-blue-100/90 text-xs sm:text-sm truncate">
                    Phát hiện chủ đề hay sai sót để ưu tiên ôn tập.
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#134878]/80 border border-cyan-300/25 backdrop-blur-sm flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/25 border border-cyan-300/40 flex items-center justify-center font-bold text-cyan-100 text-sm">
                  3
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white text-sm sm:text-base">AI Study Planner</span>
                  <span className="text-blue-100/90 text-xs sm:text-sm truncate">
                    Tự động lập thời gian biểu học tập cá nhân hóa theo tuần.
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack Integration Pill Strip */}
            <div className="p-4 rounded-xl bg-[#0e3b65]/80 border border-cyan-300/25 flex flex-col gap-2.5">
              <span className="text-cyan-200 font-semibold text-xs">Cốt lõi công nghệ vận hành:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-cyan-400/15 border border-cyan-300/30 text-cyan-100 text-xs flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Gemini 1.5 Pro
                </span>
                <span className="px-3 py-1 rounded-lg bg-cyan-400/15 border border-cyan-300/30 text-cyan-100 text-xs flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">auto_stories</span> NotebookLM
                </span>
                <span className="px-3 py-1 rounded-lg bg-cyan-400/15 border border-cyan-300/30 text-cyan-100 text-xs flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">cloud_done</span> Google Cloud Engine
                </span>
              </div>
              <p className="text-blue-100/80 italic text-xs mt-1">
                *Cam kết: AI là trợ lý thông minh hỗ trợ người học, đề cao vai trò định hướng sư phạm cốt lõi của giáo viên.
              </p>
            </div>
          </section>

          {/* 6. LEARNING RESOURCES (Học liệu chuẩn hóa) */}
          <section className="flex flex-col py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-cyan-300 text-[22px]">library_books</span>
              <span className="font-label-md text-cyan-200 uppercase tracking-wider font-bold">Học liệu chuẩn hóa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Kho tài liệu ôn thi THPT tuyển chọn
            </h2>
            <p className="text-base text-blue-50/85 mb-6">
              TinPath tổ chức và khai thác học liệu tham khảo nhằm hỗ trợ quá trình học tập, luyện tập và ôn thi liên tục.
            </p>

            <div className="flex flex-col gap-3.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex items-center gap-4 group transition-all duration-300">
                <div className="w-14 h-16 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex flex-col items-center justify-center shrink-0 p-1 text-center">
                  <span className="material-symbols-outlined text-cyan-200 text-[24px]">menu_book</span>
                  <span className="text-[10px] text-cyan-100 font-bold leading-tight mt-0.5">THPT 12</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-100 text-xs font-semibold">
                    Ôn thi tốt nghiệp
                  </span>
                  <h4 className="text-white font-bold text-[15px] sm:text-base group-hover:text-cyan-200 transition-colors mt-1.5 truncate">
                    Hướng dẫn ôn thi tốt nghiệp THPT môn Tin học
                  </h4>
                  <p className="text-sm text-blue-100/90 mt-0.5">Tổng hợp chuyên đề &amp; đề tham khảo mới</p>
                </div>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="w-10 h-10 rounded-full bg-cyan-400/20 hover:bg-cyan-400 border border-cyan-300/35 text-cyan-200 hover:text-slate-900 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Xem chuyên đề này"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex items-center gap-4 group transition-all duration-300">
                <div className="w-14 h-16 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex flex-col items-center justify-center shrink-0 p-1 text-center">
                  <span className="material-symbols-outlined text-cyan-200 text-[24px]">terminal</span>
                  <span className="text-[10px] text-cyan-100 font-bold leading-tight mt-0.5">ICT 12</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-100 text-xs font-semibold">
                    Tin ứng dụng
                  </span>
                  <h4 className="text-white font-bold text-[15px] sm:text-base group-hover:text-cyan-200 transition-colors mt-1.5 truncate">
                    Chuyên đề học tập Tin học 12 — Định hướng ICT
                  </h4>
                  <p className="text-sm text-blue-100/90 mt-0.5">Thực hành phần mềm ứng dụng &amp; CSDL</p>
                </div>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="w-10 h-10 rounded-full bg-cyan-400/20 hover:bg-cyan-400 border border-cyan-300/35 text-cyan-200 hover:text-slate-900 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Xem chuyên đề này"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex items-center gap-4 group transition-all duration-300">
                <div className="w-14 h-16 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex flex-col items-center justify-center shrink-0 p-1 text-center">
                  <span className="material-symbols-outlined text-cyan-200 text-[24px]">code</span>
                  <span className="text-[10px] text-cyan-100 font-bold leading-tight mt-0.5">CS 12</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-100 text-xs font-semibold">
                    Khoa học máy tính
                  </span>
                  <h4 className="text-white font-bold text-[15px] sm:text-base group-hover:text-cyan-200 transition-colors mt-1.5 truncate">
                    Bài tập Tin học 12 — Định hướng CS
                  </h4>
                  <p className="text-sm text-blue-100/90 mt-0.5">Lập trình thuật toán &amp; cấu trúc dữ liệu</p>
                </div>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="w-10 h-10 rounded-full bg-cyan-400/20 hover:bg-cyan-400 border border-cyan-300/35 text-cyan-200 hover:text-slate-900 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Xem chuyên đề này"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex items-center gap-4 group transition-all duration-300">
                <div className="w-14 h-16 rounded-xl bg-amber-400/20 border border-amber-300/35 flex flex-col items-center justify-center shrink-0 p-1 text-center">
                  <span
                    className="material-symbols-outlined text-amber-300 text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    military_tech
                  </span>
                  <span className="text-[10px] text-amber-200 font-bold leading-tight mt-0.5">HSG TỈNH</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/35 text-amber-200 text-xs font-semibold">
                    Đề thi nâng cao
                  </span>
                  <h4 className="text-white font-bold text-[15px] sm:text-base group-hover:text-cyan-200 transition-colors mt-1.5 truncate">
                    Tuyển tập bộ đề thi chọn HSG THPT Quảng Ngãi
                  </h4>
                  <p className="text-sm text-blue-100/90 mt-0.5">Dành cho đội tuyển bồi dưỡng học sinh giỏi</p>
                </div>
                <button
                  onClick={() => onNavigateTab('practice')}
                  className="w-10 h-10 rounded-full bg-cyan-400/20 hover:bg-cyan-400 border border-cyan-300/35 text-cyan-200 hover:text-slate-900 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Xem chuyên đề này"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* 7. TINPATH DÀNH CHO AI? */}
          <section className="flex flex-col py-2">
            <div className="text-center mb-8">
              <span className="font-label-sm text-cyan-300 uppercase font-bold tracking-widest text-xs">
                Hệ sinh thái phân quyền
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                TinPath đồng hành cùng ai?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Role 1 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-3.5 group transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200">
                      <span className="material-symbols-outlined text-[20px]">school</span>
                    </span>
                    <span className="text-[17px] text-white font-bold group-hover:text-cyan-200 transition-colors">
                      1. Học sinh THPT
                    </span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-200 text-xs font-semibold">
                    Trung tâm
                  </span>
                </div>
                <ul className="flex flex-col gap-2 pt-2 border-t border-cyan-300/20 text-blue-100/90 text-sm">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Học theo chủ đề &amp; tham gia thử thách 10 câu/ngày.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Theo dõi tiến độ học tập và nhận đề xuất riêng từ AI.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Thi thử trực tuyến với trải nghiệm chấm thi chuẩn xác.</span>
                  </li>
                </ul>
              </div>

              {/* Role 2 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-3.5 group transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200">
                      <span className="material-symbols-outlined text-[20px]">co_present</span>
                    </span>
                    <span className="text-[17px] text-white font-bold group-hover:text-cyan-200 transition-colors">
                      2. Thầy Cô Giáo
                    </span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-200 text-xs font-semibold">
                    Đồng hành
                  </span>
                </div>
                <ul className="flex flex-col gap-2 pt-2 border-t border-cyan-300/20 text-blue-100/90 text-sm">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Tạo lớp học, giao bài tập và đề kiểm tra định kỳ linh hoạt.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Chia sẻ học liệu số hóa với học sinh toàn trường.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Báo cáo phổ điểm trực quan giúp nhận diện phổ kiến thức.</span>
                  </li>
                </ul>
              </div>

              {/* Role 3 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-lg backdrop-blur-sm flex flex-col gap-3.5 group transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center text-cyan-200">
                      <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    </span>
                    <span className="text-[17px] text-white font-bold group-hover:text-cyan-200 transition-colors">
                      3. Ban Quản Trị
                    </span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/35 text-cyan-200 text-xs font-semibold">
                    Vận hành
                  </span>
                </div>
                <ul className="flex flex-col gap-2 pt-2 border-t border-cyan-300/20 text-blue-100/90 text-sm">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Kiểm duyệt chất lượng kho đề, đồng bộ ngân hàng câu hỏi.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Quản trị người dùng, phân quyền theo từng cơ sở đào tạo.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>
                    <span>Tối ưu hóa mô hình AI hỗ trợ định hướng sư phạm.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. TINPATH TẠI QUẢNG NGÃI */}
          <section className="flex flex-col py-2 scroll-mt-28" id="schools">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-cyan-300 text-[22px]">apartment</span>
              <span className="font-label-md text-cyan-200 uppercase tracking-wider font-bold">Cộng đồng địa phương</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Cùng học sinh Quảng Ngãi chinh phục Tin học
            </h2>
            <p className="text-base text-blue-50/85 mb-6">
              Xây dựng môi trường ôn tập số bình đẳng, kết nối học sinh khắp các trường THPT từ đồng bằng đến miền núi và
              hải đảo Lý Sơn.
            </p>

            {/* School Search Box */}
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[20px] text-cyan-300">search</span>
              <input
                type="text"
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#124675]/90 text-white placeholder-blue-100/60 border border-cyan-300/35 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 text-sm shadow-inner outline-none transition-all"
                placeholder="Tìm trường THPT của bạn..."
              />
            </div>

            {/* Featured Schools Chips */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              {(showAllSchools ? filteredSchools : filteredSchools.slice(0, 8)).map((sch, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-[#195b98]/70 hover:bg-[#1f6dae] border border-cyan-300/30 hover:border-cyan-300/50 text-xs font-medium text-blue-50 hover:text-white shadow-sm transition-all"
                >
                  {sch}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAllSchools(!showAllSchools)}
              className="w-full py-3.5 rounded-xl bg-[#175690] hover:bg-[#1d65a6] border border-cyan-300/35 text-cyan-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">list_alt</span>
              <span>
                {showAllSchools
                  ? 'Thu gọn danh sách trường'
                  : 'Xem danh sách 34 trường THPT toàn tỉnh'}
              </span>
            </button>
          </section>

          {/* 9. LEARNING JOURNEY (Lộ trình 6 bước) */}
          <section className="flex flex-col py-2">
            <div className="text-center mb-8">
              <span className="font-label-sm text-cyan-300 uppercase font-bold tracking-widest text-xs">
                Lộ trình bứt phá
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                6 bước học tập cùng TinPath
              </h2>
            </div>

            <div className="flex flex-col gap-4 relative pl-4 before:content-[''] before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-cyan-300/30">
              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  1
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Đánh giá đầu vào</h4>
                  <p className="text-sm text-blue-100/90">Làm bài test nhanh 15 phút xác định điểm xuất phát.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  2
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Xác định mục tiêu điểm số</h4>
                  <p className="text-sm text-blue-100/90">Đặt ngưỡng điểm kỳ vọng cho kỳ thi THPT (7+, 8+, 9+).</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  3
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Học theo chủ đề</h4>
                  <p className="text-sm text-blue-100/90">Ôn chắc lý thuyết &amp; bài tập từ mức độ Nhận biết đến Vận dụng.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  4
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Luyện đề &amp; Thử thách mỗi ngày</h4>
                  <p className="text-sm text-blue-100/90">Rèn luyện phản xạ làm bài và làm quen với áp lực thời gian.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  5
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Phân tích kết quả bằng AI</h4>
                  <p className="text-sm text-blue-100/90">Chỉ ra câu sai thường gặp, đề xuất bài tập khắc phục tức thì.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-code-inline text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-200/70">
                  6
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#195b98]/75 hover:bg-[#1f6dae]/90 border border-cyan-300/25 hover:border-cyan-300/50 shadow-md backdrop-blur-sm flex-1 transition-all">
                  <h4 className="font-bold text-white text-[15px] sm:text-base mb-1">Cải thiện &amp; Bứt phá điểm số</h4>
                  <p className="text-sm text-blue-100/90">Tự tin bước vào phòng thi chính thức với phong độ cao nhất.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. FINAL CTA & FOOTER */}
          <section className="flex flex-col py-2 scroll-mt-28" id="cta-footer">
            {/* Big CTA Card — deep sapphire navy */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0e243f] via-[#0a1c33] to-[#071426] border border-blue-500/30 shadow-2xl text-center flex flex-col items-center gap-4 mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-1 shadow-lg">
                <span className="material-symbols-outlined text-[32px]">stars</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold max-w-2xl">
                Bắt đầu hành trình Tin học của bạn cùng TinPath.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                Chủ động học tập, luyện tập có mục tiêu và từng bước củng cố kiến thức cho kỳ thi tốt nghiệp THPT.
              </p>
              <button
                onClick={() => onNavigateTab('learning')}
                className="h-13 px-8 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">flag</span>
                <span>Bắt đầu học ngay miễn phí</span>
              </button>
            </div>

            {/* Detailed Footer — dark midnight navy */}
            <footer className="flex flex-col gap-8 pt-8 text-slate-400 border-t border-slate-700/60">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <TinPathLogo size={32} textColor="text-white" subtextColor="text-slate-400" />
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-code-inline text-[11px] text-slate-300">
                    THPT Trần Quốc Tuấn
                  </span>
                </div>
                <p className="text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
                  Chinh phục Tin học THPT cùng học sinh Quảng Ngãi. Nền tảng học tập số thông minh, cá nhân hóa theo
                  Chương trình GDPT 2018.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="flex flex-col gap-2.5">
                  <span className="text-slate-200 uppercase font-bold text-xs tracking-wider">Học tập</span>
                  <button
                    onClick={() => onNavigateTab('learning')}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Theo chủ đề lớp 12
                  </button>
                  <button
                    onClick={() => onNavigateTab('practice')}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Bộ đề thi thử 2025
                  </button>
                  <button
                    onClick={() => onNavigateTab('personalized_ai')}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    AI Study Mentor
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-slate-200 uppercase font-bold text-xs tracking-wider">Tài nguyên</span>
                  <button
                    onClick={() => onNavigateTab('learning')}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Tài liệu tham khảo
                  </button>
                  <button
                    onClick={() => onOpenAuth()}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Dành cho giáo viên
                  </button>
                  <button
                    onClick={() => onNavigateTab('home')}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    34 trường THPT
                  </button>
                </div>
                <div className="col-span-2 flex flex-col gap-2.5">
                  <span className="text-slate-200 uppercase font-bold text-xs tracking-wider">Hỗ trợ</span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hệ thống hoạt động trực tuyến 24/7 phục vụ giáo viên và học sinh ôn thi THPT.
                  </p>
                  <div className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>hotro@tinpath.edu.vn</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b1424] border border-slate-800 flex flex-col gap-1.5">
                <span className="text-slate-300 font-semibold text-xs">Ghi chú học thuật &amp; Bản quyền:</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Nội dung kiến thức, câu hỏi trắc nghiệm và đề luyện được biên soạn, chọn lọc phục vụ mục đích học tập phi
                  thương mại cho cộng đồng học sinh, giáo viên tỉnh Quảng Ngãi.
                </p>
              </div>

              <div className="text-center text-[11px] text-slate-600 pt-2 pb-6">
                © 2025 TinPath Quảng Ngãi. Đồng hành cùng ước mơ số.
              </div>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
};
