import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    Boolean(url) &&
    !url?.includes('your-project-id') &&
    !url?.includes('placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
