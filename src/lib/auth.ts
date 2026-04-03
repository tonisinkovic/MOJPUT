import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

const AUTH_CHANGED = "mojput-auth-changed";

/** Pozovi nakon prijave/odjave da Navbar i ostale komponente osvježe korisnika. */
export function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED));
  }
}

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  email_verified?: number;
};

/** Izvadi korisnika iz odgovora /api/auth/me (ili login) kad je success. */
export function userFromAuthMe(res: ApiResponse<{ user: AuthUser }>): AuthUser | null {
  if (!res.success) return null;
  const r = res as { user?: AuthUser; data?: { user?: AuthUser } };
  return r.user ?? r.data?.user ?? null;
}

export async function authMe(): Promise<ApiResponse<{ user: AuthUser }>> {
  return apiGet<{ user: AuthUser }>("/api/auth/me");
}

export async function authLogin(params: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: AuthUser }>> {
  const res = await apiPost<{ user: AuthUser }>("/api/auth/login", params);
  if (res.success) notifyAuthChanged();
  return res;
}

export async function authRegister(params: {
  username: string;
  email: string;
  password: string;
}): Promise<
    ApiResponse<{
      user?: AuthUser;
      email?: string;
      verification_required?: boolean;
      dev_verification_url?: string;
    }>
  > {
  return apiPost<{
    user?: AuthUser;
    email?: string;
    verification_required?: boolean;
    dev_verification_url?: string;
  }>(
    "/api/auth/register",
    params,
  );
}

export async function authLogout(): Promise<ApiResponse<unknown>> {
  const res = await apiPost<unknown>("/api/auth/logout", {});
  if (res.success) notifyAuthChanged();
  return res;
}

export async function authVerifyEmail(token: string): Promise<ApiResponse<unknown>> {
  return apiGet<unknown>(`/api/auth/verify?token=${encodeURIComponent(token)}`);
}

export async function authResendVerification(email: string): Promise<ApiResponse<unknown>> {
  return apiPost<unknown>("/api/auth/resend-verification", { email });
}

