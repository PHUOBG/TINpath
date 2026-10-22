# -*- coding: utf-8 -*-
import sys
import io
import os
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

raw_dir = os.path.join(os.path.dirname(__file__), '..', 'raw_data', 'DETHITIN THPTQG_')

for fname in os.listdir(raw_dir):
    if not fname.endswith('.docx'):
        continue
    fpath = os.path.join(raw_dir, fname)
    with zipfile.ZipFile(fpath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        tables = tree.findall('.//w:tbl', ns)
        table_info = []
        for t_idx, tbl in enumerate(tables):
            rows = tbl.findall('.//w:tr', ns)
            first_row_cells = []
            if rows:
                first_row_cells = [''.join(n.text for n in c.findall('.//w:t', ns) if n.text).strip() for c in rows[0].findall('.//w:tc', ns)]
            table_info.append(f"Tbl{t_idx}({len(rows)}r, cols={len(first_row_cells)}: {first_row_cells[:3]})")
        print(f"{fname}: {len(tables)} tables -> {', '.join(table_info[:6])}")
