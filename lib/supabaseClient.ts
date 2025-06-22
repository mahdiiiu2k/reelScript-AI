import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Only create Supabase client if credentials are provided
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

export const isSupabaseConfigured = !!supabase

// Log configuration status
if (supabaseUrl && supabaseKey) {
  console.log('✅ Supabase client initialized:', supabaseUrl);
} else {
  console.log('⚠️ Supabase client not configured - add SUPABASE_URL and SUPABASE_KEY to environment');
}