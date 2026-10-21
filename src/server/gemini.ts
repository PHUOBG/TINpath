import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// Initialize the GoogleGenAI instance with server-side environment key and required telemetry header
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * 1. AI Tutor / Study Assistant with High Thinking Mode (gemini-4-argon)
 * Used for deep algorithm tracing, SQL analysis, and complex queries
 */
export async function generateHighThinkingExplanation(params: {
  topicTitle: string;
  userQuestion: string;
  studentContext?: string;
}) {
  const ai = getGeminiClient();
  const systemInstruction = `Bạn là Trợ lý Gia sư AI Tin học cao cấp chuyên trách chương trình Tin học THPT 2018 của nền tảng TinPath (Việt Nam).
Mục tiêu của bạn: Giải thích cặn kẽ, sư phạm, chuẩn xác theo sách giáo khoa và chương trình GDPT 2018 của Bộ Giáo dục & Đào tạo.
Phong cách trả lời:
- Luôn giải thích bản chất tư duy từng bước (Step-by-step reasoning).
- Đưa ví dụ minh họa trực quan, đoạn mã code chuẩn (Python/SQL/HTML/CSS).
- Nếu phát hiện học sinh nhầm lẫn khái niệm (như nhầm IPv4 với IPv6, Switch với Hub, Học có giám sát với Không giám sát), hãy chỉ ra rõ nguyên nhân sai lầm thường gặp.
- Dùng tiếng Việt chuẩn mực, động viên học sinh ôn thi tốt nghiệp THPT đạt điểm cao.`;

  const prompt = `Chủ đề học tập: ${params.topicTitle}
${params.studentContext ? `Bối cảnh học sinh: ${params.studentContext}` : ''}
Câu hỏi / Thắc mắc của học sinh:
${params.userQuestion}`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-argon',
    contents: prompt,
    config: {
      systemInstruction,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    },
  });

  return {
    text: response.text || 'Không có phản hồi từ mô hình.',
    modelUsed: 'gemini-4-argon (Thinking Level: HIGH)',
  };
}

/**
 * 2. Search-Grounded AI Query (gemini-3.8-flash with googleSearch)
 * Used to fetch up-to-date exam schedules, official Ministry of Education regulations, and news
 */
export async function searchGroundedQuery(query: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: `Cung cấp thông tin chính xác, cập nhật nhất về kỳ thi tốt nghiệp THPT và môn Tin học GDPT 2018 theo truy vấn sau:\n${query}`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: 'Bạn là chuyên viên tra cứu thông tin kỳ thi tốt nghiệp THPT môn Tin học. Trả lời cô đọng, khách quan, trích dẫn nguồn tìm kiếm Google nếu có.',
    },
  });

  const searchSources: string[] = [];
  const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks)) {
    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        searchSources.push(`${chunk.web.title || 'Nguồn tin'}: ${chunk.web.uri}`);
      }
    }
  }

  return {
    text: response.text || '',
    searchSources,
    modelUsed: 'gemini-3.8-flash (Google Search Grounding)',
  };
}

/**
 * 3. Fast Flash Tutor (gemini-3.1-flash-lite)
 * Used for fast response tasks: instant hints during exams, quick flashcard summary
 */
export async function generateFastHint(questionContent: string, currentOptions: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: `Hãy gợi ý một manh mối tư duy ngắn gọn (dưới 60 từ) để giúp học sinh giải câu trắc nghiệm Tin học THPT sau mà KHÔNG tiết lộ trực tiếp đáp án A/B/C/D:\nCâu hỏi: ${questionContent}\nCác lựa chọn:\n${currentOptions}`,
    config: {
      systemInstruction: 'Bạn là trợ lý gợi ý nhanh trong phòng thi Tin học. Đưa ra gợi ý tư duy ngắn, súc tích, không đưa thẳng đáp án.',
    },
  });

  return {
    hint: response.text || '',
    modelUsed: 'gemini-3.1-flash-lite',
  };
}

/**
 * 4. Adaptive Learning Plan Generator (gemini-3.8-flash)
 */
export async function generateAdaptiveStudyPlan(params: {
  studentName: string;
  grade: string;
  track: string;
  targetScore: number;
  dailyStudyMinutes: number;
  diagnosticScore?: number;
  weakTopics: string[];
  daysRemaining: number;
}) {
  const ai = getGeminiClient();
  const prompt = `Hãy thiết kế lộ trình học tập cá nhân hóa 7 ngày cho học sinh:
- Tên học sinh: ${params.studentName}
- Lớp: ${params.grade} | Định hướng thi: ${params.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
- Mục tiêu điểm thi tốt nghiệp: ${params.targetScore}/10
- Thời gian học mỗi ngày: ${params.dailyStudyMinutes} phút
- Điểm đánh giá đầu vào: ${params.diagnosticScore ?? 6.5}/10
- Các chủ đề cần cải thiện: ${params.weakTopics.length > 0 ? params.weakTopics.join(', ') : 'Chưa xác định, cần củng cố toàn diện'}
- Số ngày còn lại đến kỳ thi: ${params.daysRemaining} ngày

Yêu cầu trả về dạng JSON phân tích chi tiết gồm:
1. assessmentSummary: Nhận xét tổng quan về năng lực hiện tại
2. targetStrategy: Chiến thuật đạt mục tiêu điểm số
3. dailyRoadmap: Danh sách 7 ngày học tập, mỗi ngày gồm:
   - day: số thứ tự ngày (1 đến 7)
   - topicCode: mã chủ đề (12A, 12B, 12F, 11F, 11F_CS, 12E_ICT, 10_PYTHON)
   - topicTitle: tên chủ đề
   - keyTask: nhiệm vụ chính
   - minutes: thời gian ước tính (phút)
   - focusQuestionType: dạng câu hỏi trọng tâm (Lý thuyết, Đọc code, Bài tập SQL, Đề thi thử)`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'Bạn là chuyên gia cố vấn học tập môn Tin học THPT. Luôn trả về định dạng JSON hợp lệ.',
    },
  });

  return {
    rawJson: response.text || '{}',
    modelUsed: 'gemini-3.8-flash',
  };
}

/**
 * 4b. Diagnostic Competency Analysis Generator (gemini-3.8-flash)
 */
export async function generateDiagnosticAnalysis(params: {
  studentName: string;
  grade: string;
  track: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  topicBreakdown: Array<{
    topicId: string;
    topicName: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  wrongQuestions: Array<{
    id: string;
    topicName: string;
    content: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>;
}) {
  const ai = getGeminiClient();
  const prompt = `Bạn là chuyên gia khảo thí và cố vấn sư phạm Tin học THPT (Chương trình GDPT 2018).
Hãy phân tích kết quả bài thi đánh giá năng lực đầu vào của học sinh:
- Tên học sinh: ${params.studentName}
- Lớp: ${params.grade} | Định hướng ôn thi: ${params.track === 'CS' ? 'Khoa học máy tính (CS)' : 'Tin học ứng dụng (ICT)'}
- Điểm đánh giá: ${params.score}/10 (${params.correctCount}/${params.totalQuestions} câu đúng)
- Kết quả theo từng chủ đề kiến thức:
${params.topicBreakdown.map(t => `  + ${t.topicName} (${t.topicId}): ${t.correct}/${t.total} (${t.percentage}%)`).join('\n')}
- Các câu hỏi làm sai:
${params.wrongQuestions.length > 0 
  ? params.wrongQuestions.map((w, idx) => `  ${idx + 1}. [Chủ đề ${w.topicName}] ${w.content}\n     - Học sinh chọn: ${w.userAnswer} | Đáp án đúng: ${w.correctAnswer}\n     - Giải thích: ${w.explanation}`).join('\n')
  : '  Học sinh làm đúng 100% tất cả các câu hỏi.'}

Hãy xuất ra định dạng JSON chuẩn (RFC 8259) với cấu trúc:
{
  "overallAssessment": "Nhận xét tổng quan đánh giá năng lực, thái độ học tập và nền tảng kiến thức (2-3 câu ngắn gọn, truyền động lực)",
  "levelRanking": "Xếp loại (Xuất sắc | Giỏi | Khá | Trung bình khá | Cần củng cố nền tảng)",
  "strengths": [
    "Điểm mạnh cụ thể 1 (ghi rõ mảng kiến thức nắm chắc)",
    "Điểm mạnh cụ thể 2"
  ],
  "weaknesses": [
    "Lỗ hổng kiến thức 1 (chỉ rõ vì sao sai, khái niệm cần củng cố lại)",
    "Lỗ hổng kiến thức 2"
  ],
  "cognitiveLevels": {
    "know": { "percentage": number, "evaluation": "Nhận xét mức độ Biết" },
    "understand": { "percentage": number, "evaluation": "Nhận xét mức độ Hiểu" },
    "apply": { "percentage": number, "evaluation": "Nhận xét mức độ Vận dụng" }
  },
  "pedagogicalAdvice": "Lời khuyên sư phạm chiến lược giúp học sinh bứt phá điểm số trong thời gian tới",
  "recommendedWeakTopics": ["Mã chủ đề yếu nhất cần ưu tiên học trước, ví dụ: 12B, 11F"]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'Bạn là chuyên gia sư phạm và khảo thí môn Tin học THPT. Luôn trả về JSON hợp lệ.',
    },
  });

  return {
    rawJson: response.text || '{}',
    modelUsed: 'gemini-3.8-flash',
  };
}

/**
 * 5. High-Quality Educational Diagram & Flashcard Image Generation
 * Uses gemini-3-pro-image (or nano banana 2.1) with configurable resolution 1K, 2K, 4K
 */
export async function generateEducationalImage(params: {
  topicTitle: string;
  description: string;
  resolution?: '1K' | '2K' | '4K';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}) {
  const ai = getGeminiClient();
  const resolution = params.resolution || '1K';
  const aspectRatio = params.aspectRatio || '16:9';

  const prompt = `Educational visual graphic for Vietnamese High School Informatics subject (GDPT 2018): ${params.topicTitle}. Description: ${params.description}. Clean vector diagram aesthetic, pedagogical infographic layout, crystal clear resolution, modern educational technology illustration.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution,
      },
    },
  });

  let imageUrl: string | null = null;
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    imageUrl,
    prompt,
    resolution,
    aspectRatio,
    modelUsed: 'gemini-3-pro-image',
  };
}

/**
 * 6. Veo Video Generation (veo-3.1-fast-generate-preview or lite)
 */
export async function startVeoVideoGeneration(params: {
  prompt: string;
  aspectRatio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const ai = getGeminiClient();
  const aspectRatio = params.aspectRatio || '16:9';
  const resolution = params.resolution || '720p';

  const configPayload: any = {
    numberOfVideos: 1,
    resolution: resolution,
    aspectRatio: aspectRatio,
  };

  const requestOptions: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: params.prompt,
    config: configPayload,
  };

  if (params.imageBase64) {
    requestOptions.image = {
      imageBytes: params.imageBase64,
      mimeType: params.imageMimeType || 'image/png',
    };
  }

  const operation = await (ai.models as any).generateVideos(requestOptions);
  return {
    operationName: operation.name,
    modelUsed: 'veo-3.1-fast-generate-preview',
  };
}

/**
 * 7. Video Content Understanding & Analysis (gemini-4-argon)
 */
export async function analyzeVideoContent(params: {
  videoBase64: string;
  mimeType: string;
  userPrompt: string;
}) {
  const ai = getGeminiClient();
  const videoPart = {
    inlineData: {
      data: params.videoBase64,
      mimeType: params.mimeType || 'video/mp4',
    },
  };

  const textPart = {
    text: `Phân tích video bài giảng / mô phỏng Tin học sau: ${params.userPrompt}\nTrích xuất các ý chính, khái niệm khoa học máy tính được giải thích và tóm tắt kiến thức ôn tập.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-4-argon',
    contents: {
      parts: [videoPart, textPart],
    },
    config: {
      systemInstruction: 'Bạn là chuyên gia phân tích video học liệu Tin học THPT GDPT 2018 bằng mô hình Gemini 4 Argon.',
    },
  });

  return {
    analysis: response.text || '',
    modelUsed: 'gemini-4-argon (Multimodal Video Analysis)',
  };
}

/**
 * 8. Text Embedding (text-embedding-004) — Dùng cho RAG Vector Search
 * Client gọi /api/gemini/embed để lấy vector embedding của câu hỏi/tài liệu
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getGeminiClient();

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: {
      taskType: 'RETRIEVAL_QUERY',
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || embedding.length === 0) {
    throw new Error('Không thể tạo embedding từ mô hình gemini-embedding-001');
  }

  return embedding;
}

/**
 * 9. RAG-Augmented AI Tutor — Trả lời câu hỏi với ngữ cảnh SGK thật
 * Nhận context SGK từ pgvector search → Gemini Flash trả lời chính xác
 */
export async function generateRagTutorResponse(params: {
  topicTitle: string;
  userQuestion: string;
  studentContext?: string;
  sgkContext: string; // Các đoạn tài liệu SGK liên quan từ Supabase pgvector
}) {
  const ai = getGeminiClient();

  const hasContext = params.sgkContext && params.sgkContext.trim().length > 0;

  const systemInstruction = `Bạn là Gia sư AI Tin học chuyên trách chương trình GDPT 2018 của nền tảng TinPath (Việt Nam).
Nhiệm vụ: Giải thích chi tiết, chính xác theo đúng sách giáo khoa và chương trình Bộ GD&ĐT.
Phong cách: Từng bước rõ ràng, ví dụ thực tế, code Python/SQL chuẩn, động viên học sinh.
${hasContext ? 'QUAN TRỌNG: Chỉ trả lời dựa trên tài liệu SGK đã được cung cấp trong ngữ cảnh bên dưới. Trích dẫn rõ nguồn sách khi giải thích.' : ''}`;

  const contextSection = hasContext
    ? `\n\n📚 TÀI LIỆU SGK THAM KHẢO:\n${params.sgkContext}\n\n---`
    : '';

  const prompt = `Chủ đề học tập: ${params.topicTitle}
${params.studentContext ? `Bối cảnh học sinh: ${params.studentContext}` : ''}${contextSection}

Câu hỏi học sinh:
${params.userQuestion}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return {
    text: response.text || 'Không có phản hồi từ mô hình.',
    modelUsed: hasContext
      ? 'Gemini Flash + RAG (SGK Tin học 12 GDPT 2018)'
      : 'Gemini Flash (không có tài liệu RAG)',
  };
}

