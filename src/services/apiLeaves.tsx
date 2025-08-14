import { supabase } from "./supabase";

// Define the type for a single leave record
export interface LeaveRecord {
  user_id: number;
  result: string;
  image_url: string;
  confidence: string; 
  // Add other fields from 'upload_history' table if needed
}

export async function apiLeaves(): Promise<{ data: LeaveRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from<"upload_history", LeaveRecord>("upload_history")
    .select("*");

  return { data, error };
}
