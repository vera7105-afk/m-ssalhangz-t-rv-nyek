-- =========================================================================
-- TÜNDÉRSZÉP ILONA KASTÉLYA - NYELVTAN JÁTÉK SUPABASE ADATBÁZIS SÉMA
-- =========================================================================
-- Másold be ezt az SQL kódot a Supabase vezérlőpultján a:
-- "SQL Editor" -> "New query" ablakba, majd kattints a "RUN" gombra!
-- =========================================================================

-- 1. FELHASZNÁLÓI PROFILOK (Diákok és Tanárok)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'diak' CHECK (role IN ('diak', 'tanar', 'admin')),
  grade TEXT DEFAULT '5. osztály',
  total_score INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  spelling_score INTEGER NOT NULL DEFAULT 0,
  oddoneout_score INTEGER NOT NULL DEFAULT 0,
  bonus_score INTEGER NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EGYES FELADATOK ÉS KÉRDÉSEK PONTSZÁMAI (Részletes feladat napló)
CREATE TABLE IF NOT EXISTS public.task_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  user_role TEXT DEFAULT 'diak',
  question_id INTEGER NOT NULL,
  task_part TEXT NOT NULL CHECK (task_part IN ('quiz', 'spelling', 'oddoneout')),
  castle_floor INTEGER NOT NULL CHECK (castle_floor IN (1, 2, 3)),
  question_title TEXT,
  selected_option TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BÓNUSZ PRÓBÁK PONTSZÁMAI (Emeleti bónusz kihívások)
CREATE TABLE IF NOT EXISTS public.bonus_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  bonus_id INTEGER NOT NULL,
  castle_floor INTEGER NOT NULL,
  title TEXT,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TELJES JÁTÉK MENETEK (Eredmények a kastély bejárása után)
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  spelling_score INTEGER NOT NULL DEFAULT 0,
  oddoneout_score INTEGER NOT NULL DEFAULT 0,
  bonus_score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  completed_bonus_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXEK A GYORS LEKÉRDEZÉSEKHEZ
CREATE INDEX IF NOT EXISTS idx_task_scores_username ON public.task_scores (username);
CREATE INDEX IF NOT EXISTS idx_task_scores_question ON public.task_scores (question_id);
CREATE INDEX IF NOT EXISTS idx_bonus_scores_username ON public.bonus_scores (username);
CREATE INDEX IF NOT EXISTS idx_profiles_total_score ON public.profiles (total_score DESC);

-- =========================================================================
-- BIZTONSÁGI SZABÁLYOK (Row Level Security - RLS)
-- Engedélyezzük az olvasást, mentést és frissítést az anonim API kulccsal!
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles házirendek
CREATE POLICY "Mindenki olvashatja a profilokat" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Mindenki hozhat létre profilt" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Mindenki frissítheti a saját pontszámát" 
  ON public.profiles FOR UPDATE 
  USING (true);

-- Task scores házirendek
CREATE POLICY "Mindenki olvashatja a feladat pontszámokat" 
  ON public.task_scores FOR SELECT 
  USING (true);

CREATE POLICY "Mindenki rögzíthet feladat pontszámot" 
  ON public.task_scores FOR INSERT 
  WITH CHECK (true);

-- Bonus scores házirendek
CREATE POLICY "Mindenki olvashatja a bónusz pontszámokat" 
  ON public.bonus_scores FOR SELECT 
  USING (true);

CREATE POLICY "Mindenki rögzíthet bónusz pontszámot" 
  ON public.bonus_scores FOR INSERT 
  WITH CHECK (true);

-- Game sessions házirendek
CREATE POLICY "Mindenki olvashatja a játékmeneteket" 
  ON public.game_sessions FOR SELECT 
  USING (true);

CREATE POLICY "Mindenki rögzíthet játékmenetet" 
  ON public.game_sessions FOR INSERT 
  WITH CHECK (true);

-- =========================================================================
-- DIÁK RANGSOR NÉZET (Leaderboard / Tanári összesítő)
-- =========================================================================
CREATE OR REPLACE VIEW public.student_leaderboard AS
SELECT 
  username,
  role,
  total_score,
  quiz_score,
  spelling_score,
  oddoneout_score,
  bonus_score,
  tasks_completed,
  last_active,
  RANK() OVER (ORDER BY total_score DESC) as rank
FROM public.profiles
WHERE role = 'diak'
ORDER BY total_score DESC;
