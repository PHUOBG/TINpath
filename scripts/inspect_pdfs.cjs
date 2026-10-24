const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const dir = path.join(__dirname, '..', 'raw_data', 'DETHITIN THPTQG_');
const pdfFiles = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

async function inspect() {
  for (const f of pdfFiles.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}))) {
    const dataBuffer = fs.readFileSync(path.join(dir, f));
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    await parser.load();
    const textResult = await parser.getText();
    const text = typeof textResult === 'string' ? textResult : (textResult.text || '');
    console.log(`=== ${f} === (Length: ${text.length})`);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    console.log('Header:');
    for (let i = 0; i < Math.min(6, lines.length); i++) {
      console.log('  ', lines[i]);
    }
    const hasDapAn = text.includes('ĐÁP ÁN') || text.includes('HƯỚNG DẪN GIẢI') || text.includes('BẢNG ĐÁP ÁN');
    console.log(`Has Answer Key: ${hasDapAn}`);
    console.log();
  }
}
inspect().catch(console.error);
