export type ApiOk<T> = { success: true; data?: T; user?: T };
export type ApiErr = { success: false; message: string; code?: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

const API_BASE = (import.meta.env.VITE_API_URL as string) || "";

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : {};
  if (!res.ok) {
    const msg =
      typeof (json as any)?.message === "string"
        ? (json as any).message
        : `Greška (${res.status})`;
    const code = typeof (json as any)?.code === "string" ? (json as any).code : undefined;
    return { success: false, message: msg, code };
  }
  return json as ApiResponse<T>;
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" },
  });
  return parseJson<T>(res);
}

export async function apiPost<T>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJson<T>(res);
}

