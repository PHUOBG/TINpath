/**
 * compute_embeddings_sql.ts
 * Tính toán vector embedding cho 12 đoạn tri thức và chèn trực tiếp câu lệnh SQL UPDATE
 * vào supabase/seed_real_exams.sql.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

async function embedChunk(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || embedding.length === 0) {
    throw new Error('Không nhận được vector embedding từ gemini-embedding-001');
  }
  return embedding;
}

async function main() {
  console.log('🚀 Lấy danh sách 12 knowledge_chunks từ Supabase...');
  const { data: chunks, error } = await supabase
    .from('knowledge_chunks')
    .select('id, chunk_title, content');

  if (error || !chunks) {
    console.error('Lỗi lấy chunks:', error);
    process.exit(1);
  }

  console.log(`📌 Tìm thấy ${chunks.length} chunks. Đang tính vector embedding bằng Gemini...`);

  const sqlStatements: string[] = [
    "\n-- ==============================================================================",
    "-- CẬP NHẬT VECTOR EMBEDDINGS 768 CHIỀU CHO AI RAG (TÍNH TỪ GOOGLE GEMINI)",
    "-- ==============================================================================",
    "DROP POLICY IF EXISTS \"Public all knowledge_chunks\" ON public.knowledge_chunks;",
    "CREATE POLICY \"Public all knowledge_chunks\" ON public.knowledge_chunks FOR ALL USING (true);",
    ""
  ];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`[${i + 1}/${chunks.length}] Đang embed: "${chunk.chunk_title}"...`);
    const textToEmbed = `${chunk.chunk_title}\n${chunk.content}`;
    const vec = await embedChunk(textToEmbed);
    const vecStr = `ARRAY[${vec.join(',')}]::vector(768)`;
    sqlStatements.push(`UPDATE public.knowledge_chunks SET embedding = ${vecStr} WHERE id = '${chunk.id}';`);
    await new Promise(r => setTimeout(r, 600)); // tránh rate limit
  }

  const sqlFilePath = path.join(__dirname, '..', 'supabase', 'seed_real_exams.sql');
  const currentSql = fs.readFileSync(sqlFilePath, 'utf8');
  fs.writeFileSync(sqlFilePath, currentSql + "\n" + sqlStatements.join("\n"), 'utf8');

  console.log(`\n🎉 Đã chèn 12 câu lệnh cập nhật vector embedding vào ${sqlFilePath}!`);
}

main().catch(console.error);
