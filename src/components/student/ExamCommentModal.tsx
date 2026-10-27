import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  ThumbsUp,
  Clock,
  User,
  Sparkles,
  School,
  CheckCircle2,
} from 'lucide-react';
import { ExamComment, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface ExamCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  examTitle: string;
  currentUser: UserProfile;
  onCommentAdded?: () => void;
}

export const ExamCommentModal: React.FC<ExamCommentModalProps> = ({
  isOpen,
  onClose,
  examId,
  examTitle,
  currentUser,
  onCommentAdded,
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ExamComment[]>(() =>
    storageService.getComments(examId)
  );

  if (!isOpen) return null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = storageService.addComment({
      examId,
      examTitle,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userSchool: currentUser.schoolName,
      content: commentText.trim(),
    });

    setComments(storageService.getComments(examId));
    setCommentText('');
    if (onCommentAdded) onCommentAdded();
  };

  const handleLike = (commentId: string) => {
    storageService.likeComment(commentId);
    setComments(storageService.getComments(examId));
    if (onCommentAdded) onCommentAdded();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-4xl w-full border border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#202020] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight">Thảo luận & Bình luận đề thi</h3>
              <p className="text-xs sm:text-sm text-gray-300 truncate max-w-lg">{examTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#f8f9fa] dark:bg-[#181818]">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pb-2.5 border-b border-gray-200 dark:border-[#2C2C2C]">
            <span>Tổng cộng {comments.length} ý kiến thảo luận</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Thảo luận có kiểm duyệt kiến thức GDPT 2018
            </span>
          </div>

          {comments.length === 0 ? (
            <div className="py-14 text-center text-gray-500 text-sm">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2.5" />
              Chưa có bình luận nào cho đề thi này. Hãy là người đầu tiên đặt câu hỏi hoặc chia sẻ hướng giải!
            </div>
          ) : (
            comments.map((cm) => (
              <div
                key={cm.id}
                className="p-4 rounded-xl bg-white dark:bg-[#222222] border border-gray-200 dark:border-[#333] shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {cm.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {cm.userName}
                      </span>
                      <span className="text-xs text-gray-400 ml-1.5">({cm.userSchool})</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {cm.createdAt}
                  </span>
                </div>

                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed pl-9">
                  {cm.content}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 pl-9 border-t border-gray-100 dark:border-[#2A2A2A]">
                  <button
                    onClick={() => handleLike(cm.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Hữu ích ({cm.likes})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={handlePostComment}
          className="p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border-t border-gray-200 dark:border-[#333] shrink-0"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2878C8] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-2.5">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Hỏi đáp, trao đổi hướng giải hoặc thắc mắc về đề thi...`}
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-[#444] bg-[#fdfdfd] dark:bg-[#151515] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400 italic">
                  Đăng dưới tên <strong>{currentUser.displayName}</strong> ({currentUser.schoolName})
                </span>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-5 py-2 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" /> Gửi bình luận
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
