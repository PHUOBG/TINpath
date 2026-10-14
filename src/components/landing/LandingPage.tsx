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
    <div className="w-full bg-[#f8fafc] dark:bg-[#070D18] text-[#1E293B] dark:text-[#E2E8F0] flex flex-col items-center">

      {/* ══════ LANDING NAVBAR ══════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#161616]/95 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-[#1a1a1a]'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <div className="flex items-center shrink-0">
              <TinPathLogo size={36} textColor="text-white" subtextColor="text-blue-400" />
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
                  className="px-3.5 py-1.5 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/8 rounded-md transition-all"
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
                className="hidden sm:flex items-center h-8 px-4 rounded-full border border-white/25 text-[13px] font-medium text-gray-200 hover:border-white/50 hover:text-white transition-all cursor-pointer"
              >
                Đăng nhập
              </button>

              {/* Register — primary CTA */}
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center h-8 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-all shadow-md cursor-pointer"
              >
                Đăng ký
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-1 p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
          <div className="md:hidden bg-[#1a1a1a] border-t border-white/10 px-4 py-3 flex flex-col gap-1">
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
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/8 transition-all"
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
                className="flex-1 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all text-center"
              >
                Đăng ký
              </button>
            </div>
          </div>
        )}
      </header>
      {/* ══════ END NAVBAR ══════ */}

      {/* ══════ 1. EXPANSIVE HERO SECTION (Ảnh 3 & Ảnh 4 Reference) ══════ */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#0F1D38] via-[#142647] to-[#0E1A33] text-white pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-slate-700/60">
        {/* Subtle glowing ambient orbs - lighter & more luminous */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-400/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* ── Left Column: Content, CTAs & Tech Support ── */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#172948] border border-[#234575] text-xs font-medium text-cyan-300 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-gray-300">GDPT 2018</span>
                <span className="text-gray-500">•</span>
                <span>Chuyên đề Tin học 12 &amp; Ôn thi Tốt nghiệp THPT</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15] mb-5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#38BDF8]">TinPath:</span>{' '}
                Hành trình chinh phục Tin học THPT bắt đầu từ đây.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
                Nền tảng đồng hành cùng học sinh Quảng Ngãi trong hành trình ôn thi tốt nghiệp THPT môn Tin học với hệ thống học theo chuyên đề, ngân hàng đề thi chuẩn hóa và lộ trình cá nhân hóa bằng Trí tuệ Nhân tạo.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:from-[#0369A1] hover:to-[#1E40AF] text-white font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] active:scale-98 transition-all cursor-pointer"
                >
                  <span>Bắt đầu học ngay</span>
                  <span className="text-lg">🎓</span>
                </button>
                <a
                  href="#about-tinpath"
                  className="h-12 px-5 rounded-xl bg-[#0F172A]/80 hover:bg-[#1E293B] border border-slate-700/80 hover:border-slate-500 text-slate-200 font-semibold text-sm sm:text-base flex items-center gap-2 active:scale-98 transition-all"
                >
                  <span>🧭</span>
                  <span>Khám phá môn học &amp; Đề thi</span>
                </a>
              </div>

              {/* Tech Stack Pills: Python, C++, HTML5/CSS3, Gemini AI */}
              <div className="mb-8">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <span>HỖ TRỢ TOÀN DIỆN CÔNG NGHỆ &amp; NGÔN NGỮ LẬP TRÌNH:</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {/* Python */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112444] border border-[#224474] hover:border-amber-400/60 text-xs font-semibold text-slate-200 transition-colors">
                    <span className="text-base">🐍</span>
                    <span className="text-amber-400 font-bold">Python 3.12</span>
                  </div>

                  {/* C++ */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112444] border border-[#224474] hover:border-cyan-400/60 text-xs font-semibold text-slate-200 transition-colors">
                    <span className="text-cyan-400 font-mono text-sm">&lt;/&gt;</span>
                    <span className="text-cyan-300 font-bold">C++ 20 / STL</span>
                  </div>

                  {/* HTML5 & CSS3 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112444] border border-[#224474] hover:border-orange-400/60 text-xs font-semibold text-slate-200 transition-colors">
                    <span className="text-orange-500 font-bold">🌐</span>
                    <span className="text-orange-300 font-bold">HTML5 / CSS3</span>
                  </div>

                  {/* Gemini AI Tutor */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1D1740] border border-[#522C8C] hover:border-purple-400/70 text-xs font-semibold text-slate-200 transition-colors">
                    <span className="text-base">🧠</span>
                    <span className="text-purple-300 font-bold">Gemini AI Tutor</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0B1322] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    QN
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-[#0B1322] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    LK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-[#0B1322] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    Tr
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-600 border-2 border-[#0B1322] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    BSo
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Hơn 15.000+ Học sinh &amp; Thầy cô</span>
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold">✓</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    tại 34 trường THPT trên toàn tỉnh Quảng Ngãi cùng luyện tập mỗi ngày.
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: 3D Books Showcase & Floating Code Badges ── */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px] select-none">
              {/* Luminous circular glows behind the books */}
              <div className="absolute w-[380px] h-[380px] rounded-full bg-cyan-400/20 blur-[80px] pointer-events-none" />
              <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-500/20 blur-[60px] pointer-events-none" />

              {/* Network Globe Background with smooth blend (brighter & clearer) */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-45 pointer-events-none">
                <img
                  src="/images/landing/network_globe_bg.png"
                  alt="Network Globe"
                  className="w-full h-full object-cover filter brightness-125 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A33]/90 via-transparent to-[#0F1D38]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A33]/90 via-transparent to-[#0E1A33]/90" />
              </div>

              {/* Floating Badge Top Left: binary_search.py (Float animation 1) */}
              <div className="animate-float-1 absolute top-2 left-0 sm:left-2 z-20 bg-[#0F1C33]/92 hover:bg-[#132340] backdrop-blur-md border border-cyan-400/40 rounded-xl p-3 shadow-2xl max-w-[210px] sm:max-w-[230px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-semibold mb-1.5">
                  <span>🔸</span>
                  <span>binary_search.py</span>
                </div>
                <div className="font-mono text-[10px] text-slate-200 leading-relaxed bg-[#070E1C]/90 p-2 rounded-lg border border-slate-700/60 shadow-inner">
                  <div className="text-blue-300"><span className="text-purple-400">def</span> search(arr, x):</div>
                  <div className="pl-3 text-slate-300">mid = (l + r) // 2</div>
                  <div className="text-emerald-400 font-medium text-[9px] pt-1"># Độ phức tạp O(log N)</div>
                </div>
              </div>

              {/* Floating Badge Top Right: TinPath AI Tutor (Float animation 2) */}
              <div className="animate-float-2 absolute top-0 right-0 sm:right-2 z-20 bg-[#12223F]/92 hover:bg-[#162a4d] backdrop-blur-md border border-cyan-400/40 rounded-xl p-3 shadow-2xl max-w-[210px] sm:max-w-[220px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/25 flex items-center justify-center text-cyan-300 text-xs">
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
                <p className="text-[10px] text-slate-200 italic bg-[#070E1C]/90 p-2 rounded-lg border border-slate-700/60 shadow-inner">
                  &quot;Đã gợi ý giải thuật Quy hoạch động cho đề thi thử số 08!&quot;
                </p>
              </div>

              {/* 3D Book Fan Display (3 Real Textbook Covers) */}
              <div className="relative z-10 flex items-center justify-center py-8">
                {/* Book 1 (Left): Chuyên đề Tin học 12 (Ứng dụng) */}
                <div className="w-[130px] sm:w-[155px] lg:w-[170px] -mr-8 sm:-mr-10 transform -rotate-8 translate-y-3 hover:translate-y-0 hover:rotate-0 hover:z-30 transition-all duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] cursor-pointer group">
                  <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                    <img
                      src="/images/books/chuyen_de_tin_hoc_12_ung_dung.png"
                      alt="Chuyên đề học tập Tin học 12"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-purple-950/90 text-purple-200 border border-purple-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm backdrop-blur-xs">
                      Chuyên đề 12
                    </div>
                  </div>
                </div>

                {/* Book 2 (Center): Tin học 12 - Định hướng Khoa học máy tính (Featured) */}
                <div className="w-[155px] sm:w-[185px] lg:w-[205px] z-20 transform hover:scale-105 transition-all duration-300 drop-shadow-[0_20px_40px_rgba(2,132,199,0.5)] cursor-pointer group">
                  <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400/70 shadow-2xl bg-slate-900 ring-4 ring-cyan-500/20">
                    <img
                      src="/images/books/tin_hoc_12_ket_noi_cs.png"
                      alt="Tin học 12 - Định hướng Khoa học máy tính"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1 border border-cyan-300/50">
                      <span>⚡</span>
                      <span>Ôn Thi THPT 2025</span>
                    </div>
                  </div>
                </div>

                {/* Book 3 (Right): Tin học 12 - Tin học ứng dụng (Cánh Diều AI) */}
                <div className="w-[130px] sm:w-[155px] lg:w-[170px] -ml-8 sm:-ml-10 transform rotate-8 translate-y-3 hover:translate-y-0 hover:rotate-0 hover:z-30 transition-all duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] cursor-pointer group">
                  <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                    <img
                      src="/images/books/tin_hoc_12_canh_dieu_ung_dung.jpg"
                      alt="Tin học 12 - Tin học ứng dụng Cánh Diều"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-blue-950/90 text-blue-200 border border-blue-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm backdrop-blur-xs">
                      Ứng dụng 12
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Bottom Left: Question Bank Trophy (Float animation 3) */}
              <div className="animate-float-3 absolute bottom-2 left-0 sm:left-2 z-20 bg-[#10203C]/92 hover:bg-[#14284b] backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg sm:text-xl">
                  🏆
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-300">Ngân hàng đề thi</div>
                  <div className="text-xs font-bold text-amber-300">2.500+ Câu trắc nghiệm</div>
                </div>
              </div>

              {/* Floating Badge Bottom Right: C++20 Standard (Float animation 4) */}
              <div className="animate-float-4 absolute bottom-0 right-0 sm:right-2 z-20 bg-[#10203C]/92 hover:bg-[#14284b] backdrop-blur-md border border-cyan-400/40 rounded-xl p-2.5 sm:p-3 shadow-2xl max-w-[190px] sm:max-w-[210px] hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 font-semibold mb-1">
                  <span>⚙️</span>
                  <span>C++20 Standard</span>
                </div>
                <div className="font-mono text-[9px] text-slate-200 bg-[#070E1C]/90 p-1.5 rounded border border-slate-700/60 shadow-inner leading-tight">
                  <div>std::vector&lt;int&gt; v;</div>
                  <div className="text-blue-300">sort(v.begin(), v.end());</div>
                  <div className="text-emerald-400 font-bold pt-0.5">Tối ưu 100 điểm test</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════ 2. BODY SECTIONS CONTAINER (Rộng thoáng max-w-[1400px]) ══════ */}
      <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 space-y-16">

        {/* 2. ABOUT TINPATH (Giới thiệu nền tảng) */}
        <section className="flex flex-col py-2" id="about-tinpath">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
            <span className="font-label-md text-primary uppercase tracking-wider">Về nền tảng</span>
          </div>
          <h2 className="font-headline-sm text-on-surface font-bold mb-2">
            Sứ mệnh kiến tạo tương lai số cho học sinh Quảng Ngãi
          </h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Được thiết kế bám sát chương trình Giáo dục Phổ thông 2018, TinPath tối ưu hóa việc tự học và bồi dưỡng
            tư duy thuật toán cho kỳ thi tốt nghiệp THPT.
          </p>

          {/* 3 Core Values */}
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">navigation</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface text-[15px] mb-1">1. Học tập có định hướng</h3>
                <p className="font-body-sm text-on-surface-variant">
                  Hệ thống hóa toàn diện kiến thức trọng tâm theo từng chủ đề chuẩn THPT từ lớp 10 đến lớp 12, phân tách
                  rõ Tin học ứng dụng và Khoa học máy tính.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px]">track_changes</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface text-[15px] mb-1">2. Luyện tập có mục tiêu</h3>
                <p className="font-body-sm text-on-surface-variant">
                  Thực hành có phân cấp theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao với bộ câu hỏi
                  chuẩn quy cách Bộ GD&ĐT.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[22px]">monitoring</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface text-[15px] mb-1">3. Tiến bộ có thể theo dõi</h3>
                <p className="font-body-sm text-on-surface-variant">
                  Phân tích chi tiết lịch sử làm bài, trực quan hóa radar kỹ năng và chỉ rõ lỗ hổng kiến thức để bù đắp
                  kịp thời trước kỳ thi thật.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY CHOOSE TINPATH */}
        <section className="flex flex-col py-2" id="features">
          <div className="text-center mb-4">
            <span className="font-label-sm text-primary uppercase font-bold tracking-widest">Đặc quyền học tập</span>
            <h2 className="font-headline-sm text-on-surface font-bold mt-1">Tại sao học sinh chọn TinPath?</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[20px]">source</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">Kho học liệu tập trung</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Tổng hợp lý thuyết chuẩn mực, bài giảng số và bộ đề tinh tuyển toàn tỉnh.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[20px]">category</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">Học theo chủ đề</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Cấu trúc logic chuẩn GDPT 2018, chia nhỏ bài học giúp tiếp thu nhanh.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container mb-2">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">Luyện đề chuyên sâu</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Chấm điểm tức thì, thống kê câu sai và kèm lời giải chi tiết từng bước.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-fixed-dim mb-2">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  award_star
                </span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">Thử thách 10 câu</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Mỗi ngày 10 câu ôn tập nhanh duy trì thói quen tư duy thuật toán.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[20px]">neurology</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">AI cá nhân hóa</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Lộ trình học riêng biệt dựa trên năng lực và tốc độ giải bài thực tế.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[20px]">leaderboard</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface mb-1">Bảng xếp hạng</h4>
                <p className="font-body-sm text-on-surface-variant line-clamp-3">
                  Tạo động lực thi đua học tập cùng sĩ tử từ 34 trường THPT Quảng Ngãi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AI PERSONALIZED LEARNING */}
        <section className="flex flex-col my-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-md relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-on-primary/10 text-on-primary font-label-sm mb-3">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Công nghệ Trợ lý AI Thông minh</span>
          </div>

          <h2 className="font-headline-sm font-extrabold text-on-primary mb-2 leading-snug">
            Mỗi học sinh một lộ trình. Mỗi bước học đều có định hướng.
          </h2>

          <p className="font-body-sm text-on-primary-container mb-4">
            Hệ sinh thái AI phân tích dữ liệu làm bài theo thời gian thực, chủ động chỉ dẫn và xây dựng kế hoạch bứt
            phá điểm số chuẩn hóa.
          </p>

          {/* AI Step Process */}
          <div className="flex flex-col gap-2.5 mb-5">
            <div className="p-3 rounded-xl bg-on-primary/10 backdrop-blur-md flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center font-bold font-code-inline text-on-primary">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md font-semibold text-on-primary">Đánh giá kiến thức đầu vào</span>
                <span className="font-body-sm text-on-primary-container truncate">
                  Định vị mục tiêu điểm số & năng lực nền tảng.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-on-primary/10 backdrop-blur-md flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center font-bold font-code-inline text-on-primary">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md font-semibold text-on-primary">Phân tích điểm yếu chuyên sâu</span>
                <span className="font-body-sm text-on-primary-container truncate">
                  Phát hiện chủ đề hay sai sót để ưu tiên ôn tập.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-on-primary/10 backdrop-blur-md flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center font-bold font-code-inline text-on-primary">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md font-semibold text-on-primary">AI Study Planner</span>
                <span className="font-body-sm text-on-primary-container truncate">
                  Tự động lập thời gian biểu học tập cá nhân hóa theo tuần.
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack Integration Pill Strip */}
          <div className="p-3 rounded-xl bg-on-primary/5 flex flex-col gap-2">
            <span className="font-label-sm text-on-primary-container font-semibold">Cốt lõi công nghệ vận hành:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded bg-on-primary/15 font-code-inline text-on-primary text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">bolt</span> Gemini 1.5 Pro
              </span>
              <span className="px-2.5 py-1 rounded bg-on-primary/15 font-code-inline text-on-primary text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">auto_stories</span> NotebookLM
              </span>
              <span className="px-2.5 py-1 rounded bg-on-primary/15 font-code-inline text-on-primary text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">cloud_done</span> Google Cloud Engine
              </span>
            </div>
            <p className="font-body-sm text-on-primary-container italic text-[11px] mt-1">
              *Cam kết: AI là trợ lý thông minh hỗ trợ người học, đề cao vai trò định hướng sư phạm cốt lõi của giáo viên.
            </p>
          </div>
        </section>

        {/* 6. LEARNING RESOURCES (Học liệu chuẩn hóa) */}
        <section className="flex flex-col py-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-[20px]">library_books</span>
            <span className="font-label-md text-primary uppercase tracking-wider">Học liệu chuẩn hóa</span>
          </div>
          <h2 className="font-headline-sm text-on-surface font-bold mb-2">
            Kho tài liệu ôn thi THPT tuyển chọn
          </h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            TinPath tổ chức và khai thác học liệu tham khảo nhằm hỗ trợ quá trình học tập, luyện tập và ôn thi liên tục.
          </p>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-14 h-16 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 p-1 text-center">
                <span className="material-symbols-outlined text-primary text-[24px]">menu_book</span>
                <span className="font-label-sm text-[9px] text-primary font-bold leading-tight mt-0.5">THPT 12</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                  Ôn thi tốt nghiệp
                </span>
                <h4 className="font-label-md text-on-surface font-semibold truncate mt-1">
                  Hướng dẫn ôn thi tốt nghiệp THPT môn Tin học
                </h4>
                <p className="font-body-sm text-on-surface-variant">Tổng hợp chuyên đề & đề tham khảo mới</p>
              </div>
              <button
                onClick={() => onNavigateTab('learning')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 shrink-0 hover:bg-surface-container-high transition-colors"
                title="Xem chuyên đề này"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-14 h-16 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 p-1 text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">terminal</span>
                <span className="font-label-sm text-[9px] text-secondary font-bold leading-tight mt-0.5">ICT 12</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  Tin ứng dụng
                </span>
                <h4 className="font-label-md text-on-surface font-semibold truncate mt-1">
                  Chuyên đề học tập Tin học 12 — Định hướng ICT
                </h4>
                <p className="font-body-sm text-on-surface-variant">Thực hành phần mềm ứng dụng & CSDL</p>
              </div>
              <button
                onClick={() => onNavigateTab('learning')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 shrink-0 hover:bg-surface-container-high transition-colors"
                title="Xem chuyên đề này"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-14 h-16 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 p-1 text-center">
                <span className="material-symbols-outlined text-primary-container text-[24px]">code</span>
                <span className="font-label-sm text-[9px] text-primary-container font-bold leading-tight mt-0.5">CS 12</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
                  Khoa học máy tính
                </span>
                <h4 className="font-label-md text-on-surface font-semibold truncate mt-1">
                  Bài tập Tin học 12 — Định hướng CS
                </h4>
                <p className="font-body-sm text-on-surface-variant">Lập trình thuật toán & cấu trúc dữ liệu</p>
              </div>
              <button
                onClick={() => onNavigateTab('learning')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 shrink-0 hover:bg-surface-container-high transition-colors"
                title="Xem chuyên đề này"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-14 h-16 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 p-1 text-center">
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
                <span className="font-label-sm text-[9px] text-tertiary-container font-bold leading-tight mt-0.5">HSG TỈNH</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                  Đề thi nâng cao
                </span>
                <h4 className="font-label-md text-on-surface font-semibold truncate mt-1">
                  Tuyển tập bộ đề thi chọn HSG THPT Quảng Ngãi
                </h4>
                <p className="font-body-sm text-on-surface-variant">Dành cho đội tuyển bồi dưỡng học sinh giỏi</p>
              </div>
              <button
                onClick={() => onNavigateTab('practice')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 shrink-0 hover:bg-surface-container-high transition-colors"
                title="Xem chuyên đề này"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. TINPATH DÀNH CHO AI? */}
        <section className="flex flex-col py-2">
          <div className="text-center mb-4">
            <span className="font-label-sm text-primary uppercase font-bold tracking-widest">Hệ sinh thái phân quyền</span>
            <h2 className="font-headline-sm text-on-surface font-bold mt-1">TinPath đồng hành cùng ai?</h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Role 1 */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-bold">1. Học sinh THPT</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm">
                  Trung tâm
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 pl-1 font-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Học theo chủ đề & tham gia thử thách 10 câu/ngày.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Theo dõi tiến độ học tập và nhận đề xuất riêng từ AI.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Thi thử trực tuyến với trải nghiệm chấm thi chuẩn xác.</span>
                </li>
              </ul>
            </div>

            {/* Role 2 */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">co_present</span>
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-bold">2. Thầy Cô Giáo</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm">
                  Đồng hành
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 pl-1 font-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Tạo lớp học, giao bài tập và đề kiểm tra định kỳ linh hoạt.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Chia sẻ học liệu số hóa với học sinh toàn trường.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Báo cáo phổ điểm trực quan giúp nhận diện phổ kiến thức.</span>
                </li>
              </ul>
            </div>

            {/* Role 3 */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-bold">3. Ban Quản Trị</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">
                  Vận hành
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 pl-1 font-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Kiểm duyệt chất lượng kho đề, đồng bộ ngân hàng câu hỏi.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Quản trị người dùng, phân quyền theo từng cơ sở đào tạo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>Tối ưu hóa mô hình AI hỗ trợ định hướng sư phạm.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. TINPATH TẠI QUẢNG NGÃI */}
        <section className="flex flex-col py-2" id="schools">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
            <span className="font-label-md text-primary uppercase tracking-wider">Cộng đồng địa phương</span>
          </div>
          <h2 className="font-headline-sm text-on-surface font-bold mb-2">
            Cùng học sinh Quảng Ngãi chinh phục Tin học
          </h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Xây dựng môi trường ôn tập số bình đẳng, kết nối học sinh khắp các trường THPT từ đồng bằng đến miền núi và
            hải đảo Lý Sơn.
          </p>

          {/* School Search Box */}
          <div className="relative mb-3.5">
            <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-outline">search</span>
            <input
              type="text"
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm shadow-xs border border-gray-200 outline-none focus:border-primary"
              placeholder="Tìm trường THPT của bạn..."
            />
          </div>

          {/* Featured Schools Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(showAllSchools ? filteredSchools : filteredSchools.slice(0, 8)).map((sch, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest font-label-sm text-on-surface shadow-xs border border-gray-100"
              >
                {sch}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAllSchools(!showAllSchools)}
            className="w-full py-3 rounded-xl bg-surface-container text-primary font-label-md flex items-center justify-center gap-1.5 active:scale-98 hover:bg-surface-container-high transition-all"
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
          <div className="text-center mb-4">
            <span className="font-label-sm text-primary uppercase font-bold tracking-widest">Lộ trình bứt phá</span>
            <h2 className="font-headline-sm text-on-surface font-bold mt-1">6 bước học tập cùng TinPath</h2>
          </div>

          <div className="flex flex-col gap-3 relative pl-4 before:content-[''] before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-variant">
            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                1
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Đánh giá đầu vào</h4>
                <p className="font-body-sm text-on-surface-variant">Làm bài test nhanh 15 phút xác định điểm xuất phát.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                2
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Xác định mục tiêu điểm số</h4>
                <p className="font-body-sm text-on-surface-variant">Đặt ngưỡng điểm kỳ vọng cho kỳ thi THPT (7+, 8+, 9+).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                3
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Học theo chủ đề</h4>
                <p className="font-body-sm text-on-surface-variant">Ôn chắc lý thuyết & bài tập từ mức độ Nhận biết đến Vận dụng.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                4
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Luyện đề & Thử thách mỗi ngày</h4>
                <p className="font-body-sm text-on-surface-variant">Rèn luyện phản xạ làm bài và làm quen với áp lực thời gian.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                5
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Phân tích kết quả bằng AI</h4>
                <p className="font-body-sm text-on-surface-variant">Chỉ ra câu sai thường gặp, đề xuất bài tập khắc phục tức thì.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-code-inline text-[11px] font-bold flex items-center justify-center shrink-0 z-10">
                6
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-gray-100 flex-1">
                <h4 className="font-label-md text-on-surface font-semibold">Cải thiện & Bứt phá điểm số</h4>
                <p className="font-body-sm text-on-surface-variant">Tự tin bước vào phòng thi chính thức với phong độ cao nhất.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA & FOOTER */}
        <section className="flex flex-col py-2" id="cta-footer">
          {/* Big CTA Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-gray-100 text-center flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[28px]">stars</span>
            </div>
            <h3 className="font-headline-sm text-on-surface font-extrabold">
              Bắt đầu hành trình Tin học của bạn cùng TinPath.
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Chủ động học tập, luyện tập có mục tiêu và từng bước củng cố kiến thức cho kỳ thi tốt nghiệp THPT.
            </p>
            <button
              onClick={() => onNavigateTab('learning')}
              className="w-full h-12 mt-2 rounded-xl bg-primary hover:bg-blue-900 text-on-primary font-label-md flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">flag</span>
              <span>Bắt đầu học ngay miễn phí</span>
            </button>
          </div>

          {/* Detailed Footer */}
          <footer className="flex flex-col gap-6 pt-4 text-on-surface-variant border-t border-gray-200">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-primary font-bold">TinPath</span>
                <span className="px-2 py-0.5 rounded bg-surface-container font-code-inline text-[10px] text-primary">
                  Quảng Ngãi
                </span>
              </div>
              <p className="font-body-sm">
                Chinh phục Tin học THPT cùng học sinh Quảng Ngãi. Nền tảng học tập số thông minh, cá nhân hóa theo
                Chương trình GDPT 2018.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-label-sm">
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">Học tập</span>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  Theo chủ đề lớp 12
                </button>
                <button
                  onClick={() => onNavigateTab('practice')}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  Bộ đề thi thử 2025
                </button>
                <button
                  onClick={() => onNavigateTab('personalized_ai')}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  AI Study Mentor
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">Tài nguyên</span>
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  Tài liệu tham khảo
                </button>
                <button
                  onClick={() => onOpenAuth()}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  Dành cho giáo viên
                </button>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="text-left text-on-surface hover:text-primary transition-colors"
                >
                  34 trường THPT
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
              <span className="font-label-sm text-on-surface font-semibold">Ghi chú học thuật & Bản quyền:</span>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                Nội dung kiến thức, câu hỏi trắc nghiệm và đề luyện được biên soạn, chọn lọc phục vụ mục đích học tập phi
                thương mại cho cộng đồng học sinh, giáo viên tỉnh Quảng Ngãi.
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-primary font-medium">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span>hotro@tinpath.edu.vn — Hỗ trợ 24/7</span>
              </div>
            </div>

            <div className="text-center font-body-sm text-[11px] text-outline pt-2">
              © 2025 TinPath Quảng Ngãi. Đồng hành cùng ước mơ số.
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};
