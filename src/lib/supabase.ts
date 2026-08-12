/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mduklqhzuxuopyxjbmsg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdWtscWh6dXh1b3B5eGpibXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzY1NjMsImV4cCI6MjEwMTQxMjU2M30.s7UqRWfDZspZWIKQYWG_V3sJvErbFl-8N__lqmM0VnI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
