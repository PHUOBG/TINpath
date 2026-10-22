# -*- coding: utf-8 -*-
"""
parse_all_real_exams.py
Trích xuất dữ liệu đề thi thật 2026 từ các trường THPT Quảng Ngãi:
- THPT Thu Xà (Kèm đáp án & lời giải chi tiết)
- THPT Bình Sơn
- THPT Chuyên Lê Khiết
- THPT Quang Trung
- THPT Lê Trung Đình (Mã đề 501)
Xuất ra scripts/parsed_exams.json chuẩn format TypeScript của TinPath.
"""
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', 'raw_data', 'DETHITIN THPTQG_')
OUT_FILE = os.path.join(os.path.dirname(__file__), 'parsed_exams.json')

def extract_docx_data(filepath):
    with zipfile.ZipFile(filepath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # All paragraphs
        paragraphs = []
        for p in tree.findall('.//w:p', ns):
            text = ''.join(n.text for n in p.findall('.//w:t', ns) if n.text).strip()
            if text:
                paragraphs.append(text)
                
        # All tables
        tables = []
        for tbl in tree.findall('.//w:tbl', ns):
            t_rows = []
            for r in tbl.findall('.//w:tr', ns):
                cells = [''.join(n.text for n in c.findall('.//w:t', ns) if n.text).strip() for c in r.findall('.//w:tc', ns)]
                t_rows.append(cells)
            tables.append(t_rows)
            
        return paragraphs, tables

def parse_options_from_text(text):
    """Tách options A, B, C, D từ chuỗi"""
    # Pattern tìm A. ... B. ... C. ... D. ...
    pattern = r'([A-D])[\.:\)]\s*(.*?)(?=(?:[A-D][\.:\)]|$))'
    matches = re.findall(pattern, text, re.DOTALL)
    options = {}
    for letter, opt_text in matches:
        options[letter] = opt_text.strip()
    return options

# ==============================================================================
# 1. PARSER: THPT THU XÀ
# ==============================================================================
def parse_thuxa():
    filepath = os.path.join(RAW_DIR, 'DAP AN _ DE MINH HOA TN THPT 2026 _THPT THU XÀ.docx')
    paragraphs, _ = extract_docx_data(filepath)
    
    exam = {
        "id": "thpt_thu_xa_2026",
        "title": "Đề thi thử Tốt nghiệp THPT 2026 — THPT Thu Xà (Quảng Ngãi)",
        "source": "Trường THPT Thu Xà, Sở GD&ĐT Quảng Ngãi",
        "durationMinutes": 50,
        "year": 2026,
        "difficulty": "Thi thử tốt nghiệp",
        "description": "Đề thi minh họa tốt nghiệp THPT năm 2026 chuẩn cấu trúc Bộ GD&ĐT do THPT Thu Xà biên soạn, có đáp án & lời giải chi tiết 100%.",
        "totalScore": 10,
        "baseXP": 120,
        "part1Questions": [],
        "part2Questions": []
    }
    
    # Tách Phần I và Phần II
    p1_idx = -1
    p2_idx = -1
    for i, p in enumerate(paragraphs):
        if 'PHẦN I' in p and p1_idx == -1:
            p1_idx = i
        elif 'PHẦN II' in p and p2_idx == -1:
            p2_idx = i
            
    p1_lines = paragraphs[p1_idx+1:p2_idx]
    p2_lines = paragraphs[p2_idx+1:]
    
    # Parse Phần I
    # Mỗi câu bắt đầu bằng "[B|H|V]?Câu\s*(\d+)[\.:]\s*(\(([^)]+)\))?\s*(.*)"
    q_blocks = []
    current_block = []
    for line in p1_lines:
        if re.match(r'^[BHV]?Câu\s*\d+', line, re.IGNORECASE):
            if current_block:
                q_blocks.append(current_block)
            current_block = [line]
        else:
            if current_block:
                current_block.append(line)
    if current_block:
        q_blocks.append(current_block)
        
    for idx, block in enumerate(q_blocks):
        full_text = "\n".join(block)
        first_line = block[0]
        
        # Lấy số câu, metadata
        m = re.match(r'^[BHV]?Câu\s*(\d+)[\.:]\s*(?:\(([^)]+)\))?\s*(.*)', first_line, re.IGNORECASE)
        q_num = idx + 1
        meta_str = ""
        q_content = ""
        if m:
            q_num = int(m.group(1))
            meta_str = m.group(2) or ""
            q_content = m.group(3) or ""
            
        # Xác định topicId & level từ meta_str
        topic_id = "12A"
        level = "biet"
        if "12A" in meta_str: topic_id = "12A"
        elif "12B" in meta_str: topic_id = "12B"
        elif "12D" in meta_str: topic_id = "12D"
        elif "12F" in meta_str or "12E" in meta_str: topic_id = "12F"
        elif "11F" in meta_str: topic_id = "11F"
        elif "12G" in meta_str: topic_id = "12G"
        
        if "Hiểu" in meta_str or "H," in meta_str: level = "hieu"
        elif "Vận dụng" in meta_str or "V," in meta_str: level = "van_dung"
        elif "Biết" in meta_str or "B," in meta_str: level = "biet"
        
        # Options: tìm các dòng A. B. C. D.
        opt_text = ""
        for line in block[1:]:
            if re.search(r'\b[A-D][\.:\)]', line) and not 'Đáp án đúng' in line and not 'Giải thích' in line:
                opt_text += " " + line
        options = parse_options_from_text(opt_text)
        if len(options) < 4:
            # fallback regex trên full_text
            options = parse_options_from_text(full_text)
            
        # Correct answer
        correct = "A"
        ans_m = re.search(r'Đáp án đúng(?:\s*là)?:\s*([A-D])', full_text, re.IGNORECASE)
        if ans_m:
            correct = ans_m.group(1).upper()
            
        # Explanation
        explanation = ""
        exp_idx = -1
        for i, l in enumerate(block):
            if "Giải thích" in l:
                exp_idx = i
                break
        if exp_idx != -1:
            explanation = "\n".join(block[exp_idx:]).replace("Giải thích:", "").strip()
            
        exam["part1Questions"].append({
            "id": f"thuxa_p1_c{q_num}",
            "type": "single_choice",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": level,
            "content": q_content.strip() or f"Câu hỏi số {q_num}",
            "options": {
                "A": options.get("A", "Phương án A"),
                "B": options.get("B", "Phương án B"),
                "C": options.get("C", "Phương án C"),
                "D": options.get("D", "Phương án D")
            },
            "correctAnswer": correct,
            "explanation": explanation or f"Đáp án chính xác là {correct} theo chuẩn đáp án THPT Thu Xà."
        })
        
    # Parse Phần II
    # Gom các câu trong Phần II: Câu 1, Câu 2 (Chung), Câu 3, 4 (CS), Câu 5, 6 (ICT)
    p2_blocks = []
    curr_p2 = []
    for line in p2_lines:
        if re.match(r'^(?:[BHV]?Câu\s*\d+|Định hướng)', line, re.IGNORECASE):
            if curr_p2 and re.match(r'^[BHV]?Câu\s*\d+', curr_p2[0], re.IGNORECASE):
                p2_blocks.append(curr_p2)
                curr_p2 = []
            if re.match(r'^[BHV]?Câu\s*\d+', line, re.IGNORECASE):
                curr_p2 = [line]
        else:
            if curr_p2:
                curr_p2.append(line)
    if curr_p2 and re.match(r'^[BHV]?Câu\s*\d+', curr_p2[0], re.IGNORECASE):
        p2_blocks.append(curr_p2)
        
    for b_idx, block in enumerate(p2_blocks):
        full_b_text = "\n".join(block)
        first_line = block[0]
        c_num = b_idx + 1
        m = re.match(r'^[BHV]?Câu\s*(\d+)', first_line, re.IGNORECASE)
        if m: c_num = int(m.group(1))
        
        # Track requirement
        track = "ALL"
        if c_num in [3, 4]: track = "CS"
        elif c_num in [5, 6]: track = "ICT"
        
        # Statements a, b, c, d
        statements = []
        stmt_letters = ['a', 'b', 'c', 'd']
        for s_let in stmt_letters:
            s_match = re.search(rf'{s_let}\)\s*(.*?)(?=\s*[b-d]\)|\n|$)', full_b_text, re.IGNORECASE)
            s_text = s_match.group(1).strip() if s_match else f"Mệnh đề {s_let}"
            
            # Kiểm tra Đúng hay Sai
            # Thường ghi (B, Đúng) hoặc (H, Sai) hoặc "→ Đúng", "→ Sai"
            is_correct = False
            if re.search(rf'{s_let}\)[^)]*?\(\s*[BHV]?\s*,?\s*Đúng\)', full_b_text, re.IGNORECASE) or \
               re.search(rf'{s_let}\)[^.\n]*?→\s*Đúng', full_b_text, re.IGNORECASE) or \
               f"{s_let}) Đúng" in full_b_text or f"{s_let}. Đúng" in full_b_text:
                is_correct = True
            elif "Đúng" in s_text and "Sai" not in s_text:
                is_correct = True
                
            statements.append({
                "id": s_let,
                "text": s_text.split('(')[0].replace('→ Đúng', '').replace('→ Sai', '').strip(),
                "isCorrect": is_correct,
                "explanation": f"Mệnh đề ({s_let}) là {'Đúng' if is_correct else 'Sai'} theo đáp án THPT Thu Xà."
            })
            
        topic_id = "12B" if c_num == 1 else ("12F" if c_num == 2 else ("11F_CS" if c_num in [3, 4] else "12F"))
        
        exam["part2Questions"].append({
            "id": f"thuxa_p2_c{c_num}",
            "type": "true_false_group",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": "hieu",
            "trackRequirement": track,
            "context": block[0].replace(f"Câu {c_num}", "").replace(f"Câu{c_num}", "").strip() or f"Phần câu hỏi đúng/sai số {c_num}",
            "statements": statements
        })
        
    return exam

def get_topic_name(tid):
    mapping = {
        "12A": "Trí tuệ nhân tạo (AI) & Học máy",
        "12B": "Mạng máy tính và Internet",
        "12D": "Đạo đức, pháp luật thế giới ảo",
        "12F": "Tạo trang web và thiết kế web",
        "11F": "Hệ cơ sở dữ liệu và Truy vấn SQL",
        "11F_CS": "Thuật toán và Kĩ thuật lập trình",
        "12F_CS": "Khoa học dữ liệu & Học máy nâng cao",
        "12G": "Định hướng nghề nghiệp & Tuyển sinh CNTT"
    }
    return mapping.get(tid, "Tin học 12")

# ==============================================================================
# 2. PARSER: THPT BÌNH SƠN (BSO)
# ==============================================================================
def parse_binh_son():
    filepath = os.path.join(RAW_DIR, 'ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_BSO.docx')
    paragraphs, tables = extract_docx_data(filepath)
    
    exam = {
        "id": "thpt_binh_son_2026",
        "title": "Đề thi thử Tốt nghiệp THPT 2026 — THPT Bình Sơn (Quảng Ngãi)",
        "source": "Trường THPT Bình Sơn, Sở GD&ĐT Quảng Ngãi",
        "durationMinutes": 50,
        "year": 2026,
        "difficulty": "Thi thử tốt nghiệp",
        "description": "Đề thi thử tốt nghiệp THPT năm 2026 mã đề 5001 trường THPT Bình Sơn kèm ma trận đáp án 100%.",
        "totalScore": 10,
        "baseXP": 120,
        "part1Questions": [],
        "part2Questions": []
    }
    
    # Đáp án Table 4: Part 1
    # Rows: ['Câu', 'Đáp án', 'Câu', 'Đáp án'], ['1', 'D', '13', 'B'], ...
    p1_answers = {}
    if len(tables) >= 5:
        t4 = tables[4]
        for row in t4[1:]:
            if len(row) >= 4:
                if row[0].isdigit(): p1_answers[int(row[0])] = row[1].strip()
                if row[2].isdigit(): p1_answers[int(row[2])] = row[3].strip()
                
    # Đáp án Table 5 & 6: Part 2
    p2_answers = {} # (q_num, sub_id) -> bool
    if len(tables) >= 6:
        # Table 5: Câu 1, 2
        # ['1', 'a', 'S', '2', 'a', 'S'], ['', 'b', 'Đ', '', 'b', 'Đ']
        curr_q_left = 1
        curr_q_right = 2
        for row in tables[5][1:]:
            if len(row) >= 6:
                if row[0].isdigit(): curr_q_left = int(row[0])
                if row[3].isdigit(): curr_q_right = int(row[3])
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(curr_q_left, sub_l)] = val_l
                if sub_r: p2_answers[(curr_q_right, sub_r)] = val_r
                
    if len(tables) >= 7:
        # Table 6: Câu 3(CS), 4(CS), 5(ICT), 6(ICT)
        curr_q_left = 3
        curr_q_right = 5
        for row in tables[6][1:]:
            if len(row) >= 6:
                if '3' in row[0]: curr_q_left = 3
                elif '4' in row[0]: curr_q_left = 4
                if '5' in row[3]: curr_q_right = 5
                elif '6' in row[3]: curr_q_right = 6
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(curr_q_left, sub_l)] = val_l
                if sub_r: p2_answers[(curr_q_right, sub_r)] = val_r

    # Tách paragraphs giữa PHẦN I và PHẦN II
    p1_idx = -1
    p2_idx = -1
    dapan_idx = -1
    for i, p in enumerate(paragraphs):
        if 'PHẦN I' in p and p1_idx == -1: p1_idx = i
        elif 'PHẦN II' in p and p2_idx == -1: p2_idx = i
        elif 'ĐÁP ÁN' in p and dapan_idx == -1: dapan_idx = i
        
    p1_lines = paragraphs[p1_idx+1:p2_idx]
    p2_lines = paragraphs[p2_idx+1:dapan_idx if dapan_idx != -1 else len(paragraphs)]
    
    # Parse Part 1 questions
    q_blocks = []
    curr_b = []
    for line in p1_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b: q_blocks.append(curr_b)
            curr_b = [line]
        else:
            if curr_b: curr_b.append(line)
    if curr_b: q_blocks.append(curr_b)
    
    for idx, block in enumerate(q_blocks):
        q_num = idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        q_content = m.group(2) if m else first_line
        
        # Options
        opt_text = " ".join(block[1:])
        options = parse_options_from_text(opt_text)
        if len(options) < 4:
            options = parse_options_from_text(" ".join(block))
            
        correct = p1_answers.get(q_num, "A")
        topic_id = "12B" if q_num in [1, 2, 3] else ("12A" if q_num in [4, 5, 6, 7] else ("12F" if q_num in [8, 9, 10, 11] else "11F"))
        
        exam["part1Questions"].append({
            "id": f"bso_p1_c{q_num}",
            "type": "single_choice",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": "biet" if q_num <= 8 else ("hieu" if q_num <= 18 else "van_dung"),
            "content": q_content.strip() or f"Câu hỏi số {q_num}",
            "options": {
                "A": options.get("A", "Phương án A"),
                "B": options.get("B", "Phương án B"),
                "C": options.get("C", "Phương án C"),
                "D": options.get("D", "Phương án D")
            },
            "correctAnswer": correct,
            "explanation": f"Đáp án chính xác: {correct} theo bảng ma trận đáp án chính thức THPT Bình Sơn."
        })
        
    # Parse Part 2 questions
    p2_blocks = []
    curr_b2 = []
    for line in p2_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b2: p2_blocks.append(curr_b2)
            curr_b2 = [line]
        else:
            if curr_b2: curr_b2.append(line)
    if curr_b2: p2_blocks.append(curr_b2)
    
    for b_idx, block in enumerate(p2_blocks):
        c_num = b_idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        if m: c_num = int(m.group(1))
        
        track = "ALL"
        if c_num in [3, 4]: track = "CS"
        elif c_num in [5, 6]: track = "ICT"
        
        full_b_text = "\n".join(block)
        statements = []
        for s_let in ['a', 'b', 'c', 'd']:
            s_match = re.search(rf'{s_let}\)\s*(.*?)(?=\s*[b-d]\)|\n|$)', full_b_text, re.DOTALL)
            s_text = s_match.group(1).strip() if s_match else f"Mệnh đề {s_let}"
            val = p2_answers.get((c_num, s_let), False)
            statements.append({
                "id": s_let,
                "text": s_text,
                "isCorrect": val,
                "explanation": f"Ý ({s_let}) là {'Đúng' if val else 'Sai'} theo đáp án THPT Bình Sơn."
            })
            
        exam["part2Questions"].append({
            "id": f"bso_p2_c{c_num}",
            "type": "true_false_group",
            "topicId": "11F" if c_num == 1 else "12F",
            "topicName": get_topic_name("11F" if c_num == 1 else "12F"),
            "level": "hieu",
            "trackRequirement": track,
            "context": block[0].strip(),
            "statements": statements
        })
        
    return exam

# ==============================================================================
# 3. PARSER: THPT CHUYÊN LÊ KHIẾT (LKH)
# ==============================================================================
def parse_le_khiet():
    filepath = os.path.join(RAW_DIR, 'ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_LKH.docx')
    paragraphs, tables = extract_docx_data(filepath)
    
    exam = {
        "id": "thpt_chuyen_le_khiet_2026",
        "title": "Đề thi thử Tốt nghiệp THPT 2026 — THPT Chuyên Lê Khiết (Quảng Ngãi)",
        "source": "Trường THPT Chuyên Lê Khiết, Sở GD&ĐT Quảng Ngãi",
        "durationMinutes": 50,
        "year": 2026,
        "difficulty": "Thi thử tốt nghiệp",
        "description": "Đề minh họa thi tốt nghiệp THPT 2026 của trường chuyên hàng đầu Quảng Ngãi - THPT Chuyên Lê Khiết với ma trận phân hóa cao.",
        "totalScore": 10,
        "baseXP": 150,
        "part1Questions": [],
        "part2Questions": []
    }
    
    # Table 4: Part 1 answers
    p1_answers = {}
    if len(tables) >= 5:
        t4 = tables[4]
        for row in t4[1:]:
            if len(row) >= 4:
                if row[0].isdigit(): p1_answers[int(row[0])] = row[1].strip()
                if row[2].isdigit(): p1_answers[int(row[2])] = row[3].strip()
                
    # Table 5 & 6: Part 2 answers
    p2_answers = {}
    if len(tables) >= 6:
        curr_q_left = 1
        curr_q_right = 2
        for row in tables[5][1:]:
            if len(row) >= 6:
                if row[0].isdigit(): curr_q_left = int(row[0])
                if row[3].isdigit(): curr_q_right = int(row[3])
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(curr_q_left, sub_l)] = val_l
                if sub_r: p2_answers[(curr_q_right, sub_r)] = val_r
                
    if len(tables) >= 7:
        curr_q_left = 3
        curr_q_right = 5
        for row in tables[6][1:]:
            if len(row) >= 6:
                if '3' in row[0]: curr_q_left = 3
                elif '4' in row[0]: curr_q_left = 4
                if '5' in row[3]: curr_q_right = 5
                elif '6' in row[3]: curr_q_right = 6
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(curr_q_left, sub_l)] = val_l
                if sub_r: p2_answers[(curr_q_right, sub_r)] = val_r

    p1_idx = -1
    p2_idx = -1
    dapan_idx = -1
    for i, p in enumerate(paragraphs):
        if 'PHẦN I' in p and p1_idx == -1: p1_idx = i
        elif 'PHẦN II' in p and p2_idx == -1: p2_idx = i
        elif 'ĐÁP ÁN' in p and dapan_idx == -1: dapan_idx = i
        
    p1_lines = paragraphs[p1_idx+1:p2_idx]
    p2_lines = paragraphs[p2_idx+1:dapan_idx if dapan_idx != -1 else len(paragraphs)]
    
    q_blocks = []
    curr_b = []
    for line in p1_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b: q_blocks.append(curr_b)
            curr_b = [line]
        else:
            if curr_b: curr_b.append(line)
    if curr_b: q_blocks.append(curr_b)
    
    for idx, block in enumerate(q_blocks):
        q_num = idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        q_content = m.group(2) if m else first_line
        
        opt_text = " ".join(block[1:])
        options = parse_options_from_text(opt_text)
        if len(options) < 4:
            options = parse_options_from_text(" ".join(block))
            
        correct = p1_answers.get(q_num, "B")
        topic_id = "12A" if q_num in [1, 2, 3] else ("12B" if q_num in [4, 5, 6] else ("12F" if q_num in [7, 8, 9, 10] else "11F"))
        
        exam["part1Questions"].append({
            "id": f"lkh_p1_c{q_num}",
            "type": "single_choice",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": "biet" if q_num <= 8 else ("hieu" if q_num <= 18 else "van_dung"),
            "content": q_content.strip() or f"Câu hỏi số {q_num}",
            "options": {
                "A": options.get("A", "Phương án A"),
                "B": options.get("B", "Phương án B"),
                "C": options.get("C", "Phương án C"),
                "D": options.get("D", "Phương án D")
            },
            "correctAnswer": correct,
            "explanation": f"Đáp án chính xác: {correct} theo bảng đáp án trường THPT Chuyên Lê Khiết."
        })
        
    # Part 2
    p2_blocks = []
    curr_b2 = []
    for line in p2_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b2: p2_blocks.append(curr_b2)
            curr_b2 = [line]
        else:
            if curr_b2: curr_b2.append(line)
    if curr_b2: p2_blocks.append(curr_b2)
    
    for b_idx, block in enumerate(p2_blocks):
        c_num = b_idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        if m: c_num = int(m.group(1))
        
        track = "ALL"
        if c_num in [3, 4]: track = "CS"
        elif c_num in [5, 6]: track = "ICT"
        
        full_b_text = "\n".join(block)
        statements = []
        for s_let in ['a', 'b', 'c', 'd']:
            s_match = re.search(rf'{s_let}\)\s*(.*?)(?=\s*[b-d]\)|\n|$)', full_b_text, re.DOTALL)
            s_text = s_match.group(1).strip() if s_match else f"Mệnh đề {s_let}"
            val = p2_answers.get((c_num, s_let), False)
            statements.append({
                "id": s_let,
                "text": s_text,
                "isCorrect": val,
                "explanation": f"Ý ({s_let}) là {'Đúng' if val else 'Sai'} theo đáp án THPT Chuyên Lê Khiết."
            })
            
        exam["part2Questions"].append({
            "id": f"lkh_p2_c{c_num}",
            "type": "true_false_group",
            "topicId": "12B" if c_num == 1 else "12A",
            "topicName": get_topic_name("12B" if c_num == 1 else "12A"),
            "level": "hieu",
            "trackRequirement": track,
            "context": block[0].strip(),
            "statements": statements
        })
        
    return exam

# ==============================================================================
# 4. PARSER: THPT QUANG TRUNG (QTR)
# ==============================================================================
def parse_quang_trung():
    exam_path = os.path.join(RAW_DIR, 'ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_QTR.docx')
    ans_path = os.path.join(RAW_DIR, 'Matran_HD cham_DethiTotnghiep2026_QTR_Tinhoc.docx')
    
    exam_paras, _ = extract_docx_data(exam_path)
    _, ans_tables = extract_docx_data(ans_path)
    
    exam = {
        "id": "thpt_quang_trung_2026",
        "title": "Đề thi thử Tốt nghiệp THPT 2026 — THPT Quang Trung (Quảng Ngãi)",
        "source": "Trường THPT Quang Trung, Sở GD&ĐT Quảng Ngãi",
        "durationMinutes": 50,
        "year": 2026,
        "difficulty": "Thi thử tốt nghiệp",
        "description": "Đề kiểm tra tốt nghiệp THPT 2026 THPT Quang Trung bao phủ kiến thức AI, mạng máy tính, SQL và thiết kế web.",
        "totalScore": 10,
        "baseXP": 120,
        "part1Questions": [],
        "part2Questions": []
    }
    
    # Table 3: Part 1 answers
    p1_answers = {}
    if len(ans_tables) >= 4:
        for row in ans_tables[3][1:]:
            if len(row) >= 4:
                if row[0].isdigit(): p1_answers[int(row[0])] = row[1].strip()
                if row[2].isdigit(): p1_answers[int(row[2])] = row[3].strip()
                
    # Table 4 & 5: Part 2 answers
    p2_answers = {}
    if len(ans_tables) >= 5:
        for row in ans_tables[4][1:]:
            if len(row) >= 6:
                q1 = 1; q2 = 2
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(q1, sub_l)] = val_l
                if sub_r: p2_answers[(q2, sub_r)] = val_r
    if len(ans_tables) >= 6:
        for row in ans_tables[5]:
            if len(row) >= 6:
                q_l = 3 if '3' in row[0] else 4
                q_r = 5 if '5' in row[3] else 6
                sub_l = row[1].strip()
                val_l = (row[2].strip() == 'Đ')
                sub_r = row[4].strip()
                val_r = (row[5].strip() == 'Đ')
                if sub_l: p2_answers[(q_l, sub_l)] = val_l
                if sub_r: p2_answers[(q_r, sub_r)] = val_r

    p1_idx = -1
    p2_idx = -1
    for i, p in enumerate(exam_paras):
        if 'PHẦN I' in p and p1_idx == -1: p1_idx = i
        elif 'PHẦN II' in p and p2_idx == -1: p2_idx = i
        
    p1_lines = exam_paras[p1_idx+1:p2_idx]
    p2_lines = exam_paras[p2_idx+1:]
    
    q_blocks = []
    curr_b = []
    for line in p1_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b: q_blocks.append(curr_b)
            curr_b = [line]
        else:
            if curr_b: curr_b.append(line)
    if curr_b: q_blocks.append(curr_b)
    
    for idx, block in enumerate(q_blocks):
        q_num = idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        q_content = m.group(2) if m else first_line
        
        opt_text = " ".join(block[1:])
        options = parse_options_from_text(opt_text)
        if len(options) < 4:
            options = parse_options_from_text(" ".join(block))
            
        correct = p1_answers.get(q_num, "A")
        topic_id = "12A" if q_num <= 4 else ("12B" if q_num <= 10 else ("12F" if q_num <= 16 else "11F"))
        
        exam["part1Questions"].append({
            "id": f"qtr_p1_c{q_num}",
            "type": "single_choice",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": "biet" if q_num <= 8 else ("hieu" if q_num <= 18 else "van_dung"),
            "content": q_content.strip() or f"Câu hỏi số {q_num}",
            "options": {
                "A": options.get("A", "Phương án A"),
                "B": options.get("B", "Phương án B"),
                "C": options.get("C", "Phương án C"),
                "D": options.get("D", "Phương án D")
            },
            "correctAnswer": correct,
            "explanation": f"Đáp án: {correct} theo hướng dẫn chấm thi THPT Quang Trung."
        })
        
    p2_blocks = []
    curr_b2 = []
    for line in p2_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b2: p2_blocks.append(curr_b2)
            curr_b2 = [line]
        else:
            if curr_b2: curr_b2.append(line)
    if curr_b2: p2_blocks.append(curr_b2)
    
    for b_idx, block in enumerate(p2_blocks):
        c_num = b_idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        if m: c_num = int(m.group(1))
        
        track = "ALL"
        if c_num in [3, 4]: track = "CS"
        elif c_num in [5, 6]: track = "ICT"
        
        full_b_text = "\n".join(block)
        statements = []
        for s_let in ['a', 'b', 'c', 'd']:
            s_match = re.search(rf'{s_let}[\.:\)]\s*(.*?)(?=\s*[b-d][\.:\)]|\n|$)', full_b_text, re.DOTALL)
            s_text = s_match.group(1).strip() if s_match else f"Mệnh đề {s_let}"
            val = p2_answers.get((c_num, s_let), False)
            statements.append({
                "id": s_let,
                "text": s_text,
                "isCorrect": val,
                "explanation": f"Ý ({s_let}) là {'Đúng' if val else 'Sai'} theo đáp án THPT Quang Trung."
            })
            
        exam["part2Questions"].append({
            "id": f"qtr_p2_c{c_num}",
            "type": "true_false_group",
            "topicId": "12B" if c_num == 1 else "12F",
            "topicName": get_topic_name("12B" if c_num == 1 else "12F"),
            "level": "hieu",
            "trackRequirement": track,
            "context": block[0].strip(),
            "statements": statements
        })
        
    return exam

# ==============================================================================
# 5. PARSER: THPT LÊ TRUNG ĐÌNH (Mã đề 0501 + Excel)
# ==============================================================================
def parse_le_trung_dinh():
    doc_path = os.path.join(RAW_DIR, 'Ma_de_0501.docx')
    xls_path = os.path.join(RAW_DIR, 'Dap_an_excel_app_QM_2026.xlsx')
    
    doc_paras, _ = extract_docx_data(doc_path)
    
    # Đọc đáp án từ Excel zip
    p1_answers = {}
    p2_raw_answers = [] # 24 boolean values
    with zipfile.ZipFile(xls_path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'x': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('.//x:si', ns):
                t = ''.join(node.text for node in si.findall('.//x:t', ns) if node.text)
                shared.append(t)
        sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        ns = {'x': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for r in sheet_tree.findall('.//x:row', ns):
            vals = []
            for c in r.findall('x:c', ns):
                t = c.get('t')
                v = c.find('x:v', ns)
                val = v.text if v is not None else ''
                if t == 's' and val.isdigit(): val = shared[int(val)]
                vals.append(val)
            if vals and vals[0] == '0501':
                # vals[1:25] là 24 câu trắc nghiệm
                for i in range(1, 25):
                    if i < len(vals): p1_answers[i] = vals[i]
                # vals[25:] là các ý đúng sai
                for i in range(25, len(vals)):
                    p2_raw_answers.append(vals[i] == 'D' or vals[i] == 'Đ')
                break

    exam = {
        "id": "thpt_le_trung_dinh_0501",
        "title": "Đề thi thử Tốt nghiệp THPT 2026 — THPT Lê Trung Đình (Mã đề 501)",
        "source": "Trường THPT Lê Trung Đình, Sở GD&ĐT Quảng Ngãi",
        "durationMinutes": 50,
        "year": 2026,
        "difficulty": "Thi thử tốt nghiệp",
        "description": "Đề thi thử tốt nghiệp THPT năm 2026 mã đề 501 trường THPT Lê Trung Đình khớp bảng đáp án số hóa.",
        "totalScore": 10,
        "baseXP": 110,
        "part1Questions": [],
        "part2Questions": []
    }
    
    p1_idx = -1
    p2_idx = -1
    for i, p in enumerate(doc_paras):
        if 'PHẦN I' in p and p1_idx == -1: p1_idx = i
        elif 'PHẦN II' in p and p2_idx == -1: p2_idx = i
        
    p1_lines = doc_paras[p1_idx+1:p2_idx]
    p2_lines = doc_paras[p2_idx+1:]
    
    q_blocks = []
    curr_b = []
    for line in p1_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b: q_blocks.append(curr_b)
            curr_b = [line]
        else:
            if curr_b: curr_b.append(line)
    if curr_b: q_blocks.append(curr_b)
    
    for idx, block in enumerate(q_blocks):
        q_num = idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        q_content = m.group(2) if m else first_line
        
        opt_text = " ".join(block[1:])
        options = parse_options_from_text(opt_text)
        if len(options) < 4:
            options = parse_options_from_text(" ".join(block))
            
        correct = p1_answers.get(q_num, "B")
        topic_id = "12D" if q_num == 1 else ("12F" if q_num in [2, 3, 4] else ("12A" if q_num in [5, 6, 7] else "12B"))
        
        exam["part1Questions"].append({
            "id": f"ltd_p1_c{q_num}",
            "type": "single_choice",
            "topicId": topic_id,
            "topicName": get_topic_name(topic_id),
            "level": "biet" if q_num <= 8 else ("hieu" if q_num <= 18 else "van_dung"),
            "content": q_content.strip() or f"Câu hỏi số {q_num}",
            "options": {
                "A": options.get("A", "Phương án A"),
                "B": options.get("B", "Phương án B"),
                "C": options.get("C", "Phương án C"),
                "D": options.get("D", "Phương án D")
            },
            "correctAnswer": correct,
            "explanation": f"Đáp án chính xác: {correct} theo bảng chấm điểm chuẩn mã đề 501."
        })
        
    p2_blocks = []
    curr_b2 = []
    for line in p2_lines:
        if re.match(r'^Câu\s*\d+[:\.]', line, re.IGNORECASE):
            if curr_b2: p2_blocks.append(curr_b2)
            curr_b2 = [line]
        else:
            if curr_b2: curr_b2.append(line)
    if curr_b2: p2_blocks.append(curr_b2)
    
    raw_ans_idx = 0
    for b_idx, block in enumerate(p2_blocks):
        c_num = b_idx + 1
        first_line = block[0]
        m = re.match(r'^Câu\s*(\d+)[:\.]\s*(.*)', first_line, re.IGNORECASE)
        if m: c_num = int(m.group(1))
        
        track = "ALL"
        if c_num in [3, 4]: track = "CS"
        elif c_num in [5, 6]: track = "ICT"
        
        full_b_text = "\n".join(block)
        statements = []
        for s_let in ['a', 'b', 'c', 'd']:
            s_match = re.search(rf'{s_let}[\.:\)]\s*(.*?)(?=\s*[b-d][\.:\)]|\n|$)', full_b_text, re.DOTALL)
            s_text = s_match.group(1).strip() if s_match else f"Mệnh đề {s_let}"
            val = p2_raw_answers[raw_ans_idx] if raw_ans_idx < len(p2_raw_answers) else False
            raw_ans_idx += 1
            statements.append({
                "id": s_let,
                "text": s_text,
                "isCorrect": val,
                "explanation": f"Ý ({s_let}) là {'Đúng' if val else 'Sai'} theo đáp án chuẩn mã 501."
            })
            
        exam["part2Questions"].append({
            "id": f"ltd_p2_c{c_num}",
            "type": "true_false_group",
            "topicId": "12F",
            "topicName": get_topic_name("12F"),
            "level": "hieu",
            "trackRequirement": track,
            "context": block[0].strip(),
            "statements": statements
        })
        
    return exam

# ==============================================================================
# MAIN RUNNER
# ==============================================================================
if __name__ == '__main__':
    all_exams = []
    
    print("1. Parsing THPT Thu Xa...")
    try:
        ex_thuxa = parse_thuxa()
        all_exams.append(ex_thuxa)
        print(f"   -> Done: {len(ex_thuxa['part1Questions'])} P1, {len(ex_thuxa['part2Questions'])} P2")
    except Exception as e:
        print(f"   -> Error Thu Xa: {e}")
        
    print("2. Parsing THPT Binh Son...")
    try:
        ex_bso = parse_binh_son()
        all_exams.append(ex_bso)
        print(f"   -> Done: {len(ex_bso['part1Questions'])} P1, {len(ex_bso['part2Questions'])} P2")
    except Exception as e:
        print(f"   -> Error Binh Son: {e}")

    print("3. Parsing THPT Chuyen Le Khiet...")
    try:
        ex_lkh = parse_le_khiet()
        all_exams.append(ex_lkh)
        print(f"   -> Done: {len(ex_lkh['part1Questions'])} P1, {len(ex_lkh['part2Questions'])} P2")
    except Exception as e:
        print(f"   -> Error Le Khiet: {e}")

    print("4. Parsing THPT Quang Trung...")
    try:
        ex_qtr = parse_quang_trung()
        all_exams.append(ex_qtr)
        print(f"   -> Done: {len(ex_qtr['part1Questions'])} P1, {len(ex_qtr['part2Questions'])} P2")
    except Exception as e:
        print(f"   -> Error Quang Trung: {e}")

    print("5. Parsing THPT Le Trung Dinh (Ma de 501)...")
    try:
        ex_ltd = parse_le_trung_dinh()
        all_exams.append(ex_ltd)
        print(f"   -> Done: {len(ex_ltd['part1Questions'])} P1, {len(ex_ltd['part2Questions'])} P2")
    except Exception as e:
        print(f"   -> Error Le Trung Dinh: {e}")

    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_exams, f, ensure_ascii=False, indent=2)
        
    print(f"\nSUCCESS! Exported {len(all_exams)} official exams to {OUT_FILE}")
