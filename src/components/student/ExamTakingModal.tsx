import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
  Check,
  Award,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Exam,
  SingleChoiceQuestion,
  TrueFalseGroupQuestion,
  StudentExamAnswer,
  ExamAttempt,
} from '../../types';
import { getFastQuestionHint } from '../../services/geminiClient';
import { storageService } from '../../services/storageService';
import { ExamCommentModal } from './ExamCommentModal';

interface ExamTakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  track: 'CS' | 'ICT';
  onSubmitAttempt: (attempt: ExamAttempt) => void;
  userId: string;
}

export const ExamTakingModal: React.FC<ExamTakingModalProps> = ({
  isOpen,
  onClose,
  exam,
  track,
  onSubmitAttempt,
  userId,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentExamAnswer>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<ExamAttempt | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const currentUser = storageService.getUserProfile();

  // Filter Part 2 questions according to student's chosen track
  // Part 2 has 4 questions in total: 2 common (ALL) + 2 track-specific (CS or ICT)
  const part2Filtered = exam.part2Questions.filter(
    (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === track
  );

  // Flattened question list for index navigation
  const allQuestions: Array<{
    part: 1 | 2;
    partIndex: number;
    globalIndex: number;
    question: SingleChoiceQuestion | TrueFalseGroupQuestion;
  }> = [
    ...exam.part1Questions.map((q, idx) => ({
      part: 1 as const,
      partIndex: idx,
      globalIndex: idx,
      question: q,
    })),
    ...part2Filtered.map((q, idx) => ({
      part: 2 as const,
      partIndex: idx,
      globalIndex: exam.part1Questions.length + idx,
      question: q,
    })),
  ];

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(); // Auto submit on 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const currentItem = allQuestions[currentQuestionIndex] || allQuestions[0];
  const currentQ = currentItem.question;

  // Single choice answer handler
  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        type: 'single_choice',
        selectedOption: option,
      },
    }));
  };

  // True/False answer handler
  const handleSelectTrueFalse = (questionId: string, statementId: 'a' | 'b' | 'c' | 'd', value: boolean) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const existing = prev[questionId]?.trueFalseSelections || {};
      return {
        ...prev,
        [questionId]: {
          questionId,
          type: 'true_false_group',
          trueFalseSelections: {
            ...existing,
            [statementId]: value,
          },
        },
      };
    });
  };

  // Toggle Flag
  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Ask Gemini Flash Lite for quick hint
  const handleGetHint = async () => {
    if (currentItem.part === 1) {
      const sq = currentQ as SingleChoiceQuestion;
      const opts = `A. ${sq.options.A}\nB. ${sq.options.B}\nC. ${sq.options.C}\nD. ${sq.options.D}`;
      try {
        setLoadingHint(true);
        setAiHint(null);
        const res = await getFastQuestionHint(sq.content, opts);
        setAiHint(res.hint || 'Hãy đọc kỹ lại đề bài và loại trừ các phương án không liên quan.');
      } catch (e: any) {
        setAiHint('Gợi ý: Chú ý các từ khóa "không phải", "đúng nhất" và định nghĩa cơ bản trong SGK.');
      } finally {
        setLoadingHint(false);
      }
    } else {
      setAiHint('Gợi ý Phần II: Đọc kỹ từng mệnh đề a, b, c, d độc lập để xét tính đúng/sai theo lý thuyết.');
    }
  };

  // Calculate official Ministry of Education scoring
  const calculateFinalScore = () => {
    let part1Score = 0;
    let correctPart1Count = 0;

    // Part 1: 0.25 pt per correct answer
    for (const q of exam.part1Questions) {
      const studentAns = answers[q.id]?.selectedOption;
      if (studentAns === q.correctAnswer) {
        part1Score += 0.25;
        correctPart1Count += 1;
      }
    }

    // Part 2: 4 questions.
    // Official Ministry scoring scale:
    // 1 statement correct = 0.1 pt
    // 2 statements correct = 0.25 pt
    // 3 statements correct = 0.50 pt
    // 4 statements correct = 1.00 pt
    let part2Score = 0;
    const part2Breakdown = part2Filtered.map((q) => {
      const selections = answers[q.id]?.trueFalseSelections || {};
      let correctCount = 0;
      for (const stmt of q.statements) {
        if (selections[stmt.id] === stmt.isCorrect) {
          correctCount += 1;
        }
      }

      let qScore = 0;
      if (correctCount === 1) qScore = 0.1;
      else if (correctCount === 2) qScore = 0.25;
      else if (correctCount === 3) qScore = 0.5;
      else if (correctCount === 4) qScore = 1.0;

      part2Score += qScore;
      return {
        questionId: q.id,
        correctStatementsCount: correctCount,
        scoreAwarded: qScore,
      };
    });

    const totalScore = Math.min(10, Number((part1Score + part2Score).toFixed(2)));

    // XP calculation: 10 * score + bonus
    let xpEarned = Math.round(totalScore * 10);
    if (totalScore >= 9.0) xpEarned += 25;

    return {
      totalScore,
      part1Score: Number(part1Score.toFixed(2)),
      part2Score: Number(part2Score.toFixed(2)),
      correctPart1Count,
      part2Breakdown,
      xpEarned,
    };
  };

  const handleFinalSubmit = () => {
    const scores = calculateFinalScore();
    const durationSeconds = exam.durationMinutes * 60 - secondsRemaining;

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      userId,
      track,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds,
      ...scores,
      answers,
    };

    setCompletedAttempt(attempt);
    setIsSubmitted(true);
    onSubmitAttempt(attempt);

    if (scores.totalScore >= 8.0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/80 flex flex-col backdrop-blur-xs select-none">
      {/* Top Exam Action Bar */}
      <div className="bg-[#202020] text-white px-4 py-3 border-b border-[#333] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!isSubmitted) {
                if (window.confirm('Bạn có chắc muốn thoát bài thi? Tiến độ hiện tại chưa được lưu.')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-bold text-base sm:text-lg truncate">{exam.title}</h3>
            <span className="text-xs text-gray-400">
              Định hướng: <strong>{track === 'CS' ? 'Khoa học máy tính' : 'Tin học ứng dụng'}</strong> · 28 câu hỏi
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4">
          {!isSubmitted ? (
            <>
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-mono font-bold ${
                  secondsRemaining < 300
                    ? 'bg-red-950/80 text-red-400 border border-red-800 animate-pulse'
                    : 'bg-[#2A2A2A] text-amber-400 border border-[#444]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="tabular-nums text-sm font-bold">{formatTime(secondsRemaining)}</span>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-5 py-2 rounded-lg bg-[#22A06B] text-white text-sm font-bold hover:bg-[#1B8055] transition-colors shadow"
              >
                Nộp bài
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm px-3.5 py-1.5 rounded-lg bg-[#22A06B] text-white font-bold font-mono">
                Đã nộp bài · {completedAttempt?.totalScore.toFixed(2)} / 10 điểm
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#2878C8] text-white text-sm font-bold hover:bg-[#2068B0]"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Question Presentation Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#151515] text-[#202020] dark:text-[#E0E0E0]">
          <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[92vw] mx-auto space-y-6">
            {/* Question Header & Meta */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-[#333] pb-3">
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-[#2878C8]">
                  {currentItem.part === 1 ? 'PHẦN I — Câu trắc nghiệm (D1)' : 'PHẦN II — Trắc nghiệm đúng/sai (D2)'}
                </span>
                <span>·</span>
                <span>Câu số {currentQuestionIndex + 1} / {allQuestions.length}</span>
              </div>

              <div className="flex items-center gap-2">
                {!isSubmitted && (
                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {flaggedQuestions[currentQ.id] ? 'Đã đánh dấu xem lại' : 'Đánh dấu xem lại'}
                  </button>
                )}

                {/* AI Hint Button */}
                {!isSubmitted && (
                  <button
                    onClick={handleGetHint}
                    disabled={loadingHint}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-[#2878C8] hover:bg-blue-100 text-xs font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                    {loadingHint ? 'Đang suy nghĩ...' : 'Gợi ý AI'}
                  </button>
                )}
              </div>
            </div>

            {/* AI Hint Display Box */}
            {aiHint && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Manh mối tư duy (Gemini 3.1 Flash-Lite):</span>
                    <p className="mt-0.5 leading-relaxed">{aiHint}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiHint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Question Card */}
            <div className="bg-white dark:bg-[#1E1E1E] p-6 sm:p-7 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs space-y-5">
              {/* PART 1: Single Choice Question */}
              {currentItem.part === 1 ? (
                <>
                  <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                    <span className="font-mono text-[#2878C8] mr-2">Câu {currentQuestionIndex + 1}.</span>
                    {(currentQ as SingleChoiceQuestion).content}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                      const sq = currentQ as SingleChoiceQuestion;
                      const optText = sq.options[optKey];
                      const isSelected = answers[sq.id]?.selectedOption === optKey;
                      const isCorrect = sq.correctAnswer === optKey;

                      let itemStyle = 'border-gray-200 dark:border-[#333] hover:border-[#2878C8] bg-white dark:bg-[#1A1A1A]';
                      if (isSelected) {
                        itemStyle = 'border-[#2878C8] bg-blue-50/70 dark:bg-blue-950/40 font-semibold ring-1 ring-[#2878C8]/20';
                      }

                      if (isSubmitted) {
                        if (isCorrect) {
                          itemStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          itemStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optKey}
                          onClick={() => handleSelectOption(sq.id, optKey)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3.5 text-sm sm:text-base ${itemStyle}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#2878C8] text-white'
                                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {optKey}
                          </span>
                          <span className="leading-relaxed">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation shown after submission */}
                  {isSubmitted && (
                    <div className="p-4.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-sm space-y-1.5">
                      <span className="font-bold text-[#22A06B] flex items-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Đáp án đúng: {(currentQ as SingleChoiceQuestion).correctAnswer}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Hướng dẫn giải:</strong> {(currentQ as SingleChoiceQuestion).explanation}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* PART 2: True / False Group Question */
                <>
                  <div className="text-sm text-[#2878C8] font-bold uppercase tracking-wider">
                    Dạng 2: Trắc nghiệm Đúng/Sai (Mỗi lệnh hỏi tính điểm riêng)
                  </div>

                  <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed bg-gray-50 dark:bg-[#252525] p-4.5 rounded-xl border border-gray-200 dark:border-[#333]">
                    {(currentQ as TrueFalseGroupQuestion).context}
                  </div>

                  {/* Statements a, b, c, d */}
                  <div className="space-y-3.5 pt-2">
                    {(currentQ as TrueFalseGroupQuestion).statements.map((stmt) => {
                      const selectedVal = answers[currentQ.id]?.trueFalseSelections?.[stmt.id];
                      return (
                        <div
                          key={stmt.id}
                          className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm sm:text-base"
                        >
                          <div className="flex items-start gap-2.5 flex-1 pr-2">
                            <span className="font-mono font-bold text-[#2878C8] uppercase shrink-0">
                              {stmt.id})
                            </span>
                            <span className="leading-relaxed">{stmt.text}</span>
                          </div>

                          {/* True / False Toggle buttons */}
                          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleSelectTrueFalse(currentQ.id, stmt.id, true)}
                              disabled={isSubmitted}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                selectedVal === true
                                  ? 'bg-[#2878C8] text-white border-[#2878C8]'
                                  : 'border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              ĐÚNG
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectTrueFalse(currentQ.id, stmt.id, false)}
                              disabled={isSubmitted}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                selectedVal === false
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              SAI
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Part 2 Post-submission Explanations */}
                  {isSubmitted && (
                    <div className="space-y-2.5 pt-2">
                      {(currentQ as TrueFalseGroupQuestion).statements.map((stmt) => (
                        <div
                          key={stmt.id}
                          className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-sm"
                        >
                          <span className="font-mono font-bold mr-2 uppercase">
                            {stmt.id}) Đáp án chuẩn: {stmt.isCorrect ? 'ĐÚNG' : 'SAI'}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">{stmt.explanation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-white dark:hover:bg-[#252525] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Câu trước
              </button>

              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(allQuestions.length - 1, prev + 1))
                }
                disabled={currentQuestionIndex === allQuestions.length - 1}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-white dark:hover:bg-[#252525] flex items-center gap-1.5 transition-colors"
              >
                Câu sau <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Question Navigation Palette (VNOI Style) */}
        <div className="w-72 border-l border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Bảng câu hỏi ({allQuestions.length})
            </h4>

            {/* Part 1 Palette */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-gray-500 block mb-2">
                Phần I: 24 câu (0.25đ/câu)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {exam.part1Questions.map((q, idx) => {
                  const isAnswered = Boolean(answers[q.id]?.selectedOption);
                  const isFlagged = Boolean(flaggedQuestions[q.id]);
                  const isCurrent = currentQuestionIndex === idx;

                  let bg = 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300';
                  if (isAnswered) bg = 'bg-blue-100 text-[#2878C8] font-bold dark:bg-blue-950 dark:text-blue-300';
                  if (isFlagged) bg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                  if (isCurrent) bg = 'bg-[#2878C8] text-white font-bold ring-2 ring-[#2878C8]/40';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 rounded-lg text-sm font-mono transition-colors flex items-center justify-center ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Part 2 Palette */}
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">
                Phần II: 4 câu đúng/sai (1.0đ/câu)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {part2Filtered.map((q, idx) => {
                  const globalIdx = exam.part1Questions.length + idx;
                  const selections = answers[q.id]?.trueFalseSelections || {};
                  const answeredCount = Object.keys(selections).length;
                  const isCurrent = currentQuestionIndex === globalIdx;

                  let bg = 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300';
                  if (answeredCount > 0) bg = 'bg-blue-100 text-[#2878C8] font-bold dark:bg-blue-950 dark:text-blue-300';
                  if (isCurrent) bg = 'bg-[#2878C8] text-white font-bold ring-2 ring-[#2878C8]/40';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(globalIdx)}
                      className={`h-8 rounded-lg text-sm font-mono transition-colors flex items-center justify-center ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Action Box */}
          <div className="pt-5 border-t border-gray-200 dark:border-[#333]">
            {!isSubmitted ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-3 rounded-xl bg-[#22A06B] text-white text-sm font-bold hover:bg-[#1B8055] transition-colors shadow-sm"
              >
                Nộp bài & Chấm điểm
              </button>
            ) : (
              <div className="space-y-2.5">
                <div className="text-center p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300">
                  <span className="text-xs font-bold text-[#22A06B] block">Kết quả hoàn thành</span>
                  <span className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">
                    {completedAttempt?.totalScore.toFixed(2)}đ
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 block mt-0.5">
                    +{completedAttempt?.xpEarned} XP
                  </span>
                </div>

                <button
                  onClick={() => setIsCommentModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-800 dark:text-gray-200 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>Thảo luận đề thi ({storageService.getComments(exam.id).length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-6 max-w-sm w-full border border-gray-200 dark:border-[#333] shadow-xl text-xs space-y-4">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Xác nhận nộp bài thi
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Bạn vẫn còn thời gian làm bài. Khi đã nộp bài, hệ thống sẽ tiến hành chấm điểm và công bố kết quả ngay lập tức.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleFinalSubmit();
                }}
                className="px-4 py-1.5 rounded bg-[#22A06B] text-white font-bold"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thảo luận đề thi */}
      {isCommentModalOpen && (
        <ExamCommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          examId={exam.id}
          examTitle={exam.title}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
