import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrsbmatgafwbtyxomqhk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyc2JtYXRnYWZ3YnR5eG9tcWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMjdXBhYmFzZSI6InJvbGUiLCJ';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 