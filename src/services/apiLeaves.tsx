// src/services/apiLeaves.ts
import { supabase } from "./supabase";
import { getGradeColor } from "../utils/gradeColor";

// Type for a single leave record
export interface LeaveRecord {
  user_id: string; // Supabase auth uses UUID
  result: string;
  image_url: string;
  confidence: number;
  model_version?: string; // ✅ Added as optional
  status?: string;
  processed_at: string;
  color?: ReturnType<typeof getGradeColor>; // Optional color info
}

// Type for filters
export interface HistoryFilters {
  user_id?: string | null;
  from?: string;   // ISO date string
  to?: string;     // ISO date string
  result?: string;
  minConf?: number;
  maxConf?: number;
}

// Function to fetch leaves with dynamic filters
export async function apiLeaves(
  filters: HistoryFilters = {}
): Promise<{ data: (LeaveRecord & { color: ReturnType<typeof getGradeColor> })[] | null; error: any }> {
  let query = supabase.from("upload_history").select("*").order("processed_at", { ascending: false });

  // Always filter by user_id if provided
  if (filters.user_id) {
    query = query.eq("user_id", filters.user_id);
  }

  if (filters.from) query = query.gte("processed_at", filters.from);
  if (filters.to) query = query.lt("processed_at", filters.to);
  if (filters.result) query = query.eq("result", filters.result);
  if (filters.minConf != null) query = query.gte("confidence", filters.minConf);
  if (filters.maxConf != null) query = query.lte("confidence", filters.maxConf);

  const { data, error } = await query;

  // Add color information to each record
  const recordsWithColor = data?.map(record => ({
    ...record,
    color: getGradeColor(record.result)
  })) ?? null;

  return { data: recordsWithColor, error };
}