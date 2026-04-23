import { API_BASE_URL } from "@/config/apiBase";

export type ApiOk<T> = { success: true; data?: T; user?: T };
export type ApiErr = { success: false; message: string; code?: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

const AUTH_TOKEN_KEY = "mojput_bearer_token";
const LAST_LOGIN_EMAIL_KEY = "mojput_last_account_email";

export function getStoredLastLoginEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem(LAST_LOGIN_EMAIL_KEY)?.trim().toLowerCase();
    return t || null;
  } catch {
    return null;
  }
}

/** Zadnji uspješno korišten email (bez lozinke) — predispunjavanje stranice za prijavu. */
export function setStoredLastLoginEmail(email: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const n = email?.trim().toLowerCase();
    if (n) localStorage.setItem(LAST_LOGIN_EMAIL_KEY, n);
    else localStorage.removeItem(LAST_LOGIN_EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function withAuthHeaders(headers: Record<string, string>): Record<string, string> {
  const t = getStoredAuthToken();
  if (t) return { ...headers, Authorization: `Bearer ${t}` };
  return headers;
}

/** Ne briši spremljeni JWT na 401 od prijave (pogrešna lozinka itd.). */
function shouldClearStoredTokenOn401(reqPath: string): boolean {
  const skip = ["/api/auth/login", "/api/auth/register"];
  return !skip.some((p) => reqPath.startsWith(p));
}

function messageFromJson(json: unknown): string {
  if (json && typeof json === "object" && "message" in json) {
    const m = (json as { message?: unknown }).message;
    return typeof m === "string" ? m.trim() : "";
  }
  return "";
}

function codeFromJson(json: unknown): string | undefined {
  if (json && typeof json === "object" && "code" in json) {
    const c = (json as { code?: unknown }).code;
    return typeof c === "string" ? c : undefined;
  }
  return undefined;
}

function formatHttpError(res: Response, json: unknown, rawText: string, reqPath: string): string {
  const fromApi = messageFromJson(json);
  if (fromApi) return fromApi;
  if (!res.ok && rawText && !rawText.trim().startsWith("{")) {
    const base =
      `Greška (${res.status}). Odgovor nije JSON (obično HTML) — API poziv vjerojatno ne stiže do Node backenda. ` +
      `U produkciji VITE_API_URL pri buildu mora biti puni URL API-ja (npr. https://mojput.onrender.com), ne samo adresa statičkog frontenda. ` +
      `Lokalno pokreni npm run dev:full (Vite + server.cjs).`;
    if (res.status === 404 && reqPath.startsWith("/api/auth/")) {
      return (
        base +
        ` Za novije rute (npr. zaboravljena lozinka) napravi redeploy API-ja ako je već ispravan URL.`
      );
    }
    return base;
  }
  return `Greška (${res.status}).`;
}

async function parseJson<T>(res: Response, reqPath: string): Promise<ApiResponse<T>> {
  const text = await res.text();
  let json: unknown = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    return {
      success: false,
      message: formatHttpError(res, {}, text, reqPath),
    };
  }
  if (!res.ok) {
    if (res.status === 401 && shouldClearStoredTokenOn401(reqPath)) {
      setStoredAuthToken(null);
    }
    const msg = formatHttpError(res, json, text, reqPath);
    const code = codeFromJson(json);
    return { success: false, message: msg, code };
  }
  const body = json as Record<string, unknown>;
  if (body && typeof body === "object" && body.success === undefined && ("user" in body || "data" in body)) {
    return { ...body, success: true } as ApiResponse<T>;
  }
  return json as ApiResponse<T>;
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      credentials: "include",
      headers: withAuthHeaders({ Accept: "application/json" }),
    });
    return parseJson<T>(res, url);
  } catch {
    return { success: false, message: "Server nije dostupan. Provjeri je li pokrenut." };
  }
}

export async function apiPost<T>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      credentials: "include",
      headers: withAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(body),
    });
    return parseJson<T>(res, url);
  } catch {
    return { success: false, message: "Server nije dostupan. Provjeri je li pokrenut." };
  }
}

export async function apiPatch<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: "PATCH",
      credentials: "include",
      headers: withAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(body),
    });
    return parseJson<T>(res, url);
  } catch {
    return { success: false, message: "Server nije dostupan. Provjeri je li pokrenut." };
  }
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
      headers: withAuthHeaders({ Accept: "application/json" }),
    });
    return parseJson<T>(res, url);
  } catch {
    return { success: false, message: "Server nije dostupan. Provjeri je li pokrenut." };
  }
}
