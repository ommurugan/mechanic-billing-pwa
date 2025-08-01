// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mkhoewnricapntdwqzdp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raG9ld25yaWNhcG50ZHdxemRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjA1MzUsImV4cCI6MjA2NzI5NjUzNX0.q57iLBhIL6tlBVj1VAGNMLH1LKrhiYGE5Vb2aLC8KPs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});