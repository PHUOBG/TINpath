# -*- coding: utf-8 -*-
import sys, io, os, zipfile, xml.etree.ElementTree as ET
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

fpath = os.path.join('raw_data', 'DETHITIN THPTQG_', 'DAP AN _ DE MINH HOA TN THPT 2026 _THPT THU XÀ.docx')
with zipfile.ZipFile(fpath) as z:
    tree = ET.fromstring(z.read('word/document.xml'))
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    all_p = [''.join(n.text for n in p.findall('.//w:t', ns) if n.text).strip() for p in tree.findall('.//w:p', ns)]
    all_p = [p for p in all_p if p]
    for p in all_p[:35]:
        print(p)
