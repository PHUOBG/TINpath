# -*- coding: utf-8 -*-
import sys
import io
import os
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

fpath = os.path.join('raw_data', 'DETHITIN THPTQG_', 'DAP AN _ DE MINH HOA TN THPT 2026 _THPT THU XÀ.docx')
with zipfile.ZipFile(fpath) as z:
    tree = ET.fromstring(z.read('word/document.xml'))
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    for p in tree.findall('.//w:p', ns):
        text = ''.join(n.text for n in p.findall('.//w:t', ns) if n.text).strip()
        if text:
            print(text)
