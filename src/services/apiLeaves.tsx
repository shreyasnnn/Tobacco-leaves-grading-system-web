// src/services/apiLeaves.ts
import { supabase } from "./supabase";

// Type for a single leave record
export interface LeaveRecord {
  user_id: number;
  result: string;
  image_url: string;
  confidence: string;
  processed_at: string;
}

// Type for filters
export interface HistoryFilters {
  from?: string; // ISO date string
  to?: string;   // ISO date string
  result?: string;
  minConf?: number;
  maxConf?: number;
}

// Function to fetch leaves with dynamic filters
export async function apiLeaves(
  filters: HistoryFilters = {}
): Promise<{ data: LeaveRecord[] | null; error: any }> {
  let query = supabase.from("upload_history").select("*");

  if (filters.from) query = query.gte("processed_at", filters.from);
  if (filters.to) query = query.lt("processed_at", filters.to);
  if (filters.result) query = query.eq("result", filters.result);
  if (filters.minConf != null) query = query.gte("confidence", filters.minConf);
  if (filters.maxConf != null) query = query.lte("confidence", filters.maxConf);

  const { data, error } = await query;

  return { data: data as LeaveRecord[] ?? null, error };
}
