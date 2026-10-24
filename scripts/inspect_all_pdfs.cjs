const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const dir = path.join(__dirname, '..', 'raw_data', 'DETHITIN THPTQG_');
const pdfFiles = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

async function inspectAllPdfs() {
  for (const f of pdfFiles.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}))) {
    const dataBuffer = fs.readFileSync(path.join(dir, f));
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    await parser.load();
    const textResult = await parser.getText();
    const text = typeof textResult === 'string' ? textResult : (textResult.text || '');
    
    // Search for titles
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const titleLines = lines.slice(0, 10).join(' | ');
    
    // Search for Part I, Part II, and Answer Key
    const hasPart1 = text.includes('PHẦN I') || text.includes('Phần I') || text.includes('Phần 1');
    const hasPart2 = text.includes('PHẦN II') || text.includes('Phần II') || text.includes('Phần 2');
    const hasAnswers = text.includes('ĐÁP ÁN') || text.includes('HƯỚNG DẪN GIẢI') || text.includes('BẢNG ĐÁP ÁN');
    
    console.log(`[${f}] Len: ${text.length} | P1: ${hasPart1} | P2: ${hasPart2} | Ans: ${hasAnswers}`);
    console.log(`   Title: ${titleLines.slice(0, 150)}...`);
  }
}
inspectAllPdfs().catch(console.error);
