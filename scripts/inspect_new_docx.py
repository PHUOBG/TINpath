# -*- coding: utf-8 -*-
import sys
import io
import os
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_docx(filename):
    fpath = os.path.join('raw_data', 'DETHITIN THPTQG_', filename)
    with zipfile.ZipFile(fpath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paras = []
        for p in tree.findall('.//w:p', ns):
            text = ''.join(n.text for n in p.findall('.//w:t', ns) if n.text).strip()
            if text:
                paras.append(text)
        print(f"=== {filename} === (Total non-empty paras: {len(paras)})")
        for i, p in enumerate(paras):
            p_lower = p.lower()
            if any(k in p_lower for k in ['đáp án', 'phần ii', 'phần i', 'câu 24', 'hướng dẫn', 'hết', 'bảng đáp án']):
                print(f"  [{i}] {p[:120]}")
        print("\nLast 15 paras:")
        for i, p in enumerate(paras[-15:]):
            print(f"  [End-{15-i}] {p[:120]}")
        print("-" * 50)

check_docx('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_TQT.docx')
check_docx('ĐỀ MINH HỌA THI TN THPT NĂM 2026 - TIN HỌC_ĐTH.docx')
