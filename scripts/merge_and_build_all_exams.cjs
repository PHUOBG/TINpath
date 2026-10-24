const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parsePdfExam } = require('./parse_pdf_exam.cjs');

const ROOT = path.join(__dirname, '..');
const PARSED_JSON_PATH = path.join(ROOT, 'scripts', 'parsed_exams.json');
const TS_FILE_PATH = path.join(ROOT, 'src', 'data', 'officialExamsData.ts');

async function main() {
  console.log('🚀 Bắt đầu tổng hợp toàn bộ đề thi mới vào hệ thống TinPath...');

  // 1. Đọc các đề thi hiện có (5 đề đầu tiên)
  let allExams = [];
  if (fs.existsSync(PARSED_JSON_PATH)) {
    allExams = JSON.parse(fs.readFileSync(PARSED_JSON_PATH, 'utf8'));
  }
  // Giữ lại 5 đề gốc
  const base5Ids = ['thpt_thu_xa_2026', 'thpt_binh_son_2026', 'thpt_chuyen_le_khiet_2026', 'thpt_quang_trung_2026', 'thpt_le_trung_dinh_0501'];
  allExams = allExams.filter(e => base5Ids.includes(e.id));
  console.log(`📌 5 đề thi THPT gốc Quảng Ngãi: ${allExams.map(e => e.id).join(', ')}`);

  // 2. Parse 2 đề DOCX mới (TQT & ĐTH) qua python script
  console.log('\n📄 2. Đang phân tích 2 đề THPT Trần Quốc Tuấn và Đinh Tiên Hoàng...');
  execSync('python scripts/export_docx_exams.py', { cwd: ROOT, stdio: 'inherit' });
  const docxJsonPath = path.join(ROOT, 'scripts', 'temp_docx_exams.json');
  const docxExams = JSON.parse(fs.readFileSync(docxJsonPath, 'utf8'));
  for (const de of docxExams) {
    allExams.push(de);
    console.log(`   ✅ Đã thêm: ${de.title} (${de.part1Questions.length} trắc nghiệm + ${de.part2Questions.length} đúng/sai)`);
  }

  // 3. Parse các đề PDF mới
  console.log('\n📚 3. Đang phân tích các bộ đề thi thử PDF chuẩn cấu trúc Bộ GD&ĐT 2026...');
  const pdfList = [
    { file: 'Đề 1.pdf', id: 'de_on_luyen_01', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 01', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 2.pdf', id: 'de_on_luyen_02', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 02', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 5.pdf', id: 'de_on_luyen_05', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 05', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 6.pdf', id: 'de_on_luyen_06', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 06', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 8.pdf', id: 'de_on_luyen_08', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 08', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 10.pdf', id: 'de_on_luyen_10', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 10', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
    { file: 'Đề 11.pdf', id: 'de_on_luyen_11', title: 'Đề ôn luyện thi tốt nghiệp THPT 2026 — Đề số 11', source: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2026' },
  ];

  for (const item of pdfList) {
    const fPath = path.join(ROOT, 'raw_data', 'DETHITIN THPTQG_', item.file);
    if (fs.existsSync(fPath)) {
      try {
        const parsed = await parsePdfExam(fPath, item.id, item.title, item.source);
        allExams.push(parsed);
        console.log(`   ✅ Đã thêm: ${parsed.title} (${parsed.part1Questions.length} trắc nghiệm + ${parsed.part2Questions.length} đúng/sai)`);
      } catch (err) {
        console.warn(`   ⚠️ Lỗi phân tích ${item.file}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 TỔNG CỘNG ĐÃ TỔNG HỢP ${allExams.length} BỘ ĐỀ THI VỚI HƠN ${allExams.reduce((sum, e) => sum + e.part1Questions.length + e.part2Questions.length, 0)} CÂU HỎI THẬT!`);

  // 4. Lưu vào parsed_exams.json
  fs.writeFileSync(PARSED_JSON_PATH, JSON.stringify(allExams, null, 2), 'utf8');
  console.log(`💾 Đã lưu dữ liệu vào ${PARSED_JSON_PATH}`);

  // 5. Cập nhật officialExamsData.ts cho Frontend
  let tsContent = "import { Exam, SingleChoiceQuestion, TrueFalseGroupQuestion } from '../types';\n\n";
  tsContent += "export const OFFICIAL_EXAMS: Exam[] = " + JSON.stringify(allExams, null, 2) + ";\n\n";
  tsContent += `export const DIAGNOSTIC_QUESTIONS: SingleChoiceQuestion[] = [
  ...OFFICIAL_EXAMS[0].part1Questions.slice(0, 10),
  ...OFFICIAL_EXAMS[1].part1Questions.slice(0, 5),
];

export const DAILY_CHALLENGE_POOL: SingleChoiceQuestion[] = [
  ...OFFICIAL_EXAMS[0].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[1].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[2].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[3].part1Questions.slice(0, 5),
  ...(OFFICIAL_EXAMS[5] ? OFFICIAL_EXAMS[5].part1Questions.slice(0, 5) : []),
  ...(OFFICIAL_EXAMS[6] ? OFFICIAL_EXAMS[6].part1Questions.slice(0, 5) : []),
];
`;
  fs.writeFileSync(TS_FILE_PATH, tsContent, 'utf8');
  console.log(`💾 Đã cập nhật ${TS_FILE_PATH}`);

  // 6. Tái tạo seed_master.sql
  console.log('\n🔨 6. Đang tái tạo file supabase/seed_master.sql...');
  execSync('python scripts/build_master_seed.py', { cwd: ROOT, encoding: 'utf8' });
  console.log('✅ Đã tái tạo seed_master.sql hoàn chỉnh với tất cả các đề mới!');

  // 7. Nạp trực tiếp vào Supabase
  console.log('\n🚀 7. Đang nạp tất cả đề thi mới vào Supabase qua CLI...');
  execSync('npx tsx scripts/seedRealExamsToSupabase.ts', { cwd: ROOT, stdio: 'inherit' });
}

main().catch(console.error);
