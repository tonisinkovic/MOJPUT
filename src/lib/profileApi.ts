import { apiDelete, apiGet, apiPatch, apiPost, type ApiResponse } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";
import type { ProfileQuizPayload } from "@/lib/careerQuizApi";

export type DashboardActivity = {
  forum_threads: number;
  forum_messages: number;
  saved_faculties_count: number;
  profile_completion_percent: number;
};

export type SavedFacultyRow = {
  id: number;
  faculty_id: string;
  label: string;
  city: string | null;
  excerpt: string | null;
  created_at: string;
};

export type QuizHistoryEntry = {
  id: number;
  created_at: string;
  payload: ProfileQuizPayload;
};

export type DashboardPayload = {
  user: AuthUser;
  activity: DashboardActivity;
  saved_faculties: SavedFacultyRow[];
  quiz_history: QuizHistoryEntry[];
};

export async function fetchDashboard(): Promise<ApiResponse<DashboardPayload>> {
  return apiGet<DashboardPayload>("/api/me/dashboard");
}

export async function updateProfile(body: {
  username?: string;
  user_type?: string;
  current_password?: string;
  new_password?: string;
}): Promise<ApiResponse<{ user: AuthUser }>> {
  return apiPatch<{ user: AuthUser }>("/api/me/profile", body);
}

export async function saveFacultyFavorite(body: {
  faculty_id: string;
  label: string;
  city?: string;
  excerpt?: string;
}): Promise<ApiResponse<{ data: SavedFacultyRow }>> {
  return apiPost<{ data: SavedFacultyRow }>("/api/me/saved-faculties", body);
}

export async function deleteFacultyFavorite(id: number): Promise<ApiResponse<unknown>> {
  return apiDelete(`/api/me/saved-faculties/${id}`);
}
