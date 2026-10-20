-- ==============================================================================
-- TINPATH EDTECH PLATFORM - SUPABASE DATABASE SCHEMA & VECTOR EXTENSION
-- ==============================================================================

-- 1. BẬT CÁC EXTENSION CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Phục vụ AI RAG Vector Search

-- ==============================================================================
-- 2. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES) - Liên kết với Supabase Auth
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    province TEXT DEFAULT 'Quảng Ngãi',
    district TEXT,
    school_id TEXT,
    school_name TEXT,
    grade TEXT DEFAULT '12' CHECK (grade IN ('10', '11', '12')),
    track TEXT DEFAULT 'CS' CHECK (track IN ('CS', 'ICT')),
    target_score NUMERIC(3, 1) DEFAULT 8.5,
    daily_study_minutes INT DEFAULT 45,
    xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    completed_daily_today BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    diagnostic_score NUMERIC(3, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. BẢNG TRƯỜNG THPT (DANH MỤC 34 TRƯỜNG QUẢNG NGÃI & MỞ RỘNG)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. BẢNG CHUYÊN ĐỀ & BÀI HỌC (TOPICS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY, -- '12A', '12B', '12F_CS', '11F', etc.
    name TEXT NOT NULL,
    track TEXT DEFAULT 'ALL' CHECK (track IN ('ALL', 'CS', 'ICT')),
    description TEXT,
    grade TEXT DEFAULT '12',
    total_questions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. BẢNG ĐỀ THI CHUẨN HÓA (EXAMS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT DEFAULT 'Bộ Giáo Dục & Đào Tạo',
    duration_minutes INT DEFAULT 50,
    year INT DEFAULT 2025,
    difficulty TEXT DEFAULT 'Thi thử tốt nghiệp',
    description TEXT,
    base_xp INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. BẢNG NGÂN HÀNG CÂU HỎI (QUESTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES public.exams(id) ON DELETE SET NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    topic_name TEXT,
    type TEXT NOT NULL CHECK (type IN ('single_choice', 'true_false_group')),
    level TEXT NOT NULL CHECK (level IN ('biet', 'hieu', 'van_dung')),
    track_requirement TEXT DEFAULT 'ALL' CHECK (track_requirement IN ('ALL', 'CS', 'ICT')),
    content TEXT NOT NULL,
    options JSONB, -- { "A": "...", "B": "...", "C": "...", "D": "..." }
    correct_answer TEXT, -- 'A', 'B', 'C', 'D' cho trắc nghiệm 1 lựa chọn
    explanation TEXT,
    code_snippet TEXT,
    statements JSONB, -- Mảng 4 câu Đúng/Sai cho dạng thức Phần 2
    table_data JSONB, -- Dữ liệu bảng (nếu có)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. BẢNG LỊCH SỬ THI THỬ & LÀM BÀI (EXAM_ATTEMPTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    exam_title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track TEXT NOT NULL CHECK (track IN ('CS', 'ICT')),
    started_at TIMESTAMPTZ NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_seconds INT NOT NULL,
    total_score NUMERIC(4, 2) NOT NULL,
    part1_score NUMERIC(4, 2) NOT NULL,
    part2_score NUMERIC(4, 2) NOT NULL,
    correct_part1_count INT NOT NULL,
    part2_breakdown JSONB,
    answers JSONB NOT NULL,
    xp_earned INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. BẢNG THỬ THÁCH 10 CÂU MỖI NGÀY (DAILY_CHALLENGES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    score NUMERIC(4, 2) NOT NULL,
    total_questions INT DEFAULT 10,
    correct_count INT NOT NULL,
    xp_awarded INT DEFAULT 30,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_date)
);

-- ==============================================================================
-- 9. BẢNG NHẬT KÝ ĐIỂM THƯỞNG (XP_TRANSACTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. BẢNG LỚP HỌC & BÀI TẬP CỦA GIÁO VIÊN (CLASSROOMS & ASSIGNMENTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.classrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    grade TEXT DEFAULT '12',
    school_name TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    student_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classroom_members (
    classroom_id TEXT NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (classroom_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    classroom_id TEXT NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ NOT NULL,
    question_count INT DEFAULT 15,
    allow_retake BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(4, 2) NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. BẢNG BÌNH LUẬN & THẢO LUẬN ĐỀ THI (EXAM_COMMENTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exam_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_school TEXT,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. BẢNG TRI THỨC DÀNH CHO AI RAG (KNOWLEDGE_CHUNKS VỚI PGVECTOR)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    book_source TEXT, -- 'SGK Tin 12 Kết Nối Tri Thức', 'SGK Cánh Diều', 'Quy chế Bộ GD&ĐT'
    chapter TEXT,
    page_number INT,
    chunk_title TEXT NOT NULL,
    content TEXT NOT NULL, -- Đoạn lý thuyết SGK chi tiết
    embedding vector(768), -- Vector embedding 768 chiều từ text-embedding-004 của Google
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hàm tìm kiếm ngữ cảnh SGK tương đồng nhất (Semantic Vector Search) cho AI
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 4
)
RETURNS TABLE (
    id UUID,
    topic_id TEXT,
    book_source TEXT,
    chunk_title TEXT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.topic_id,
        kc.book_source,
        kc.chunk_title,
        kc.content,
        1 - (kc.embedding <=> query_embedding) AS similarity
    FROM public.knowledge_chunks kc
    WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- ==============================================================================
-- 13. TỰ ĐỘNG TẠO PROFILE KHI NGƯỜI DÙNG ĐĂNG KÝ AUTH SUPABASE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        display_name,
        avatar_url,
        role
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 14. BẢO MẬT ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể xem danh mục trường, chủ đề, đề thi, câu hỏi và tài liệu SGK
DROP POLICY IF EXISTS "Public read schools" ON public.schools;
CREATE POLICY "Public read schools" ON public.schools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read topics" ON public.topics;
CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read exams" ON public.exams;
CREATE POLICY "Public read exams" ON public.exams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read questions" ON public.questions;
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Public read knowledge_chunks" ON public.knowledge_chunks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read comments" ON public.exam_comments;
CREATE POLICY "Public read comments" ON public.exam_comments FOR SELECT USING (true);

-- Profiles: Người dùng xem được hồ sơ công khai, tự sửa hồ sơ của mình
DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;
CREATE POLICY "Allow select profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update own profile" ON public.profiles;
CREATE POLICY "Allow update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Exam Attempts: Xem lịch sử của mình, nộp bài mới của mình
DROP POLICY IF EXISTS "Users can read own attempts" ON public.exam_attempts;
CREATE POLICY "Users can read own attempts" ON public.exam_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.exam_attempts;
CREATE POLICY "Users can insert own attempts" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments: Đăng bình luận
DROP POLICY IF EXISTS "Users can insert comments" ON public.exam_comments;
CREATE POLICY "Users can insert comments" ON public.exam_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

