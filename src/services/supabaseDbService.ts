/**
 * supabaseDbService.ts
 * Thay thế hoàn toàn storageService.ts (localStorage) bằng Supabase PostgreSQL
 * Hỗ trợ chế độ dự phòng: nếu chưa cấu hình Supabase → fallback sang localStorage
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  UserProfile,
  ExamAttempt,
  XPTransaction,
  Classroom,
  Assignment,
  ExamComment,
  StudyRoadmapItem,
} from '../types';

// ---------------------------------------------------------------------------
// FALLBACK: Đọc/Ghi localStorage (dùng khi chưa cấu hình Supabase)
// ---------------------------------------------------------------------------
const LS = {
  get: <T>(key: string): T | null => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  },
  set: <T>(key: string, val: T) => {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

const STORAGE_KEYS = {
  USER_PROFILE: 'tinpath_user_profile',
  EXAM_ATTEMPTS: 'tinpath_exam_attempts',
  XP_TRANSACTIONS: 'tinpath_xp_transactions',
  CLASSROOMS: 'tinpath_classrooms',
  ASSIGNMENTS: 'tinpath_assignments',
  COMMENTS: 'tinpath_exam_comments',
};

// ---------------------------------------------------------------------------
// PROFILE — Lấy hồ sơ người dùng hiện tại
// ---------------------------------------------------------------------------
export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return LS.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  // Map snake_case DB → camelCase TypeScript
  return mapDbProfileToLocal(data);
}

export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const current = LS.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    if (current) LS.set(STORAGE_KEYS.USER_PROFILE, { ...current, ...updates });
    return true;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.displayName,
      avatar_url: updates.avatarUrl,
      school_id: updates.schoolId,
      school_name: updates.schoolName,
      district: updates.district,
      grade: updates.grade,
      track: updates.track,
      target_score: updates.targetScore,
      daily_study_minutes: updates.dailyStudyMinutes,
      xp: updates.xp,
      streak_days: updates.streakDays,
      last_active_date: updates.lastActiveDate,
      completed_daily_today: updates.completedDailyToday,
      onboarding_completed: updates.onboardingCompleted,
      diagnostic_score: updates.diagnosticScore,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

// ---------------------------------------------------------------------------
// EXAM ATTEMPTS — Lưu và lấy lịch sử thi
// ---------------------------------------------------------------------------
export async function saveExamAttempt(attempt: ExamAttempt): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS) || [];
    LS.set(STORAGE_KEYS.EXAM_ATTEMPTS, [...existing, attempt]);
    return true;
  }

  const { error } = await supabase.from('exam_attempts').insert({
    id: attempt.id,
    exam_id: attempt.examId,
    exam_title: attempt.examTitle,
    user_id: attempt.userId,
    track: attempt.track,
    started_at: attempt.startedAt,
    submitted_at: attempt.submittedAt,
    duration_seconds: attempt.durationSeconds,
    total_score: attempt.totalScore,
    part1_score: attempt.part1Score,
    part2_score: attempt.part2Score,
    correct_part1_count: attempt.correctPart1Count,
    part2_breakdown: attempt.part2Breakdown,
    answers: attempt.answers,
    xp_earned: attempt.xpEarned,
  });

  return !error;
}

export async function getExamAttempts(userId: string): Promise<ExamAttempt[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS) || [])
      .filter(a => a.userId === userId);
  }

  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error || !data) return [];

  return data.map(mapDbAttemptToLocal);
}

// ---------------------------------------------------------------------------
// XP TRANSACTIONS — Ghi điểm thưởng
// ---------------------------------------------------------------------------
export async function addXPTransaction(tx: XPTransaction): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<XPTransaction[]>(STORAGE_KEYS.XP_TRANSACTIONS) || [];
    LS.set(STORAGE_KEYS.XP_TRANSACTIONS, [...existing, tx]);
    return true;
  }

  const { error } = await supabase.from('xp_transactions').insert({
    id: tx.id,
    user_id: tx.userId,
    amount: tx.amount,
    source: tx.source,
    description: tx.description,
    created_at: tx.timestamp,
  });

  return !error;
}

// ---------------------------------------------------------------------------
// LEADERBOARD — Bảng xếp hạng thật theo trường, huyện hoặc toàn tỉnh
// ---------------------------------------------------------------------------
export async function getLeaderboard(filter?: {
  scope: 'school' | 'district' | 'province';
  value: string;
}): Promise<{ rank: number; name: string; schoolName: string; district: string; xp: number; streak: number; isCurrentUser: boolean }[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  let query = supabase
    .from('profiles')
    .select('id, display_name, school_name, district, xp, streak_days')
    .eq('role', 'student')
    .order('xp', { ascending: false })
    .limit(50);

  if (filter?.scope === 'school') {
    query = query.eq('school_name', filter.value);
  } else if (filter?.scope === 'district') {
    query = query.eq('district', filter.value);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const { data: { user } } = await supabase.auth.getUser();

  return data.map((row, idx) => ({
    rank: idx + 1,
    name: row.display_name,
    schoolName: row.school_name || '',
    district: row.district || '',
    xp: row.xp,
    streak: row.streak_days,
    isCurrentUser: row.id === user?.id,
  }));
}

// ---------------------------------------------------------------------------
// COMMENTS — Bình luận đề thi
// ---------------------------------------------------------------------------
export async function getExamComments(examId: string): Promise<ExamComment[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<ExamComment[]>(STORAGE_KEYS.COMMENTS) || [])
      .filter(c => c.examId === examId);
  }

  const { data, error } = await supabase
    .from('exam_comments')
    .select('*')
    .eq('exam_id', examId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    examId: row.exam_id,
    examTitle: '',
    userId: row.user_id,
    userName: row.user_name,
    userSchool: row.user_school || '',
    content: row.content,
    createdAt: row.created_at,
    likes: row.likes,
  }));
}

export async function addExamComment(comment: ExamComment): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<ExamComment[]>(STORAGE_KEYS.COMMENTS) || [];
    LS.set(STORAGE_KEYS.COMMENTS, [comment, ...existing]);
    return true;
  }

  const { error } = await supabase.from('exam_comments').insert({
    exam_id: comment.examId,
    user_id: comment.userId,
    user_name: comment.userName,
    user_school: comment.userSchool,
    content: comment.content,
  });

  return !error;
}

// ---------------------------------------------------------------------------
// CLASSROOMS — Lớp học giáo viên
// ---------------------------------------------------------------------------
export async function getTeacherClassrooms(teacherId: string): Promise<Classroom[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<Classroom[]>(STORAGE_KEYS.CLASSROOMS) || [])
      .filter(c => c.teacherId === teacherId);
  }

  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    code: row.code,
    grade: row.grade,
    schoolName: row.school_name,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    studentCount: row.student_count,
    createdAt: row.created_at,
  }));
}

export async function getClassroomAssignments(classroomId: string): Promise<Assignment[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS) || [])
      .filter(a => a.classroomId === classroomId);
  }

  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    classroomId: row.classroom_id,
    title: row.title,
    topicId: row.topic_id,
    dueDate: row.due_date,
    questionCount: row.question_count,
    allowRetake: row.allow_retake,
    status: row.status,
    submissionsCount: 0,
  }));
}

// ---------------------------------------------------------------------------
// MAPPER FUNCTIONS — DB snake_case → TypeScript camelCase
// ---------------------------------------------------------------------------
function mapDbProfileToLocal(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    province: row.province || 'Quảng Ngãi',
    district: row.district || '',
    schoolId: row.school_id || '',
    schoolName: row.school_name || '',
    grade: row.grade || '12',
    track: row.track || 'CS',
    targetScore: Number(row.target_score) || 8.5,
    dailyStudyMinutes: row.daily_study_minutes || 45,
    xp: row.xp || 0,
    streakDays: row.streak_days || 0,
    lastActiveDate: row.last_active_date || new Date().toISOString().split('T')[0],
    completedDailyToday: row.completed_daily_today || false,
    onboardingCompleted: row.onboarding_completed || false,
    diagnosticScore: row.diagnostic_score ? Number(row.diagnostic_score) : undefined,
    createdAt: row.created_at,
  };
}

function mapDbAttemptToLocal(row: any): ExamAttempt {
  return {
    id: row.id,
    examId: row.exam_id,
    examTitle: row.exam_title,
    userId: row.user_id,
    track: row.track,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    durationSeconds: row.duration_seconds,
    totalScore: Number(row.total_score),
    part1Score: Number(row.part1_score),
    part2Score: Number(row.part2_score),
    correctPart1Count: row.correct_part1_count,
    part2Breakdown: row.part2_breakdown || [],
    answers: row.answers || {},
    xpEarned: row.xp_earned || 0,
  };
}
