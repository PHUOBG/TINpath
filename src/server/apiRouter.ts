import { IncomingMessage, ServerResponse } from 'http';
import {
  generateHighThinkingExplanation,
  searchGroundedQuery,
  generateFastHint,
  generateAdaptiveStudyPlan,
  generateDiagnosticAnalysis,
  generateEducationalImage,
  startVeoVideoGeneration,
  analyzeVideoContent,
} from './gemini';

// Helper to parse JSON body from incoming stream
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return true;
  }

  if (!url.startsWith('/api/')) {
    return false;
  }

  try {
    // 1. Health check
    if (url === '/api/health') {
      sendJson(res, 200, {
        status: 'ok',
        appName: 'TinPath',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
      return true;
    }

    // 2. High Thinking AI Tutor (Gemini 4 Argon)
    if (url === '/api/gemini/thinking' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateHighThinkingExplanation({
        topicTitle: body.topicTitle || 'Tổng quan Tin học THPT',
        userQuestion: body.userQuestion || '',
        studentContext: body.studentContext,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 3. Search Grounding (Gemini 3.8 Flash with googleSearch)
    if (url === '/api/gemini/search' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await searchGroundedQuery(body.query || 'Cấu trúc đề thi tốt nghiệp THPT môn Tin học 2025');
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 4. Fast Question Hint (Gemini 3.1 Flash-Lite)
    if (url === '/api/gemini/hint' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateFastHint(body.questionContent || '', body.options || '');
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5. Adaptive Study Plan
    if (url === '/api/gemini/study-plan' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateAdaptiveStudyPlan({
        studentName: body.studentName || 'Học sinh TinPath',
        grade: body.grade || '12',
        track: body.track || 'CS',
        targetScore: body.targetScore || 8.5,
        dailyStudyMinutes: body.dailyStudyMinutes || 45,
        diagnosticScore: body.diagnosticScore,
        weakTopics: body.weakTopics || [],
        daysRemaining: body.daysRemaining || 75,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5b. Diagnostic Competency Analysis (Gemini 3.8 Flash)
    if (url === '/api/gemini/diagnostic-analysis' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateDiagnosticAnalysis({
        studentName: body.studentName || 'Học sinh TinPath',
        grade: body.grade || '12',
        track: body.track || 'CS',
        score: body.score ?? 7.0,
        totalQuestions: body.totalQuestions ?? 10,
        correctCount: body.correctCount ?? 7,
        topicBreakdown: body.topicBreakdown || [],
        wrongQuestions: body.wrongQuestions || [],
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 6. Educational Image Generation (1K, 2K, 4K)
    if (url === '/api/gemini/generate-image' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateEducationalImage({
        topicTitle: body.topicTitle || 'Kiến trúc máy tính và mạng',
        description: body.description || 'Infographic minh họa các tầng mạng',
        resolution: body.resolution || '1K',
        aspectRatio: body.aspectRatio || '16:9',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 7. Veo Video Generation
    if (url === '/api/gemini/generate-video' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await startVeoVideoGeneration({
        prompt: body.prompt || 'Mô phỏng 3D dòng dữ liệu truyền qua bộ chuyển mạch Switch và Router',
        aspectRatio: body.aspectRatio || '16:9',
        resolution: body.resolution || '720p',
        imageBase64: body.imageBase64,
        imageMimeType: body.imageMimeType,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 8. Video Understanding & Analysis
    if (url === '/api/gemini/analyze-video' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.videoBase64) {
        sendJson(res, 400, { success: false, error: 'Thiếu dữ liệu video base64' });
        return true;
      }
      const result = await analyzeVideoContent({
        videoBase64: body.videoBase64,
        mimeType: body.mimeType || 'video/mp4',
        userPrompt: body.userPrompt || 'Tóm tắt các khái niệm tin học được đề cập trong video',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 9. Server-side XP Verification Engine (Rule 9: Module tính điểm tập trung, chống gian lận)
    if (url === '/api/xp/verify' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { type, score, correctCount, totalQuestions, currentStreak } = body;

      let awardedXP = 0;
      let reason = '';

      if (type === 'daily_challenge') {
        // Daily challenge rule: 10 questions. Base 30 XP + 5 XP per correct question
        const validCorrect = Math.min(Math.max(correctCount || 0, 0), 10);
        awardedXP = 30 + validCorrect * 5;
        reason = `Hoàn thành thử thách 10 câu hằng ngày (${validCorrect}/10 câu đúng)`;
      } else if (type === 'exam') {
        // Exam completion rule: score based on 10-point scale
        const validScore = Math.min(Math.max(score || 0, 0), 10);
        awardedXP = Math.round(validScore * 10); // e.g. 8.5 điểm = 85 XP
        if (validScore >= 9.0) {
          awardedXP += 25; // Bonus for distinction
          reason = `Đạt điểm xuất sắc (${validScore}đ) bài thi thử tốt nghiệp`;
        } else {
          reason = `Hoàn thành bài thi thử (${validScore}đ)`;
        }
      } else if (type === 'streak_milestone') {
        // Streak milestones: 7 days (+50 XP), 14 days (+100 XP), 30 days (+200 XP)
        if (currentStreak === 7) awardedXP = 50;
        else if (currentStreak === 14) awardedXP = 100;
        else if (currentStreak === 30) awardedXP = 200;
        reason = `Thưởng mốc chuỗi học ${currentStreak} ngày liên tiếp`;
      }

      sendJson(res, 200, {
        success: true,
        awardedXP,
        reason,
        verifiedAt: new Date().toISOString(),
      });
      return true;
    }

    sendJson(res, 404, { error: 'Không tìm thấy API endpoint' });
    return true;
  } catch (error: any) {
    console.error('API Error:', error);
    sendJson(res, 500, {
      success: false,
      error: error.message || 'Lỗi xử lý server nội bộ',
    });
    return true;
  }
}
