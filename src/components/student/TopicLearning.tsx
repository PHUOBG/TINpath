import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle,
  Circle,
  Code,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Share2,
  FileText,
  CheckCircle2,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { SubjectTopicId } from '../../types';
import { TOPIC_LESSONS, TopicLesson } from '../../data/topicsData';

interface TopicLearningProps {
  initialTopicId?: SubjectTopicId;
  completedTopics: Record<SubjectTopicId, boolean>;
  onToggleCompleteTopic: (topicId: SubjectTopicId) => void;
  onPracticeTopicQuiz: (topicId: SubjectTopicId) => void;
}

export const TopicLearning: React.FC<TopicLearningProps> = ({
  initialTopicId = '12A',
  completedTopics,
  onToggleCompleteTopic,
  onPracticeTopicQuiz,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<SubjectTopicId>(initialTopicId);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '12' | '11' | '10'>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'ALL' | 'CS' | 'ICT'>('all');

  const topicsList = Object.values(TOPIC_LESSONS);

  // Filter topics
  const filteredTopics = topicsList.filter((topic) => {
    const matchSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'all' || topic.grade === gradeFilter;
    const matchTrack = trackFilter === 'all' || topic.track === trackFilter || topic.track === 'ALL';
    return matchSearch && matchGrade && matchTrack;
  });

  const activeTopic: TopicLesson = TOPIC_LESSONS[selectedTopicId] || TOPIC_LESSONS['12A'];
  const isCompleted = Boolean(completedTopics[selectedTopicId]);

  // Next topic helper
  const allTopicKeys = Object.keys(TOPIC_LESSONS) as SubjectTopicId[];
  const currentIndex = allTopicKeys.indexOf(selectedTopicId);
  const nextTopicId = currentIndex < allTopicKeys.length - 1 ? allTopicKeys[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#202020] dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2878C8]" />
              Học tập kiến thức Tin học THPT
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Hệ thống hóa toàn bộ kiến thức theo chuẩn chương trình GDPT 2018 (Lớp 10, 11, 12)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tra cứu bài học, khái niệm (SQL, TCP, AI...)"
              className="w-full pl-9 pr-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs focus:outline-none focus:border-[#2878C8]"
            />
          </div>
        </div>

        {/* Filter Segmented Controls (Anti-slop clean buttons) */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Grade filter */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded">
            <span className="text-[11px] text-gray-600 dark:text-gray-400 px-2 font-medium">Khối:</span>
            {(['all', '12', '11', '10'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  gradeFilter === g
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
              </button>
            ))}
          </div>

          {/* Track filter */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded">
            <span className="text-[11px] text-gray-600 dark:text-gray-400 px-2 font-medium">Định hướng:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'ALL', label: 'Chung (80%)' },
              { id: 'CS', label: 'Khoa học máy tính' },
              { id: 'ICT', label: 'Tin học ứng dụng' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTrackFilter(t.id as any)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  trackFilter === t.id
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Learning Workspace: Left Catalog List & Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Topic Index (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold px-1 text-gray-600 dark:text-gray-400">
            <span>DANH SÁCH CHỦ ĐỀ ({filteredTopics.length})</span>
            <span>Trạng thái</span>
          </div>

          <div className="space-y-1.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              const completed = Boolean(completedTopics[topic.id]);
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border-[#2878C8] shadow-xs'
                      : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span className="font-bold text-[#2878C8]">{topic.code}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">Lớp {topic.grade}</span>
                      {topic.track && topic.track !== 'ALL' && (
                        <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[9px] font-bold">
                          {topic.track}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate mt-0.5">
                      {topic.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Topic Detail View (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-6">
          {/* Header of Detail */}
          <div className="border-b border-gray-200 dark:border-[#333] pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-[#2878C8] font-bold">
                  {activeTopic.code}
                </span>
                <span className="text-gray-600 dark:text-gray-400">Khối Lớp {activeTopic.grade}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600 dark:text-gray-400">{activeTopic.examWeight}</span>
              </div>

              {/* Complete Toggle Button */}
              <button
                onClick={() => onToggleCompleteTopic(activeTopic.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-emerald-50 text-[#22A06B] border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                    : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#22A06B]" /> Đã hoàn thành (+20 XP)
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" /> Đánh dấu đã học xong
                  </>
                )}
              </button>
            </div>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {activeTopic.title}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              {activeTopic.summary}
            </p>
          </div>

          {/* 1. Yêu cầu cần đạt chuẩn Bộ GD&ĐT */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2878C8]" />
              Yêu cầu cần đạt chuẩn chương trình
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc pl-5">
              {activeTopic.requirements.map((req, idx) => (
                <li key={idx} className="leading-relaxed">
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Khái niệm cốt lõi & Ví dụ */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#FFC928]" />
              Các khái niệm trọng tâm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTopic.keyConcepts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded border border-gray-200 dark:border-[#333] bg-gray-50/70 dark:bg-[#252525]"
                >
                  <h4 className="text-xs font-bold text-[#2878C8]">{item.term}</h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                    {item.definition}
                  </p>
                  {item.example && (
                    <div className="mt-2 pt-1.5 border-t border-gray-200/50 dark:border-[#333] text-[11px] text-gray-600 dark:text-gray-400 italic">
                      Ví dụ: {item.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Chi tiết lý thuyết & Minh họa Code */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#2878C8]" />
              Nội dung kiến thức & Minh họa
            </h3>
            {activeTopic.theorySections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] space-y-2"
              >
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{sec.title}</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {sec.content}
                </p>

                {sec.codeSnippet && (
                  <pre className="p-3 rounded bg-[#202020] text-gray-200 font-mono text-[11px] overflow-x-auto border border-[#333] mt-2">
                    <code>{sec.codeSnippet}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>

          {/* 4. Lưu ý phòng tránh bẫy câu hỏi thi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold text-[#22A06B] flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4" /> Kinh nghiệm làm bài
              </h4>
              <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 list-disc pl-4">
                {activeTopic.practicalTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Bẫy đề thi hay nhầm lẫn
              </h4>
              <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 list-disc pl-4">
                {activeTopic.commonPitfalls.map((pitfall, i) => (
                  <li key={i}>{pitfall}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Actions: Practice Quiz & Next Topic */}
          <div className="pt-4 border-t border-gray-200 dark:border-[#333] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onPracticeTopicQuiz(activeTopic.id)}
              className="px-4 py-2 rounded bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Luyện trắc nghiệm chủ đề này <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {nextTopicId && (
              <button
                onClick={() => setSelectedTopicId(nextTopicId)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-[#444] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525] flex items-center gap-1"
              >
                Chuyển sang {TOPIC_LESSONS[nextTopicId].code} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
