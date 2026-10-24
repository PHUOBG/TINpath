# -*- coding: utf-8 -*-
import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from parse_docx_exams import parse_docx_exam

tqt = parse_docx_exam('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_TQT.docx', 'thpt_tran_quoc_tuan_2026', 'Đề thi thử Tốt nghiệp THPT 2026 — THPT Trần Quốc Tuấn (Quảng Ngãi)', 'Trường THPT Trần Quốc Tuấn, Sở GD&ĐT Quảng Ngãi')
dth = parse_docx_exam('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_ĐTH.docx', 'thpt_dinh_tien_hoang_2026', 'Đề thi thử Tốt nghiệp THPT 2026 — THPT Đinh Tiên Hoàng (Quảng Ngãi)', 'Trường THPT Đinh Tiên Hoàng, Sở GD&ĐT Quảng Ngãi')

out_path = os.path.join(ROOT, 'scripts', 'temp_docx_exams.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump([tqt, dth], f, ensure_ascii=False, indent=2)

print(f"Exported 2 docx exams to {out_path}")
