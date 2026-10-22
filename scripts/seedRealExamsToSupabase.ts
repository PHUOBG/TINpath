/**
 * seedRealExamsToSupabase.ts
 * Nạp 5 bộ đề thi chính thức tốt nghiệp THPT 2026 từ các trường THPT Quảng Ngãi vào Supabase
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
  console.log('🚀 Bắt đầu nạp 5 bộ đề thi thật THPT 2026 vào Supabase...');

  const jsonPath = path.join(__dirname, 'parsed_exams.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy scripts/parsed_exams.json');
    process.exit(1);
  }

  const exams = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📌 Tìm thấy ${exams.length} đề thi cần nạp.`);

  // 1. Kiểm tra và bổ sung topics nếu thiếu
  const topicsToEnsure = [
    { id: '12A', name: 'Trí tuệ nhân tạo (AI) & Học máy', track: 'ALL', grade: '12' },
    { id: '12B', name: 'Mạng máy tính và Internet', track: 'ALL', grade: '12' },
    { id: '12D', name: 'Đạo đức, pháp luật thế giới ảo', track: 'ALL', grade: '12' },
    { id: '12F', name: 'Tạo trang web và thiết kế web', track: 'ALL', grade: '12' },
    { id: '11F', name: 'Hệ cơ sở dữ liệu và Truy vấn SQL', track: 'ALL', grade: '11' },
    { id: '11F_CS', name: 'Thuật toán và Kĩ thuật lập trình', track: 'CS', grade: '11' },
    { id: '12F_CS', name: 'Khoa học dữ liệu & Học máy nâng cao', track: 'CS', grade: '12' },
    { id: '12G', name: 'Định hướng nghề nghiệp & Tuyển sinh CNTT', track: 'ALL', grade: '12' },
  ];

  for (const t of topicsToEnsure) {
    const { error } = await supabase.from('topics').upsert(t, { onConflict: 'id' });
    if (error) console.warn(`Cảnh báo upsert topic ${t.id}:`, error.message);
  }

  let totalQuestionsInserted = 0;

  for (const exam of exams) {
    console.log(`\n📝 Đang nạp đề: ${exam.title} (${exam.id})...`);

    // 2. Upsert Exam
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
      console.error(`❌ Lỗi upsert exam ${exam.id}:`, exErr.message);
      continue;
    }
    console.log(`   ✅ Đã lưu đề thi: ${exam.id}`);

    // 3. Chuẩn bị danh sách câu hỏi
    const questionsToInsert: any[] = [];

    // Part 1
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

    // Part 2
    for (const q of exam.part2Questions) {
      questionsToInsert.push({
        id: q.id,
        exam_id: exam.id,
        topic_id: q.topicId || '12B',
        topic_name: q.topicName,
        type: 'true_false_group',
        level: q.level || 'hieu',
        track_requirement: q.trackRequirement || 'ALL',
        content: q.content,
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
      console.error(`❌ Lỗi nạp câu hỏi cho ${exam.id}:`, qErr.message);
    } else {
      console.log(`   ✅ Đã nạp ${questionsToInsert.length} câu hỏi (24 trắc nghiệm + ${exam.part2Questions.length} đúng/sai).`);
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

  console.log(`\n🎉 HOÀN TẤT NẠP DỮ LIỆU! Tổng cộng đã nạp ${exams.length} đề thi và ${totalQuestionsInserted} câu hỏi thật vào Supabase!`);
}

main().catch(console.error);
