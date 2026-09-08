import seed from "@/data/junior-forum/third-year.json";
import { attachForumMeta, type JuniorForumTrackId } from "@/lib/juniorForum";

export type JuniorThirdYearThread = (typeof seed)["threads"][number];

export const juniorThirdYearThreads = seed.threads as JuniorThirdYearThread[];

export function juniorThirdYearStudentCount(): number {
  const names = new Set<string>();
  for (const thread of juniorThirdYearThreads) {
    for (const reply of thread.replies) names.add(reply.username);
  }
  return names.size;
}

export function isJuniorEditorialThread(title: string): boolean {
  return juniorThirdYearThreads.some((thread) => thread.title === title);
}

const EDITORIAL_USERNAMES = new Set<string>(
  juniorThirdYearThreads.flatMap((thread) => [thread.asker, ...thread.replies.map((reply) => reply.username)]),
);

export function isJuniorEditorialUsername(username: string | null | undefined): boolean {
  return Boolean(username && EDITORIAL_USERNAMES.has(username));
}

export function attachThirdYearBody(thread: JuniorThirdYearThread): string {
  const track = thread.track as JuniorForumTrackId;
  return attachForumMeta(thread.question, {
    city: thread.city,
    track: track || "ostalo",
    askSenior: true,
  });
}
