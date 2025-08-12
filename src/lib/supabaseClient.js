import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ildeffyvkiaytvktamga.supabase.co"; // from step 2
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZGVmZnl2a2lheXR2a3RhbWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDc0NzgsImV4cCI6MjA3MDU4MzQ3OH0.FOhD45JRZlORJ7oxgXwKiN1xe_HthQroMOipHbbnmJ0"; // from step 2

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
