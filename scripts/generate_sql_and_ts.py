# -*- coding: utf-8 -*-
"""
generate_sql_and_ts.py
Tạo ra 2 file từ scripts/parsed_exams.json:
1. supabase/seed_real_exams.sql: SQL nạp trực tiếp vào Supabase (chạy 1 phát là vào Database thật ngay)
2. src/data/officialExamsData.ts: Dữ liệu thật đưa vào Frontend web TinPath (đảm bảo web hiển thị ngay cả khi offline)
"""
import os
import json

ROOT = os.path.join(os.path.dirname(__file__), '..')
JSON_FILE = os.path.join(ROOT, 'scripts', 'parsed_exams.json')
SQL_FILE = os.path.join(ROOT, 'supabase', 'seed_real_exams.sql')
TS_FILE = os.path.join(ROOT, 'src', 'data', 'officialExamsData.ts')

with open(JSON_FILE, 'r', encoding='utf-8') as f:
    exams = json.load(f)

print(f"Loaded {len(exams)} exams from parsed_exams.json")

# ==============================================================================
# 1. TẠO FILE SQL CHO SUPABASE
# ==============================================================================
def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def json_escape(obj):
    if obj is None:
        return "NULL"
    return "'" + json.dumps(obj, ensure_ascii=False).replace("'", "''") + "'::jsonb"

sql_lines = [
    "-- ==============================================================================",
    "-- NẠP DỮ LIỆU ĐỀ THI VÀ CÂU HỎI THẬT TỐT NGHIỆP THPT 2026 (QUẢNG NGÃI)",
    "-- Gồm 5 trường: Chuyên Lê Khiết, Bình Sơn, Thu Xà, Quang Trung, Lê Trung Đình",
    "-- ==============================================================================",
    "",
    "-- Mở quyền RLS cho exams và questions để web và admin có thể quản lý",
    "DROP POLICY IF EXISTS \"Public insert exams\" ON public.exams;",
    "CREATE POLICY \"Public insert exams\" ON public.exams FOR ALL USING (true);",
    "",
    "DROP POLICY IF EXISTS \"Public insert questions\" ON public.questions;",
    "CREATE POLICY \"Public insert questions\" ON public.questions FOR ALL USING (true);",
    "",
    "-- Đảm bảo các chủ đề (topics) có sẵn",
    "INSERT INTO public.topics (id, name, track, grade, description) VALUES",
    "('12A', 'Trí tuệ nhân tạo (AI) & Học máy', 'ALL', '12', 'Khái niệm AI, Machine Learning, Học có giám sát, Không giám sát, đạo đức AI'),",
    "('12B', 'Mạng máy tính và Internet', 'ALL', '12', 'Địa chỉ IP, Switch, Router, giao thức TCP/IP, DNS, DHCP'),",
    "('12D', 'Đạo đức, pháp luật thế giới ảo', 'ALL', '12', 'Luật An ninh mạng, quyền riêng tư, bản quyền số'),",
    "('12F', 'Tạo trang web và thiết kế web', 'ALL', '12', 'HTML, CSS, cấu trúc trang web'),",
    "('11F', 'Hệ cơ sở dữ liệu và Truy vấn SQL', 'ALL', '11', 'Mô hình CSDL quan hệ, Khóa chính, Khóa ngoại, câu lệnh SQL SELECT, JOIN'),",
    "('11F_CS', 'Thuật toán và Kĩ thuật lập trình', 'CS', '11', 'Đệ quy, Tìm kiếm nhị phân, Sắp xếp, độ phức tạp O-notation'),",
    "('12F_CS', 'Khoa học dữ liệu & Học máy nâng cao', 'CS', '12', 'Tiền xử lý dữ liệu và thuật toán học máy'),",
    "('12G', 'Định hướng nghề nghiệp & Tuyển sinh CNTT', 'ALL', '12', 'Nhóm ngành Máy tính & CNTT, tổ hợp môn A00, A01, D01, D07')",
    "ON CONFLICT (id) DO NOTHING;",
    ""
]

# Thêm từng đề thi và câu hỏi vào SQL
for ex in exams:
    sql_lines.append(f"-- ------------------------------------------------------------------------------")
    sql_lines.append(f"-- ĐỀ THI: {ex['title']}")
    sql_lines.append(f"-- ------------------------------------------------------------------------------")
    sql_lines.append(f"INSERT INTO public.exams (id, title, source, duration_minutes, year, difficulty, description, base_xp)")
    sql_lines.append(f"VALUES ({sql_escape(ex['id'])}, {sql_escape(ex['title'])}, {sql_escape(ex['source'])}, {ex['durationMinutes']}, {ex['year']}, {sql_escape(ex['difficulty'])}, {sql_escape(ex['description'])}, {ex['baseXP']})")
    sql_lines.append(f"ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, base_xp = EXCLUDED.base_xp;")
    sql_lines.append("")
    
    # Câu hỏi Phần I
    sql_lines.append(f"-- Câu hỏi Phần I của {ex['id']}")
    for q in ex['part1Questions']:
        sql_lines.append(
            f"INSERT INTO public.questions (id, exam_id, topic_id, topic_name, type, level, track_requirement, content, options, correct_answer, explanation) "
            f"VALUES ({sql_escape(q['id'])}, {sql_escape(ex['id'])}, {sql_escape(q['topicId'])}, {sql_escape(q['topicName'])}, 'single_choice', {sql_escape(q['level'])}, 'ALL', "
            f"{sql_escape(q['content'])}, {json_escape(q['options'])}, {sql_escape(q['correctAnswer'])}, {sql_escape(q['explanation'])}) "
            f"ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation;"
        )
    sql_lines.append("")
    
    # Câu hỏi Phần II
    sql_lines.append(f"-- Câu hỏi Phần II của {ex['id']}")
    for q in ex['part2Questions']:
        q_ctx = q.get('context') or q.get('content') or ''
        sql_lines.append(
            f"INSERT INTO public.questions (id, exam_id, topic_id, topic_name, type, level, track_requirement, content, statements) "
            f"VALUES ({sql_escape(q['id'])}, {sql_escape(ex['id'])}, {sql_escape(q['topicId'])}, {sql_escape(q['topicName'])}, 'true_false_group', {sql_escape(q['level'])}, {sql_escape(q['trackRequirement'])}, "
            f"{sql_escape(q_ctx)}, {json_escape(q['statements'])}) "
            f"ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, statements = EXCLUDED.statements;"
        )
    sql_lines.append("")

# Cập nhật số lượng câu hỏi trong topics
sql_lines.append("-- Cập nhật thống kê total_questions trong topics")
sql_lines.append("UPDATE public.topics t SET total_questions = (SELECT COUNT(*) FROM public.questions q WHERE q.topic_id = t.id);")

with open(SQL_FILE, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"✅ Generated {SQL_FILE} (size: {os.path.getsize(SQL_FILE)} bytes)")

# ==============================================================================
# 2. TẠO FILE TYPESCRIPT CHO FRONTEND (officialExamsData.ts)
# ==============================================================================
ts_content = "import { Exam, SingleChoiceQuestion, TrueFalseGroupQuestion } from '../types';\n\n"
ts_content += "export const OFFICIAL_EXAMS: Exam[] = " + json.dumps(exams, ensure_ascii=False, indent=2) + ";\n\n"

# Daily challenge pool lấy từ 20 câu trắc nghiệm hay nhất của các trường
ts_content += """export const DIAGNOSTIC_QUESTIONS: SingleChoiceQuestion[] = [
  ...OFFICIAL_EXAMS[0].part1Questions.slice(0, 10),
  ...OFFICIAL_EXAMS[1].part1Questions.slice(0, 5),
];

export const DAILY_CHALLENGE_POOL: SingleChoiceQuestion[] = [
  ...OFFICIAL_EXAMS[0].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[1].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[2].part1Questions.slice(0, 5),
  ...OFFICIAL_EXAMS[3].part1Questions.slice(0, 5),
];
"""

with open(TS_FILE, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"✅ Generated {TS_FILE} (size: {os.path.getsize(TS_FILE)} bytes)")
