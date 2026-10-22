# -*- coding: utf-8 -*-
import sys
import io
import os
import glob
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

raw_dir = os.path.join(os.path.dirname(__file__), '..', 'raw_data', 'DETHITIN THPTQG_')

def examine_file(filepath):
    print("=" * 60)
    print("EXAMINING:", os.path.basename(filepath))
    with zipfile.ZipFile(filepath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Check paragraphs
        all_p = []
        for p in tree.findall('.//w:p', ns):
            text = ''.join(node.text for node in p.findall('.//w:t', ns) if node.text).strip()
            if text:
                all_p.append(text)
                
        print(f"Total non-empty paragraphs: {len(all_p)}")
        
        # Look for sections / headings
        for i, text in enumerate(all_p):
            t_lower = text.lower()
            if any(k in t_lower for k in ['hướng dẫn chấm', 'đáp án', 'phần i', 'phần ii', 'phần 1', 'phần 2', 'bảng đáp án']):
                print(f"  Line {i}: {text[:100]}")
                # print 3 following lines
                for j in range(1, 4):
                    if i + j < len(all_p):
                        print(f"    + {all_p[i+j][:100]}")

for f in sorted(glob.glob(os.path.join(raw_dir, '*.docx'))):
    examine_file(f)
