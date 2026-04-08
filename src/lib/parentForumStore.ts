import { forumSeed } from "@/data/parentHub";

const STORAGE_KEY = "mojput_parent_forum_conversations_v1";
const LIKED_IDS_KEY = "mojput_parent_forum_liked_message_ids_v1";
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

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Početni sadržaj iz seed podataka — svaka tema postaje razgovor s porukama. */
export function buildInitialConversations(): ParentForumConversation[] {
  return forumSeed.map((topic) => {
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

export function loadConversations(): ParentForumConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = buildInitialConversations();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as ParentForumConversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = buildInitialConversations();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    const initial = buildInitialConversations();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch {
      /* ignore */
    }
    return initial;
  }
}

export function saveConversations(conversations: ParentForumConversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    /* ignore quota */
  }
}

export function readLikedMessageIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function writeLikedMessageIds(ids: Set<string>) {
  try {
    localStorage.setItem(LIKED_IDS_KEY, JSON.stringify([...ids]));
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
