# -*- coding: utf-8 -*-
import sys
import io
import os
import glob
import zipfile
import xml.etree.ElementTree as ET

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

raw_dir = os.path.join(os.path.dirname(__file__), '..', 'raw_data', 'DETHITIN THPTQG_')
files = sorted(glob.glob(os.path.join(raw_dir, '*.docx')))

for f in files:
    filename = os.path.basename(f)
    print(f"=== FILE: {filename} ===")
    try:
        with zipfile.ZipFile(f) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find paragraphs
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in tree.findall('.//w:p', namespaces):
                p_text = ''.join(node.text for node in p.findall('.//w:t', namespaces) if node.text)
                if p_text.strip():
                    paragraphs.append(p_text.strip())
            
            print(f"Total paragraphs: {len(paragraphs)}")
            for i, p in enumerate(paragraphs[:15]):
                print(f"  [{i}] {p}")
            print()
    except Exception as e:
        print(f"Error reading {filename}: {e}\n")
