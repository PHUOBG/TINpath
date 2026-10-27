import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TopicLearning } from './components/student/TopicLearning';
import { ExamPractice } from './components/student/ExamPractice';
import { ExamTakingModal } from './components/student/ExamTakingModal';
import { PersonalizedAI } from './components/student/PersonalizedAI';
import { Leaderboard } from './components/student/Leaderboard';
import { UserProfileView } from './components/student/UserProfileView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { GoogleToolsHub } from './components/google/GoogleToolsHub';
import { AuthModal } from './components/auth/AuthModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { FloatingAiBot } from './components/common/FloatingAiBot';

import {
  UserProfile,
  UserRole,
  SubjectTopicId,
  Exam,
  ExamAttempt,
} from './types';
import { storageService } from './services/storageService';
import { OFFICIAL_EXAMS, DAILY_CHALLENGE_POOL } from './data/officialExamsData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { verifyServerXP } from './services/geminiClient';
import {
  saveExamAttempt,
  updateProfile,
  saveClassroom,
  saveAssignment,
  recordDailyChallengeAttempt,
} from './services/supabaseDbService';
import { onAuthStateChange } from './services/supabaseAuthService';
import { isSupabaseConfigured } from './services/supabaseClient';

export default function App() {
  // Theme state (mặc định giao diện sáng)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => storageService.getThemeMode());

  // User & role state
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());

  // Auth state: true if user has completed login/registration flow
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = storageService.getUserProfile();
    return saved.onboardingCompleted === true;
  });

  // Auth view: 'landing' | 'login'
  const [authView, setAuthView] = useState<'landing' | 'login'>('landing');

  // Register/Auth modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  const handleOpenAuth = (mode: 'login' | 'register' = 'register') => {
    if (mode === 'login') {
      setAuthView('login');
      setIsRegisterModalOpen(false);
    } else {
      setAuthModalMode(mode);
      setIsRegisterModalOpen(true);
    }
  };

  // Navigation state (Mặc định vào dashboard sau khi đăng nhập)
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeTopicId, setActiveTopicId] = useState<SubjectTopicId>('12B');

  // Completed topics record
  const [completedTopics, setCompletedTopics] = useState<Record<SubjectTopicId, boolean>>(() =>
    storageService.getCompletedTopics()
  );

  // Classrooms and assignments for teacher/student
  const [classrooms, setClassrooms] = useState(() => storageService.getClassrooms());
  const [assignments, setAssignments] = useState(() => storageService.getAssignments());
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() =>
    storageService.getExamAttempts()
  );

  // Modals state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [isExamPracticeMode, setIsExamPracticeMode] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGoogleHubOpen, setIsGoogleHubOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Google Firebase Auth state
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Initialize theme
  useEffect(() => {
    storageService.setThemeMode(themeMode);
  }, [themeMode]);

  // Initialize Firebase Auth listener (giữ nguyên cho Google Sign-in hiện tại)
  useEffect(() => {
    const unsubscribe = initAuth(
      (firebaseUser, token) => {
        setIsGoogleLoggedIn(true);
        if (firebaseUser.email) {
          setUser((prev) => {
            const updated = {
              ...prev,
              email: firebaseUser.email || prev.email,
              displayName: firebaseUser.displayName || prev.displayName,
            };
            storageService.saveUserProfile(updated);
            return updated;
          });
        }
      },
      () => {
        setIsGoogleLoggedIn(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Lấy session Supabase nếu đã đăng nhập từ trước
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const cleanup = onAuthStateChange((authUser) => {
      if (authUser && !isLoggedIn) {
        const profile = storageService.getUserProfile();
        if (profile.onboardingCompleted) {
          // Khôi phục session tự động nếu đã hoàn thành onboarding
          const updated: UserProfile = {
            ...profile,
            id: authUser.id,
            email: authUser.email,
            displayName: authUser.displayName || profile.displayName,
            avatarUrl: authUser.avatarUrl || profile.avatarUrl,
          };
          setUser(updated);
          setIsLoggedIn(true);
        }
      }
    });
    return cleanup;
  }, []);

  // Theme toggle
  const handleToggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
  };

  // Google sign in trigger
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const res = await googleSignIn();
      if (res) {
        setIsGoogleLoggedIn(true);
        setUser((prev) => {
          const updated = {
            ...prev,
            email: res.user.email || prev.email,
            displayName: res.user.displayName || prev.displayName,
          };
          storageService.saveUserProfile(updated);
          return updated;
        });
      }
    } catch (err: any) {
      alert(`Đăng nhập Google thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setIsGoogleLoggedIn(false);
  };

  // Handle successful login/registration from RegisterModal or LoginPage
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setAuthView('landing');
    if (loggedInUser.role === 'student') setCurrentTab('home');
    else if (loggedInUser.role === 'teacher') setCurrentTab('teacher_overview');
  };

  // Handle logout - return to landing
  const handleLogout = async () => {
    await logout();
    setIsGoogleLoggedIn(false);
    setIsLoggedIn(false);
    setAuthView('landing');
    // Reset profile so next visit starts fresh
    const resetUser = storageService.getUserProfile();
    resetUser.onboardingCompleted = false;
    storageService.saveUserProfile({ ...resetUser, onboardingCompleted: false });
    setUser({ ...resetUser, onboardingCompleted: false });
  };

  // Role switch handler
  const handleSwitchRole = (newRole: UserRole) => {
    const updated = storageService.updateRole(newRole);
    setUser(updated);
    if (newRole === 'student') setCurrentTab('home');
    else if (newRole === 'teacher') setCurrentTab('teacher_overview');
  };

  // Save profile — ghi vào Supabase + localStorage
  const handleSaveProfile = async (updated: UserProfile) => {
    setUser(updated);
    storageService.saveUserProfile(updated);
    if (isSupabaseConfigured()) {
      await updateProfile(updated.id, updated);
    }
  };

  // Toggle completed topic
  const handleToggleCompleteTopic = (topicId: SubjectTopicId) => {
    storageService.toggleTopicCompleted(topicId);
    setCompletedTopics(storageService.getCompletedTopics());
    setUser(storageService.getUserProfile());
  };

  // Start Exam by ID
  const handleStartExam = (examId: string, isRetake?: boolean) => {
    const found = OFFICIAL_EXAMS.find((e) => e.id === examId) || OFFICIAL_EXAMS[0];
    setIsExamPracticeMode(Boolean(isRetake));
    setActiveExam(found);
  };

  // Start Custom Generated Exam (AI Remedial / Topic)
  const handleStartCustomExam = (customExam: Exam) => {
    setIsExamPracticeMode(true);
    setActiveExam(customExam);
  };

  // Start Daily 10 Challenge
  const handleStartDailyChallenge = () => {
    const dailyExam: Exam = {
      id: `daily_${new Date().toISOString().split('T')[0]}`,
      title: 'Thử thách 10 câu trắc nghiệm hằng ngày',
      source: 'Ngân hàng câu hỏi TinPath GDPT 2018',
      durationMinutes: 15,
      year: 2025,
      difficulty: 'Trung bình',
      description: 'Luyện 10 câu trắc nghiệm mỗi ngày để nhận điểm thưởng XP và bảo vệ chuỗi ngày học liên tục.',
      totalScore: 10,
      baseXP: 30,
      part1Questions: DAILY_CHALLENGE_POOL,
      part2Questions: [], // Daily challenge focuses on Part 1
    };
    setIsExamPracticeMode(true);
    setActiveExam(dailyExam);
  };

  // Start Topic Custom Quiz
  const handleStartTopicQuiz = (topicId: SubjectTopicId, count: number, level: string) => {
    const allQuestions = OFFICIAL_EXAMS.flatMap((e) => e.part1Questions);
    const pool = allQuestions.filter((q) => q.topicId === topicId);
    const questionsToUse = pool.length > 0 ? pool.slice(0, count) : allQuestions.slice(0, count);

    const topicQuiz: Exam = {
      id: `quiz_${topicId}_${Date.now()}`,
      title: `Bài luyện tập chuyên đề: ${topicId}`,
      source: 'Ngân hàng chuyên đề TinPath GDPT 2018',
      durationMinutes: Math.round(count * 1.5),
      year: 2025,
      difficulty: 'Cơ bản',
      description: `Luyện tập chuyên sâu ${count} câu hỏi chủ đề ${topicId}.`,
      totalScore: 10,
      baseXP: 40,
      part1Questions: questionsToUse,
      part2Questions: [],
    };
    setIsExamPracticeMode(true);
    setActiveExam(topicQuiz);
  };

  // Submit Exam Attempt — ghi vào Supabase + localStorage
  const handleSubmitAttempt = async (attempt: ExamAttempt) => {
    if (attempt.examId.startsWith('daily_')) {
      try {
        const verifyRes = await verifyServerXP({
          type: 'daily_challenge',
          correctCount: attempt.correctPart1Count,
          totalQuestions: 10,
        });
        const awardedXP = verifyRes.awardedXP || 80;
        storageService.recordDailyChallengeCompleted(attempt.correctPart1Count, awardedXP);
        if (isSupabaseConfigured()) {
          recordDailyChallengeAttempt({
            userId: user.id,
            score: attempt.totalScore,
            totalQuestions: 10,
            correctCount: attempt.correctPart1Count,
            xpAwarded: awardedXP,
          }).catch(console.error);
        }
      } catch {
        storageService.recordDailyChallengeCompleted(attempt.correctPart1Count, 80);
      }
    } else {
      // Ghi vào Supabase nếu đã cấu hình
      storageService.saveExamAttempt(attempt);
      if (isSupabaseConfigured()) {
        saveExamAttempt(attempt).catch(console.error);
        // Cập nhật XP trong profile Supabase
        const currentUser = storageService.getUserProfile();
        updateProfile(currentUser.id, { xp: currentUser.xp }).catch(console.error);
      }
    }

    setExamAttempts(storageService.getExamAttempts());
    setUser(storageService.getUserProfile());
  };

  // Continue topic from dashboard
  const handleContinueTopic = (topicId: string) => {
    setActiveTopicId(topicId as SubjectTopicId);
    setCurrentTab('learning');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa] dark:bg-[#121212] text-[#202020] dark:text-[#E0E0E0] transition-colors">
      {/* ── UNAUTHENTICATED: Show Landing Page or Login Page ── */}
      {!isLoggedIn && (
        <>
          {/* Landing Page always visible underneath */}
          <LandingPage
            user={user}
            onNavigateTab={setCurrentTab}
            onOpenAuth={handleOpenAuth}
            onStartDailyChallenge={() => handleOpenAuth('register')}
            onTakeExam={() => handleOpenAuth('register')}
          />

          {/* Login Modal Overlay */}
          {authView === 'login' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              {/* Blurred backdrop of landing page */}
              <div
                className="absolute inset-0 backdrop-blur-sm bg-black/40"
                onClick={() => setAuthView('landing')}
              />
              {/* Login Card */}
              <div className="relative z-10 w-full max-w-[480px] mx-4">
                <LoginPage
                  onBackToHome={() => setAuthView('landing')}
                  onLoginSuccess={(loggedInUser) => {
                    handleLoginSuccess(loggedInUser);
                  }}
                  onSwitchToRegister={() => {
                    setAuthView('landing');
                    handleOpenAuth('register');
                  }}
                />
              </div>
            </div>
          )}

          {/* Register Modal */}
          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            initialMode={authModalMode}
            onSwitchToLogin={() => {
              setIsRegisterModalOpen(false);
              setAuthView('login');
            }}
          />
        </>
      )}

      {/* ── AUTHENTICATED: Show App Shell ── */}
      {isLoggedIn && (
        <>
          {/* Top Navigation */}
          <Navbar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            user={user}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            onOpenProfile={() => setCurrentTab('profile')}
            onSwitchRole={handleSwitchRole}
            onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isGoogleAuthenticated={isGoogleLoggedIn}
            onSignOut={handleLogout}
          />

      {/* Main View Area: Tràn rộng sang 2 bên trái phải, dịch xuống cho cân xứng với top navbar */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-8 2xl:px-10 pt-5 sm:pt-6 md:pt-8 pb-14 sm:pb-16">
        {/* STUDENT VIEWS */}
        {user.role === 'student' && (
          <>
            {currentTab === 'home' && (
              <StudentDashboard
                user={user}
                assignments={assignments}
                examAttempts={examAttempts}
                onStartDailyChallenge={handleStartDailyChallenge}
                onContinueTopic={handleContinueTopic}
                onTakeExam={handleStartExam}
                onNavigateTab={setCurrentTab}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              />
            )}

            {currentTab === 'learning' && (
              <TopicLearning
                initialTopicId={activeTopicId}
                completedTopics={completedTopics}
                onToggleCompleteTopic={handleToggleCompleteTopic}
                onPracticeTopicQuiz={(tId) => handleStartTopicQuiz(tId, 10, 'all')}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              />
            )}

            {currentTab === 'practice' && (
              <ExamPractice
                onStartExam={handleStartExam}
                onStartCustomExam={handleStartCustomExam}
                onStartDailyChallenge={handleStartDailyChallenge}
                onStartTopicQuiz={handleStartTopicQuiz}
                completedDailyToday={user.completedDailyToday}
                streakDays={user.streakDays}
                examAttempts={examAttempts}
              />
            )}

            {currentTab === 'personalized_ai' && (
              <PersonalizedAI
                user={user}
                examAttempts={examAttempts}
                onUpdateUser={handleSaveProfile}
                onNavigateTopic={handleContinueTopic}
                onStartExam={handleStartExam}
                onStartTopicQuiz={handleStartTopicQuiz}
                onStartDailyChallenge={handleStartDailyChallenge}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'leaderboard' && (
              <Leaderboard currentUser={user} onClose={() => setCurrentTab('home')} />
            )}

            {currentTab === 'profile' && (
              <UserProfileView
                user={user}
                examAttempts={examAttempts}
                completedTopics={completedTopics}
                onUpdateUser={setUser}
                onNavigateTab={setCurrentTab}
              />
            )}
          </>
        )}

        {/* TEACHER VIEWS */}
        {user.role === 'teacher' && (
          <TeacherDashboard
            currentTab={currentTab}
            classrooms={classrooms}
            assignments={assignments}
            onAddClassroom={(cls) => {
              storageService.addClassroom(cls);
              setClassrooms(storageService.getClassrooms());
              if (isSupabaseConfigured()) {
                saveClassroom(cls).catch(console.error);
              }
            }}
            onAddAssignment={(assign) => {
              storageService.addAssignment(assign);
              setAssignments(storageService.getAssignments());
              if (isSupabaseConfigured()) {
                saveAssignment(assign).catch(console.error);
              }
            }}
          />
        )}
      </main>

      <Footer
        onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Exam Taking Workspace */}
      {activeExam && (
        <ExamTakingModal
          isOpen={Boolean(activeExam)}
          onClose={() => {
            setActiveExam(null);
            setIsExamPracticeMode(false);
          }}
          exam={activeExam}
          track={user.track}
          onSubmitAttempt={handleSubmitAttempt}
          userId={user.id}
          isPracticeMode={isExamPracticeMode}
        />
      )}

      {/* 2. Profile & Quảng Ngãi School Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfile}
        onGoogleSignIn={handleGoogleSignIn}
        isSigningIn={isSigningIn}
        isLoggedIn={isGoogleLoggedIn}
      />

      {/* 3. Google Ecosystem Hub Modal */}
      <GoogleToolsHub
        isOpen={isGoogleHubOpen}
        onClose={() => setIsGoogleHubOpen(false)}
        user={user}
        isLoggedIn={isGoogleLoggedIn}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* 4. Privacy & Terms Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 dark:border-[#333] shadow-2xl text-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Chính sách Quyền riêng tư & Bảo vệ Dữ liệu TinPath
            </h3>
            <div className="space-y-2.5 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              <p>
                1. <strong>Bảo mật thông tin:</strong> TinPath cam kết không chia sẻ địa chỉ email, số điện thoại hay kết quả bài kiểm tra riêng tư của học sinh cho bên thứ ba.
              </p>
              <p>
                2. <strong>Bảng xếp hạng công khai:</strong> Chỉ hiển thị tên gọi, trường THPT, điểm XP và chuỗi ngày học để tạo động lực thi đua học tập lành mạnh.
              </p>
              <p>
                3. <strong>Tích hợp Google:</strong> Mọi thao tác lưu trữ Google Drive, xuất Google Sheets hay gửi Gmail đều chỉ thực hiện khi có sự xác nhận rõ ràng của người dùng.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-5 py-2 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-xs transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Detailed Ranking & Organization Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-7xl 2xl:max-w-[95vw] p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-[#333] shadow-2xl max-h-[94vh] overflow-y-auto">
            <Leaderboard
              currentUser={user}
              onClose={() => setIsLeaderboardOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Floating AI Bot in bottom-right corner: Bot Tin Học TQT */}
      {!activeExam && (
        <FloatingAiBot user={user} currentTopicId={activeTopicId} />
      )}
        </>
      )}
    </div>
  );
}
