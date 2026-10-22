# -*- coding: utf-8 -*-
import sys, io, os
from test_parser import parse_docx_paragraphs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

filepath = os.path.join('raw_data', 'DETHITIN THPTQG_', 'DAP AN _ DE MINH HOA TN THPT 2026 _THPT THU XÀ.docx')
paras = parse_docx_paragraphs(filepath)

p2_idx = 0
for i, p in enumerate(paras):
    if 'PHẦN II' in p:
        p2_idx = i
        break

print(f"PHẦN II starts at line {p2_idx}")
for i in range(p2_idx, min(p2_idx + 80, len(paras))):
    print(f"[{i}] {paras[i]}")
