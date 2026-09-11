import { API_BASE_URL } from "@/config/apiBase";
import { getStoredAuthToken, setStoredAuthToken, type ApiResponse } from "@/lib/api";
import { notifyAuthChanged, type AuthUser } from "@/lib/auth";

export type SchoolPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIDDEN";
export type SchoolPostCategory = "dogadaj" | "upisi" | "uspjeh" | "obavijest" | "ostalo";

export type SchoolPostImage = {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
};

export type SchoolPost = {
  id: number;
  schoolId?: string;
  schoolSlug?: string;
  schoolName?: string | null;
  schoolCity?: string | null;
  title: string;
  content: string;
  slug: string;
  category: string | null;
  linkUrl: string | null;
  status: SchoolPostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: SchoolPostImage[];
};

export type SchoolCatalog = {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string;
  address: string;
  postalCode: string;
  category: string;
  alsoElementary: boolean;
  website: string | null;
  emails: string[];
  phones: string[];
  principal: string | null;
  founder: string | null;
};

export type SchoolPublicPayload = {
  catalog: SchoolCatalog;
  profile: {
    aboutText: string;
    logoUrl: string | null;
    coverUrl: string | null;
    extraWebsite: string | null;
    isActive: boolean;
  };
  posts: SchoolPost[];
};

export type SchoolMePayload = {
  catalog: SchoolCatalog | null;
  account: {
    slug: string;
    aboutText: string;
    logoUrl: string | null;
    coverUrl: string | null;
    extraWebsite: string | null;
    mustChangePassword: boolean;
    isActive: boolean;
  };
  stats: { published: number; draft: number; archived: number; hidden: number; total: number };
  recentPosts: SchoolPost[];
};

export type AdminSchoolRow = {
  id: number;
  highSchoolId: string;
  name: string;
  city: string;
  county: string;
  slug: string;
  username: string;
  email: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  postCount: number;
  createdAt: string;
};

function unwrap<T>(res: ApiResponse<T> & { data?: T }): ApiResponse<T> {
  return res;
}

async function parseRes<T>(res: Response, path: string): Promise<ApiResponse<T>> {
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return { success: false, message: `Greška (${res.status}).` };
  }
  if (!res.ok) {
    return {
      success: false,
      message: typeof json.message === "string" ? json.message : `Greška (${res.status}).`,
      code: typeof json.code === "string" ? json.code : undefined,
    };
  }
  return json as ApiResponse<T>;
}

function authHeaders(json = true): Record<string, string> {
  const t = getStoredAuthToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (json) headers["Content-Type"] = "application/json";
  if (t) headers.Authorization = `Bearer ${t}`;
  return headers;
}

export function schoolMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${rel}`;
}

export async function schoolLogin(params: {
  login: string;
  password: string;
}): Promise<ApiResponse<{ user: AuthUser; token?: string }>> {
  const res = await fetch(`${API_BASE_URL}/api/schools/login`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify({ login: params.login, password: params.password }),
  });
  const json = await parseRes<{ user: AuthUser; token?: string }>(res, "/api/schools/login");
  if (json.success) {
    const body = json as { user?: AuthUser; token?: string; data?: { user?: AuthUser; token?: string } };
    const token = body.token || body.data?.token;
    if (token) setStoredAuthToken(token);
    notifyAuthChanged();
  }
  return json;
}

export async function fetchSchoolPublic(slug: string): Promise<ApiResponse<SchoolPublicPayload>> {
  const res = await fetch(`${API_BASE_URL}/api/schools/public/${encodeURIComponent(slug)}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return parseRes<SchoolPublicPayload>(res, "/api/schools/public");
}

export async function fetchSchoolFeed(params?: {
  city?: string;
  category?: string;
  school?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<SchoolPost[]>> {
  const q = new URLSearchParams();
  if (params?.city) q.set("city", params.city);
  if (params?.category) q.set("category", params.category);
  if (params?.school) q.set("school", params.school);
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);
  const res = await fetch(`${API_BASE_URL}/api/schools/feed?${q.toString()}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return parseRes<SchoolPost[]>(res, "/api/schools/feed");
}

export async function fetchSchoolMe(): Promise<ApiResponse<SchoolMePayload>> {
  const res = await fetch(`${API_BASE_URL}/api/schools/me`, {
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes<SchoolMePayload>(res, "/api/schools/me");
}

export async function patchSchoolProfile(body: { aboutText?: string; extraWebsite?: string }) {
  const res = await fetch(`${API_BASE_URL}/api/schools/me`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return parseRes(res, "/api/schools/me");
}

export async function changeSchoolPassword(body: { currentPassword: string; newPassword: string }) {
  const res = await fetch(`${API_BASE_URL}/api/schools/me/password`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return parseRes(res, "/api/schools/me/password");
}

export async function fetchSchoolPosts(status?: string): Promise<ApiResponse<SchoolPost[]>> {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${API_BASE_URL}/api/schools/me/posts${q}`, {
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes<SchoolPost[]>(res, "/api/schools/me/posts");
}

export async function createSchoolPost(body: {
  title: string;
  content: string;
  status?: SchoolPostStatus;
  category?: string;
  linkUrl?: string;
}): Promise<ApiResponse<SchoolPost>> {
  const res = await fetch(`${API_BASE_URL}/api/schools/me/posts`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return parseRes<SchoolPost>(res, "/api/schools/me/posts");
}

export async function patchSchoolPost(id: number, body: Record<string, unknown>): Promise<ApiResponse<SchoolPost>> {
  const res = await fetch(`${API_BASE_URL}/api/schools/me/posts/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return parseRes<SchoolPost>(res, "/api/schools/me/posts");
}

export async function deleteSchoolPost(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/schools/me/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes(res, "/api/schools/me/posts");
}

export async function uploadSchoolFile(form: FormData) {
  const res = await fetch(`${API_BASE_URL}/api/schools/me/upload`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(false),
    body: form,
  });
  return parseRes<{ url: string; id?: number; kind?: string }>(res, "/api/schools/me/upload");
}

export async function fetchAdminSchools(q = ""): Promise<ApiResponse<AdminSchoolRow[]>> {
  const res = await fetch(`${API_BASE_URL}/api/admin/schools?q=${encodeURIComponent(q)}`, {
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes<AdminSchoolRow[]>(res, "/api/admin/schools");
}

export async function patchAdminSchool(id: number, body: { isActive: boolean }) {
  const res = await fetch(`${API_BASE_URL}/api/admin/schools/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return parseRes(res, "/api/admin/schools");
}

export async function resetAdminSchoolAccess(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/schools/${id}/reset-access`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: "{}",
  });
  return parseRes<{ username: string; email: string; password: string; loginPath: string }>(
    res,
    "/api/admin/schools/reset",
  );
}

export async function fetchAdminSchoolPosts(params?: { status?: string; q?: string }): Promise<ApiResponse<SchoolPost[]>> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.q) q.set("q", params.q);
  const res = await fetch(`${API_BASE_URL}/api/admin/schools/posts?${q.toString()}`, {
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes<SchoolPost[]>(res, "/api/admin/schools/posts");
}

export async function moderateAdminSchoolPost(id: number, status: SchoolPostStatus) {
  const res = await fetch(`${API_BASE_URL}/api/admin/schools/posts/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return parseRes(res, "/api/admin/schools/posts");
}

export async function deleteAdminSchoolPost(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/schools/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(false),
  });
  return parseRes(res, "/api/admin/schools/posts");
}

export function adminCredentialsCsvUrl() {
  return `${API_BASE_URL}/api/admin/schools/credentials.csv`;
}

export function adminCredentialsHtmlUrl() {
  return `${API_BASE_URL}/api/admin/schools/credentials.html`;
}

export { unwrap };
