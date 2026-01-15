// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pljtuoiitbecqetnbmej.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsanR1b2lpdGJlY3FldG5ibWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTk0NzQsImV4cCI6MjA4NDAzNTQ3NH0.zITyRoDRQ_bci72gBdYtGtOHakdshvk-Ej2xXqqMK1U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
