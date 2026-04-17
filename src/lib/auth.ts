import { apiGet, apiPost, setStoredAuthToken, type ApiResponse } from "@/lib/api";

const AUTH_CHANGED = "mojput-auth-changed";

/** Pozovi nakon prijave/odjave da Navbar i ostale komponente osvježe korisnika. */
export function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED));
  }
}

export type UserTypeId = "srednjoskolac" | "student" | "profesor" | "roditelj";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  email_verified?: number;
  /** Samo za račune navedene u ADMIN_EMAILS na serveru. */
  is_admin?: boolean;
  user_type?: UserTypeId | string;
  last_login_at?: string | null;
};

export type AdminStats = {
  users_total: number;
  users_verified: number;
  pending_registrations: number;
  site_feedback: number;
  forum_conversations: number;
  forum_messages: number;
  forum_likes: number;
  registrations_last_7_days: number;
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
}): Promise<ApiResponse<{ user: AuthUser; token?: string }>> {
  const res = await apiPost<{ user: AuthUser; token?: string }>("/api/auth/login", params);
  if (res.success) {
    const t = typeof (res as { token?: string }).token === "string" ? (res as { token?: string }).token : "";
    if (t) setStoredAuthToken(t);
    notifyAuthChanged();
  }
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
      email_preview_url?: string;
      code?: "email_already_registered" | "pending_verification" | string;
    }>
  > {
  return apiPost<{
    user?: AuthUser;
    email?: string;
    verification_required?: boolean;
    email_preview_url?: string;
    code?: "email_already_registered" | "pending_verification" | string;
  }>(
    "/api/auth/register",
    params,
  );
}

export async function authLogout(): Promise<ApiResponse<unknown>> {
  const res = await apiPost<unknown>("/api/auth/logout", {});
  setStoredAuthToken(null);
  if (res.success) notifyAuthChanged();
  return res;
}

export async function authVerifyCode(params: { email: string; code: string }): Promise<ApiResponse<unknown>> {
  return apiPost<unknown>("/api/auth/verify-code", params);
}

export async function authResendVerification(email: string): Promise<ApiResponse<unknown>> {
  return apiPost<unknown>("/api/auth/resend-verification", { email });
}

export async function authForgotPassword(
  email: string,
): Promise<ApiResponse<{ message?: string; email_preview_url?: string }>> {
  return apiPost<{ message?: string; email_preview_url?: string }>("/api/auth/forgot-password", { email });
}

export async function authResetPassword(params: {
  token: string;
  password: string;
}): Promise<ApiResponse<{ message?: string }>> {
  return apiPost<{ message?: string }>("/api/auth/reset-password", params);
}

export async function fetchAdminStats(): Promise<ApiResponse<unknown>> {
  return apiGet<unknown>("/api/admin/stats");
}

