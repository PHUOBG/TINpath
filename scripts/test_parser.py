# -*- coding: utf-8 -*-
import sys
import io
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def parse_docx_paragraphs(filepath):
    with zipfile.ZipFile(filepath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for p in tree.findall('.//w:p', ns):
            text = ''.join(n.text for n in p.findall('.//w:t', ns) if n.text).strip()
            if text:
                paragraphs.append(text)
        return paragraphs

filepath = os.path.join('raw_data', 'DETHITIN THPTQG_', 'DAP AN _ DE MINH HOA TN THPT 2026 _THPT THU XÀ.docx')
paras = parse_docx_paragraphs(filepath)

for i in range(5, 50):
    if i < len(paras):
        print(f"[{i:02d}] {paras[i]}")
