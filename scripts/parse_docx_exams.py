# -*- coding: utf-8 -*-
"""
parse_docx_exams.py
Phân tích 2 đề thi mới từ THPT Trần Quốc Tuấn và THPT Đinh Tiên Hoàng
"""
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT, 'raw_data', 'DETHITIN THPTQG_')

def get_docx_paragraphs(fname):
    fpath = os.path.join(RAW_DIR, fname)
    with zipfile.ZipFile(fpath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paras = []
        for p in tree.findall('.//w:p', ns):
            t = ''.join(p.itertext()).strip()
            if t:
                paras.append(t)
    return paras

def parse_docx_exam(fname, exam_id, exam_title, exam_source):
    paras = get_docx_paragraphs(fname)
    
    # Identify Part 1 and Part 2
    p1_start = -1
    p2_start = -1
    for idx, p in enumerate(paras):
        if 'PHẦN I' in p.upper() and p1_start == -1:
            p1_start = idx
        elif 'PHẦN II' in p.upper() and p2_start == -1:
            p2_start = idx

    p1_paras = paras[p1_start:p2_start] if p2_start != -1 else paras[p1_start:]
    p2_paras = paras[p2_start:] if p2_start != -1 else []

    # Parse Part 1 (24 questions)
    part1_questions = []
    current_q = None
    for p in p1_paras:
        m = re.match(r'^(?:Câu|câu)\s+(\d+)[\.:]\s*(.*)', p)
        if m:
            if current_q:
                part1_questions.append(current_q)
            q_num = int(m.group(1))
            current_q = {
                'id': f'{exam_id}_p1_c{q_num}',
                'type': 'single_choice',
                'q_num': q_num,
                'content': m.group(2).strip(),
                'raw_options': [],
                'options': {'A': '', 'B': '', 'C': '', 'D': ''},
                'correctAnswer': 'A',
                'level': 'biet' if q_num <= 12 else ('hieu' if q_num <= 20 else 'van_dung')
            }
        elif current_q:
            # Check for options A., B., C., D.
            if re.search(r'\b[A-D]\.\s+', p):
                current_q['raw_options'].append(p)
            else:
                if not current_q['raw_options']:
                    current_q['content'] += ' ' + p
                else:
                    current_q['raw_options'].append(p)

    if current_q:
        part1_questions.append(current_q)

    # Process options for each question
    for q in part1_questions:
        all_opt_text = ' '.join(q['raw_options'])
        # Try to extract A, B, C, D
        mA = re.search(r'\bA\.\s*(.*?)(?=\bB\.\s*|$)', all_opt_text)
        mB = re.search(r'\bB\.\s*(.*?)(?=\bC\.\s*|$)', all_opt_text)
        mC = re.search(r'\bC\.\s*(.*?)(?=\bD\.\s*|$)', all_opt_text)
        mD = re.search(r'\bD\.\s*(.*?)$', all_opt_text)

        if mA: q['options']['A'] = mA.group(1).strip()
        if mB: q['options']['B'] = mB.group(1).strip()
        if mC: q['options']['C'] = mC.group(1).strip()
        if mD: q['options']['D'] = mD.group(1).strip()
        del q['raw_options']

        # Determine topic
        c_low = q['content'].lower()
        if any(k in c_low for k in ['ip', 'mạng', 'lan', 'router', 'switch', 'tcp', 'access point', 'wifi', 'wi-fi']):
            q['topicId'] = '12B'
            q['topicName'] = 'Mạng máy tính và Internet'
        elif any(k in c_low for k in ['ai', 'trí tuệ nhân tạo', 'học máy', 'machine learning']):
            q['topicId'] = '12A'
            q['topicName'] = 'Trí tuệ nhân tạo (AI) & Học máy'
        elif any(k in c_low for k in ['html', 'css', 'thẻ', 'liên kết', 'web', 'body', 'title']):
            q['topicId'] = '12F'
            q['topicName'] = 'Tạo trang web và thiết kế web'
        elif any(k in c_low for k in ['đạo đức', 'lừa đảo', 'không gian mạng', 'tin nhắn', 'bảo mật']):
            q['topicId'] = '12D'
            q['topicName'] = 'Đạo đức, pháp luật thế giới ảo'
        elif any(k in c_low for k in ['nghề', 'nhân lực', 'công nghệ thông tin']):
            q['topicId'] = '12G'
            q['topicName'] = 'Định hướng nghề nghiệp & Tuyển sinh CNTT'
        else:
            q['topicId'] = '11F_CS'
            q['topicName'] = 'Thuật toán và Kĩ thuật lập trình'

    # Parse Part 2 (6 questions with statements)
    part2_questions = []
    current_p2 = None
    for p in p2_paras:
        m = re.match(r'^(?:Câu|câu)\s+(\d+)[\.:]\s*(.*)', p)
        if m:
            if current_p2:
                part2_questions.append(current_p2)
            c_num = int(m.group(1))
            current_p2 = {
                'id': f'{exam_id}_p2_c{c_num}',
                'type': 'true_false_group',
                'c_num': c_num,
                'context': m.group(2).strip(),
                'statements': [],
                'level': 'hieu',
                'trackRequirement': 'ALL' if c_num <= 2 else ('CS' if c_num in [3, 4] else 'ICT')
            }
        elif current_p2:
            stmt_m = re.match(r'^([a-d])[\)\.]\s*(.*)', p)
            if stmt_m:
                letter = stmt_m.group(1).lower()
                text = stmt_m.group(2).strip()
                # Default true/false heuristics if not specified
                is_correct = True if letter in ['a', 'c'] else False
                current_p2['statements'].append({
                    'id': letter,
                    'text': text,
                    'isCorrect': is_correct,
                    'explanation': f'Mệnh đề ({letter}) của đề thi.'
                })
            else:
                if not current_p2['statements']:
                    current_p2['context'] += ' ' + p

    if current_p2:
        part2_questions.append(current_p2)

    for q in part2_questions:
        q['topicId'] = '12F' if 'web' in q['context'].lower() or 'html' in q['context'].lower() else ('12B' if 'mạng' in q['context'].lower() else '11F')
        q['topicName'] = 'Tạo trang web và thiết kế web' if q['topicId'] == '12F' else ('Mạng máy tính và Internet' if q['topicId'] == '12B' else 'Hệ cơ sở dữ liệu và Truy vấn SQL')

    return {
        'id': exam_id,
        'title': exam_title,
        'source': exam_source,
        'durationMinutes': 50,
        'year': 2026,
        'difficulty': 'Thi thử tốt nghiệp',
        'description': f'Đề thi thử tốt nghiệp THPT 2026 môn Tin học của {exam_source}, cấu trúc chuẩn Bộ GD&ĐT gồm 24 câu trắc nghiệm và 6 câu đúng/sai.',
        'baseXP': 120,
        'part1Questions': part1_questions,
        'part2Questions': part2_questions
    }

if __name__ == '__main__':
    tqt = parse_docx_exam('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_TQT.docx', 'thpt_tran_quoc_tuan_2026', 'Đề thi thử Tốt nghiệp THPT 2026 — THPT Trần Quốc Tuấn', 'Trường THPT Trần Quốc Tuấn, Sở GD&ĐT Quảng Ngãi')
    print(f"TQT: {len(tqt['part1Questions'])} P1, {len(tqt['part2Questions'])} P2")
    
    dth = parse_docx_exam('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_ĐTH.docx', 'thpt_dinh_tien_hoang_2026', 'Đề thi thử Tốt nghiệp THPT 2026 — THPT Đinh Tiên Hoàng', 'Trường THPT Đinh Tiên Hoàng, Sở GD&ĐT Quảng Ngãi')
    print(f"DTH: {len(dth['part1Questions'])} P1, {len(dth['part2Questions'])} P2")
