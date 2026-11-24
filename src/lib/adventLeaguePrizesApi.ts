import { apiGet, apiPut, type ApiResponse } from "@/lib/api";

export type AdventPrizePartnerRef = {
  id: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  isDemo?: boolean;
};

export type AdventPrizePublic = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  category: string;
  tier: "main" | "daily";
  partnerId?: string | null;
  isDemo?: boolean;
  sortOrder?: number;
  partner?: AdventPrizePartnerRef | null;
};

export type AdventPartnerPublic = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  isDemo?: boolean;
};

export type AdventPrizesPublicPayload = {
  partners: AdventPartnerPublic[];
  mainPrizes: AdventPrizePublic[];
  dailyPrizes: AdventPrizePublic[];
  hasDemoContent: boolean;
};

export type AdventPrizesAdminPayload = {
  partners: AdventPartnerPublic[];
  prizes: Omit<AdventPrizePublic, "partner">[];
};

export async function adventFetchPrizes() {
  return apiGet<AdventPrizesPublicPayload>("/api/advent/prizes");
}

export async function adminFetchPrizesPartners() {
  return apiGet<AdventPrizesAdminPayload>("/api/admin/advent/prizes-partners");
}

export async function adminSavePrizesPartners(payload: AdventPrizesAdminPayload) {
  return apiPut<AdventPrizesAdminPayload>("/api/admin/advent/prizes-partners", payload);
}

export function isPrizesApiError<T>(res: ApiResponse<T>): res is { success: false; message: string } {
  return !res.success;
}