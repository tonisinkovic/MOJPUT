import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  email_verified?: number;
};

export async function authMe(): Promise<ApiResponse<{ user: AuthUser }>> {
  return apiGet<{ user: AuthUser }>("/api/auth/me");
}

export async function authLogin(params: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: AuthUser }>> {
  return apiPost<{ user: AuthUser }>("/api/auth/login", params);
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
  return apiPost<unknown>("/api/auth/logout", {});
}

export async function authVerifyEmail(token: string): Promise<ApiResponse<unknown>> {
  return apiGet<unknown>(`/api/auth/verify?token=${encodeURIComponent(token)}`);
}

export async function authResendVerification(email: string): Promise<ApiResponse<unknown>> {
  return apiPost<unknown>("/api/auth/resend-verification", { email });
}

