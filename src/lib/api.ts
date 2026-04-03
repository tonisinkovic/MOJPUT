import { API_BASE_URL } from "@/config/apiBase";

export type ApiOk<T> = { success: true; data?: T; user?: T };
export type ApiErr = { success: false; message: string; code?: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

function formatHttpError(res: Response, json: unknown, rawText: string): string {
  const fromApi = typeof (json as any)?.message === "string" ? (json as any).message.trim() : "";
  if (fromApi) return fromApi;
  if (!res.ok && rawText && !rawText.trim().startsWith("{")) {
    return `Greška (${res.status}). Server je vratio stranicu umjesto JSON-a — provjeri VITE_API_URL (GitHub Pages) ili je li backend pokrenut (lokalno: npm run dev:full).`;
  }
  return `Greška (${res.status}).`;
}

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  let json: unknown = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    return {
      success: false,
      message: formatHttpError(res, {}, text),
    };
  }
  if (!res.ok) {
    const msg = formatHttpError(res, json, text);
    const code = typeof (json as any)?.code === "string" ? (json as any).code : undefined;
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
      headers: { "Accept": "application/json" },
    });
    return parseJson<T>(res);
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
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    return parseJson<T>(res);
  } catch {
    return { success: false, message: "Server nije dostupan. Provjeri je li pokrenut." };
  }
}

