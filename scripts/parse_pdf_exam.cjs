const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function parsePdfExam(pdfPath, examId, examTitle, examSource) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse(new Uint8Array(dataBuffer));
  await parser.load();
  const textResult = await parser.getText();
  const fullText = typeof textResult === 'string' ? textResult : (textResult.text || '');

  // 1. Extract Answer Key table
  // "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24"
  // "A C C B A C D A C B B C C B A A C B B C D A C B"
  const p1Answers = {};
  const p1Match = fullText.match(/PHẦN I[\s\S]*?1\s+2\s+3\s+4[\s\S]*?\n([A-D\s]{40,80})/);
  if (p1Match) {
    const letters = p1Match[1].trim().split(/\s+/);
    for (let i = 0; i < letters.length && i < 24; i++) {
      p1Answers[i + 1] = letters[i];
    }
  }

  // Part 2 Answer Key table
  // "Câu 1 Câu 2 Câu 3 Câu 4 Câu 5 Câu 6"
  // "a) Đ Đ S Đ S S"
  // "b) S Đ Đ Đ Đ Đ"
  // "c) Đ S Đ S S S"
  // "d) S S Đ Đ S Đ"
  const p2Answers = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
  const p2Lines = ['a', 'b', 'c', 'd'];
  for (const letter of p2Lines) {
    const regex = new RegExp(letter + '\\)\\s+([ĐDS\\s]{10,25})', 'i');
    const m = fullText.match(regex);
    if (m) {
      const vals = m[1].trim().split(/\s+/);
      for (let c = 1; c <= 6 && c <= vals.length; c++) {
        p2Answers[c][letter] = vals[c - 1].toUpperCase() === 'Đ';
      }
    }
  }

  // 2. Extract Explanations
  const loiGiaiIdx = fullText.indexOf('Lời giải');
  const loiGiaiSection = loiGiaiIdx !== -1 ? fullText.substring(loiGiaiIdx) : '';

  // Parse Part 1 Questions from test section (between PHẦN I and PHẦN II)
  const p1Start = fullText.indexOf('PHẦN I');
  const p2Start = fullText.indexOf('PHẦN II');
  const p1Text = fullText.substring(p1Start, p2Start !== -1 ? p2Start : fullText.length);

  const part1Questions = [];
  for (let qNum = 1; qNum <= 24; qNum++) {
    const qMarker = `Câu ${qNum}.`;
    const nextQMarker = qNum < 24 ? `Câu ${qNum + 1}.` : 'PHẦN II';
    const startIdx = p1Text.indexOf(qMarker);
    const endIdx = p1Text.indexOf(nextQMarker, startIdx);
    
    if (startIdx !== -1) {
      const qBlock = p1Text.substring(startIdx + qMarker.length, endIdx !== -1 ? endIdx : p1Text.length).trim();
      
      // Clean page footer noise: "-- X of 15 -- ... Biên soạn..."
      const cleaned = qBlock.replace(/--\s*\d+\s*of\s*\d+\s*--[\s\S]*?(?:tư vấn|phút)/g, '').trim();

      // Extract options A., B., C., D.
      let optA = '', optB = '', optC = '', optD = '';
      let qContent = cleaned;
      
      const optAMatch = cleaned.match(/\bA\.\s+/);
      if (optAMatch) {
        qContent = cleaned.substring(0, optAMatch.index).trim();
        const optText = cleaned.substring(optAMatch.index);
        
        const mB = optText.match(/\bB\.\s+/);
        const mC = optText.match(/\bC\.\s+/);
        const mD = optText.match(/\bD\.\s+/);
        
        if (mB && mC && mD) {
          optA = optText.substring(2, mB.index).trim();
          optB = optText.substring(mB.index + 2, mC.index).trim();
          optC = optText.substring(mC.index + 2, mD.index).trim();
          optD = optText.substring(mD.index + 2).trim();
        }
      }

      // Find explanation in loiGiaiSection
      let explanation = '';
      const explMatch = loiGiaiSection.indexOf(`Câu ${qNum}.`);
      if (explMatch !== -1) {
        const nextExpl = loiGiaiSection.indexOf(`Câu ${qNum + 1}.`, explMatch);
        explanation = loiGiaiSection.substring(explMatch, nextExpl !== -1 ? nextExpl : explMatch + 600)
          .replace(/--\s*\d+\s*of\s*\d+\s*--[\s\S]*?(?:tư vấn|phút)/g, '')
          .trim();
      }

      // Guess topic based on content
      let topicId = '12A';
      let topicName = 'Trí tuệ nhân tạo (AI) & Học máy';
      const cLower = qContent.toLowerCase();
      if (cLower.includes('ip') || cLower.includes('router') || cLower.includes('switch') || cLower.includes('mạng') || cLower.includes('tcp') || cLower.includes('access point')) {
        topicId = '12B';
        topicName = 'Mạng máy tính và Internet';
      } else if (cLower.includes('đạo đức') || cLower.includes('không gian mạng') || cLower.includes('bảo mật') || cLower.includes('lừa đảo') || cLower.includes('chia sẻ')) {
        topicId = '12D';
        topicName = 'Đạo đức, pháp luật thế giới ảo';
      } else if (cLower.includes('html') || cLower.includes('css') || cLower.includes('thẻ') || cLower.includes('trang web')) {
        topicId = '12F';
        topicName = 'Tạo trang web và thiết kế web';
      } else if (cLower.includes('nghề') || cLower.includes('công nghệ thông tin') || cLower.includes('quản trị mạng')) {
        topicId = '12G';
        topicName = 'Định hướng nghề nghiệp & Tuyển sinh CNTT';
      } else if (cLower.includes('python') || cLower.includes('hàm') || cLower.includes('thuật toán')) {
        topicId = '11F_CS';
        topicName = 'Thuật toán và Kĩ thuật lập trình';
      }

      part1Questions.push({
        id: `${examId}_p1_c${qNum}`,
        type: 'single_choice',
        topicId,
        topicName,
        level: qNum <= 12 ? 'biet' : (qNum <= 20 ? 'hieu' : 'van_dung'),
        content: qContent.replace(/\s+/g, ' '),
        options: {
          A: optA.replace(/\s+/g, ' ') || 'Phương án A',
          B: optB.replace(/\s+/g, ' ') || 'Phương án B',
          C: optC.replace(/\s+/g, ' ') || 'Phương án C',
          D: optD.replace(/\s+/g, ' ') || 'Phương án D',
        },
        correctAnswer: p1Answers[qNum] || 'A',
        explanation: explanation || null,
      });
    }
  }

  // Parse Part 2 Questions (6 questions)
  const part2Questions = [];
  const p2Text = fullText.substring(p2Start !== -1 ? p2Start : 0, loiGiaiIdx !== -1 ? loiGiaiIdx : fullText.length);
  
  for (let cNum = 1; cNum <= 6; cNum++) {
    const cMarker = `Câu ${cNum}.`;
    const nextCMarker = cNum < 6 ? `Câu ${cNum + 1}.` : 'ĐÁP ÁN';
    const sIdx = p2Text.indexOf(cMarker);
    const eIdx = p2Text.indexOf(nextCMarker, sIdx);

    if (sIdx !== -1) {
      const block = p2Text.substring(sIdx + cMarker.length, eIdx !== -1 ? eIdx : p2Text.length)
        .replace(/--\s*\d+\s*of\s*\d+\s*--[\s\S]*?(?:tư vấn|phút)/g, '')
        .trim();

      // Split into context and statements a), b), c), d)
      const aIdx = block.indexOf('a)');
      const bIdx = block.indexOf('b)');
      const cIdx = block.indexOf('c)');
      const dIdx = block.indexOf('d)');

      const context = (aIdx !== -1 ? block.substring(0, aIdx) : block).trim().replace(/\s+/g, ' ');
      const textA = aIdx !== -1 && bIdx !== -1 ? block.substring(aIdx + 2, bIdx).trim().replace(/\s+/g, ' ') : '';
      const textB = bIdx !== -1 && cIdx !== -1 ? block.substring(bIdx + 2, cIdx).trim().replace(/\s+/g, ' ') : '';
      const textC = cIdx !== -1 && dIdx !== -1 ? block.substring(cIdx + 2, dIdx).trim().replace(/\s+/g, ' ') : '';
      const textD = dIdx !== -1 ? block.substring(dIdx + 2).trim().replace(/\s+/g, ' ') : '';

      const isA = p2Answers[cNum]?.a ?? true;
      const isB = p2Answers[cNum]?.b ?? false;
      const isC = p2Answers[cNum]?.c ?? true;
      const isD = p2Answers[cNum]?.d ?? false;

      let topicId = '12B';
      let topicName = 'Mạng máy tính và Internet';
      let trackReq = 'ALL';
      if (cNum === 2 || cNum === 6) {
        topicId = '11F';
        topicName = 'Hệ cơ sở dữ liệu và Truy vấn SQL';
      } else if (cNum === 3) {
        topicId = '11F_CS';
        topicName = 'Thuật toán và Kĩ thuật lập trình';
        trackReq = 'CS';
      } else if (cNum === 4) {
        topicId = '12F_CS';
        topicName = 'Khoa học dữ liệu & Học máy nâng cao';
        trackReq = 'CS';
      } else if (cNum === 5) {
        topicId = '12F';
        topicName = 'Tạo trang web và thiết kế web';
        trackReq = 'ICT';
      }

      part2Questions.push({
        id: `${examId}_p2_c${cNum}`,
        type: 'true_false_group',
        topicId,
        topicName,
        level: 'hieu',
        trackRequirement: trackReq,
        context: context || `Tình huống bài tập chuyên đề ${topicName}`,
        statements: [
          { id: 'a', text: textA || 'Mệnh đề a', isCorrect: isA, explanation: `Mệnh đề (a) là ${isA ? 'Đúng' : 'Sai'}.` },
          { id: 'b', text: textB || 'Mệnh đề b', isCorrect: isB, explanation: `Mệnh đề (b) là ${isB ? 'Đúng' : 'Sai'}.` },
          { id: 'c', text: textC || 'Mệnh đề c', isCorrect: isC, explanation: `Mệnh đề (c) là ${isC ? 'Đúng' : 'Sai'}.` },
          { id: 'd', text: textD || 'Mệnh đề d', isCorrect: isD, explanation: `Mệnh đề (d) là ${isD ? 'Đúng' : 'Sai'}.` },
        ]
      });
    }
  }

  return {
    id: examId,
    title: examTitle,
    source: examSource,
    durationMinutes: 50,
    year: 2026,
    difficulty: 'Thi thử tốt nghiệp',
    description: `Bộ đề thi thử tốt nghiệp THPT 2026 môn Tin học chuẩn cấu trúc Bộ GD&ĐT, bao gồm 24 câu trắc nghiệm nhiều lựa chọn và 6 câu đúng/sai kèm đáp án và lời giải chi tiết.`,
    baseXP: 120,
    part1Questions,
    part2Questions,
  };
}

module.exports = { parsePdfExam };
