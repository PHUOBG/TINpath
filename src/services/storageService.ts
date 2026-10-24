import {
  UserProfile,
  ExamAttempt,
  XPTransaction,
  Classroom,
  Assignment,
  StudyRoadmapItem,
  SubjectTopicId,
  ExamComment,
  DiagnosticReport,
  AiRoadmapPlan,
  RoadmapDayItem,
  TopicMasteryInfo,
  TopicMasteryStatus,
} from '../types';
import { QUANG_NGAI_SCHOOLS } from '../data/schoolsData';

const STORAGE_KEYS = {
  USER_PROFILE: 'tinpath_user_profile',
  EXAM_ATTEMPTS: 'tinpath_exam_attempts',
  XP_TRANSACTIONS: 'tinpath_xp_transactions',
  DAILY_CHALLENGES: 'tinpath_daily_challenges',
  ROADMAP_ITEMS: 'tinpath_roadmap_items',
  ROADMAP_PLAN: 'tinpath_ai_roadmap_plan',
  DIAGNOSTIC_REPORT: 'tinpath_diagnostic_report',
  COMPLETED_TOPICS: 'tinpath_completed_topics',
  CLASSROOMS: 'tinpath_classrooms',
  ASSIGNMENTS: 'tinpath_assignments',
  THEME_MODE: 'tinpath_theme_mode',
  COMMENTS: 'tinpath_exam_comments',
};

export const DEFAULT_STUDENT: UserProfile = {
  id: 'student_qn_01',
  email: 'fightingalone0408@gmail.com',
  displayName: 'Nguyễn Văn An',
  role: 'student',
  province: 'Quảng Ngãi',
  district: 'TP. Quảng Ngãi',
  schoolId: 'qn_le_khiet',
  schoolName: 'THPT chuyên Lê Khiết',
  grade: '12',
  track: 'CS',
  targetScore: 9.0,
  dailyStudyMinutes: 45,
  xp: 320,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedDailyToday: false,
  onboardingCompleted: true,
  diagnosticScore: 7.5,
  createdAt: new Date().toISOString(),
};

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Trần Bảo Long', schoolName: 'THPT chuyên Lê Khiết', district: 'TP. Quảng Ngãi', xp: 850, streak: 18, isCurrentUser: false },
  { rank: 2, name: 'Nguyễn Thị Mỹ Duyên', schoolName: 'THPT Trần Quốc Tuấn', district: 'TP. Quảng Ngãi', xp: 740, streak: 14, isCurrentUser: false },
  { rank: 3, name: 'Lê Hoàng Nam', schoolName: 'THPT Bình Sơn', district: 'Huyện Bình Sơn', xp: 680, streak: 12, isCurrentUser: false },
  { rank: 4, name: 'Phạm Minh Quân', schoolName: 'THPT Ba Gia', district: 'Huyện Sơn Tịnh', xp: 590, streak: 9, isCurrentUser: false },
  { rank: 5, name: 'Nguyễn Văn An (Bạn)', schoolName: 'THPT chuyên Lê Khiết', district: 'TP. Quảng Ngãi', xp: 320, streak: 5, isCurrentUser: true },
  { rank: 6, name: 'Võ Thị Thanh Thảo', schoolName: 'THPT Số 1 Tư Nghĩa', district: 'Huyện Tư Nghĩa', xp: 310, streak: 4, isCurrentUser: false },
  { rank: 7, name: 'Đặng Quốc Huy', schoolName: 'THPT Số 1 Đức Phổ', district: 'Thị xã Đức Phổ', xp: 290, streak: 6, isCurrentUser: false },
  { rank: 8, name: 'Bùi Gia Khang', schoolName: 'THPT Mộ Đức 1', district: 'Huyện Mộ Đức', xp: 260, streak: 3, isCurrentUser: false },
  { rank: 9, name: 'Hồ Văn Lộc', schoolName: 'THPT Sơn Hà', district: 'Huyện Sơn Hà', xp: 240, streak: 4, isCurrentUser: false },
  { rank: 10, name: 'Đinh Thị Mai', schoolName: 'THPT Trà Bồng', district: 'Huyện Trà Bồng', xp: 220, streak: 2, isCurrentUser: false },
];

export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'class_12tin1',
    name: '12 Tin Học - Luyện Thi Tốt Nghiệp THPT 2025',
    code: 'TIN12-QN',
    grade: '12',
    schoolName: 'THPT chuyên Lê Khiết',
    teacherId: 'teacher_01',
    teacherName: 'Thầy Nguyễn Trọng Bình',
    studentCount: 38,
    createdAt: '2025-09-05',
  },
  {
    id: 'class_12a2',
    name: '12A2 - Chuyên đề Định hướng Khoa học máy tính',
    code: 'CS12-LK',
    grade: '12',
    schoolName: 'THPT chuyên Lê Khiết',
    teacherId: 'teacher_01',
    teacherName: 'Thầy Nguyễn Trọng Bình',
    studentCount: 35,
    createdAt: '2025-09-05',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign_01',
    classroomId: 'class_12tin1',
    title: 'Bài tập tuần 1: 50 câu trắc nghiệm Kiến trúc Mạng & Giao thức TCP/IP',
    topicId: '12B',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    questionCount: 15,
    allowRetake: true,
    status: 'active',
    submissionsCount: 29,
  },
  {
    id: 'assign_02',
    classroomId: 'class_12tin1',
    title: 'Kiểm tra 15 phút: Cú pháp SQL và Mô hình CSDL quan hệ',
    topicId: '11F',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    questionCount: 10,
    allowRetake: false,
    status: 'active',
    submissionsCount: 18,
  },
];

export const storageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  updateRole(role: UserRole): UserProfile {
    const user = this.getUserProfile();
    const updated = { ...user, role };
    this.saveUserProfile(updated);
    return updated;
  },

  getExamAttempts(): ExamAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAM_ATTEMPTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveExamAttempt(attempt: ExamAttempt): void {
    const attempts = this.getExamAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify(attempts));

    // Update user profile XP and statistics
    const user = this.getUserProfile();
    user.xp += attempt.xpEarned;
    this.saveUserProfile(user);

    this.addXPTransaction({
      id: `xp_${Date.now()}`,
      userId: user.id,
      amount: attempt.xpEarned,
      source: 'exam_completion',
      description: `Hoàn thành bài thi ${attempt.examTitle} (${attempt.totalScore.toFixed(2)}đ)`,
      timestamp: new Date().toISOString(),
    });
  },

  getXPTransactions(): XPTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.XP_TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'xp_init_1',
        userId: 'student_qn_01',
        amount: 50,
        source: 'diagnostic',
        description: 'Hoàn thành bài đánh giá đầu vào',
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'xp_init_2',
        userId: 'student_qn_01',
        amount: 80,
        source: 'daily_challenge',
        description: 'Hoàn thành thử thách 10 câu hằng ngày',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
  },

  addXPTransaction(tx: XPTransaction): void {
    const list = this.getXPTransactions();
    list.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.XP_TRANSACTIONS, JSON.stringify(list));
  },

  isDailyChallengeCompletedToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const completedMap = this.getDailyCompletedDates();
    return Boolean(completedMap[today]);
  },

  getDailyCompletedDates(): Record<string, boolean> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  recordDailyChallengeCompleted(correctCount: number, xpEarned: number): void {
    const today = new Date().toISOString().split('T')[0];
    const map = this.getDailyCompletedDates();
    map[today] = true;
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(map));

    const user = this.getUserProfile();
    user.completedDailyToday = true;
    user.xp += xpEarned;
    user.streakDays += 1;
    user.lastActiveDate = today;
    this.saveUserProfile(user);

    this.addXPTransaction({
      id: `xp_daily_${Date.now()}`,
      userId: user.id,
      amount: xpEarned,
      source: 'daily_challenge',
      description: `Hoàn thành thử thách 10 câu ngày ${today} (${correctCount}/10 câu đúng)`,
      timestamp: new Date().toISOString(),
    });
  },

  getCompletedTopics(): Record<SubjectTopicId, boolean> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOPICS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      '12A': true,
      '12B': false,
      '12D': false,
      '12G': false,
      '12F': false,
      '12E_ICT': false,
      '12F_CS': false,
      '11F': false,
      '11E_ICT': false,
      '11F_CS': false,
      '10_PYTHON': false,
    };
  },

  toggleTopicCompleted(topicId: SubjectTopicId): boolean {
    const map = this.getCompletedTopics();
    const newState = !map[topicId];
    map[topicId] = newState;
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify(map));

    if (newState) {
      const user = this.getUserProfile();
      user.xp += 20;
      this.saveUserProfile(user);
      this.addXPTransaction({
        id: `xp_topic_${Date.now()}`,
        userId: user.id,
        amount: 20,
        source: 'lesson_complete',
        description: `Hoàn thành toàn bộ nội dung chủ đề ${topicId}`,
        timestamp: new Date().toISOString(),
      });
    }
    return newState;
  },

  getClassrooms(): Classroom[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_CLASSROOMS;
  },

  addClassroom(cls: Classroom): void {
    const list = this.getClassrooms();
    list.unshift(cls);
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(list));
  },

  getAssignments(): Assignment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_ASSIGNMENTS;
  },

  addAssignment(assign: Assignment): void {
    const list = this.getAssignments();
    list.unshift(assign);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(list));
  },

  getThemeMode(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME_MODE) as 'light' | 'dark') || 'light';
  },

  setThemeMode(mode: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  getComments(examId?: string): ExamComment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      let comments: ExamComment[] = data ? JSON.parse(data) : INITIAL_COMMENTS;
      if (!Array.isArray(comments) || comments.length === 0) {
        comments = INITIAL_COMMENTS;
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      }
      if (examId) {
        return comments.filter((c) => c.examId === examId);
      }
      return comments;
    } catch (e) {
      return INITIAL_COMMENTS;
    }
  },

  addComment(payload: Omit<ExamComment, 'id' | 'createdAt' | 'likes'>): ExamComment {
    const list = this.getComments();
    const newComment: ExamComment = {
      ...payload,
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: 'Vừa xong',
      likes: 0,
    };
    list.unshift(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(list));
    return newComment;
  },

  likeComment(commentId: string): void {
    const list = this.getComments();
    const item = list.find((c) => c.id === commentId);
    if (item) {
      item.likes += 1;
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(list));
    }
  },

  getDiagnosticReport(): DiagnosticReport | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_REPORT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading diagnostic report:', e);
    }
    return null;
  },

  saveDiagnosticReport(report: DiagnosticReport): void {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC_REPORT, JSON.stringify(report));

    const user = this.getUserProfile();
    user.diagnosticScore = report.score;
    user.xp += 50;
    this.saveUserProfile(user);

    this.addXPTransaction({
      id: `xp_diag_${Date.now()}`,
      userId: user.id,
      amount: 50,
      source: 'diagnostic',
      description: `Hoàn thành đánh giá năng lực: ${report.examTitle} (${report.score.toFixed(2)}đ)`,
      timestamp: new Date().toISOString(),
    });
  },

  getRoadmapPlan(): AiRoadmapPlan | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP_PLAN);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading roadmap plan:', e);
    }
    return null;
  },

  saveRoadmapPlan(plan: AiRoadmapPlan): void {
    localStorage.setItem(STORAGE_KEYS.ROADMAP_PLAN, JSON.stringify(plan));
  },

  updateRoadmapDayStatus(dayNumber: number, status: 'todo' | 'in_progress' | 'completed'): AiRoadmapPlan | null {
    const plan = this.getRoadmapPlan();
    if (!plan || !Array.isArray(plan.dailyRoadmap)) return null;

    const item = plan.dailyRoadmap.find((d) => d.day === dayNumber);
    if (item) {
      const oldStatus = item.status;
      item.status = status;
      if (status === 'completed' && oldStatus !== 'completed') {
        item.completedAt = new Date().toISOString();
        const user = this.getUserProfile();
        user.xp += 25;
        this.saveUserProfile(user);

        this.addXPTransaction({
          id: `xp_roadmap_${dayNumber}_${Date.now()}`,
          userId: user.id,
          amount: 25,
          source: 'lesson_complete',
          description: `Hoàn thành nhiệm vụ Ngày ${dayNumber}: ${item.topicTitle}`,
          timestamp: new Date().toISOString(),
        });
      }
      this.saveRoadmapPlan(plan);
    }
    return plan;
  },

  calculateTopicMastery(
    attempts: ExamAttempt[],
    diagnostic?: DiagnosticReport | null
  ): Record<SubjectTopicId, TopicMasteryInfo> {
    const allTopicIds: SubjectTopicId[] = [
      '12A', '12B', '12D', '12G', '12F', '12E_ICT', '12F_CS',
      '11F', '11E_ICT', '11F_CS', '10_PYTHON'
    ];

    const topicNames: Record<SubjectTopicId, string> = {
      '12A': 'Trí tuệ nhân tạo (AI)',
      '12B': 'Mạng máy tính & Giao thức Internet',
      '12D': 'Tính nhân văn trong thế giới ảo',
      '12G': 'Nhóm nghề dịch vụ & Quản trị',
      '12F': 'Thiết kế trang web (HTML & CSS)',
      '12E_ICT': 'Thực hành phần mềm tạo trang web',
      '12F_CS': 'Học máy & Khoa học dữ liệu',
      '11F': 'Hệ cơ sở dữ liệu (RDBMS & SQL)',
      '11E_ICT': 'Khai thác & Quản trị CSDL',
      '11F_CS': 'Kĩ thuật lập trình & Thuật toán',
      '10_PYTHON': 'Lập trình Python cơ bản',
    };

    const topicWeights: Record<SubjectTopicId, string> = {
      '12A': '1.5 - 2.0 điểm',
      '12B': '2.0 - 2.5 điểm',
      '12D': '0.5 - 1.0 điểm',
      '12G': '0.5 - 1.0 điểm',
      '12F': '1.0 - 1.5 điểm',
      '12E_ICT': '1.0 - 1.5 điểm',
      '12F_CS': '1.0 - 1.5 điểm',
      '11F': '1.5 - 2.0 điểm',
      '11E_ICT': '1.0 - 1.5 điểm',
      '11F_CS': '1.5 - 2.0 điểm',
      '10_PYTHON': '0.5 - 1.0 điểm',
    };

    const stats: Record<SubjectTopicId, { answered: number; correct: number; commonMistakes: string[] }> = {
      '12A': { answered: 0, correct: 0, commonMistakes: ['Nhầm lẫn đặc trưng AI và AGI', 'Khái niệm Turing Test'] },
      '12B': { answered: 0, correct: 0, commonMistakes: ['Phân biệt Switch (MAC) và Router (IP)', 'Đổi nhị phân IPv4 và cấu trúc IPv6'] },
      '12D': { answered: 0, correct: 0, commonMistakes: ['Bản quyền số và sở hữu trí tuệ', 'An toàn dữ liệu cá nhân'] },
      '12G': { answered: 0, correct: 0, commonMistakes: ['Phân biệt chuyên viên quản trị hệ thống và phát triển phần mềm'] },
      '12F': { answered: 0, correct: 0, commonMistakes: ['Box Model (margin vs padding)', 'Thẻ ngữ nghĩa semantic HTML5'] },
      '12E_ICT': { answered: 0, correct: 0, commonMistakes: ['Cấu trúc trang web tĩnh vs động', 'Biên tập form nhập liệu'] },
      '12F_CS': { answered: 0, correct: 0, commonMistakes: ['Học có giám sát (Supervised) vs Không giám sát (Unsupervised)'] },
      '11F': { answered: 0, correct: 0, commonMistakes: ['Khóa chính (Primary Key) vs Khóa ngoại (Foreign Key)', 'Cú pháp GROUP BY và HAVING trong SQL'] },
      '11E_ICT': { answered: 0, correct: 0, commonMistakes: ['Tạo Form và Report trong Access', 'Mối liên kết 1-nhiều giữa bảng'] },
      '11F_CS': { answered: 0, correct: 0, commonMistakes: ['Độ phức tạp thuật toán O(log n) của Binary Search', 'Đệ quy và quay lui'] },
      '10_PYTHON': { answered: 0, correct: 0, commonMistakes: ['Chỉ số index mảng âm trong Python', 'Vòng lặp for range(start, stop, step)'] },
    };

    // 1. Tích hợp từ Diagnostic Report nếu có
    if (diagnostic && Array.isArray(diagnostic.topicBreakdown)) {
      for (const tb of diagnostic.topicBreakdown) {
        if (stats[tb.topicId]) {
          stats[tb.topicId].answered += tb.total;
          stats[tb.topicId].correct += tb.correct;
        }
      }
      if (Array.isArray(diagnostic.wrongQuestions)) {
        for (const wq of diagnostic.wrongQuestions) {
          if (stats[wq.topicId] && wq.content) {
            const snippet = wq.content.slice(0, 80);
            if (!stats[wq.topicId].commonMistakes.includes(snippet)) {
              stats[wq.topicId].commonMistakes.unshift(snippet);
            }
          }
        }
      }
    }

    // 2. Tích hợp từ Exam Attempts
    for (const attempt of attempts) {
      if (attempt.answers) {
        // Exam attempts provide aggregate scores, but we can distribute proportionally or check breakdown
        if (Array.isArray(attempt.part2Breakdown)) {
          // If 12B or 11F was in exam
          stats['12B'].answered += 4;
          stats['12B'].correct += Math.round(attempt.part1Score > 4 ? 3 : 2);
          stats['11F'].answered += 4;
          stats['11F'].correct += Math.round(attempt.totalScore > 7 ? 3 : 2);
        }
      }
    }

    // Xây dựng kết quả chuẩn mực cho tất cả các chủ đề
    const result: Record<SubjectTopicId, TopicMasteryInfo> = {} as any;

    for (const topicId of allTopicIds) {
      const item = stats[topicId];
      const answered = item.answered;
      const correct = item.correct;
      const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0;

      let status: TopicMasteryStatus = 'not_assessed';
      let statusLabel = 'Chưa đánh giá';

      if (answered < 2) {
        status = 'not_assessed';
        statusLabel = 'Chưa đánh giá';
      } else if (percentage < 60) {
        status = 'needs_improvement';
        statusLabel = 'Cần củng cố';
      } else if (percentage < 85) {
        status = 'learning';
        statusLabel = 'Đang học';
      } else {
        status = 'proficient';
        statusLabel = 'Thành thạo';
      }

      result[topicId] = {
        topicId,
        topicName: topicNames[topicId] || topicId,
        totalAnswered: answered,
        totalCorrect: correct,
        percentage,
        status,
        statusLabel,
        examWeight: topicWeights[topicId] || '1.0 - 2.0 điểm',
        commonMistakes: item.commonMistakes.slice(0, 3),
      };
    }

    return result;
  },
};

export const INITIAL_COMMENTS: ExamComment[] = [
  {
    id: 'cm_01',
    examId: 'de_so_1',
    examTitle: 'Đề số 1: Đề chuẩn Bộ GD&ĐT 2025',
    userId: 'user_bach',
    userName: 'fextivity',
    userSchool: 'THPT chuyên Lê Khiết',
    content: 'Phần đúng/sai câu 3 về giao thức TCP/IP cần chú ý cờ SYN-ACK khi thiết lập bắt tay 3 bước nha các bạn!',
    createdAt: '5 phút trước',
    likes: 18,
  },
  {
    id: 'cm_02',
    examId: 'de_so_2',
    examTitle: 'Đề số 2: Đề thi thử THPT Chuyên Lê Khiết',
    userId: 'user_hung',
    userName: 'hollwo_pelw',
    userSchool: 'THPT Trần Quốc Tuấn',
    content: 'Câu 12 SQL mệnh đề GROUP BY kết hợp HAVING lọc nhóm rất hay, tránh nhầm với WHERE khi có hàm tính gộp COUNT/AVG.',
    createdAt: '18 phút trước',
    likes: 12,
  },
  {
    id: 'cm_03',
    examId: 'daily_today',
    examTitle: 'Thử thách 10 câu hằng ngày',
    userId: 'user_thang',
    userName: 'marvinthang',
    userSchool: 'THPT Ba Gia',
    content: 'Giữ streak ngày thứ 18 rồi, 10 câu hôm nay rèn phản xạ nhận biết bộ định tuyến Router và Switch rất hữu ích.',
    createdAt: '34 phút trước',
    likes: 24,
  },
  {
    id: 'cm_04',
    examId: 'de_so_1',
    examTitle: 'Đề số 1: Đề chuẩn Bộ GD&ĐT 2025',
    userId: 'user_loc',
    userName: 'vancongloc1234',
    userSchool: 'THPT Bình Sơn',
    content: 'Hướng giải cho bài toán lọc địa chỉ IPv4/IPv6: IPv4 là 32 bit viết dạng 4 số thập phân, IPv6 là 128 bit hexa cách nhau bởi dấu hai chấm!',
    createdAt: '1 giờ trước',
    likes: 9,
  },
  {
    id: 'cm_05',
    examId: 'de_so_3',
    examTitle: 'Đề số 3: Đề thi thử THPT Trần Quốc Tuấn',
    userId: 'user_anh',
    userName: 'Hollowed',
    userSchool: 'THPT Bình Sơn',
    content: 'Khóa ngoại (FOREIGN KEY) phải tham chiếu tới khóa chính (PRIMARY KEY) của bảng cha, nếu xóa dòng cha có liên kết sẽ vi phạm toàn vẹn!',
    createdAt: '2 giờ trước',
    likes: 15,
  },
  {
    id: 'cm_06',
    examId: 'de_so_2',
    examTitle: 'Đề số 2: Đề thi thử THPT Chuyên Lê Khiết',
    userId: 'user_pisu',
    userName: 'BaoJiaoPisu',
    userSchool: 'THPT Số 1 Tư Nghĩa',
    content: 'Đề thi phân hóa rõ rệt ở phần II (Đúng/Sai). Muốn đạt 9+ cần nắm chắc định nghĩa các tầng trong mô hình OSI.',
    createdAt: '3 giờ trước',
    likes: 7,
  },
];

