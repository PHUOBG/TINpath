import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Minimize2,
  Send,
  RefreshCw,
  BookOpen,
  Brain,
  Globe,
  HelpCircle,
  MessageSquare,
  CornerDownLeft,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { askRagTutor } from '../../services/ragService';
import { askThinkingAiTutor, askSearchGroundedInfo } from '../../services/geminiClient';

interface FloatingAiBotProps {
  user: UserProfile;
  currentTopicId?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  model?: string;
  sources?: string[];
  ragSources?: Array<{ title: string; bookSource: string }>;
}

const QUICK_PROMPTS = [
  { label: 'Giao thức TCP/IP', prompt: 'Giải thích mô hình TCP/IP 4 tầng và chức năng từng tầng trong SGK Tin học 12' },
  { label: 'Khóa chính & Khóa ngoại SQL', prompt: 'Phân biệt khóa chính (Primary Key) và khóa ngoại (Foreign Key) trong CSDL quan hệ' },
  { label: 'AI hẹp vs AI tổng quát', prompt: 'Phân biệt AI hẹp (ANI) và AI tổng quát (AGI), cho ví dụ thực tế' },
  { label: 'Tính địa chỉ IP & Subnet Mask', prompt: 'Hướng dẫn cách xác định địa chỉ mạng từ địa chỉ IP và Subnet Mask' },
  { label: 'Bẫy đề thi trắc nghiệm Đúng/Sai', prompt: 'Chia sẻ các bẫy thường gặp trong câu trắc nghiệm Đúng/Sai dạng D2 Tin học THPT' },
];

export const FloatingAiBot: React.FC<FloatingAiBotProps> = ({ user, currentTopicId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [tutorMode, setTutorMode] = useState<'rag' | 'thinking' | 'search'>('rag');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Xin chào ${user.displayName || 'bạn'}! Mình là **Bot Tin Học TQT** 🤖 - Trợ lý Gia sư AI chuyên trách môn Tin học THPT theo chương trình GDPT 2018.\n\nMình có thể hỗ trợ bạn:\n- 📖 Giải thích tường tận lý thuyết SGK Tin 10, 11, 12.\n- 💡 Phân tích lỗi sai đề thi & bẫy trắc nghiệm.\n- 🔍 Hướng dẫn viết câu lệnh SQL, thuật toán Python.\n\nBạn đang thắc mắc vấn đề gì, cứ hỏi mình nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      model: 'TinPath SGK RAG Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Fallback intelligent responder in case server is offline or fails
  const getFallbackAnswer = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('tcp') || q.includes('ip') || q.includes('tầng')) {
      return `### 🌐 Về mô hình TCP/IP trong SGK Tin học 12 (Chủ đề B):
Mô hình TCP/IP gồm **4 tầng** chính:
1. **Tầng ứng dụng (Application Layer):** Cung cấp giao diện dịch vụ cho người dùng (HTTP, HTTPS, FTP, DNS, SMTP).
2. **Tầng giao vận (Transport Layer):** Đảm bảo truyền dữ liệu tin cậy từ đầu cuối đến đầu cuối (TCP: tin cậy, bắt tay 3 bước; UDP: tốc độ cao, không đảm bảo bắt tay).
3. **Tầng mạng / Internet (Internet Layer):** Định tuyến và đánh địa chỉ gói tin (giao thức IP, ICMP). Thiết bị hoạt động chính ở tầng này là **Router**.
4. **Tầng liên kết dữ liệu / Truy cập mạng (Network Access Layer):** Truyền dữ liệu qua môi trường vật lý (Ethernet, Wi-Fi, cáp quang). Thiết bị là **Switch, Hub, WAP**.

> **💡 Lưu ý thi cử:** Router làm việc ở Tầng 3 (chuyển tiếp gói tin qua địa chỉ IP), còn Switch làm việc ở Tầng 2 (chuyển tiếp khung tin dựa trên địa chỉ MAC).`;
    }

    if (q.includes('khoá chính') || q.includes('khóa chính') || q.includes('khoá ngoại') || q.includes('khóa ngoại') || q.includes('sql') || q.includes('csdl')) {
      return `### 🗄️ Khóa chính (Primary Key) vs Khóa ngoại (Foreign Key) - Tin học 11 (Chủ đề F):
- **Khóa chính (Primary Key - PK):**
  - Là một hoặc tập hợp các thuộc tính giúp xác định **duy nhất** mỗi hàng (bản ghi) trong bảng.
  - Giá trị khóa chính **không được để trống (NOT NULL)** và **không được trùng lặp (UNIQUE)**.
  - Mỗi bảng chỉ có duy nhất **1 khóa chính**.

- **Khóa ngoại (Foreign Key - FK):**
  - Là thuộc tính ở bảng này tham chiếu đến khóa chính của bảng khác.
  - Mục đích: Thiết lập **liên kết giữa các bảng** và đảm bảo tính toàn vẹn tham chiếu.
  - Giá trị khóa ngoại phải tồn tại ở bảng cha hoặc có thể mang giá trị NULL.

> **💡 Bẫy đề thi:** Khóa ngoại KHÔNG bắt buộc phải có giá trị duy nhất trong bảng con, nó có thể lặp lại (quan hệ 1 - nhiều)!`;
    }

    if (q.includes('ai') || q.includes('trí tuệ nhân tạo') || q.includes('turing') || q.includes('ani') || q.includes('agi')) {
      return `### 🤖 Phân loại Trí tuệ nhân tạo (AI) - Tin học 12 (Chủ đề A):
1. **AI hẹp (Narrow AI / ANI):**
   - Thiết kế để giải quyết **một nhiệm vụ chuyên biệt duy nhất** (ví dụ: cờ vua AlphaGo, nhận diện khuôn mặt, trợ lý Siri, dịch máy Google Translate).
   - Tất cả AI thực tế ngày nay đều thuộc nhóm AI hẹp!
2. **AI tổng quát (General AI / AGI):**
   - Có năng lực nhận thức và thích ứng thông minh như con người trên mọi lĩnh vực.
   - Hiện nay AGI vẫn đang ở mức nghiên cứu định hướng tương lai, chưa xuất hiện trên thực tế.

> **💡 Câu hỏi hay bẫy:** "AI hiện nay đã có thể thay thế hoàn toàn con người trong mọi công việc chưa?" ➡️ **Sai**. AI chỉ thay thế được các công việc lặp lại, có quy tắc rõ ràng; những công việc đòi hỏi cảm xúc, đạo đức, sáng tạo đỉnh cao vẫn cần con người.`;
    }

    if (q.includes('subnet') || q.includes('mạng') || q.includes('nhị phân') || q.includes('broadcast')) {
      return `### 🔢 Cách tính địa chỉ mạng & Subnet Mask:
- **Địa chỉ IPv4:** Dài 32 bit, chia làm 4 octet (mỗi octet 8 bit từ 0 đến 255), gồm 2 phần: **NetID (Địa chỉ mạng)** và **HostID (Địa chỉ máy chủ)**.
- **Quy tắc tìm Địa chỉ Mạng:** Thực hiện phép toán logic **AND** từng bit giữa [Địa chỉ IP] và [Subnet Mask].
  - Ví dụ: IP: 192.168.1.50, Mask: 255.255.255.0 ➡️ Địa chỉ mạng: 192.168.1.0.
- **Địa chỉ Broadcast (Quảng bá):** Tất cả các bit của phần HostID đều bật lên là 1 (ở ví dụ trên là 192.168.1.255).`;
    }

    if (q.includes('đúng/sai') || q.includes('dạng d2') || q.includes('mẹo')) {
      return `### 📝 Chiến thuật làm trắc nghiệm Đúng/Sai dạng D2:
Đề thi GDPT 2018 có thang điểm phân hóa rất cao cho dạng D2:
- Đúng 1 ý: **0.1 điểm**
- Đúng 2 ý: **0.25 điểm**
- Đúng 3 ý: **0.5 điểm**
- Đúng cả 4 ý: **1.0 điểm trọn vẹn!**

**Bí quyết:**
1. Đọc kỹ từ ngữ tuyệt đối: Các mệnh đề có chữ *"luôn luôn"*, *"tuyệt đối"*, *"không bao giờ"*, *"thay thế hoàn toàn"* thường có xác suất sai rất cao.
2. Kiểm tra ngữ cảnh: Dạng D2 thường cung cấp một kịch bản tình huống (bảng CSDL, sơ đồ mạng, bảng tính...). Phải đối chiếu dữ liệu của đề bài trước khi chọn True/False.
3. Không bỏ trống ý nào vì mỗi ý đều có điểm độc lập!`;
    }

    return `### 📘 Trả lời câu hỏi: "${question}"
Dựa theo chương trình Tin học GDPT 2018 (SGK Kết nối tri thức & Cánh diều):

1. **Khái niệm trọng tâm:** Kiến thức này gắn liền với chuẩn đầu ra năng lực của Bộ GD&ĐT. Bạn cần nắm chắc các định nghĩa nhận biết và từ khóa kỹ thuật trước khi làm bài tập vận dụng.
2. **Nguyên lý hoạt động:** Chú ý liên hệ giữa lý thuyết và các tình huống ứng dụng thực tế trên máy tính (hệ điều hành, mạng máy tính, hệ quản trị CSDL MySQL/Access hoặc cú pháp ngôn ngữ lập trình).
3. **Lời khuyên ôn luyện:** Bạn có thể vào tab **"Học theo chủ đề"** trên TinPath để làm thêm các câu hỏi trắc nghiệm tương ứng có giải thích chi tiết!

*💡 Bạn có thể hỏi cụ thể hơn về một câu hỏi trắc nghiệm hoặc một đoạn mã để mình hỗ trợ giải đáp chi tiết hơn nhé!*`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuestion).trim();
    if (!query || isTyping) return;

    setInputQuestion('');
    const userMsgId = `user_${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: userTimestamp,
      },
    ]);

    setIsTyping(true);

    try {
      let botResponseText = '';
      let modelUsed = 'TinPath SGK RAG';
      let sources: string[] | undefined = undefined;
      let ragSources: Array<{ title: string; bookSource: string }> | undefined = undefined;

      if (tutorMode === 'search') {
        try {
          const res = await askSearchGroundedInfo(query);
          botResponseText = res.text;
          modelUsed = res.modelUsed || 'Google Search Grounding';
          sources = res.searchSources;
        } catch {
          botResponseText = getFallbackAnswer(query);
        }
      } else if (tutorMode === 'thinking') {
        try {
          const res = await askThinkingAiTutor({
            topicTitle: currentTopicId ? `Chuyên đề ${currentTopicId}` : 'Ôn thi tốt nghiệp THPT Tin học 2026',
            userQuestion: query,
            studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
          });
          botResponseText = res.text;
          modelUsed = res.modelUsed || 'Gemini 2.5 Flash Thinking';
        } catch {
          botResponseText = getFallbackAnswer(query);
        }
      } else {
        // Default: SGK RAG Tutor
        try {
          const res = await askRagTutor({
            topicTitle: currentTopicId ? `Chuyên đề ${currentTopicId}` : 'Ôn thi tốt nghiệp THPT Tin học 2026',
            userQuestion: query,
            studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
            topicId: currentTopicId,
          });
          botResponseText = res.text;
          modelUsed = res.modelUsed || 'Gemini Flash + RAG SGK GDPT 2018';
          ragSources = res.sourceChunks;
        } catch {
          botResponseText = getFallbackAnswer(query);
        }
      }

      const botMsgId = `bot_${Date.now()}`;
      const botTimestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: botResponseText,
          timestamp: botTimestamp,
          model: modelUsed,
          sources,
          ragSources,
        },
      ]);
    } catch {
      const fallbackText = getFallbackAnswer(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_fb_${Date.now()}`,
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          model: 'TinPath AI Tutor Knowledge Base',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_refreshed',
        sender: 'bot',
        text: `Đã làm mới cuộc trò chuyện. Bạn muốn mình giải đáp nội dung nào tiếp theo?`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        model: 'Bot Tin Học TQT',
      },
    ]);
  };

  return (
    <>
      {/* 1. FLOATING PILL BUTTON AT BOTTOM-RIGHT - Matches user screenshot */}
      {!isOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(true);
              setIsMinimized(false);
            }
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-100 border-2 border-emerald-500/40 hover:border-emerald-500 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer active:scale-95 select-none"
          title="Mở Bot Tin Học TQT - Trợ lý Gia sư AI"
        >
          {/* Bot icon circle badge with soft mint background */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Bot Title matching user specification */}
          <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase font-sans text-gray-900 dark:text-white">
            BOT TIN HỌC TQT
          </span>

          {/* Pulsing online green dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
      )}

      {/* 2. EXPANDED / MINIMIZED FLOATING CHAT WINDOW */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-5 z-50 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${
            isMinimized
              ? 'w-72 h-14'
              : 'w-[94vw] sm:w-[440px] md:w-[480px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-white dark:bg-[#202020] border-b border-gray-200 dark:border-[#333] px-4 py-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white tracking-wide uppercase">
                    Bot Tin Học TQT
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                {!isMinimized && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    Gia sư AI Tin học GDPT 2018 • RAG SGK
                  </p>
                )}
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                title="Làm mới đoạn hội thoại"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Selector Pill Bar (Only when not minimized) */}
          {!isMinimized && (
            <div className="px-3.5 py-2 bg-gray-50 dark:bg-[#161616] border-b border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between gap-1 text-[11px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTutorMode('rag')}
                  className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition-colors ${
                    tutorMode === 'rag'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>SGK RAG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTutorMode('thinking')}
                  className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition-colors ${
                    tutorMode === 'thinking'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <Brain className="w-3 h-3" />
                  <span>Suy luận sâu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTutorMode('search')}
                  className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition-colors ${
                    tutorMode === 'search'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Tra cứu</span>
                </button>
              </div>

              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium hidden sm:inline">
                GDPT 2018
              </span>
            </div>
          )}

          {/* Chat Messages Body */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm bg-gray-50/50 dark:bg-[#151515]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#2878C8] text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#222] text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-[#333] rounded-tl-none'
                    }`}
                  >
                    {/* Bot avatar mini tag */}
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-gray-100 dark:border-[#333] text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        <span>Bot Tin Học TQT</span>
                        {msg.model && (
                          <span className="text-gray-400 font-normal ml-auto">({msg.model})</span>
                        )}
                      </div>
                    )}

                    {/* Content text */}
                    <div className="whitespace-pre-wrap space-y-1">
                      {msg.text}
                    </div>

                    {/* SGK RAG Sources Citation */}
                    {msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        📖 Trích dẫn SGK:{' '}
                        {msg.ragSources.map((s, idx) => (
                          <span key={idx} className="inline-block bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded text-[10px] mr-1 mt-1 border border-indigo-200/50 dark:border-indigo-800/40">
                            {s.bookSource}: {s.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Google Search Grounding Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        🌐 Nguồn tham khảo: {msg.sources.slice(0, 3).join(', ')}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] text-xs text-gray-500 flex items-center gap-2 shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Bot Tin Học TQT đang soạn câu trả lời...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Prompt Suggestion Chips */}
          {!isMinimized && messages.length <= 2 && (
            <div className="px-3 py-2 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-gray-400 shrink-0 font-bold uppercase flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-emerald-500" /> Gợi ý:
              </span>
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold whitespace-nowrap transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          {!isMinimized && (
            <div className="p-3 bg-white dark:bg-[#1E1E1E] border-t border-gray-200 dark:border-[#333]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="Nhập câu hỏi cần Bot Tin Học TQT giải đáp..."
                    disabled={isTyping}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-gray-50 dark:bg-[#121212] text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#161616] transition-all"
                  />
                  {inputQuestion && (
                    <button
                      type="button"
                      onClick={() => setInputQuestion('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isTyping || !inputQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  title="Gửi câu hỏi"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-gray-400">
                <span>Nhấn Enter để gửi</span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="w-2.5 h-2.5" /> TinPath AI v2026
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
