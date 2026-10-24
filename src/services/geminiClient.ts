export async function askThinkingAiTutor(params: {
  topicTitle: string;
  userQuestion: string;
  studentContext?: string;
}) {
  const res = await fetch('/api/gemini/thinking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function askSearchGroundedInfo(query: string) {
  const res = await fetch('/api/gemini/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getFastQuestionHint(questionContent: string, options: string) {
  const res = await fetch('/api/gemini/hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionContent, options }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function requestAdaptiveStudyPlan(params: {
  studentName: string;
  grade: string;
  track: string;
  targetScore: number;
  dailyStudyMinutes: number;
  diagnosticScore?: number;
  weakTopics: string[];
  daysRemaining: number;
}) {
  const res = await fetch('/api/gemini/study-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function requestDiagnosticAnalysis(params: {
  studentName: string;
  grade: string;
  track: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  topicBreakdown: Array<{
    topicId: string;
    topicName: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  wrongQuestions: Array<{
    id: string;
    topicName: string;
    content: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>;
}) {
  const res = await fetch('/api/gemini/diagnostic-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateEducationalIllustration(params: {
  topicTitle: string;
  description: string;
  resolution?: '1K' | '2K' | '4K';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}) {
  const res = await fetch('/api/gemini/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateVeoVideo(params: {
  prompt: string;
  aspectRatio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const res = await fetch('/api/gemini/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function analyzeVideoWithArgon(params: {
  videoBase64: string;
  mimeType: string;
  userPrompt: string;
}) {
  const res = await fetch('/api/gemini/analyze-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function verifyServerXP(params: {
  type: 'daily_challenge' | 'exam' | 'streak_milestone';
  score?: number;
  correctCount?: number;
  totalQuestions?: number;
  currentStreak?: number;
}) {
  const res = await fetch('/api/xp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function requestRemedialExam(params: {
  wrongQuestions: Array<{
    id: string;
    topicId: string;
    content: string;
    options: Record<'A' | 'B' | 'C' | 'D', string>;
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation?: string;
    userAnswer?: string;
    examTitle?: string;
  }>;
  mode: 'retest' | 'variation';
  questionCount: number;
  studentTrack: 'CS' | 'ICT';
}) {
  const res = await fetch('/api/gemini/generate-remedial-exam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}
