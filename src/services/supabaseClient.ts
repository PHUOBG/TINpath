import { createClient } from '@supabase/supabase-js';

// Các biến môi trường được đọc từ .env hoặc Vercel Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Chưa cấu hình VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env!\n' +
    'Hệ thống đang hoạt động ở chế độ Local Mockup dự phòng.'
  );
}

// Khởi tạo Supabase client dùng chung trong toàn bộ dự án
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder-project')
  );
};
