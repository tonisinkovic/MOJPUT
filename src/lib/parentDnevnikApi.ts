import { apiDelete, apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type { DnevnikEntry } from "@/lib/parentDnevnikStore";

export async function fetchParentDnevnik(): Promise<ApiResponse<DnevnikEntry[]>> {
  return apiGet<DnevnikEntry[]>("/api/me/parent-dnevnik");
}

export async function createParentDnevnik(
  body: Omit<DnevnikEntry, "id">,
): Promise<ApiResponse<DnevnikEntry>> {
  return apiPost<DnevnikEntry>("/api/me/parent-dnevnik", body);
}

export async function deleteParentDnevnik(id: string): Promise<ApiResponse<unknown>> {
  return apiDelete(`/api/me/parent-dnevnik/${id}`);
}
