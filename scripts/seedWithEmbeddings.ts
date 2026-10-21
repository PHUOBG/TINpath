/**
 * seedWithEmbeddings.ts
 * Tự động tính toán vector embedding 768 chiều cho toàn bộ tri thức SGK Tin học 12
 * và cập nhật trực tiếp vào Supabase pgvector!
 */
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env');
  process.exit(1);
}

if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
  console.error('❌ Thiếu GEMINI_API_KEY hợp lệ trong file .env. Vui lòng dán khóa Gemini vào .env để tạo embedding.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

async function embedChunk(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || embedding.length === 0) {
    throw new Error('Không nhận được vector embedding từ text-embedding-004');
  }
  return embedding;
}

async function main() {
  console.log('🚀 Bắt đầu quét các đoạn tri thức SGK cần tạo vector embedding...');

  // Lấy các bản ghi chưa có embedding
  const { data: chunks, error } = await supabase
    .from('knowledge_chunks')
    .select('id, chunk_title, content')
    .is('embedding', null);

  if (error) {
    console.error('❌ Lỗi truy vấn Supabase:', error.message);
    process.exit(1);
  }

  if (!chunks || chunks.length === 0) {
    console.log('✅ Tất cả các đoạn tri thức trong database đã có vector embedding rồi!');
    return;
  }

  console.log(`📌 Tìm thấy ${chunks.length} đoạn tri thức cần tạo vector embedding...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`[${i + 1}/${chunks.length}] Đang tạo vector cho: "${chunk.chunk_title}"...`);

    try {
      const textToEmbed = `${chunk.chunk_title}\n${chunk.content}`;
      const vector = await embedChunk(textToEmbed);

      const { error: updateError } = await supabase
        .from('knowledge_chunks')
        .update({ embedding: vector })
        .eq('id', chunk.id);

      if (updateError) {
        console.error(`   ⚠️ Lỗi cập nhật ID ${chunk.id}:`, updateError.message);
      } else {
        console.log(`   ✅ Đã cập nhật vector 768 chiều thành công!`);
      }
    } catch (err: any) {
      console.error(`   ❌ Lỗi tạo embedding:`, err.message);
    }

    // Tránh chạm rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n🎉 Hoàn thành 100% nạp Vector Embeddings cho AI RAG TinPath!');
}

main().catch(console.error);
