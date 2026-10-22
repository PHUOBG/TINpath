# -*- coding: utf-8 -*-
import sys, io, os, zipfile, xml.etree.ElementTree as ET
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

raw_dir = os.path.join('raw_data', 'DETHITIN THPTQG_')

def check_answers(filename):
    print("=" * 60)
    print("FILE:", filename)
    fpath = os.path.join(raw_dir, filename)
    with zipfile.ZipFile(fpath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Check tables
        tables = tree.findall('.//w:tbl', ns)
        for t_idx, tbl in enumerate(tables):
            rows = tbl.findall('.//w:tr', ns)
            row_data = []
            for r in rows:
                cells = [''.join(n.text for n in c.findall('.//w:t', ns) if n.text).strip() for c in r.findall('.//w:tc', ns)]
                row_data.append(cells)
            
            # Print if looks like answers
            flat = ' '.join(' '.join(r) for r in row_data)
            if 'Đáp án' in flat or 'ĐÁP ÁN' in flat or any(x in flat for x in ['1.', 'Câu 1', 'Đ/S']):
                print(f"Table {t_idx} ({len(rows)} rows):")
                for r in row_data[:15]:
                    print("  ", r)

check_answers('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_BSO.docx')
check_answers('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_LKH.docx')
check_answers('Matran_HD cham_DethiTotnghiep2026_QTR_Tinhoc.docx')
