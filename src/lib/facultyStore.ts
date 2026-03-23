import { facultyPostsSeed, facultySeed, facultyUsersSeed } from "@/data/facultyProfiles";
import type { Faculty, FacultyPost, FacultyUser } from "@/types/faculty";

const FACULTIES_KEY = "mojput_faculties";
const FACULTY_USERS_KEY = "mojput_faculty_users";
const FACULTY_POSTS_KEY = "mojput_faculty_posts";
const FACULTY_SESSION_KEY = "mojput_faculty_session";

type FacultySession = {
  userId: string;
  facultyId: string;
};

function parseStoredArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredArray<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeFacultyUsers() {
  const users = parseStoredArray(FACULTY_USERS_KEY, facultyUsersSeed) as Array<FacultyUser & { email?: string }>;
  const normalized = users.map((user) => {
    const email = user.email || `${user.id}@faculty.local`;
    const username = typeof user.username === "string" && user.username.trim()
      ? user.username
      : email.split("@")[0] || user.id;
    return { ...user, email, username };
  });
  writeStoredArray(FACULTY_USERS_KEY, normalized);
}

export function ensureFacultySeed() {
  parseStoredArray(FACULTIES_KEY, facultySeed);
  parseStoredArray(FACULTY_USERS_KEY, facultyUsersSeed);
  parseStoredArray(FACULTY_POSTS_KEY, facultyPostsSeed);
  normalizeFacultyUsers();
}

export function getFaculties(): Faculty[] {
  ensureFacultySeed();
  return parseStoredArray(FACULTIES_KEY, facultySeed);
}

export function getFacultyById(id: string): Faculty | undefined {
  return getFaculties().find((faculty) => faculty.id === id);
}

export function getFacultyPosts(facultyId: string): FacultyPost[] {
  ensureFacultySeed();
  return parseStoredArray(FACULTY_POSTS_KEY, facultyPostsSeed)
    .filter((post) => post.facultyId === facultyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getFacultyUsers(): FacultyUser[] {
  ensureFacultySeed();
  return parseStoredArray(FACULTY_USERS_KEY, facultyUsersSeed);
}

export function loginFaculty(email: string, password: string): FacultySession | null {
  const match = getFacultyUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  );
  if (!match) return null;

  const session = { userId: match.id, facultyId: match.facultyId };
  localStorage.setItem(FACULTY_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutFaculty() {
  localStorage.removeItem(FACULTY_SESSION_KEY);
}

export function getFacultySession(): FacultySession | null {
  try {
    const raw = localStorage.getItem(FACULTY_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FacultySession;
    if (!parsed?.facultyId || !parsed?.userId) return null;
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
  const posts = parseStoredArray(FACULTY_POSTS_KEY, facultyPostsSeed);
  const post: FacultyPost = {
    id: `fp-${Date.now()}`,
    facultyId,
    title: title.trim(),
    content: content.trim(),
    imageUrl: imageUrl?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  const next = [post, ...posts];
  writeStoredArray(FACULTY_POSTS_KEY, next);
  return post;
}

export function updateFacultyPost(
  postId: string,
  facultyId: string,
  title: string,
  content: string,
  imageUrl?: string,
): boolean {
  const posts = parseStoredArray(FACULTY_POSTS_KEY, facultyPostsSeed);
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
  const posts = parseStoredArray(FACULTY_POSTS_KEY, facultyPostsSeed);
  const next = posts.filter((post) => !(post.id === postId && post.facultyId === facultyId));
  if (next.length === posts.length) return false;
  writeStoredArray(FACULTY_POSTS_KEY, next);
  return true;
}

export function updateFacultyProfile(
  facultyId: string,
  updates: Partial<
    Pick<Faculty, "name" | "description" | "longDescription" | "city" | "area" | "logoUrl" | "coverImageUrl" | "websiteUrl">
  >,
): boolean {
  const faculties = parseStoredArray(FACULTIES_KEY, facultySeed);
  const index = faculties.findIndex((faculty) => faculty.id === facultyId);
  if (index === -1) return false;
  faculties[index] = { ...faculties[index], ...updates };
  writeStoredArray(FACULTIES_KEY, faculties);
  return true;
}

export function addFacultyMedia(
  facultyId: string,
  media: NonNullable<Faculty["media"]>[number],
): boolean {
  const faculties = parseStoredArray(FACULTIES_KEY, facultySeed);
  const index = faculties.findIndex((faculty) => faculty.id === facultyId);
  if (index === -1) return false;
  const current = faculties[index].media ?? [];
  faculties[index] = { ...faculties[index], media: [media, ...current] };
  writeStoredArray(FACULTIES_KEY, faculties);
  return true;
}

export function deleteFacultyMedia(facultyId: string, mediaId: string): boolean {
  const faculties = parseStoredArray(FACULTIES_KEY, facultySeed);
  const index = faculties.findIndex((faculty) => faculty.id === facultyId);
  if (index === -1) return false;
  const current = faculties[index].media ?? [];
  const next = current.filter((item) => item.id !== mediaId);
  if (next.length === current.length) return false;
  faculties[index] = { ...faculties[index], media: next };
  writeStoredArray(FACULTIES_KEY, faculties);
  return true;
}
