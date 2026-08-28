import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, SupabaseTaskScoreRecord, StudentScoreSummary, UserAnswer } from '../types';

const STORAGE_KEY_CONFIG = 'fairy_supabase_custom_config';
const STORAGE_KEY_PROFILE = 'fairy_active_user_profile';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Get credentials from env or localStorage
export function getSupabaseConfig(): SupabaseConfig {
  const custom = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  const env = (import.meta as any).env || {};
  return {
    url: (env.VITE_SUPABASE_URL as string) || '',
    anonKey: (env.VITE_SUPABASE_ANON_KEY as string) || '',
  };
}

export function saveCustomSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  clientInstance = null; // reset client
}

export function clearCustomSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const config = getSupabaseConfig();
  if (config.url && config.anonKey && config.url.startsWith('http') && !config.url.includes('your-project')) {
    try {
      clientInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return clientInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(
    config.url &&
    config.anonKey &&
    config.url.startsWith('http') &&
    !config.url.includes('your-project')
  );
}

// Test connection
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Nincs beállítva érvényes Supabase URL vagy Anon Kulcs.',
    };
  }

  try {
    const { data, error } = await client.from('profiles').select('count').limit(1);
    if (error) {
      // If table doesn't exist yet, explain
      if (error.code === '42P01' || error.message.includes('relation "public.profiles" does not exist')) {
        return {
          success: false,
          message: 'A kapcsolat él, de a „profiles” tábla még nem jött létre! Kérlek futtasd le a supabase_schema.sql kódot a Supabase SQL Editorban.',
        };
      }
      return { success: false, message: `Hiba a kapcsolódáskor: ${error.message}` };
    }
    return { success: true, message: 'Sikeres kapcsolat a Supabase adatbázishoz!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Ismeretlen hiba a kapcsolódás során.' };
  }
}

// Local active profile fallback & persistence
export function getSavedUserProfile(): UserProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return null;
}

export function saveLocalUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

export function clearLocalUserProfile() {
  localStorage.removeItem(STORAGE_KEY_PROFILE);
}

// Fetch a specific user profile from Supabase by username
export async function fetchUserProfile(username: string): Promise<UserProfile | null> {
  const client = getSupabaseClient();
  if (!client) {
    // Fallback to local storage
    const local = getSavedUserProfile();
    if (local && local.username.toLowerCase() === username.trim().toLowerCase()) {
      return local;
    }
    return null;
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('username', username.trim())
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name || data.username,
      role: data.role || 'diak',
      grade: data.grade || '5. osztály',
      totalScore: data.total_score || 0,
      quizScore: data.quiz_score || 0,
      spellingScore: data.spelling_score || 0,
      oddoneoutScore: data.oddoneout_score || 0,
      bonusScore: data.bonus_score || 0,
      tasksCompleted: data.tasks_completed || 0,
      lastActive: data.last_active,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('fetchUserProfile error:', err);
    return null;
  }
}

// Login or register student
export async function loginOrRegisterUser(
  username: string,
  displayName?: string,
  role: 'diak' | 'tanar' = 'diak',
  grade: string = '5.a'
): Promise<UserProfile> {
  const trimmedUser = username.trim().toLowerCase().replace(/\s+/g, '.');
  const existing = await fetchUserProfile(trimmedUser);

  if (existing) {
    saveLocalUserProfile(existing);
    return existing;
  }

  // Create new profile
  const newProfile: UserProfile = {
    username: trimmedUser,
    displayName: displayName?.trim() || username.trim(),
    role,
    grade: grade.trim() || '5. osztály',
    totalScore: 0,
    quizScore: 0,
    spellingScore: 0,
    oddoneoutScore: 0,
    bonusScore: 0,
    tasksCompleted: 0,
    lastActive: new Date().toISOString(),
  };

  saveLocalUserProfile(newProfile);
  await syncUserProfileToSupabase(newProfile);
  return newProfile;
}

// Student individual game progress per username in localStorage
export function getStudentLocalProgress(username: string): {
  userAnswers: UserAnswer[];
  completedBonusIds: number[];
  currentQuestionIndex: number;
} {
  const key = `student_progress_${username.toLowerCase()}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return {
    userAnswers: [],
    completedBonusIds: [],
    currentQuestionIndex: 0,
  };
}

export function saveStudentLocalProgress(
  username: string,
  userAnswers: UserAnswer[],
  completedBonusIds: number[],
  currentQuestionIndex: number
) {
  const key = `student_progress_${username.toLowerCase()}`;
  localStorage.setItem(
    key,
    JSON.stringify({
      userAnswers,
      completedBonusIds,
      currentQuestionIndex,
      updatedAt: Date.now(),
    })
  );
}

export function resetStudentLocalProgress(username: string) {
  const key = `student_progress_${username.toLowerCase()}`;
  localStorage.removeItem(key);
}

// Sync/Upsert User Profile in Supabase
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  saveLocalUserProfile(profile);

  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('profiles').upsert(
      {
        username: profile.username.trim(),
        display_name: profile.displayName || profile.username,
        role: profile.role,
        grade: profile.grade || '5. osztály',
        total_score: profile.totalScore,
        quiz_score: profile.quizScore,
        spelling_score: profile.spellingScore,
        oddoneout_score: profile.oddoneoutScore,
        bonus_score: profile.bonusScore,
        tasks_completed: profile.tasksCompleted,
        last_active: new Date().toISOString(),
      },
      { onConflict: 'username' }
    );

    if (error) {
      console.warn('Supabase profile sync error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase profile sync failed:', err);
    return false;
  }
}

// Save individual question/task score
export async function saveTaskScoreToSupabase(record: SupabaseTaskScoreRecord): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('task_scores').insert({
      username: record.username.trim(),
      user_role: record.user_role || 'diak',
      question_id: record.question_id,
      task_part: record.task_part,
      castle_floor: record.castle_floor,
      question_title: record.question_title || `Kérdés #${record.question_id}`,
      selected_option: record.selected_option,
      is_correct: record.is_correct,
      points_awarded: record.points_awarded,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Failed to save task score to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveTaskScoreToSupabase exception:', err);
    return false;
  }
}

// Save bonus score
export async function saveBonusScoreToSupabase(
  username: string,
  bonusId: number,
  castleFloor: number,
  title: string,
  pointsAwarded: number
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('bonus_scores').insert({
      username: username.trim(),
      bonus_id: bonusId,
      castle_floor: castleFloor,
      title,
      points_awarded: pointsAwarded,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Failed to save bonus score to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveBonusScoreToSupabase exception:', err);
    return false;
  }
}

// Save finished game session
export async function saveGameSessionToSupabase(
  username: string,
  totalScore: number,
  quizScore: number,
  spellingScore: number,
  oddoneoutScore: number,
  bonusScore: number,
  correctCount: number,
  completedBonusCount: number
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('game_sessions').insert({
      username: username.trim(),
      total_score: totalScore,
      quiz_score: quizScore,
      spelling_score: spellingScore,
      oddoneout_score: oddoneoutScore,
      bonus_score: bonusScore,
      correct_count: correctCount,
      completed_bonus_count: completedBonusCount,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Failed to save game session:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveGameSession exception:', err);
    return false;
  }
}

// Fetch all student profiles for teacher dashboard / leaderboard
export async function fetchStudentsFromSupabase(): Promise<StudentScoreSummary[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('total_score', { ascending: false });

    if (error || !data) {
      console.warn('fetchStudentsFromSupabase error:', error);
      return [];
    }

    return data.map((item, index) => ({
      username: item.username,
      displayName: item.display_name,
      role: item.role,
      total_score: item.total_score || 0,
      quiz_score: item.quiz_score || 0,
      spelling_score: item.spelling_score || 0,
      oddoneout_score: item.oddoneout_score || 0,
      bonus_score: item.bonus_score || 0,
      tasks_completed: item.tasks_completed || 0,
      last_active: item.last_active || item.created_at || '',
      rank: index + 1,
    }));
  } catch (err) {
    console.warn('fetchStudentsFromSupabase exception:', err);
    return [];
  }
}

// Fetch individual task scores for a student
export async function fetchStudentTaskScores(username: string): Promise<SupabaseTaskScoreRecord[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('task_scores')
      .select('*')
      .eq('username', username.trim())
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((d) => ({
      id: d.id,
      username: d.username,
      user_role: d.user_role,
      question_id: d.question_id,
      task_part: d.task_part,
      castle_floor: d.castle_floor,
      question_title: d.question_title,
      selected_option: d.selected_option,
      is_correct: d.is_correct,
      points_awarded: d.points_awarded,
      created_at: d.created_at,
    }));
  } catch (err) {
    console.warn('fetchStudentTaskScores exception:', err);
    return [];
  }
}
