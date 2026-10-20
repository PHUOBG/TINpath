/**
 * ragService.ts  — AI RAG (Retrieval-Augmented Generation)
 * Quy trình:
 *   1. Embed câu hỏi của học sinh → vector 768 chiều
 *   2. Tìm đoạn SGK liên quan nhất trong Supabase pgvector
 *   3. Gửi ngữ cảnh SGK + câu hỏi vào Gemini Flash → Trả lời chính xác
 * 
 * Nếu Supabase chưa cấu hình → gọi Gemini Flash trực tiếp không có RAG context
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

// ---------------------------------------------------------------------------
// BƯỚC 1: TẠO VECTOR EMBEDDING CHO CÂU HỎI
// Gọi backend API để dùng text-embedding-004 (server-side để bảo vệ API key)
// ---------------------------------------------------------------------------
async function embedText(text: string): Promise<number[] | null> {
  try {
    const res = await fetch('/api/gemini/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.embedding || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// BƯỚC 2: TÌM KIẾM ĐOẠN SGK LIÊN QUAN NHẤT (Vector Similarity Search)
// ---------------------------------------------------------------------------
interface KnowledgeChunk {
  id: string;
  topicId: string;
  bookSource: string;
  chunkTitle: string;
  content: string;
  similarity: number;
}

async function searchSGKContext(
  queryEmbedding: number[],
  topicId?: string,
  threshold = 0.60,
  maxResults = 4
): Promise<KnowledgeChunk[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: maxResults,
  });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    topicId: row.topic_id,
    bookSource: row.book_source,
    chunkTitle: row.chunk_title,
    content: row.content,
    similarity: row.similarity,
  }));
}

// ---------------------------------------------------------------------------
// BƯỚC 3: HỎI AI VỚI CONTEXT RAG
// ---------------------------------------------------------------------------
export async function askRagTutor(params: {
  topicTitle: string;
  userQuestion: string;
  studentContext?: string;
  topicId?: string;
}): Promise<{ text: string; sourceChunks: { title: string; bookSource: string }[]; modelUsed: string }> {
  
  // Bước 1: Tạo embedding cho câu hỏi
  const embedding = await embedText(params.userQuestion);

  let contextText = '';
  let sourceChunks: { title: string; bookSource: string }[] = [];

  // Bước 2: Tìm kiếm nội dung SGK liên quan
  if (embedding && isSupabaseConfigured()) {
    const chunks = await searchSGKContext(embedding, params.topicId);

    if (chunks.length > 0) {
      contextText = chunks
        .map((c, i) => `[Tài liệu ${i + 1} - ${c.bookSource} - ${c.chunkTitle}]\n${c.content}`)
        .join('\n\n---\n\n');

      sourceChunks = chunks.map(c => ({
        title: c.chunkTitle,
        bookSource: c.bookSource,
      }));
    }
  }

  // Bước 3: Gửi câu hỏi + context SGK cho Gemini (qua API backend)
  const res = await fetch('/api/gemini/rag-tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topicTitle: params.topicTitle,
      userQuestion: params.userQuestion,
      studentContext: params.studentContext,
      sgkContext: contextText,  // <-- Đây là nội dung SGK thật tìm được
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const result = await res.json();

  return {
    text: result.text || 'Không có phản hồi từ AI.',
    sourceChunks,
    modelUsed: result.modelUsed || 'Gemini Flash (RAG)',
  };
}

// ---------------------------------------------------------------------------
// ADMIN: NẠP TÀI LIỆU SGK VÀO KNOWLEDGE BASE (Dùng một lần để seed dữ liệu)
// ---------------------------------------------------------------------------
export async function ingestKnowledgeChunk(chunk: {
  topicId: string;
  bookSource: string;
  chapter: string;
  chunkTitle: string;
  content: string;
  pageNumber?: number;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase chưa cấu hình — không thể nạp tài liệu vào knowledge base.');
    return false;
  }

  // Lấy embedding từ backend
  const embedding = await embedText(chunk.content);
  if (!embedding) {
    console.error('Không thể tạo embedding cho đoạn tài liệu:', chunk.chunkTitle);
    return false;
  }

  const { error } = await supabase.from('knowledge_chunks').insert({
    topic_id: chunk.topicId || null,
    book_source: chunk.bookSource,
    chapter: chunk.chapter,
    chunk_title: chunk.chunkTitle,
    content: chunk.content,
    embedding,
    page_number: chunk.pageNumber || null,
  });

  if (error) {
    console.error('Lỗi nạp tài liệu:', error.message);
    return false;
  }

  return true;
}
