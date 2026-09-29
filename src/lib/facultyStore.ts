import { facultyUsersGenerated } from "@/data/facultyUsers";
import { facultyCatalog } from "@/lib/facultyCatalog";
import type { Faculty, FacultyPost, FacultyUser } from "@/types/faculty";

const FACULTY_OVERRIDES_KEY = "mojput_faculty_overrides_v2";
const FACULTY_POSTS_KEY = "mojput_faculty_posts_v2";
const FACULTY_SESSION_KEY = "mojput_faculty_session_v2";

type FacultySession = {
  userId: string;
  facultyId: string;
};

type FacultyOverride = Partial<
  Pick<
    Faculty,
    | "name"
    | "description"
    | "longDescription"
    | "city"
    | "area"
    | "logoUrl"
    | "coverImageUrl"
    | "websiteUrl"
    | "media"
    | "verified"
  >
>;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseStoredArray<T>(key: string, fallback: T[]): T[] {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredArray<T>(key: string, value: T[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getOverrides(): Record<string, FacultyOverride> {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(FACULTY_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, FacultyOverride>) : {};
  } catch {
    return {};
  }
}

function writeOverrides(value: Record<string, FacultyOverride>) {
  if (!canUseStorage()) return;
  localStorage.setItem(FACULTY_OVERRIDES_KEY, JSON.stringify(value));
}

export function getFaculties(): Faculty[] {
  const overrides = getOverrides();
  return facultyCatalog.map((faculty) => {
    const extra = overrides[faculty.id];
    return extra ? { ...faculty, ...extra, id: faculty.id } : faculty;
  });
}

export function getFacultyById(id: string): Faculty | undefined {
  return getFaculties().find((faculty) => faculty.id === id);
}

export function getFacultyPosts(facultyId: string): FacultyPost[] {
  return parseStoredArray<FacultyPost>(FACULTY_POSTS_KEY, [])
    .filter((post) => post.facultyId === facultyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getFacultyUsers(): FacultyUser[] {
  return facultyUsersGenerated.map((user) => ({
    ...user,
    email: user.email || `${user.id}@fakultet.mojput.hr`,
    username: user.username?.trim() || user.email.split("@")[0] || user.id,
  }));
}

export function loginFaculty(login: string, password: string): FacultySession | null {
  const key = login.trim().toLowerCase();
  if (!key || !password) return null;
  const match = getFacultyUsers().find((user) => {
    if (user.password !== password) return false;
    const email = user.email.toLowerCase();
    const username = (user.username || "").toLowerCase();
    return email === key || username === key;
  });
  if (!match) return null;

  const session = { userId: match.id, facultyId: match.facultyId };
  if (canUseStorage()) localStorage.setItem(FACULTY_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutFaculty() {
  if (!canUseStorage()) return;
  localStorage.removeItem(FACULTY_SESSION_KEY);
}

export function getFacultySession(): FacultySession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(FACULTY_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FacultySession;
    if (!parsed?.facultyId || !parsed?.userId) return null;
    if (!getFacultyById(parsed.facultyId)) return null;
    const users = getFacultyUsers();
    if (users.length === 0) {
      logoutFaculty();
      return null;
    }
    if (!users.some((user) => user.id === parsed.userId && user.facultyId === parsed.facultyId)) {
      logoutFaculty();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createFacultyPost(
  facultyId: string,
  title: string,
  content: string,
  imageUrl?: string,
): FacultyPost {
  const posts = parseStoredArray<FacultyPost>(FACULTY_POSTS_KEY, []);
  const post: FacultyPost = {
    id: `fp-${Date.now()}`,
    facultyId,
    title: title.trim(),
    content: content.trim(),
    imageUrl: imageUrl?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  writeStoredArray(FACULTY_POSTS_KEY, [post, ...posts]);
  return post;
}

export function updateFacultyPost(
  postId: string,
  facultyId: string,
  title: string,
  content: string,
  imageUrl?: string,
): boolean {
  const posts = parseStoredArray<FacultyPost>(FACULTY_POSTS_KEY, []);
  const index = posts.findIndex((post) => post.id === postId && post.facultyId === facultyId);
  if (index === -1) return false;
  posts[index] = {
    ...posts[index],
    title: title.trim(),
    content: content.trim(),
    imageUrl: imageUrl?.trim() || undefined,
  };
  writeStoredArray(FACULTY_POSTS_KEY, posts);
  return true;
}

export function deleteFacultyPost(postId: string, facultyId: string): boolean {
  const posts = parseStoredArray<FacultyPost>(FACULTY_POSTS_KEY, []);
  const next = posts.filter((post) => !(post.id === postId && post.facultyId === facultyId));
  if (next.length === posts.length) return false;
  writeStoredArray(FACULTY_POSTS_KEY, next);
  return true;
}

export function updateFacultyProfile(
  facultyId: string,
  updates: FacultyOverride,
): boolean {
  if (!facultyCatalog.some((faculty) => faculty.id === facultyId)) return false;
  const overrides = getOverrides();
  overrides[facultyId] = { ...overrides[facultyId], ...updates };
  writeOverrides(overrides);
  return true;
}

export function addFacultyMedia(
  facultyId: string,
  media: NonNullable<Faculty["media"]>[number],
): boolean {
  const faculty = getFacultyById(facultyId);
  if (!faculty) return false;
  const current = faculty.media ?? [];
  return updateFacultyProfile(facultyId, { media: [media, ...current] });
}

export function deleteFacultyMedia(facultyId: string, mediaId: string): boolean {
  const faculty = getFacultyById(facultyId);
  if (!faculty) return false;
  const current = faculty.media ?? [];
  const next = current.filter((item) => item.id !== mediaId);
  if (next.length === current.length) return false;
  return updateFacultyProfile(facultyId, { media: next });
}
