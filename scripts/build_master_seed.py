# -*- coding: utf-8 -*-
"""
build_master_seed.py
Tạo file supabase/seed_master.sql tổng hợp toàn bộ dữ liệu mẫu:
1. RLS Policies mở rộng
2. 34 Trường THPT Quảng Ngãi
3. 8 Chủ đề Tin học
4. 5 Đề thi thật THPT 2026 và 140+ câu hỏi
5. Tri thức SGK Knowledge Chunks
"""
import os
import json
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARSED_EXAMS_JSON = os.path.join(ROOT, 'scripts', 'parsed_exams.json')
SCHOOLS_TS = os.path.join(ROOT, 'src', 'data', 'schoolsData.ts')
KNOWLEDGE_SQL = os.path.join(ROOT, 'supabase', 'seed_knowledge_chunks.sql')
OUTPUT_SQL = os.path.join(ROOT, 'supabase', 'seed_master.sql')

def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def json_escape(obj):
    if obj is None:
        return "NULL"
    return "'" + json.dumps(obj, ensure_ascii=False).replace("'", "''") + "'::jsonb"

# 1. Parse schools from schoolsData.ts
schools = []
with open(SCHOOLS_TS, 'r', encoding='utf-8') as f:
    content = f.read()
    pattern = r"{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*district:\s*'([^']+)',\s*address:\s*'([^']+)'\s*}"
    matches = re.findall(pattern, content)
    for m in matches:
        schools.append({
            'id': m[0],
            'name': m[1],
            'district': m[2],
            'address': m[3]
        })

print(f"Parsed {len(schools)} schools from schoolsData.ts")

# 2. Parse exams from parsed_exams.json
with open(PARSED_EXAMS_JSON, 'r', encoding='utf-8') as f:
    exams = json.load(f)
print(f"Loaded {len(exams)} exams from parsed_exams.json")

# 3. Read knowledge chunks from seed_knowledge_chunks.sql
kc_sql_parts = []
if os.path.exists(KNOWLEDGE_SQL):
    with open(KNOWLEDGE_SQL, 'r', encoding='utf-8') as f:
        kc_sql = f.read()
        # Extract from INSERT INTO public.knowledge_chunks
        kc_idx = kc_sql.find('-- 3. NẠP DỮ LIỆU TRI THỨC SGK')
        if kc_idx != -1:
            kc_sql_parts.append(kc_sql[kc_idx:])
        else:
            kc_sql_parts.append(kc_sql)

# 4. Generate Master Seed SQL
lines = []
lines.append("-- ==============================================================================")
lines.append("-- TINPATH - MASTER SEED DATABASE SCRIPT")
lines.append("-- Nạp toàn bộ dữ liệu hoàn chỉnh cho hệ thống TinPath gồm 14 bảng:")
lines.append("-- 1. Trường học (34 THPT Quảng Ngãi)")
lines.append("-- 2. Chuyên đề (8 Topics chuẩn GDPT 2018)")
lines.append("-- 3. Đề thi (5 Đề thi thử THPT 2026 chính thức)")
lines.append("-- 4. Ngân hàng câu hỏi (140+ câu hỏi trắc nghiệm & đúng sai có giải thích)")
lines.append("-- 5. Tri thức SGK (Knowledge Chunks phục vụ AI Mentor RAG)")
lines.append("-- 6. Cấu hình phân quyền RLS an toàn, tránh lỗi permission")
lines.append("-- ==============================================================================")
lines.append("")

# RLS Policies Setup
lines.append("-- 1. CẤU HÌNH PHÂN QUYỀN ROW LEVEL SECURITY (RLS) TRÁNH LỖI INSERT/SELECT")
for tbl in ['schools', 'topics', 'exams', 'questions', 'knowledge_chunks', 'classrooms', 'assignments', 'classroom_members', 'exam_comments', 'daily_challenge_attempts', 'xp_transactions']:
    lines.append(f'DROP POLICY IF EXISTS "Allow public all on {tbl}" ON public.{tbl};')
    lines.append(f'CREATE POLICY "Allow public all on {tbl}" ON public.{tbl} FOR ALL USING (true) WITH CHECK (true);')
lines.append("")

# Schools
lines.append("-- ==============================================================================")
lines.append(f"-- 2. NẠP DANH MỤC {len(schools)} TRƯỜNG THPT TỈNH QUẢNG NGÃI")
lines.append("-- ==============================================================================")
lines.append("INSERT INTO public.schools (id, name, district, address) VALUES")
school_values = []
for s in schools:
    school_values.append(f"({sql_escape(s['id'])}, {sql_escape(s['name'])}, {sql_escape(s['district'])}, {sql_escape(s['address'])})")
lines.append(",\n".join(school_values))
lines.append("ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, district = EXCLUDED.district, address = EXCLUDED.address;")
lines.append("")

# Topics
lines.append("-- ==============================================================================")
lines.append("-- 3. NẠP DANH MỤC 8 CHỦ ĐỀ CHUẨN CHƯƠNG TRÌNH GDPT 2018 (TIN HỌC 11 & 12)")
lines.append("-- ==============================================================================")
lines.append("""INSERT INTO public.topics (id, name, track, grade, description) VALUES
('12A', 'Trí tuệ nhân tạo (AI) & Học máy', 'ALL', '12', 'Khái niệm AI, Machine Learning, Học có giám sát, Không giám sát, đạo đức AI'),
('12B', 'Mạng máy tính và Internet', 'ALL', '12', 'Địa chỉ IP, Switch, Router, giao thức TCP/IP, DNS, DHCP'),
('12D', 'Đạo đức, pháp luật thế giới ảo', 'ALL', '12', 'Luật An ninh mạng, quyền riêng tư, bản quyền số'),
('12F', 'Tạo trang web và thiết kế web', 'ALL', '12', 'HTML, CSS, cấu trúc trang web'),
('11F', 'Hệ cơ sở dữ liệu và Truy vấn SQL', 'ALL', '11', 'Mô hình CSDL quan hệ, Khóa chính, Khóa ngoại, câu lệnh SQL SELECT, JOIN'),
('11F_CS', 'Thuật toán và Kĩ thuật lập trình', 'CS', '11', 'Đệ quy, Tìm kiếm nhị phân, Sắp xếp, độ phức tạp O-notation'),
('12F_CS', 'Khoa học dữ liệu & Học máy nâng cao', 'CS', '12', 'Tiền xử lý dữ liệu và thuật toán học máy'),
('12G', 'Định hướng nghề nghiệp & Tuyển sinh CNTT', 'ALL', '12', 'Nhóm ngành Máy tính & CNTT, tổ hợp môn A00, A01, D01, D07')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, track = EXCLUDED.track, description = EXCLUDED.description;
""")

# Exams & Questions
lines.append("-- ==============================================================================")
lines.append(f"-- 4. NẠP 5 ĐỀ THI TỐT NGHIỆP THPT 2026 VÀ TOÀN BỘ CÂU HỎI THẬT")
lines.append("-- ==============================================================================")

total_q = 0
for ex in exams:
    lines.append(f"-- ------------------------------------------------------------------------------")
    lines.append(f"-- ĐỀ THI: {ex['title']}")
    lines.append(f"-- ------------------------------------------------------------------------------")
    lines.append(f"INSERT INTO public.exams (id, title, source, duration_minutes, year, difficulty, description, base_xp)")
    lines.append(f"VALUES ({sql_escape(ex['id'])}, {sql_escape(ex['title'])}, {sql_escape(ex['source'])}, {ex['durationMinutes']}, {ex['year']}, {sql_escape(ex['difficulty'])}, {sql_escape(ex['description'])}, {ex['baseXP']})")
    lines.append(f"ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, base_xp = EXCLUDED.base_xp;")
    lines.append("")

    # Part 1 Questions
    lines.append(f"-- Câu hỏi Phần I của {ex['id']}")
    for q in ex['part1Questions']:
        total_q += 1
        lines.append(
            f"INSERT INTO public.questions (id, exam_id, topic_id, topic_name, type, level, track_requirement, content, options, correct_answer, explanation) "
            f"VALUES ({sql_escape(q['id'])}, {sql_escape(ex['id'])}, {sql_escape(q['topicId'])}, {sql_escape(q['topicName'])}, 'single_choice', {sql_escape(q['level'])}, 'ALL', "
            f"{sql_escape(q['content'])}, {json_escape(q['options'])}, {sql_escape(q['correctAnswer'])}, {sql_escape(q.get('explanation', ''))}) "
            f"ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation;"
        )
    lines.append("")

    # Part 2 Questions
    lines.append(f"-- Câu hỏi Phần II của {ex['id']}")
    for q in ex['part2Questions']:
        total_q += 1
        q_ctx = q.get('context') or q.get('content') or f"Câu hỏi đúng/sai chuyên đề {q.get('topicName', '')}"
        lines.append(
            f"INSERT INTO public.questions (id, exam_id, topic_id, topic_name, type, level, track_requirement, content, statements) "
            f"VALUES ({sql_escape(q['id'])}, {sql_escape(ex['id'])}, {sql_escape(q['topicId'])}, {sql_escape(q['topicName'])}, 'true_false_group', {sql_escape(q['level'])}, {sql_escape(q['trackRequirement'])}, "
            f"{sql_escape(q_ctx)}, {json_escape(q['statements'])}) "
            f"ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, statements = EXCLUDED.statements;"
        )
    lines.append("")

lines.append("-- Cập nhật thống kê total_questions trong topics")
lines.append("UPDATE public.topics t SET total_questions = (SELECT COUNT(*) FROM public.questions q WHERE q.topic_id = t.id);")
lines.append("")

# Knowledge Chunks
lines.append("-- ==============================================================================")
lines.append("-- 5. NẠP DỮ LIỆU TRI THỨC SGK TIN HỌC 11 & 12 (KNOWLEDGE_CHUNKS CHO AI RAG)")
lines.append("-- ==============================================================================")
if kc_sql_parts:
    lines.extend(kc_sql_parts)

# Write output
with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print(f"[OK] Created Master Seed SQL: {OUTPUT_SQL}")
print(f"   Schools: {len(schools)}")
print(f"   Exams: {len(exams)}")
print(f"   Questions: {total_q}")
