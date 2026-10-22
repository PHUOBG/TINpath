export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  province: string; // e.g. "Quảng Ngãi"
  district: string; // e.g. "TP. Quảng Ngãi", "Huyện Bình Sơn"
  schoolId: string;
  schoolName: string;
  grade: '10' | '11' | '12';
  track: 'CS' | 'ICT'; // Khoa học máy tính hoặc Tin học ứng dụng
  targetScore: number; // e.g. 8.5
  dailyStudyMinutes: number; // e.g. 45
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedDailyToday: boolean;
  onboardingCompleted: boolean;
  diagnosticScore?: number;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  district: string;
  address: string;
}

export type QuestionType = 'single_choice' | 'true_false_group';
export type CognitiveLevel = 'biet' | 'hieu' | 'van_dung';
export type SubjectTopicId = 
  | '12A' // Trí tuệ nhân tạo
  | '12B' // Kết nối mạng
  | '12D' // Tính nhân văn thế giới ảo
  | '12G' // Nhóm nghề dịch vụ & quản trị
  | '12F' // Tạo trang web
  | '12E_ICT' // Thực hành phần mềm tạo trang web
  | '12F_CS' // Học máy và khoa học dữ liệu
  | '11F' // Hệ cơ sở dữ liệu
  | '11E_ICT' // Khai thác CSDL
  | '11F_CS' // Kĩ thuật lập trình & thuật toán
  | '10_PYTHON'; // Lập trình Python cơ bản

export interface SingleChoiceQuestion {
  id: string;
  type: 'single_choice';
  topicId: SubjectTopicId;
  topicName: string;
  level: CognitiveLevel;
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  codeSnippet?: string;
  image?: string;
}

export interface TrueFalseStatement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TrueFalseGroupQuestion {
  id: string;
  type: 'true_false_group';
  topicId: SubjectTopicId;
  topicName: string;
  level?: CognitiveLevel;
  trackRequirement?: 'ALL' | 'CS' | 'ICT';
  context: string;
  statements: TrueFalseStatement[];
  codeSnippet?: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export type ExamQuestion = SingleChoiceQuestion | TrueFalseGroupQuestion;

export interface Exam {
  id: string;
  title: string;
  source: string; // e.g. "Bộ Giáo Dục & Đào Tạo"
  durationMinutes: number; // 50 phút
  year: number;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'Thi thử tốt nghiệp';
  description: string;
  part1Questions: SingleChoiceQuestion[]; // 24 câu
  part2Questions: TrueFalseGroupQuestion[]; // 4 câu (2 câu chung + 2 câu CS hoặc ICT)
  totalScore: 10;
  baseXP: number;
}

export interface StudentExamAnswer {
  questionId: string;
  type: QuestionType;
  selectedOption?: 'A' | 'B' | 'C' | 'D'; // For single choice
  trueFalseSelections?: {
    a?: boolean;
    b?: boolean;
    c?: boolean;
    d?: boolean;
  }; // For true/false
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  track: 'CS' | 'ICT';
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  totalScore: number;
  part1Score: number;
  part2Score: number;
  correctPart1Count: number;
  part2Breakdown: {
    questionId: string;
    correctStatementsCount: number;
    scoreAwarded: number;
  }[];
  answers: Record<string, StudentExamAnswer>;
  xpEarned: number;
}

export interface DailyChallengeAttempt {
  date: string; // YYYY-MM-DD
  userId: string;
  score: number;
  totalQuestions: 10;
  correctCount: number;
  xpAwarded: number;
  completedAt: string;
}

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  source: 'daily_challenge' | 'exam_completion' | 'streak_bonus' | 'lesson_complete' | 'diagnostic';
  description: string;
  timestamp: string;
}

export interface StudyRoadmapItem {
  id: string;
  dayNumber: number;
  topicId: SubjectTopicId;
  topicName: string;
  actionType: 'theory' | 'practice_quiz' | 'mock_test' | 'code_exercise';
  title: string;
  description: string;
  targetMinutes: number;
  status: 'todo' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface StudentAnalytics {
  topicAccuracies: Record<SubjectTopicId, {
    totalAnswered: number;
    totalCorrect: number;
    percentage: number;
  }>;
  levelAccuracies: Record<CognitiveLevel, {
    totalAnswered: number;
    totalCorrect: number;
    percentage: number;
  }>;
  weakTopics: SubjectTopicId[];
  strongTopics: SubjectTopicId[];
  averageScore: number;
  examsTaken: number;
  totalQuestionsPracticed: number;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  grade: '10' | '11' | '12';
  schoolName: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  topicId?: SubjectTopicId;
  dueDate: string;
  questionCount: number;
  allowRetake: boolean;
  status: 'active' | 'closed';
  submissionsCount: number;
}

export interface ExamComment {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  userName: string;
  userSchool: string;
  content: string;
  createdAt: string;
  likes: number;
}

