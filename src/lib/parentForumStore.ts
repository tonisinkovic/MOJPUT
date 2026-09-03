import { forumSeedFor } from "@/data/parentHub";
import type { MojPutExperienceMode } from "@/lib/experience";

const STORAGE_KEY_PREFIX = "mojput_parent_forum_conversations_v1";
const LIKED_IDS_KEY_PREFIX = "mojput_parent_forum_liked_message_ids_v1";
export const PARENT_FORUM_DISPLAY_NAME_KEY = "mojput_parent_forum_display_name";

export type ParentForumMessage = {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
};

export type ParentForumConversation = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: ParentForumMessage[];
};

function storageKey(audience: MojPutExperienceMode): string {
  return `${STORAGE_KEY_PREFIX}_${audience}`;
}

function likedIdsKey(audience: MojPutExperienceMode): string {
  return `${LIKED_IDS_KEY_PREFIX}_${audience}`;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Početni sadržaj iz seed podataka — svaka tema postaje razgovor s porukama. */
export function buildInitialConversations(audience: MojPutExperienceMode): ParentForumConversation[] {
  return forumSeedFor(audience).map((topic) => {
    const opening: ParentForumMessage = {
      id: `${topic.id}-opening`,
      text: topic.content,
      authorName: topic.author,
      createdAt: topic.createdAt,
      likeCount: Math.max(0, topic.likes),
    };
    const replies: ParentForumMessage[] = topic.comments.map((c) => ({
      id: c.id,
      text: c.content,
      authorName: c.author,
      createdAt: c.createdAt,
      likeCount: 0,
    }));
    const preview =
      topic.content.length > 140 ? `${topic.content.slice(0, 137).trim()}…` : topic.content;
    return {
      id: topic.id,
      title: topic.title,
      description: preview,
      createdAt: topic.createdAt,
      updatedAt: topic.createdAt,
      messages: [opening, ...replies],
    };
  });
}

export function loadConversations(audience: MojPutExperienceMode): ParentForumConversation[] {
  try {
    const raw = localStorage.getItem(storageKey(audience));
    if (!raw) {
      const initial = buildInitialConversations(audience);
      localStorage.setItem(storageKey(audience), JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as ParentForumConversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = buildInitialConversations(audience);
      localStorage.setItem(storageKey(audience), JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    const initial = buildInitialConversations(audience);
    try {
      localStorage.setItem(storageKey(audience), JSON.stringify(initial));
    } catch {
      /* ignore */
    }
    return initial;
  }
}

export function saveConversations(audience: MojPutExperienceMode, conversations: ParentForumConversation[]) {
  try {
    localStorage.setItem(storageKey(audience), JSON.stringify(conversations));
  } catch {
    /* ignore quota */
  }
}

export function readLikedMessageIds(audience: MojPutExperienceMode): Set<string> {
  try {
    const raw = localStorage.getItem(likedIdsKey(audience));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function writeLikedMessageIds(audience: MojPutExperienceMode, ids: Set<string>) {
  try {
    localStorage.setItem(likedIdsKey(audience), JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function readDisplayName(): string {
  try {
    return localStorage.getItem(PARENT_FORUM_DISPLAY_NAME_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeDisplayName(name: string) {
  try {
    const t = name.trim();
    if (t) localStorage.setItem(PARENT_FORUM_DISPLAY_NAME_KEY, t);
    else localStorage.removeItem(PARENT_FORUM_DISPLAY_NAME_KEY);
  } catch {
    /* ignore */
  }
}

export function createConversation(title: string, firstMessage: string, authorName: string): ParentForumConversation {
  const now = new Date().toISOString();
  const id = makeId("conv");
  const msgId = makeId("msg");
  const preview = firstMessage.length > 160 ? `${firstMessage.slice(0, 157).trim()}…` : firstMessage;
  return {
    id,
    title: title.trim(),
    description: preview,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: msgId,
        text: firstMessage.trim(),
        authorName: authorName.trim() || "Gost",
        createdAt: now,
        likeCount: 0,
      },
    ],
  };
}

export function appendMessage(
  conversations: ParentForumConversation[],
  conversationId: string,
  text: string,
  authorName: string,
): ParentForumConversation[] {
  const now = new Date().toISOString();
  const msgId = makeId("msg");
  return conversations.map((c) => {
    if (c.id !== conversationId) return c;
    return {
      ...c,
      updatedAt: now,
      messages: [
        ...c.messages,
        {
          id: msgId,
          text: text.trim(),
          authorName: authorName.trim() || "Gost",
          createdAt: now,
          likeCount: 0,
        },
      ],
    };
  });
}

/**
 * Lajk je po pregledniku: jedan korisnik (ovaj uređaj) može uključiti/isključiti lajk po poruci.
 * Broj lajkova na poruci se prilagođava pri svakom kliku.
 */
export function toggleMessageLike(
  conversations: ParentForumConversation[],
  messageId: string,
  likedIds: Set<string>,
): { conversations: ParentForumConversation[]; likedIds: Set<string> } {
  const nextLiked = new Set(likedIds);
  const wasLiked = nextLiked.has(messageId);

  const updated = conversations.map((c) => ({
    ...c,
    messages: c.messages.map((m) => {
      if (m.id !== messageId) return m;
      if (wasLiked) {
        return { ...m, likeCount: Math.max(0, m.likeCount - 1) };
      }
      return { ...m, likeCount: m.likeCount + 1 };
    }),
  }));

  if (wasLiked) nextLiked.delete(messageId);
  else nextLiked.add(messageId);

  return { conversations: updated, likedIds: nextLiked };
}

export function totalThreadLikes(c: ParentForumConversation): number {
  return c.messages.reduce((s, m) => s + m.likeCount, 0);
}
