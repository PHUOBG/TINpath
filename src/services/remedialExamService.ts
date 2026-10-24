import {
  Exam,
  SingleChoiceQuestion,
  TrueFalseGroupQuestion,
  SubjectTopicId,
} from '../types';
import { requestRemedialExam } from './geminiClient';
import { OFFICIAL_EXAMS } from '../data/officialExamsData';

export interface WrongQuestionInput {
  id: string;
  topicId: SubjectTopicId;
  content: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  userAnswer?: string;
  examId?: string;
  examTitle?: string;
}

export interface WrongPart2QuestionInput {
  id: string;
  topicId: SubjectTopicId;
  context: string;
  trackRequirement?: 'ALL' | 'CS' | 'ICT';
  statements: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  examId?: string;
}

/**
 * Fisher-Yates shuffle for options A, B, C, D
 */
function shuffleOptionsAndRemap(
  options: Record<'A' | 'B' | 'C' | 'D', string>,
  correctAnswer: 'A' | 'B' | 'C' | 'D'
): {
  shuffledOptions: Record<'A' | 'B' | 'C' | 'D', string>;
  newCorrectAnswer: 'A' | 'B' | 'C' | 'D';
} {
  const keys: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const correctText = options[correctAnswer];

  const pairs = keys.map((k) => ({ originalKey: k, text: options[k] }));

  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  const shuffledOptions: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: pairs[0].text,
    B: pairs[1].text,
    C: pairs[2].text,
    D: pairs[3].text,
  };

  const newCorrectKey = keys.find((k) => shuffledOptions[k] === correctText) || 'A';

  return {
    shuffledOptions,
    newCorrectAnswer: newCorrectKey,
  };
}

/**
 * Mutate a Part 1 Single Choice question for variation mode
 */
function mutatePart1Variation(
  q: WrongQuestionInput | SingleChoiceQuestion,
  index: number
): SingleChoiceQuestion {
  let content = q.content;
  let options = { ...q.options };
  let explanation = q.explanation || '';

  // 1. IP & Networking mutations (Topic 12B)
  if (content.includes('192.168.') || content.includes('IP') || content.includes('Subnet')) {
    const ipReplacements: Array<[string, string]> = [
      ['192.168.1.1', '172.16.10.1'],
      ['192.168.1.0', '172.16.10.0'],
      ['192.168.1.255', '172.16.10.255'],
      ['192.168.0.1', '10.0.0.1'],
      ['255.255.255.0', '255.255.0.0'],
    ];

    ipReplacements.forEach(([from, to]) => {
      content = content.replaceAll(from, to);
      (['A', 'B', 'C', 'D'] as const).forEach((opt) => {
        options[opt] = options[opt].replaceAll(from, to);
      });
      explanation = explanation.replaceAll(from, to);
    });

    if (!content.startsWith('[Biến tấu số liệu]')) {
      content = `[Biến tấu số liệu] ${content}`;
    }
  }
  // 2. SQL & CSDL mutations (Topic 11F)
  else if (
    content.includes('Học sinh') ||
    content.includes('HOCSINH') ||
    content.includes('MaHS') ||
    content.includes('SQL')
  ) {
    content = content
      .replaceAll('Học sinh', 'Nhân viên')
      .replaceAll('HOCSINH', 'NHANVIEN')
      .replaceAll('MaHS', 'MaNV')
      .replaceAll('DiemToan', 'HeSoLuong')
      .replaceAll('Lop', 'PhongBan');

    (['A', 'B', 'C', 'D'] as const).forEach((opt) => {
      options[opt] = options[opt]
        .replaceAll('Học sinh', 'Nhân viên')
        .replaceAll('HOCSINH', 'NHANVIEN')
        .replaceAll('MaHS', 'MaNV')
        .replaceAll('DiemToan', 'HeSoLuong')
        .replaceAll('Lop', 'PhongBan');
    });

    explanation = explanation
      .replaceAll('Học sinh', 'Nhân viên')
      .replaceAll('HOCSINH', 'NHANVIEN')
      .replaceAll('MaHS', 'MaNV');

    if (!content.startsWith('[Biến tấu ngữ cảnh CSDL]')) {
      content = `[Biến tấu ngữ cảnh CSDL] ${content}`;
    }
  }
  // 3. AI / Machine learning concepts (Topic 12A)
  else if (content.includes('AI') || content.includes('Trí tuệ nhân tạo') || content.includes('Turing')) {
    if (!content.startsWith('[Biến tấu góc nhìn]')) {
      content = `[Biến tấu góc nhìn] ${content}`;
    }
  } else {
    if (!content.startsWith('[Biến tấu tương đương]')) {
      content = `[Biến tấu tương đương] ${content}`;
    }
  }

  const { shuffledOptions, newCorrectAnswer } = shuffleOptionsAndRemap(options, q.correctAnswer);

  return {
    id: `thpt_remedial_p1_${index + 1}_${Date.now()}`,
    type: 'single_choice',
    topicId: q.topicId as SubjectTopicId,
    content,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    explanation: explanation || `Kiến thức này liên quan đến câu làm sai của bạn ở chuyên đề ${q.topicId}.`,
  };
}

/**
 * Mutate a Part 1 Single Choice question for retest mode
 */
function mutatePart1Retest(
  q: WrongQuestionInput | SingleChoiceQuestion,
  index: number
): SingleChoiceQuestion {
  const { shuffledOptions, newCorrectAnswer } = shuffleOptionsAndRemap(q.options, q.correctAnswer);

  return {
    id: `thpt_remedial_p1_${index + 1}_${Date.now()}`,
    type: 'single_choice',
    topicId: q.topicId as SubjectTopicId,
    content: q.content,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    explanation: q.explanation || `Ôn lại câu hỏi đã làm sai ở chuyên đề ${q.topicId}.`,
  };
}

/**
 * Mutate a Part 2 True/False group question
 */
function mutatePart2Question(
  q: TrueFalseGroupQuestion,
  index: number,
  mode: 'variation' | 'retest'
): TrueFalseGroupQuestion {
  let context = q.context;

  if (mode === 'variation') {
    if (context.includes('192.168.')) {
      context = context.replaceAll('192.168.1.', '172.16.20.').replaceAll('192.168.', '172.16.');
    }
    if (context.includes('Học sinh')) {
      context = context.replaceAll('Học sinh', 'Hội viên');
    }
    if (!context.startsWith('[Biến tấu tình huống]')) {
      context = `[Biến tấu tình huống] ${context}`;
    }
  }

  // Statements remain structured with 4 items a, b, c, d
  return {
    ...q,
    id: `thpt_remedial_p2_${index + 1}_${Date.now()}`,
    context,
    statements: q.statements.map((s) => ({
      ...s,
    })),
  };
}

/**
 * GENERATE FULL 100% OFFICIAL THPTQG EXAM
 * - Duration: Exactly 50 minutes
 * - Total Score: Exactly 10.0
 * - Part 1: Exactly 24 Single Choice questions (A, B, C, D) = 6.0 points
 * - Part 2: Exactly 4 True/False group questions (a, b, c, d) = 4.0 points
 */
export async function createFullThptqgRemedialExam(params: {
  wrongPart1Questions: WrongQuestionInput[];
  wrongPart2Questions?: WrongPart2QuestionInput[];
  mode: 'variation' | 'retest';
  studentTrack: 'CS' | 'ICT';
}): Promise<{ exam: Exam; modelUsed: string; isAiGenerated: boolean }> {
  const targetPart1Count = 24;
  const targetPart2Count = 4;

  const mistakes = params.wrongPart1Questions || [];

  // 1. First attempt Gemini AI generation for Part 1 questions
  let aiPart1Questions: SingleChoiceQuestion[] = [];
  let aiModelUsed = 'TinPath Heuristic Adaptive Engine';
  let isAiGenerated = false;

  try {
    const aiResult = await requestRemedialExam({
      wrongQuestions: mistakes.slice(0, 15).map((q) => ({
        id: q.id,
        topicId: q.topicId,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        userAnswer: q.userAnswer,
        examTitle: q.examTitle,
      })),
      mode: params.mode,
      questionCount: Math.min(mistakes.length, 15),
      studentTrack: params.studentTrack,
    });

    if (aiResult.success && Array.isArray(aiResult.questions) && aiResult.questions.length > 0) {
      aiPart1Questions = aiResult.questions.map((q: any, i: number) => ({
        id: q.id || `ai_thpt_p1_${i + 1}`,
        type: 'single_choice' as const,
        topicId: (q.topicId as SubjectTopicId) || mistakes[i % (mistakes.length || 1)]?.topicId || '12B',
        content: q.content,
        options: q.options || { A: '', B: '', C: '', D: '' },
        correctAnswer: (q.correctAnswer as 'A' | 'B' | 'C' | 'D') || 'A',
        explanation: q.explanation || 'Giải thích từ Gemini AI',
      }));
      aiModelUsed = aiResult.modelUsed || 'Gemini 3.5 Flash';
      isAiGenerated = true;
    }
  } catch (error) {
    console.warn('AI API call skipped or timed out, generating via local heuristic mutation engine:', error);
  }

  // 2. Build Part 1: exactly 24 questions
  const finalPart1: SingleChoiceQuestion[] = [];

  // Add AI generated questions first
  aiPart1Questions.forEach((q) => {
    if (finalPart1.length < targetPart1Count) {
      finalPart1.push(q);
    }
  });

  // If more slots needed, mutate directly from student's wrong questions
  if (finalPart1.length < targetPart1Count) {
    const existingIds = new Set(finalPart1.map((q) => q.content));
    mistakes.forEach((m, idx) => {
      if (finalPart1.length < targetPart1Count && !existingIds.has(m.content)) {
        const mutated =
          params.mode === 'variation'
            ? mutatePart1Variation(m, idx)
            : mutatePart1Retest(m, idx);
        finalPart1.push(mutated);
        existingIds.add(m.content);
      }
    });
  }

  // If still fewer than 24, pad with related questions from official exam pool
  if (finalPart1.length < targetPart1Count) {
    const allBankPart1 = OFFICIAL_EXAMS.flatMap((e) => e.part1Questions);
    const mistakeTopics = new Set(mistakes.map((m) => m.topicId));
    const matchingTopics = allBankPart1.filter(
      (q) => mistakeTopics.has(q.topicId as SubjectTopicId)
    );
    const pool = matchingTopics.length >= 24 ? matchingTopics : allBankPart1;

    let pIdx = 0;
    while (finalPart1.length < targetPart1Count && pIdx < pool.length) {
      const candidate = pool[pIdx];
      const isAlreadyIncluded = finalPart1.some((q) => q.content === candidate.content);
      if (!isAlreadyIncluded) {
        const mutated =
          params.mode === 'variation'
            ? mutatePart1Variation(candidate, finalPart1.length)
            : mutatePart1Retest(candidate, finalPart1.length);
        finalPart1.push(mutated);
      }
      pIdx++;
    }
  }

  // 3. Build Part 2: exactly 4 True/False group questions (chuẩn đề thi THPTQG)
  // Structure: 2 questions for ALL track + 2 questions for student's track (CS or ICT)
  const allBankPart2 = OFFICIAL_EXAMS.flatMap((e) => e.part2Questions);

  const allTrackQuestions = allBankPart2.filter((q) => q.trackRequirement === 'ALL' || !q.trackRequirement);
  const specificTrackQuestions = allBankPart2.filter(
    (q) => q.trackRequirement === params.studentTrack
  );

  const fallbackTrackQuestions = specificTrackQuestions.length >= 2
    ? specificTrackQuestions
    : allBankPart2.filter((q) => q.trackRequirement !== (params.studentTrack === 'CS' ? 'ICT' : 'CS'));

  const finalPart2: TrueFalseGroupQuestion[] = [];

  // Pick 2 ALL track questions
  for (let i = 0; i < 2 && i < allTrackQuestions.length; i++) {
    finalPart2.push(mutatePart2Question(allTrackQuestions[i], finalPart2.length, params.mode));
  }

  // Pick 2 Specific Track questions
  for (let i = 0; i < 2 && i < fallbackTrackQuestions.length; i++) {
    finalPart2.push(mutatePart2Question(fallbackTrackQuestions[i], finalPart2.length, params.mode));
  }

  // Fill up to 4 if necessary
  let padIdx = 0;
  while (finalPart2.length < targetPart2Count && padIdx < allBankPart2.length) {
    const cand = allBankPart2[padIdx];
    if (!finalPart2.some((q) => q.context === cand.context)) {
      finalPart2.push(mutatePart2Question(cand, finalPart2.length, params.mode));
    }
    padIdx++;
  }

  // 4. Assemble the official THPTQG Exam
  const examTitle =
    params.mode === 'variation'
      ? 'Đề thi thử Tốt nghiệp THPT 2026 — Đề AI Biến Tấu Khắc Phục Câu Sai'
      : 'Đề thi thử Tốt nghiệp THPT 2026 — Đề AI Rèn Luyện Lại Các Câu Sai';

  const exam: Exam = {
    id: `thpt_remedial_${Date.now()}`,
    title: examTitle,
    source: isAiGenerated
      ? 'Mô hình Gemini AI Studio — Chuẩn Bộ GD&ĐT (TinPath)'
      : 'TinPath Adaptive Assessment Engine — Chuẩn Bộ GD&ĐT',
    durationMinutes: 50, // Đúng 50 phút chuẩn THPTQG
    year: 2026,
    difficulty: 'Thi thử tốt nghiệp',
    description: `Đề thi tốt nghiệp THPT chuẩn 100% quy chuẩn Bộ GD&ĐT (50 phút, 10 điểm) gồm đúng 24 câu trắc nghiệm Phần I (6.0đ) và 4 câu Đúng/Sai Phần II (4.0đ), được AI tự động biên tập và biến tấu từ các lỗi sai của bạn.`,
    totalScore: 10,
    baseXP: 100,
    part1Questions: finalPart1.slice(0, 24),
    part2Questions: finalPart2.slice(0, 4),
  };

  return {
    exam,
    modelUsed: aiModelUsed,
    isAiGenerated,
  };
}

// Backward-compatible alias
export const createRemedialExam = async (params: {
  wrongQuestions: WrongQuestionInput[];
  mode: 'retest' | 'variation';
  questionCount?: number;
  studentTrack: 'CS' | 'ICT';
}) => {
  return createFullThptqgRemedialExam({
    wrongPart1Questions: params.wrongQuestions,
    mode: params.mode,
    studentTrack: params.studentTrack,
  });
};
