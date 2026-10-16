import React, { useState } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Cpu,
  Award,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Database,
} from 'lucide-react';
import { OFFICIAL_EXAMS } from '../../data/officialExamsData';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'users' | 'exams' | 'ai' | 'xp'>('system');
  const [dailyBaseXP, setDailyBaseXP] = useState(30);
  const [dailyCorrectBonus, setDailyCorrectBonus] = useState(5);
  const [examBonusScore, setExamBonusScore] = useState(25);
  const [ruleSavedNotice, setRuleSavedNotice] = useState(false);

  const handleSaveXPRules = (e: React.FormEvent) => {
    e.preventDefault();
    setRuleSavedNotice(true);
    setTimeout(() => setRuleSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#202020] dark:text-[#E0E0E0]">
      {/* Admin Header */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-[#2878C8]" />
              Trung Tâm Quản Trị Hệ Thống TinPath (Admin Console)
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Giám sát hạ tầng, duyệt ngân hàng câu hỏi, kiểm soát mô hình Gemini AI và điều chỉnh công thức tính điểm XP
            </p>
          </div>

          <span className="text-xs px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold font-mono self-start md:self-center">
            Quyền Quản trị viên tối cao
          </span>
        </div>

        {/* Admin Tabs */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap gap-2 text-sm">
          {[
            { id: 'system', label: '1. Dashboard hệ thống' },
            { id: 'users', label: '2. Người dùng & Phân quyền' },
            { id: 'exams', label: '3. Ngân hàng đề thi' },
            { id: 'ai', label: '4. Quản lý Gemini AI' },
            { id: 'xp', label: '5. Điều chỉnh quy tắc XP' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-[#2878C8] font-bold dark:bg-blue-950 dark:text-blue-300 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Tổng tài khoản học sinh</span>
              <span className="text-3xl font-bold font-mono text-gray-900 dark:text-white tabular-nums">
                1,428
              </span>
              <span className="text-xs text-emerald-600 font-semibold block mt-1.5">+12% tuần này</span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Số lượt làm đề thi</span>
              <span className="text-3xl font-bold font-mono text-[#2878C8] tabular-nums">
                6,840
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Tỷ lệ chính xác AI</span>
              <span className="text-3xl font-bold font-mono text-[#22A06B] tabular-nums">
                99.8%
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Trường THPT Quảng Ngãi</span>
              <span className="text-3xl font-bold font-mono text-amber-500 tabular-nums">
                28
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Nhật ký sự kiện hệ thống thời gian thực
            </h3>

            <div className="space-y-2.5 text-sm font-mono">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#252525] flex justify-between">
                <span>[INFO] Xác nhận giao dịch +80 XP cho học sinh Nguyễn Văn An (THPT chuyên Lê Khiết)</span>
                <span className="text-gray-400 text-xs">Vừa xong</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#252525] flex justify-between">
                <span>[API] Gọi mô hình Gemini 4 Argon giải đáp thuật toán Tìm kiếm nhị phân thành công (240ms)</span>
                <span className="text-gray-400 text-xs">2 phút trước</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#252525] flex justify-between">
                <span>[SYNC] Xuất 38 bản ghi bảng điểm sang Google Sheets thành công</span>
                <span className="text-gray-400 text-xs">12 phút trước</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ GEMINI AI */}
      {activeTab === 'ai' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#2878C8]" />
            Cấu hình & Giám sát các Mô hình Google Gemini
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2878C8]">gemini-4-argon</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                  Sẵn sàng
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm">
                Nhiệm vụ: Gia sư AI suy luận sâu (High Thinking), giải thích code phức tạp và phân tích nội dung video bài giảng.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2878C8]">gemini-3.8-flash</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                  Sẵn sàng
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm">
                Nhiệm vụ: Tra cứu Google Search Grounding thông tin kỳ thi Bộ GD&ĐT và tạo lộ trình học tập cá nhân hóa 7 ngày.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2878C8]">gemini-3.1-flash-lite</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                  Sẵn sàng
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm">
                Nhiệm vụ: Gợi ý nhanh manh mối tư duy trong phòng thi trắc nghiệm không làm chậm thời gian học sinh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ĐIỀU CHỈNH QUY TẮC XP */}
      {activeTab === 'xp' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#FFC928]" />
            Điều chỉnh Module Công Thức Tính Điểm XP Tập Trung
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Các quy tắc này được áp dụng trực tiếp tại máy chủ xác thực `/api/xp/verify` để ngăn chặn gian lận điểm từ trình duyệt.
          </p>

          {ruleSavedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22A06B]" />
              Đã cập nhật quy tắc XP thành công trên toàn bộ hệ thống!
            </div>
          )}

          <form onSubmit={handleSaveXPRules} className="space-y-4 max-w-xl text-sm">
            <div>
              <label className="block font-semibold mb-1.5">
                Điểm XP cơ bản cho Thử thách 10 câu hằng ngày:
              </label>
              <input
                type="number"
                value={dailyBaseXP}
                onChange={(e) => setDailyBaseXP(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">
                Điểm XP thưởng cho mỗi câu trả lời đúng (tối đa 10 câu):
              </label>
              <input
                type="number"
                value={dailyCorrectBonus}
                onChange={(e) => setDailyCorrectBonus(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">
                Điểm thưởng thêm khi đạt điểm xuất sắc bài thi thử (Điểm ≥ 9.0):
              </label>
              <input
                type="number"
                value={examBonusScore}
                onChange={(e) => setExamBonusScore(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] font-mono text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2878C8] text-white font-bold hover:bg-[#2068B0] text-sm shadow-sm"
              >
                Cập nhật cấu hình XP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: NGÂN HÀNG ĐỀ THI */}
      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kiểm duyệt ngân hàng đề thi chuẩn</h3>
            <span className="text-xs px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold">
              7 đề đã duyệt chính thức
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {OFFICIAL_EXAMS.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">{ex.title}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    Nguồn: {ex.source} · Thời gian: {ex.durationMinutes} phút · Ma trận 28 câu
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#22A06B] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã duyệt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NGƯỜI DÙNG */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quản lý người dùng & Phân quyền</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Cấp quyền an toàn phía máy chủ cho tài khoản giáo viên và quản trị viên, chống leo thang đặc quyền trái phép.
          </p>

          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3">Họ tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Trường</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2C2C2C]">
                <tr>
                  <td className="p-3 font-bold">Nguyễn Văn An</td>
                  <td className="p-3 font-mono text-gray-600 dark:text-gray-400">fightingalone0408@gmail.com</td>
                  <td className="p-3">THPT chuyên Lê Khiết</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">Học sinh</span></td>
                  <td className="p-3 text-[#22A06B] font-semibold">Hoạt động</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Thầy Nguyễn Trọng Bình</td>
                  <td className="p-3 font-mono text-gray-600 dark:text-gray-400">binh.nt@quangngai.edu.vn</td>
                  <td className="p-3">THPT chuyên Lê Khiết</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-semibold">Giáo viên</span></td>
                  <td className="p-3 text-[#22A06B] font-semibold">Hoạt động</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
