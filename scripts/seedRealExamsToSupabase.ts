/**
 * seedRealExamsToSupabase.ts
 * Nạp toàn bộ cơ sở dữ liệu thật vào Supabase:
 * - 34 Trường THPT Quảng Ngãi
 * - 8 Chuyên đề chuẩn GDPT 2018
 * - 5 Bộ đề thi thật THPT 2026 và 150 câu hỏi
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('🚀 Bắt đầu nạp cơ sở dữ liệu TinPath vào Supabase...');

  // 1. Nạp danh mục các trường THPT Quảng Ngãi
  console.log('\n🏫 1. Đang nạp danh mục trường THPT Quảng Ngãi...');
  const schoolsData = [
    { id: 'qn_le_khiet', name: 'THPT chuyên Lê Khiết', district: 'TP. Quảng Ngãi', address: 'Số 10 đường Nguyễn Thông, Phường Nghĩa Lộ, TP. Quảng Ngãi' },
    { id: 'qn_tran_quoc_tuan', name: 'THPT Trần Quốc Tuấn', district: 'TP. Quảng Ngãi', address: 'Phường Nguyễn Nghiêm, TP. Quảng Ngãi' },
    { id: 'qn_vo_nguyen_giap', name: 'THPT Võ Nguyên Giáp', district: 'TP. Quảng Ngãi', address: 'Phường Trương Quang Trọng, TP. Quảng Ngãi' },
    { id: 'qn_huynh_thuc_khang', name: 'THPT Huỳnh Thúc Kháng', district: 'TP. Quảng Ngãi', address: 'Phường Trương Quang Trọng, TP. Quảng Ngãi' },
    { id: 'qn_le_trung_dinh', name: 'THPT Lê Trung Đình', district: 'TP. Quảng Ngãi', address: 'Phường Trần Hưng Đạo, TP. Quảng Ngãi' },
    { id: 'qn_son_my', name: 'THPT Sơn Mỹ', district: 'TP. Quảng Ngãi', address: 'Xã Tịnh Khê, TP. Quảng Ngãi' },
    { id: 'qn_ptdtnt', name: 'PTDTNT THPT Tỉnh Quảng Ngãi', district: 'TP. Quảng Ngãi', address: 'Số 10 đường Nguyễn Thông, Phường Nghĩa Lộ, TP. Quảng Ngãi' },
    { id: 'bs_binh_son', name: 'THPT Bình Sơn', district: 'Huyện Bình Sơn', address: 'Thị trấn Châu Ổ, Huyện Bình Sơn' },
    { id: 'bs_tran_ky_phong', name: 'THPT Trần Kỳ Phong', district: 'Huyện Bình Sơn', address: 'Xã Bình Nguyên, Huyện Bình Sơn' },
    { id: 'bs_le_quy_don', name: 'THPT Lê Quý Đôn', district: 'Huyện Bình Sơn', address: 'Xã Bình Trung, Huyện Bình Sơn' },
    { id: 'bs_van_tuong', name: 'THCS & THPT Vạn Tường', district: 'Huyện Bình Sơn', address: 'Xã Bình Tân Phú, Huyện Bình Sơn' },
    { id: 'st_ba_gia', name: 'THPT Ba Gia', district: 'Huyện Sơn Tịnh', address: 'Xã Tịnh Bắc, Huyện Sơn Tịnh' },
    { id: 'st_son_tinh_1', name: 'THPT Sơn Tịnh 1', district: 'Huyện Sơn Tịnh', address: 'Xã Tịnh Hà, Huyện Sơn Tịnh' },
    { id: 'tn_so_1', name: 'THPT Số 1 Tư Nghĩa', district: 'Huyện Tư Nghĩa', address: 'Thị trấn Sông Vệ, Huyện Tư Nghĩa' },
    { id: 'tn_so_2', name: 'THPT Số 2 Tư Nghĩa', district: 'Huyện Tư Nghĩa', address: 'Xã Nghĩa Lâm, Huyện Tư Nghĩa' },
    { id: 'tn_chu_van_an', name: 'THPT Chu Văn An', district: 'Huyện Tư Nghĩa', address: 'Thị trấn La Hà, Huyện Tư Nghĩa' },
    { id: 'tn_thu_xa', name: 'THPT Thu Xà', district: 'Huyện Tư Nghĩa', address: 'Xã Nghĩa Hòa, Huyện Tư Nghĩa' },
    { id: 'nh_so_1', name: 'THPT Số 1 Nghĩa Hành', district: 'Huyện Nghĩa Hành', address: 'Thị trấn Chợ Chùa, Huyện Nghĩa Hành' },
    { id: 'nh_so_2', name: 'THPT Số 2 Nghĩa Hành', district: 'Huyện Nghĩa Hành', address: 'Xã Hành Minh, Huyện Nghĩa Hành' },
    { id: 'md_mo_duc_1', name: 'THPT Mộ Đức 1', district: 'Huyện Mộ Đức', address: 'Thị trấn Đồng Cát, Huyện Mộ Đức' },
    { id: 'md_mo_duc_2', name: 'THPT Mộ Đức 2', district: 'Huyện Mộ Đức', address: 'Xã Đức Tân, Huyện Mộ Đức' },
    { id: 'md_pham_van_dong', name: 'THPT Phạm Văn Đồng', district: 'Huyện Mộ Đức', address: 'Xã Đức Tân, Huyện Mộ Đức' },
    { id: 'md_nguyen_cong_phuong', name: 'THPT Nguyễn Công Phương', district: 'Huyện Mộ Đức', address: 'Xã Đức Hòa, Huyện Mộ Đức' },
    { id: 'dp_so_1', name: 'THPT Số 1 Đức Phổ', district: 'Thị xã Đức Phổ', address: 'Phường Nguyễn Nghiêm, Thị xã Đức Phổ' },
    { id: 'dp_so_2', name: 'THPT Số 2 Đức Phổ', district: 'Thị xã Đức Phổ', address: 'Phường Phổ Minh, Thị xã Đức Phổ' },
    { id: 'dp_luong_the_vinh', name: 'THPT Lương Thế Vinh', district: 'Thị xã Đức Phổ', address: 'Phường Phổ Thạnh, Thị xã Đức Phổ' },
    { id: 'ls_ly_son', name: 'THPT Lý Sơn', district: 'Huyện Lý Sơn', address: 'Huyện đảo Lý Sơn, Tỉnh Quảng Ngãi' },
    { id: 'ml_minh_long', name: 'THPT Minh Long', district: 'Huyện Minh Long', address: 'Xã Long Hiệp, Huyện Minh Long' },
    { id: 'sh_son_ha', name: 'THPT Sơn Hà', district: 'Huyện Sơn Hà', address: 'Thị trấn Di Lăng, Huyện Sơn Hà' },
    { id: 'sh_so_2', name: 'THPT Số 2 Sơn Hà', district: 'Huyện Sơn Hà', address: 'Xã Sơn Hạ, Huyện Sơn Hà' },
    { id: 'tt_tay_tra', name: 'THPT Tây Trà', district: 'Huyện Tây Trà', address: 'Xã Trà Phong, Huyện Tây Trà' },
    { id: 'tb_tra_bong', name: 'THPT Trà Bồng', district: 'Huyện Trà Bồng', address: 'Thị trấn Trà Xuân, Huyện Trà Bồng' },
    { id: 'st_son_tay', name: 'THPT Sơn Tây', district: 'Huyện Sơn Tây', address: 'Xã Sơn Dung, Huyện Sơn Tây' },
    { id: 'bt_ba_to', name: 'THPT Ba Tơ', district: 'Huyện Ba Tơ', address: 'Thị trấn Ba Tơ, Huyện Ba Tơ' },
  ];

  const { error: schoolErr } = await supabase.from('schools').upsert(schoolsData, { onConflict: 'id' });
  if (schoolErr) {
    console.warn('   ⚠️ Không thể nạp schools qua Anon Key (cần mở RLS policy):', schoolErr.message);
  } else {
    console.log(`   ✅ Đã nạp thành công ${schoolsData.length} trường THPT Quảng Ngãi.`);
  }

  // 2. Nạp topics
  console.log('\n📚 2. Đang nạp danh mục 8 chuyên đề (topics)...');
  const topicsToEnsure = [
    { id: '12A', name: 'Trí tuệ nhân tạo (AI) & Học máy', track: 'ALL', grade: '12', description: 'Khái niệm AI, Machine Learning, Học có giám sát, Không giám sát, đạo đức AI' },
    { id: '12B', name: 'Mạng máy tính và Internet', track: 'ALL', grade: '12', description: 'Địa chỉ IP, Switch, Router, giao thức TCP/IP, DNS, DHCP' },
    { id: '12D', name: 'Đạo đức, pháp luật thế giới ảo', track: 'ALL', grade: '12', description: 'Luật An ninh mạng, quyền riêng tư, bản quyền số' },
    { id: '12F', name: 'Tạo trang web và thiết kế web', track: 'ALL', grade: '12', description: 'HTML, CSS, cấu trúc trang web' },
    { id: '11F', name: 'Hệ cơ sở dữ liệu và Truy vấn SQL', track: 'ALL', grade: '11', description: 'Mô hình CSDL quan hệ, Khóa chính, Khóa ngoại, câu lệnh SQL SELECT, JOIN' },
    { id: '11F_CS', name: 'Thuật toán và Kĩ thuật lập trình', track: 'CS', grade: '11', description: 'Đệ quy, Tìm kiếm nhị phân, Sắp xếp, độ phức tạp O-notation' },
    { id: '12F_CS', name: 'Khoa học dữ liệu & Học máy nâng cao', track: 'CS', grade: '12', description: 'Tiền xử lý dữ liệu và thuật toán học máy' },
    { id: '12G', name: 'Định hướng nghề nghiệp & Tuyển sinh CNTT', track: 'ALL', grade: '12', description: 'Nhóm ngành Máy tính & CNTT, tổ hợp môn A00, A01, D01, D07' },
  ];

  for (const t of topicsToEnsure) {
    const { error } = await supabase.from('topics').upsert(t, { onConflict: 'id' });
    if (error) console.warn(`   ⚠️ Cảnh báo upsert topic ${t.id}:`, error.message);
  }
  console.log(`   ✅ Đã nạp 8 chuyên đề chuẩn GDPT 2018.`);

  // 3. Đọc dữ liệu đề thi từ parsed_exams.json
  const jsonPath = path.join(__dirname, 'parsed_exams.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy scripts/parsed_exams.json');
    process.exit(1);
  }

  const exams = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`\n📝 3. Tìm thấy ${exams.length} đề thi cần nạp vào Database.`);

  let totalQuestionsInserted = 0;

  for (const exam of exams) {
    console.log(`\n   🔹 Đang nạp đề: ${exam.title} (${exam.id})...`);

    // Upsert Exam
    const { error: exErr } = await supabase.from('exams').upsert({
      id: exam.id,
      title: exam.title,
      source: exam.source,
      duration_minutes: exam.durationMinutes,
      year: exam.year,
      difficulty: exam.difficulty,
      description: exam.description,
      base_xp: exam.baseXP,
    }, { onConflict: 'id' });

    if (exErr) {
      console.error(`   ❌ Lỗi upsert exam ${exam.id}:`, exErr.message);
      continue;
    }
    console.log(`      ✅ Đã lưu thông tin đề thi: ${exam.id}`);

    // Chuẩn bị danh sách câu hỏi
    const questionsToInsert: any[] = [];

    // Part 1: Trắc nghiệm 1 đáp án
    for (const q of exam.part1Questions) {
      questionsToInsert.push({
        id: q.id,
        exam_id: exam.id,
        topic_id: q.topicId || '12A',
        topic_name: q.topicName,
        type: 'single_choice',
        level: q.level || 'biet',
        track_requirement: 'ALL',
        content: q.content,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        code_snippet: q.codeSnippet || null,
        statements: null,
      });
    }

    // Part 2: Trắc nghiệm đúng/sai nhóm 4 ý
    for (const q of exam.part2Questions) {
      questionsToInsert.push({
        id: q.id,
        exam_id: exam.id,
        topic_id: q.topicId || '12B',
        topic_name: q.topicName,
        type: 'true_false_group',
        level: q.level || 'hieu',
        track_requirement: q.trackRequirement || 'ALL',
        content: q.context || q.content || `Câu hỏi trắc nghiệm Đúng/Sai chuyên đề ${q.topicName}`,
        options: null,
        correct_answer: null,
        explanation: null,
        code_snippet: q.codeSnippet || null,
        statements: q.statements,
      });
    }

    // Upsert câu hỏi theo batch
    const { error: qErr } = await supabase.from('questions').upsert(questionsToInsert, { onConflict: 'id' });
    if (qErr) {
      console.error(`      ❌ Lỗi nạp câu hỏi cho ${exam.id}:`, qErr.message);
    } else {
      console.log(`      ✅ Đã nạp ${questionsToInsert.length} câu hỏi (${exam.part1Questions.length} trắc nghiệm + ${exam.part2Questions.length} đúng/sai).`);
      totalQuestionsInserted += questionsToInsert.length;
    }
  }

  // 4. Cập nhật total_questions trong topics
  const { data: qCounts } = await supabase.from('questions').select('topic_id');
  if (qCounts) {
    const counts: Record<string, number> = {};
    for (const q of qCounts) {
      if (q.topic_id) counts[q.topic_id] = (counts[q.topic_id] || 0) + 1;
    }
    for (const [tid, cnt] of Object.entries(counts)) {
      await supabase.from('topics').update({ total_questions: cnt }).eq('id', tid);
    }
  }

  console.log(`\n🎉 HOÀN TẤT NẠP DỮ LIỆU!`);
  console.log(`   - Tổng số trường THPT: ${schoolsData.length}`);
  console.log(`   - Tổng số chủ đề: ${topicsToEnsure.length}`);
  console.log(`   - Tổng số đề thi thật: ${exams.length}`);
  console.log(`   - Tổng số câu hỏi thật: ${totalQuestionsInserted}`);
}

main().catch(console.error);
