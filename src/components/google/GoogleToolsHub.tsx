import React, { useState } from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckSquare,
  Mail,
  Video,
  Users,
  Image as ImageIcon,
  Film,
  Search,
  ExternalLink,
  ShieldCheck,
  Brain,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Play,
  Presentation,
} from 'lucide-react';
import { UserProfile } from '../../types';
import {
  createStudyFileOnDrive,
  exportToGoogleSheets,
  createGoogleDocGuide,
  createGoogleSlidesDeck,
  addStudyEventToCalendar,
  addStudyTaskToGoogleTasks,
  sendScoreReportEmail,
  createGoogleMeetRoom,
  getGoogleContacts,
} from '../../services/workspaceService';
import {
  generateEducationalIllustration,
  generateVeoVideo,
  analyzeVideoWithArgon,
} from '../../services/geminiClient';

interface GoogleToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isLoggedIn: boolean;
  onGoogleSignIn: () => Promise<void>;
}

export const GoogleToolsHub: React.FC<GoogleToolsHubProps> = ({
  isOpen,
  onClose,
  user,
  isLoggedIn,
  onGoogleSignIn,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'images' | 'video' | 'intelligence'>('workspace');

  // Status and feedback state
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [resultNotice, setResultNotice] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  // Image Generation Form state
  const [imageTopic, setImageTopic] = useState('Mô hình Mạng máy tính: Switch, Router, Access Point và Modem');
  const [imageDescription, setImageDescription] = useState('Sơ đồ trực quan kết nối mạng LAN gia đình tới Internet, thể hiện rõ chức năng của từng thiết bị.');
  const [imageResolution, setImageResolution] = useState<'1K' | '2K' | '4K'>('2K');
  const [imageRatio, setImageRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [generatedImgResult, setGeneratedImgResult] = useState<string | null>(null);

  // Veo Video Generation Form state
  const [videoPrompt, setVideoPrompt] = useState('3D animation of data packets moving through a network switch and router into fiber optic cable, educational visualization.');
  const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoResultNotice, setVideoResultNotice] = useState<string | null>(null);

  // Contacts state
  const [contacts, setContacts] = useState<Array<{ name: string; email: string }>>([]);

  if (!isOpen) return null;

  // Workspace Actions with user confirmation (Rule: User Confirmation for Destructive/Mutating Operations)
  const handleDriveExport = async () => {
    if (!window.confirm('Bạn có đồng ý lưu tệp "Cẩm nang ôn thi Tin học THPT 2018 - TinPath.txt" vào Google Drive của bạn không?')) return;
    try {
      setLoadingAction('drive');
      setResultNotice(null);
      const content = `TINPATH — CẨM NANG ÔN THI TIN HỌC THPT 2018\nNgười dùng: ${user.displayName} (${user.schoolName})\nMục tiêu: ${user.targetScore} điểm\n\nNội dung chính:\n- 12A: 5 đặc trưng của AI, phân loại ANI/AGI\n- 12B: Switch đọc MAC, Router định tuyến IP, Access Point phát Wi-Fi, Cáp quang singlemode\n- 12F: Cấu trúc HTML5, CSS Box Model, Form biểu mẫu\n- 11F: Cơ sở dữ liệu quan hệ, Khóa chính, Khóa ngoại, SQL SELECT\n- 11F_CS: Tìm kiếm nhị phân O(log n), Sắp xếp nổi bọt O(n^2)\n`;
      const res = await createStudyFileOnDrive('TinPath_CamNang_OnThi_TinHoc.txt', content);
      setResultNotice({
        type: 'success',
        message: 'Đã lưu tài liệu ôn tập thành công vào Google Drive của bạn!',
        link: res.webViewLink,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSheetsExport = async () => {
    if (!window.confirm('Bạn có đồng ý tạo một Bảng tính Google Sheets để lưu trữ tiến độ học tập và điểm thi thử không?')) return;
    try {
      setLoadingAction('sheets');
      setResultNotice(null);
      const headers = ['Ngày làm bài', 'Tên đề thi', 'Điểm đạt', 'Phần 1 (D1)', 'Phần 2 (D2)', 'XP nhận được'];
      const rows = [
        [new Date().toLocaleDateString('vi-VN'), 'Đề số 1 — Thi tốt nghiệp THPT chuẩn Bộ GD&ĐT', '8.50', '5.50', '3.00', '+85 XP'],
        [new Date(Date.now() - 86400000).toLocaleDateString('vi-VN'), 'Thử thách 10 câu trắc nghiệm hằng ngày', '8.00', '2.00', '-', '+70 XP'],
      ];
      const res = await exportToGoogleSheets(`Báo cáo học tập TinPath - ${user.displayName}`, headers, rows);
      setResultNotice({
        type: 'success',
        message: 'Đã tạo và đồng bộ bảng điểm thành công vào Google Sheets!',
        link: res.spreadsheetUrl,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDocsExport = async () => {
    if (!window.confirm('Bạn có đồng ý tạo một tài liệu ôn thi Google Docs mới không?')) return;
    try {
      setLoadingAction('docs');
      setResultNotice(null);
      const res = await createGoogleDocGuide(
        `Đề cương tóm tắt Tin học THPT 2018 - ${user.displayName}`,
        `CHƯƠNG TRÌNH ÔN THI TỐT NGHIỆP THPT MÔN TIN HỌC (GDPT 2018)\n\n1. Chủ đề 12A: Trí tuệ nhân tạo\n- 5 đặc trưng: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.\n- Phép thử Turing và phân loại AI hẹp (ANI) vs AI rộng (AGI).\n\n2. Chủ đề 12B: Mạng máy tính & Kết nối\n- Switch: bộ chuyển mạch trong LAN, học địa chỉ MAC.\n- Router: bộ định tuyến trong WAN, tìm đường đi ngắn nhất.\n- IPv4 (32 bit) vs IPv6 (128 bit). Hệ thống tên miền DNS.`
      );
      setResultNotice({
        type: 'success',
        message: 'Đã tạo tài liệu đề cương trên Google Docs thành công!',
        link: res.documentUrl,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSlidesExport = async () => {
    if (!window.confirm('Bạn có đồng ý tạo bài trình chiếu tóm tắt bài giảng trên Google Slides không?')) return;
    try {
      setLoadingAction('slides');
      setResultNotice(null);
      const res = await createGoogleSlidesDeck(`Bài giảng ôn tập Tin học 12 - ${user.displayName}`, [
        { heading: '1. Khái niệm Trí tuệ nhân tạo (AI)', points: ['Khởi đầu Dartmouth 1956', '5 đặc trưng chính', 'Phân loại ANI và AGI'] },
        { heading: '2. Mạng máy tính & Thiết bị', points: ['Switch: Chuyển mạch MAC', 'Router: Định tuyến IP', 'Access Point: Phát Wi-Fi'] },
      ]);
      setResultNotice({
        type: 'success',
        message: 'Đã khởi tạo bản trình chiếu bài học thành công trên Google Slides!',
        link: res.presentationUrl,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCalendarSync = async () => {
    if (!window.confirm('Bạn có đồng ý thêm lịch nhắc giờ học Tin học vào Google Calendar không?')) return;
    try {
      setLoadingAction('calendar');
      setResultNotice(null);
      const now = new Date();
      const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // in 2 hours
      const endTime = new Date(startTime.getTime() + 50 * 60 * 1000); // 50 mins
      const res = await addStudyEventToCalendar(
        'Luyện đề thi thử tốt nghiệp THPT môn Tin học (50 phút)',
        'Làm Đề số 1 trên nền tảng TinPath. Mục tiêu đạt điểm ≥ 8.5/10.',
        startTime.toISOString(),
        endTime.toISOString()
      );
      setResultNotice({
        type: 'success',
        message: 'Đã đồng bộ lịch ôn thi thành công vào Google Calendar!',
        link: res.htmlLink,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTasksSync = async () => {
    if (!window.confirm('Bạn có đồng ý thêm nhiệm vụ học tập hôm nay vào danh sách Google Tasks không?')) return;
    try {
      setLoadingAction('tasks');
      setResultNotice(null);
      await addStudyTaskToGoogleTasks(
        'Hoàn thành Thử thách 10 câu trắc nghiệm Tin học trên TinPath',
        'Luyện tập mỗi ngày để nhận +80 XP và duy trì chuỗi học tập liên tiếp.'
      );
      setResultNotice({
        type: 'success',
        message: 'Đã thêm tác vụ học tập thành công vào Google Tasks!',
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGmailReport = async () => {
    const targetEmail = prompt('Nhập địa chỉ email nhận bảng báo cáo kết quả thi thử:', user.email);
    if (!targetEmail) return;
    try {
      setLoadingAction('gmail');
      setResultNotice(null);
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #202020;">
          <h2 style="color: #2878C8;">TinPath — Phiếu Điểm Ôn Thi Tin Học THPT 2018</h2>
          <p>Kính gửi: <strong>${user.displayName}</strong> (${user.schoolName})</p>
          <p>Mục tiêu điểm thi tốt nghiệp: <strong>${user.targetScore} / 10đ</strong></p>
          <div style="background: #F4F6F8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;">Điểm đánh giá hiện tại: <strong style="color: #2878C8;">${user.diagnosticScore ?? 7.5}đ</strong></p>
            <p style="margin: 5px 0 0 0;">Điểm XP tích lũy: <strong style="color: #FFC928;">${user.xp} XP</strong></p>
            <p style="margin: 5px 0 0 0;">Chuỗi ngày học liên tục: <strong>${user.streakDays} ngày</strong></p>
          </div>
          <p>Hệ thống đề xuất bạn tiếp tục củng cố chủ đề <strong>12B (Kết nối mạng)</strong> và <strong>11F (Cơ sở dữ liệu)</strong>.</p>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">Email tự động gửi từ Nền tảng ôn thi TinPath.</p>
        </div>
      `;
      await sendScoreReportEmail(targetEmail, `[TinPath] Phiếu kết quả ôn thi Tin học THPT của ${user.displayName}`, htmlBody);
      setResultNotice({
        type: 'success',
        message: `Đã gửi bảng điểm thành công qua Gmail tới hòm thư ${targetEmail}!`,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreateMeet = async () => {
    if (!window.confirm('Bạn có đồng ý tạo phòng họp Google Meet để học nhóm hoặc trao đổi bài với giáo viên không?')) return;
    try {
      setLoadingAction('meet');
      setResultNotice(null);
      const res = await createGoogleMeetRoom();
      setResultNotice({
        type: 'success',
        message: 'Đã tạo phòng họp Google Meet thành công!',
        link: res.meetUri,
      });
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLoadContacts = async () => {
    try {
      setLoadingAction('contacts');
      const list = await getGoogleContacts();
      setContacts(list);
    } catch (e: any) {
      setResultNotice({ type: 'error', message: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  // Image Generation with gemini-3-pro-image (1K, 2K, 4K)
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingAction('image_gen');
      setGeneratedImgResult(null);
      const res = await generateEducationalIllustration({
        topicTitle: imageTopic,
        description: imageDescription,
        resolution: imageResolution,
        aspectRatio: imageRatio,
      });
      if (res.imageUrl) {
        setGeneratedImgResult(res.imageUrl);
      } else {
        throw new Error('Mô hình không trả về dữ liệu ảnh hợp lệ');
      }
    } catch (e: any) {
      setResultNotice({ type: 'error', message: `Lỗi tạo ảnh: ${e.message}` });
    } finally {
      setLoadingAction(null);
    }
  };

  // Veo Video Generation
  const handleGenerateVeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingAction('veo_gen');
      setVideoResultNotice(null);
      const res = await generateVeoVideo({
        prompt: videoPrompt,
        aspectRatio: videoRatio,
      });
      setVideoResultNotice(`Đã khởi chạy tiến trình sinh video Veo (${res.modelUsed}). Tác vụ: ${res.operationName}`);
    } catch (e: any) {
      setResultNotice({ type: 'error', message: `Lỗi sinh video: ${e.message}` });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-4xl w-full border border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#202020] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#2878C8] text-white">
              <Sparkles className="w-5 h-5 text-[#FFC928]" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hệ Sinh Thái Công Cụ Google Cho TinPath</h3>
              <p className="text-xs text-gray-300">
                Tích hợp toàn diện Google Gemini AI và bộ công cụ Google Workspace
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-[#333] px-6 py-2 bg-gray-50 dark:bg-[#252525] flex flex-wrap gap-2 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'workspace'
                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#2878C8]" />
            Google Workspace (Drive, Sheets, Docs, Calendar, Tasks, Gmail, Meet)
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'images'
                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
            Tạo ảnh chất lượng cao (1K, 2K, 4K)
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-indigo-500" />
            Sinh & Phân tích Video (Veo & Argon)
          </button>
        </div>

        {/* Notice Bar */}
        {resultNotice && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg text-xs flex items-center justify-between shrink-0 ${
              resultNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300'
                : 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200 border border-red-300'
            }`}
          >
            <span>{resultNotice.message}</span>
            {resultNotice.link && (
              <a
                href={resultNotice.link}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline flex items-center gap-1 ml-2 shrink-0"
              >
                Mở liên kết <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-[#202020] dark:text-[#E0E0E0] space-y-6">
          {/* TAB 1: GOOGLE WORKSPACE TOOLS */}
          {activeTab === 'workspace' && (
            <div className="space-y-4">
              {!isLoggedIn && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Đăng nhập tài khoản Google</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                      Cần cấp quyền truy cập để kích hoạt các tính năng đồng bộ và xuất dữ liệu Workspace.
                    </p>
                  </div>
                  <button
                    onClick={onGoogleSignIn}
                    className="px-4 py-2 rounded bg-[#2878C8] text-white font-bold hover:bg-[#2068B0]"
                  >
                    Đăng nhập Google
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Google Drive */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Download className="w-4 h-4 text-emerald-500" /> Google Drive
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Lưu trữ cẩm nang và đề cương tóm tắt kiến thức Tin học THPT lên Google Drive.
                    </p>
                  </div>
                  <button
                    onClick={handleDriveExport}
                    disabled={loadingAction === 'drive'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'drive' ? 'Đang lưu...' : 'Lưu vào Google Drive'}
                  </button>
                </div>

                {/* 2. Google Sheets */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Google Sheets
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Xuất bảng điểm thi thử, lịch sử bài làm và báo cáo thống kê năng lực theo lớp.
                    </p>
                  </div>
                  <button
                    onClick={handleSheetsExport}
                    disabled={loadingAction === 'sheets'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'sheets' ? 'Đang xuất...' : 'Xuất sang Google Sheets'}
                  </button>
                </div>

                {/* 3. Google Docs */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <FileText className="w-4 h-4 text-blue-500" /> Google Docs
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Khởi tạo tài liệu đề cương ôn tập tổng hợp dạng văn bản Google Docs để in ấn.
                    </p>
                  </div>
                  <button
                    onClick={handleDocsExport}
                    disabled={loadingAction === 'docs'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'docs' ? 'Đang tạo...' : 'Tạo Google Doc'}
                  </button>
                </div>

                {/* 4. Google Slides */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Presentation className="w-4 h-4 text-amber-500" /> Google Slides
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Tự động tạo bộ slide thuyết trình ôn tập tóm tắt các chương lý thuyết Tin học 12.
                    </p>
                  </div>
                  <button
                    onClick={handleSlidesExport}
                    disabled={loadingAction === 'slides'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'slides' ? 'Đang tạo...' : 'Tạo slide Google Slides'}
                  </button>
                </div>

                {/* 5. Google Calendar */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-blue-600" /> Google Calendar
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Đồng bộ lịch thi thử và cài đặt nhắc nhở giờ tự học mỗi ngày vào Google Calendar.
                    </p>
                  </div>
                  <button
                    onClick={handleCalendarSync}
                    disabled={loadingAction === 'calendar'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'calendar' ? 'Đang đồng bộ...' : 'Thêm vào Lịch'}
                  </button>
                </div>

                {/* 6. Google Tasks */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <CheckSquare className="w-4 h-4 text-blue-500" /> Google Tasks
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Ghi nhận checklist Thử thách 10 câu hôm nay vào ứng dụng Google Tasks cá nhân.
                    </p>
                  </div>
                  <button
                    onClick={handleTasksSync}
                    disabled={loadingAction === 'tasks'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'tasks' ? 'Đang thêm...' : 'Đồng bộ Google Tasks'}
                  </button>
                </div>

                {/* 7. Gmail */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Mail className="w-4 h-4 text-rose-500" /> Gmail
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Gửi email báo cáo kết quả làm bài thi thử và bảng phân tích điểm mạnh/yếu về hộp thư.
                    </p>
                  </div>
                  <button
                    onClick={handleGmailReport}
                    disabled={loadingAction === 'gmail'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'gmail' ? 'Đang gửi...' : 'Gửi báo cáo qua Gmail'}
                  </button>
                </div>

                {/* 8. Google Meet */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Video className="w-4 h-4 text-emerald-500" /> Google Meet
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Khởi tạo phòng học nhóm trực tuyến hoặc gia sư 1-1 với giáo viên qua Google Meet.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateMeet}
                    disabled={loadingAction === 'meet'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'meet' ? 'Đang tạo phòng...' : 'Tạo phòng Google Meet'}
                  </button>
                </div>

                {/* 9. Google Contacts */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Users className="w-4 h-4 text-[#2878C8]" /> Google Contacts
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Tìm kiếm danh bạ bạn học cùng trường để gửi lời mời tham gia nhóm học tập.
                    </p>
                  </div>
                  <button
                    onClick={handleLoadContacts}
                    disabled={loadingAction === 'contacts'}
                    className="w-full py-1.5 rounded bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#444] font-semibold hover:border-[#2878C8]"
                  >
                    {loadingAction === 'contacts' ? 'Đang tải...' : 'Xem danh bạ bạn học'}
                  </button>
                </div>
              </div>

              {/* Contacts view */}
              {contacts.length > 0 && (
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">Danh sách liên hệ Google Contacts ({contacts.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {contacts.map((c, i) => (
                      <div key={i} className="p-2 rounded bg-gray-50 dark:bg-[#252525] flex justify-between items-center">
                        <div>
                          <p className="font-bold">{c.name}</p>
                          <p className="text-gray-500 font-mono text-[10px]">{c.email}</p>
                        </div>
                        <button className="px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] text-[10px] font-bold">
                          Mời học nhóm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMAGE GENERATION (gemini-3-pro-image with 1K, 2K, 4K) */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-500" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      Tạo & Chỉnh Sửa Ảnh Minh Họa Bằng Gemini (gemini-3-pro-image-preview)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tạo hình ảnh sơ đồ mạng, vi mạch, cấu trúc dữ liệu hoặc infographic với tùy chọn độ phân giải 1K, 2K, 4K.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGenerateImage} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-semibold mb-1">Chủ đề bài học:</label>
                    <input
                      type="text"
                      value={imageTopic}
                      onChange={(e) => setImageTopic(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Mô tả chi tiết hình ảnh:</label>
                    <textarea
                      rows={2}
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Độ phân giải (Image Size):</label>
                      <select
                        value={imageResolution}
                        onChange={(e) => setImageResolution(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono font-bold text-[#2878C8]"
                      >
                        <option value="1K">1K (1024 x 1024 / Nhanh)</option>
                        <option value="2K">2K (2048 x 2048 / Chuẩn nét)</option>
                        <option value="4K">4K (4096 x 4096 / Siêu phân giải Ultra-HD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Tỷ lệ khung hình (Aspect Ratio):</label>
                      <select
                        value={imageRatio}
                        onChange={(e) => setImageRatio(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono"
                      >
                        <option value="16:9">16:9 (Ngang chuẩn bài giảng)</option>
                        <option value="4:3">4:3 (Khung hình học tập)</option>
                        <option value="1:1">1:1 (Vuông minh họa thẻ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={loadingAction === 'image_gen'}
                      className="px-5 py-2 rounded bg-pink-600 text-white font-bold hover:bg-pink-700 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      {loadingAction === 'image_gen' ? 'Đang khởi tạo ảnh...' : 'Sinh ảnh minh họa ngay'}
                    </button>
                  </div>
                </form>
              </div>

              {generatedImgResult && (
                <div className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-gray-900 dark:text-white">
                      Ảnh minh họa tạo thành công ({imageResolution} · {imageRatio})
                    </h5>
                    <a
                      href={generatedImgResult}
                      download="tinpath_diagram.png"
                      className="text-[#2878C8] hover:underline font-bold"
                    >
                      Tải về máy
                    </a>
                  </div>
                  <img
                    src={generatedImgResult}
                    alt="Generated diagram"
                    className="max-h-80 w-auto mx-auto rounded border border-gray-200 dark:border-[#333] object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO (Veo 3.1 & Argon) */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] space-y-3">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      Tạo Video Mô Phỏng Bằng Google Veo (veo-3.1-fast-generate-preview)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Chuyển văn bản hoặc hình ảnh bài học thành video mô phỏng chuyển động sinh động (Tỷ lệ 16:9 hoặc 9:16).
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGenerateVeo} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-semibold mb-1">Mô tả nội dung video mô phỏng (Prompt):</label>
                    <textarea
                      rows={2}
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Tỷ lệ khung hình:</label>
                    <select
                      value={videoRatio}
                      onChange={(e) => setVideoRatio(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono"
                    >
                      <option value="16:9">16:9 (Landscape - màn hình ngang bài giảng)</option>
                      <option value="9:16">9:16 (Portrait - video dọc di động)</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={loadingAction === 'veo_gen'}
                      className="px-5 py-2 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Film className="w-4 h-4 text-white" />
                      {loadingAction === 'veo_gen' ? 'Đang gửi yêu cầu Veo...' : 'Khởi tạo Video Veo'}
                    </button>
                  </div>
                </form>

                {videoResultNotice && (
                  <div className="p-3 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-xs text-indigo-900 dark:text-indigo-200">
                    {videoResultNotice}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
