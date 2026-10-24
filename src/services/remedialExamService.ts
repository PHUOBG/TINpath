import { Exam, SingleChoiceQuestion, SubjectTopicId } from '../types';
import { requestRemedialExam } from './geminiClient';
import { TOPIC_LESSONS } from '../data/topicsData';
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

  // Pair options with texts
  const pairs = keys.map((k) => ({ originalKey: k, text: options[k] }));

  // Shuffle pairs
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
 * Mutate question content and options for 'variation' mode
 */
function mutateQuestionVariation(
  q: WrongQuestionInput,
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
  else if (content.includes('Học sinh') || content.includes('HOCSINH') || content.includes('MaHS') || content.includes('SQL')) {
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
  }
  // 4. Default variation tag
  else {
    if (!content.startsWith('[Câu hỏi tương đương]')) {
      content = `[Câu hỏi tương đương] ${content}`;
    }
  }

  // Shuffle options to prevent memory reliance
  const { shuffledOptions, newCorrectAnswer } = shuffleOptionsAndRemap(options, q.correctAnswer);

  return {
    id: `remedial_var_${index + 1}_${Date.now()}`,
    topicId: q.topicId,
    content,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    explanation: explanation || `Kiến thức này liên quan đến câu làm sai của bạn ở chuyên đề ${q.topicId}.`,
  };
}

/**
 * Mutate question for 'retest' mode (exact content, shuffled options)
 */
function mutateQuestionRetest(
  q: WrongQuestionInput,
  index: number
): SingleChoiceQuestion {
  const { shuffledOptions, newCorrectAnswer } = shuffleOptionsAndRemap(q.options, q.correctAnswer);

  return {
    id: `remedial_ret_${index + 1}_${Date.now()}`,
    topicId: q.topicId,
    content: `[Làm lại câu sai] ${q.content}`,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    explanation: q.explanation || `Ôn lại câu hỏi đã làm sai ở chuyên đề ${q.topicId}.`,
  };
}

/**
 * Generate a complete remedial Exam object
 */
export async function createRemedialExam(params: {
  wrongQuestions: WrongQuestionInput[];
  mode: 'retest' | 'variation';
  questionCount: number;
  studentTrack: 'CS' | 'ICT';
}): Promise<{ exam: Exam; modelUsed: string; isAiGenerated: boolean }> {
  const count = Math.min(Math.max(params.questionCount || 10, 5), params.wrongQuestions.length || 10);
  const selectedMistakes = params.wrongQuestions.slice(0, count);

  // Try calling the Gemini AI Server endpoint first
  try {
    const aiResult = await requestRemedialExam({
      wrongQuestions: selectedMistakes.map((q) => ({
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
      questionCount: count,
      studentTrack: params.studentTrack,
    });

    if (aiResult.success && Array.isArray(aiResult.questions) && aiResult.questions.length > 0) {
      const formattedPart1: SingleChoiceQuestion[] = aiResult.questions.map((q: any, i: number) => ({
        id: q.id || `ai_q_${i + 1}`,
        topicId: (q.topicId as SubjectTopicId) || selectedMistakes[i % selectedMistakes.length]?.topicId || '12B',
        content: q.content,
        options: q.options || { A: '', B: '', C: '', D: '' },
        correctAnswer: (q.correctAnswer as 'A' | 'B' | 'C' | 'D') || 'A',
        explanation: q.explanation || 'Giải thích từ Gemini AI',
      }));

      const exam: Exam = {
        id: `ai_remedial_${Date.now()}`,
        title: aiResult.examTitle || (params.mode === 'variation' ? 'Đề AI Biến Tấu: Khắc Phục Câu Sai' : 'Đề AI Làm Lại: Đảo Phương Án'),
        source: 'Gemini AI Studio — Khắc phục lỗ hổng TinPath',
        durationMinutes: Math.round(formattedPart1.length * 1.5),
        year: 2026,
        difficulty: params.mode === 'variation' ? 'Nâng cao' : 'Trung bình',
        description: aiResult.description || `Đề thi gồm ${formattedPart1.length} câu trắc nghiệm được Gemini AI biến tấu dựa trên các câu hỏi bạn đã làm sai.`,
        totalScore: 10,
        baseXP: 60,
        part1Questions: formattedPart1,
        part2Questions: [],
      };

      return {
        exam,
        modelUsed: aiResult.modelUsed || 'Gemini 3.5 Flash',
        isAiGenerated: true,
      };
    }
  } catch (error) {
    console.warn('Gemini API endpoint failed, switching to local adaptive mutation engine:', error);
  }

  // Local fallback mutation engine
  const generatedQuestions: SingleChoiceQuestion[] = [];

  selectedMistakes.forEach((q, idx) => {
    if (params.mode === 'variation') {
      generatedQuestions.push(mutateQuestionVariation(q, idx));
    } else {
      generatedQuestions.push(mutateQuestionRetest(q, idx));
    }
  });

  // If question count requested is more than wrong questions, supplement with related topic questions
  if (generatedQuestions.length < count) {
    const needed = count - generatedQuestions.length;
    const allBankQuestions = OFFICIAL_EXAMS.flatMap((e) => e.part1Questions);
    const existingIds = new Set(generatedQuestions.map((g) => g.id));

    // Prefer questions from the same topics as the mistakes
    const mistakeTopics = new Set(selectedMistakes.map((m) => m.topicId));
    const matchingTopicQuestions = allBankQuestions.filter(
      (q) => mistakeTopics.has(q.topicId as SubjectTopicId) && !existingIds.has(q.id)
    );

    const pool = matchingTopicQuestions.length >= needed ? matchingTopicQuestions : allBankQuestions;

    for (let i = 0; i < needed && i < pool.length; i++) {
      const q = pool[i];
      const { shuffledOptions, newCorrectAnswer } = shuffleOptionsAndRemap(q.options, q.correctAnswer);
      generatedQuestions.push({
        id: `supp_${i + 1}_${Date.now()}`,
        topicId: q.topicId as SubjectTopicId,
        content: `[Kiến thức bổ trợ] ${q.content}`,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer,
        explanation: q.explanation || 'Câu hỏi củng cố kiến thức cùng chuyên đề.',
      });
    }
  }

  const exam: Exam = {
    id: `local_remedial_${Date.now()}`,
    title:
      params.mode === 'variation'
        ? 'Đề AI Biến Tấu: Khắc Phục Lỗ Hổng Kiến Thức'
        : 'Đề AI Luyện Lại: Đảo Phương Án Các Câu Sai',
    source: 'TinPath AI Adaptive Exam Engine (GDPT 2018)',
    durationMinutes: Math.round(generatedQuestions.length * 1.5),
    year: 2026,
    difficulty: params.mode === 'variation' ? 'Nâng cao' : 'Trung bình',
    description: `Đề thi gồm ${generatedQuestions.length} câu trắc nghiệm được hệ thống tự động tổng hợp và biến tấu từ các lỗi sai của bạn trong các đề thi trước.`,
    totalScore: 10,
    baseXP: 50,
    part1Questions: generatedQuestions,
    part2Questions: [],
  };

  return {
    exam,
    modelUsed: 'TinPath Adaptive Heuristic Engine',
    isAiGenerated: false,
  };
}
