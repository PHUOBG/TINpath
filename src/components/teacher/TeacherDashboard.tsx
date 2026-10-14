import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  BarChart2,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Classroom, Assignment } from '../../types';
import { exportToGoogleSheets } from '../../services/workspaceService';

interface TeacherDashboardProps {
  currentTab: string;
  classrooms: Classroom[];
  assignments: Assignment[];
  onAddClassroom: (cls: Classroom) => void;
  onAddAssignment: (assign: Assignment) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentTab,
  classrooms,
  assignments,
  onAddClassroom,
  onAddAssignment,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'classes' | 'assignments' | 'tests' | 'materials' | 'stats'>('overview');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showCreateAssign, setShowCreateAssign] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [exportingSheet, setExportingSheet] = useState(false);
  const [sheetNotice, setSheetNotice] = useState<string | null>(null);

  // Quick stats
  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentCount, 0);

  // Handle export gradebook to Google Sheets
  const handleExportGradebook = async () => {
    try {
      setExportingSheet(true);
      setSheetNotice(null);
      const headers = ['STT', 'Họ và tên học sinh', 'Lớp', 'Điểm kiểm tra 15p', 'Điểm thi thử', 'Tỷ lệ hoàn thành'];
      const rows = [
        [1, 'Trần Bảo Long', '12 Tin', 9.5, 9.2, '98%'],
        [2, 'Nguyễn Thị Mỹ Duyên', '12 Tin', 8.5, 8.8, '92%'],
        [3, 'Lê Hoàng Nam', '12 Tin', 8.0, 7.5, '85%'],
        [4, 'Nguyễn Văn An', '12 Tin', 8.5, 8.0, '90%'],
        [5, 'Võ Thị Thanh Thảo', '12 Tin', 7.5, 7.0, '80%'],
      ];

      const res = await exportToGoogleSheets('Bảng điểm Lớp 12 Tin - THPT chuyên Lê Khiết', headers, rows);
      setSheetNotice(`Đã xuất thành công sang Google Sheets! Link: ${res.spreadsheetUrl}`);
    } catch (e: any) {
      setSheetNotice(`Không thể xuất Google Sheets: ${e.message}`);
    } finally {
      setExportingSheet(false);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass: Classroom = {
      id: `class_${Date.now()}`,
      name: newClassName.trim(),
      code: `TIN${Math.floor(100 + Math.random() * 900)}`,
      grade: '12',
      schoolName: 'THPT chuyên Lê Khiết',
      teacherId: 'teacher_01',
      teacherName: 'Thầy Nguyễn Trọng Bình',
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddClassroom(newClass);
    setNewClassName('');
    setShowCreateClass(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;
    const newAssign: Assignment = {
      id: `assign_${Date.now()}`,
      classroomId: classrooms[0]?.id || 'class_1',
      title: assignTitle.trim(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      questionCount: 15,
      allowRetake: true,
      status: 'active',
      submissionsCount: 0,
    };
    onAddAssignment(newAssign);
    setAssignTitle('');
    setShowCreateAssign(false);
  };

  return (
    <div className="space-y-6 text-[#202020] dark:text-[#E0E0E0]">
      {/* Teacher Top Bar */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2878C8]" />
              Không Gian Quản Trị Giáo Viên Tin Học
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
              Quản lý lớp học, giao bài tập, soạn đề kiểm tra ma trận GDPT 2018 và theo dõi tiến độ học sinh
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateClass(true)}
              className="px-3.5 py-1.5 rounded bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0] transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo lớp học mới
            </button>
            <button
              onClick={() => setShowCreateAssign(true)}
              className="px-3.5 py-1.5 rounded bg-[#202020] dark:bg-white text-white dark:text-[#202020] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" /> Giao bài tập
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap gap-1 text-xs">
          {[
            { id: 'overview', label: '1. Tổng quan' },
            { id: 'classes', label: '2. Lớp học' },
            { id: 'assignments', label: '3. Bài tập' },
            { id: 'tests', label: '4. Kiểm tra' },
            { id: 'materials', label: '5. Học liệu' },
            { id: 'stats', label: '6. Thống kê & Báo cáo' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                activeSection === sec.id
                  ? 'bg-blue-50 text-[#2878C8] font-bold dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: TỔNG QUAN */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-[11px] text-gray-500 block">Lớp quản lý</span>
              <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums">
                {classrooms.length}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-[11px] text-gray-500 block">Tổng số học sinh</span>
              <span className="text-2xl font-bold font-mono text-[#2878C8] tabular-nums">
                {totalStudents}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-[11px] text-gray-500 block">Bài tập đang giao</span>
              <span className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
                {assignments.filter((a) => a.status === 'active').length}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-[11px] text-gray-500 block">Tỷ lệ nộp bài</span>
              <span className="text-2xl font-bold font-mono text-[#22A06B] tabular-nums">
                87.5%
              </span>
            </div>
          </div>

          {/* Quick lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Classrooms */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Danh sách lớp học trực tuyến
                </h3>
                <span className="text-xs text-gray-500 font-mono">{classrooms.length} lớp</span>
              </div>

              <div className="space-y-2">
                {classrooms.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{cls.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span>Mã tham gia: <strong className="font-mono text-[#2878C8]">{cls.code}</strong></span>
                        <span>·</span>
                        <span>{cls.studentCount} học sinh</span>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                      Đang hoạt động
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Students requiring attention */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Học sinh cần hỗ trợ bổ sung
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Lê Hoàng Nam (12 Tin)</span>
                    <span className="text-amber-600 font-mono">Điểm TB: 6.2đ</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                    Thường trả lời sai dạng câu hỏi đúng/sai chủ đề 12B (Kết nối mạng). Cần giao thêm bài tập luyện tập chuyên đề mạng.
                  </p>
                </div>

                <div className="p-3 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Võ Thị Thanh Thảo (12 Tin)</span>
                    <span className="text-amber-600 font-mono">Điểm TB: 6.5đ</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                    Cần củng cố kiến thức CSDL quan hệ 11F (khóa ngoại, các lệnh SELECT SQL).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LỚP HỌC */}
      {activeSection === 'classes' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Quản lý lớp học</h3>
            <button
              onClick={() => setShowCreateClass(true)}
              className="px-3.5 py-1.5 rounded bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0]"
            >
              + Tạo lớp
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#2878C8] font-mono font-bold">
                    Mã: {c.code}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Trường: {c.schoolName} · Khối: {c.grade} · Sĩ số: {c.studentCount} học sinh
                </p>
                <div className="pt-2 flex gap-2">
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-[#444] text-[11px] hover:bg-white">
                    Xem danh sách học sinh
                  </button>
                  <button className="px-3 py-1 rounded border border-gray-300 dark:border-[#444] text-[11px] hover:bg-white">
                    Bảng điểm lớp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: BÀI TẬP */}
      {activeSection === 'assignments' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Danh sách bài tập đã giao</h3>
            <button
              onClick={() => setShowCreateAssign(true)}
              className="px-3.5 py-1.5 rounded bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0]"
            >
              + Tạo bài tập mới
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</h4>
                  <p className="text-gray-500 mt-0.5">
                    Hạn nộp: {a.dueDate} · {a.questionCount} câu hỏi · Đã nộp: {a.submissionsCount} bài
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-100 text-[#2878C8] font-semibold text-[11px]">
                  Đang diễn ra
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: THỐNG KÊ & XUẤT GOOGLE SHEETS */}
      {activeSection === 'stats' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#2878C8]" />
                Báo cáo Thống kê & Phổ điểm Lớp học
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Xuất danh sách và kết quả kiểm tra trực tiếp sang Google Sheets
              </p>
            </div>

            <button
              onClick={handleExportGradebook}
              disabled={exportingSheet}
              className="px-4 py-2 rounded bg-[#22A06B] text-white text-xs font-bold hover:bg-[#1B8055] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {exportingSheet ? 'Đang xuất Google Sheets...' : 'Xuất bảng điểm sang Google Sheets'}
            </button>
          </div>

          {sheetNotice && (
            <div className="p-3.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200">
              {sheetNotice}
            </div>
          )}

          <div className="p-4 rounded border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Phân bố điểm thi thử gần nhất:</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                <span className="text-[10px] text-gray-500 block">Giỏi (8.0 - 10.0đ)</span>
                <span className="font-bold font-mono text-emerald-600 text-base">42%</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                <span className="text-[10px] text-gray-500 block">Khá (6.5 - 7.75đ)</span>
                <span className="font-bold font-mono text-blue-600 text-base">38%</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                <span className="text-[10px] text-gray-500 block">Trung bình (5.0 - 6.25đ)</span>
                <span className="font-bold font-mono text-amber-600 text-base">15%</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                <span className="text-[10px] text-gray-500 block">Dưới 5.0đ</span>
                <span className="font-bold font-mono text-red-600 text-base">5%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Classroom */}
      {showCreateClass && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateClass}
            className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg max-w-sm w-full border border-gray-200 dark:border-[#333] shadow-xl text-xs space-y-4"
          >
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Tạo lớp học trực tuyến mới</h4>
            <div>
              <label className="block text-xs font-semibold mb-1">Tên lớp học</label>
              <input
                type="text"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="VD: 12A1 - Luyện đề tốt nghiệp Tin học"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs focus:outline-none focus:border-[#2878C8]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateClass(false)}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444]"
              >
                Hủy
              </button>
              <button type="submit" className="px-4 py-1.5 rounded bg-[#2878C8] text-white font-bold">
                Tạo lớp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Create Assignment */}
      {showCreateAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssignment}
            className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg max-w-sm w-full border border-gray-200 dark:border-[#333] shadow-xl text-xs space-y-4"
          >
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Giao bài tập mới</h4>
            <div>
              <label className="block text-xs font-semibold mb-1">Tiêu đề bài tập</label>
              <input
                type="text"
                required
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="VD: 20 câu trắc nghiệm đúng/sai CSDL quan hệ"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-xs focus:outline-none focus:border-[#2878C8]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateAssign(false)}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-[#444]"
              >
                Hủy
              </button>
              <button type="submit" className="px-4 py-1.5 rounded bg-[#2878C8] text-white font-bold">
                Giao bài
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
