/**
 * supabaseAuthService.ts
 * Quản lý đăng nhập / đăng ký bằng Supabase Auth
 * Hỗ trợ: Google OAuth + Email/Password
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile } from '../types';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

// ---------------------------------------------------------------------------
// ĐĂNG NHẬP BẰNG GOOGLE (OAuth)
// ---------------------------------------------------------------------------
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase chưa cấu hình — đăng nhập Google không hoạt động ở chế độ local.');
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        // Yêu cầu đăng nhập lại để lấy avatar và tên mới nhất
        prompt: 'select_account',
      },
    },
  });

  if (error) throw new Error(`Đăng nhập Google thất bại: ${error.message}`);
}

// ---------------------------------------------------------------------------
// ĐĂNG KÝ BẰNG EMAIL + MẬT KHẨU
// ---------------------------------------------------------------------------
export async function signUpWithEmail(params: {
  email: string;
  password: string;
  displayName: string;
  role?: 'student' | 'teacher';
}): Promise<{ user: AuthUser | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase chưa được cấu hình.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.displayName,
        role: params.role || 'student',
      },
    },
  });

  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Không thể tạo tài khoản.' };

  return {
    user: {
      id: data.user.id,
      email: data.user.email || '',
      displayName: params.displayName,
    },
    error: null,
  };
}

// ---------------------------------------------------------------------------
// ĐĂNG NHẬP BẰNG EMAIL + MẬT KHẨU
// ---------------------------------------------------------------------------
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase chưa được cấu hình.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Đăng nhập thất bại.' };

  return {
    user: {
      id: data.user.id,
      email: data.user.email || '',
      displayName: data.user.user_metadata?.full_name || email.split('@')[0],
      avatarUrl: data.user.user_metadata?.avatar_url,
    },
    error: null,
  };
}

// ---------------------------------------------------------------------------
// ĐĂNG XUẤT
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}

// ---------------------------------------------------------------------------
// LẤY SESSION HIỆN TẠI (dùng khi app load lại trang)
// ---------------------------------------------------------------------------
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.full_name || user.user_metadata?.name || user.email || '',
    avatarUrl: user.user_metadata?.avatar_url,
  };
}

// ---------------------------------------------------------------------------
// LẮNG NGHE TRẠNG THÁI AUTH (dùng trong React useEffect)
// ---------------------------------------------------------------------------
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  if (!isSupabaseConfigured()) {
    callback(null);
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
          displayName:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email || '',
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        callback(null);
      }
    }
  );

  // Trả về hàm unsubscribe để cleanup trong useEffect
  return () => subscription.unsubscribe();
}
