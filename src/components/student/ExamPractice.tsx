import React, { useState } from 'react';
import {
  Flame,
  Award,
  Clock,
  BookOpen,
  CheckCircle2,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart2,
  Calendar,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { Exam, SubjectTopicId, ExamAttempt } from '../../types';
import { OFFICIAL_EXAMS } from '../../data/officialExamsData';
import { TOPIC_LESSONS } from '../../data/topicsData';
import { storageService } from '../../services/storageService';
import { ExamCommentModal } from './ExamCommentModal';


interface ExamPracticeProps {
  onStartExam: (examId: string) => void;
  onStartDailyChallenge: () => void;
  onStartTopicQuiz: (topicId: SubjectTopicId, questionCount: number, level: string) => void;
  completedDailyToday: boolean;
  streakDays: number;
  examAttempts: ExamAttempt[];
}

export const ExamPractice: React.FC<ExamPracticeProps> = ({
  onStartExam,
  onStartDailyChallenge,
  onStartTopicQuiz,
  completedDailyToday,
  streakDays,
  examAttempts,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'topic' | 'exams'>('exams');
  const [commentModalExam, setCommentModalExam] = useState<{ id: string; title: string } | null>(null);
  const [commentsVersion, setCommentsVersion] = useState(0);
  const currentUser = storageService.getUserProfile();

  // Topic practice configuration state
  const [selectedTopic, setSelectedTopic] = useState<SubjectTopicId>('12B');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficultyLevel, setDifficultyLevel] = useState<string>('all');

  // Exam bank filter state
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredExams = OFFICIAL_EXAMS.filter((ex) => {
    if (difficultyFilter === 'all') return true;
    return ex.difficulty === difficultyFilter;
  });

  return (
    <div className="space-y-6">
      {/* Tab Navigation (Anti-slop clean segmented button bar) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#202020] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2878C8]" />
              Trung tâm Luyện đề Tin học THPT
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
              Rèn luyện theo chuẩn cấu trúc đề thi tốt nghiệp THPT từ năm 2025 của Bộ Giáo dục & Đào tạo
            </p>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'daily'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FFC928]" />
              Thử thách hằng ngày
            </button>

            <button
              onClick={() => setActiveTab('topic')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'topic'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#2878C8]" />
              Luyện theo chủ đề
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'exams'
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#22A06B]" />
              Ngân hàng đề thi
            </button>
          </div>
        </div>
      </div>

      {/* TAB A: THỬ THÁCH HẰNG NGÀY */}
      {activeTab === 'daily' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50 dark:border-amber-900/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded bg-amber-500 text-white shadow-xs">
                  <Flame className="w-5 h-5 fill-white" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Thử thách 10 câu trắc nghiệm mỗi ngày
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Duy trì chuỗi ngày học liên tục · Nhận tối đa 80 XP mỗi ngày
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-gray-500 block">Chuỗi hiện tại</span>
                <span className="text-lg font-bold font-mono text-amber-500 tabular-nums">
                  {streakDays} ngày liên tiếp
                </span>
              </div>

              {!completedDailyToday ? (
                <button
                  onClick={onStartDailyChallenge}
                  className="px-5 py-2.5 rounded bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Bắt đầu thử thách hôm nay
                </button>
              ) : (
                <div className="px-4 py-2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã hoàn thành hôm nay (+80 XP)
                </div>
              )}
            </div>
          </div>

          {/* Rules and Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Quy định nhận điểm XP</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Mỗi ngày được tính điểm 1 lần duy nhất để bảo đảm tính công bằng. Bạn nhận 30 XP cơ bản khi nộp bài và 5 XP cho mỗi câu trả lời đúng (tối đa 80 XP).
              </p>
            </div>
            <div className="p-4 rounded border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Mốc thưởng chuỗi ngày</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Đạt mốc 7 ngày: thưởng +50 XP. Mốc 14 ngày: thưởng +100 XP. Mốc 30 ngày: thưởng +200 XP được xác minh bảo mật phía máy chủ.
              </p>
            </div>
            <div className="p-4 rounded border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525]">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Xem lại câu hỏi</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Sau khi hoàn thành, bạn vẫn có thể xem lại đáp án và lời giải chi tiết bất cứ lúc nào mà không sợ ảnh hưởng đến tiến độ chuỗi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: LUYỆN THEO CHỦ ĐỀ */}
      {activeTab === 'topic' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Tùy chỉnh phòng luyện tập theo chủ đề
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
              Tập trung khắc phục chủ đề yếu hoặc luyện tập chuyên sâu các dạng câu hỏi cụ thể
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic selector */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                1. Chọn chủ đề kiến thức
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value as SubjectTopicId)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs font-medium focus:outline-none focus:border-[#2878C8]"
              >
                {Object.values(TOPIC_LESSONS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} — {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Question count */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                2. Số lượng câu hỏi
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs font-medium focus:outline-none focus:border-[#2878C8]"
              >
                <option value={5}>5 câu (Khởi động nhanh - 7 phút)</option>
                <option value={10}>10 câu (Tiêu chuẩn - 15 phút)</option>
                <option value={15}>15 câu (Chuyên sâu - 22 phút)</option>
                <option value={20}>20 câu (Thử thách - 30 phút)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                3. Cấp độ tư duy
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs font-medium focus:outline-none focus:border-[#2878C8]"
              >
                <option value="all">Tất cả mức độ (Biết, Hiểu, Vận dụng)</option>
                <option value="biet">Mức độ Biết (Nhận biết khái niệm)</option>
                <option value="hieu">Mức độ Hiểu (Thông hiểu, đọc code)</option>
                <option value="van_dung">Mức độ Vận dụng (Tình huống thực tiễn)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onStartTopicQuiz(selectedTopic, questionCount, difficultyLevel)}
              className="px-6 py-2.5 rounded bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" /> Bắt đầu làm bài luyện tập
            </button>
          </div>
        </div>
      )}

      {/* TAB C: NGÂN HÀNG ĐỀ THI TỐT NGHIỆP */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {/* Exam Filter strip */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 px-1">
            <span>DANH SÁCH ĐỀ THI ({filteredExams.length} đề chuẩn Bộ GD&ĐT)</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-500">Lọc độ khó:</span>
              {(['all', 'Thi thử tốt nghiệp', 'Cơ bản', 'Nâng cao'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    difficultyFilter === lvl
                      ? 'bg-[#2878C8] text-white font-bold'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExams.map((exam) => {
              const attempt = examAttempts.find((a) => a.examId === exam.id);
              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 dark:hover:border-[#444] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[#2878C8] font-bold">Năm {exam.year}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-300 font-medium">
                        {exam.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-2 leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                      {exam.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-700 dark:text-gray-300 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {exam.durationMinutes} phút
                      </span>
                      <span>·</span>
                      <span>28 câu (24 câu D1 + 4 câu D2)</span>
                      <span>·</span>
                      <span className="text-[#FFC928] font-bold">+{exam.baseXP} XP</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {attempt ? (
                        <span className="text-xs text-[#22A06B] font-semibold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Điểm cao nhất: {attempt.totalScore.toFixed(2)}đ
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Chưa làm bài</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCommentModalExam({
                            id: exam.id,
                            title: exam.title,
                          })
                        }
                        className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Xem và gửi ý kiến thảo luận đề thi"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Thảo luận ({storageService.getComments(exam.id).length})</span>
                      </button>

                      <button
                        onClick={() => onStartExam(exam.id)}
                        className="px-4 py-1.5 rounded bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> {attempt ? 'Luyện lại' : 'Bắt đầu làm bài'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal bình luận và thảo luận đề thi */}
      {commentModalExam && (
        <ExamCommentModal
          isOpen={Boolean(commentModalExam)}
          onClose={() => setCommentModalExam(null)}
          examId={commentModalExam.id}
          examTitle={commentModalExam.title}
          currentUser={currentUser}
          onCommentAdded={() => setCommentsVersion((v) => v + 1)}
        />
      )}
    </div>
  );
};
