import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Flag,
  LogOut,
  LogIn,
  MessageCircle,
  MessagesSquare,
  Plus,
  Reply,
  Search,
  Send,
  ShieldCheck,
  ThumbsUp,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

/** Razgovori/poruke iz localStorage (offline fallback) koriste velike ID-eve; serverski su mali autoincrement. */
function isLocalForumConversationId(id: number): boolean {
  return id >= 1_000_000_000_000;
}

/** Lokalno spremanje samo kad server nije dostupan — odbijene poruke (filter, limit) se ne spremaju. */
function isOfflineError<T>(res: ApiResponse<T>): boolean {
  return !res.success && res.code === "NETWORK_ERROR";
}

const FORUM_RULES = [
  "Bez vrijeđanja, psovki, prijetnji i govora mržnje.",
  "Ne objavljuj osobne podatke (broj mobitela, adresu, OIB) — ni svoje ni tuđe.",
  "Bez reklama i spama.",
  "Poruke koje više korisnika prijavi automatski se skrivaju dok ih moderator ne pregleda.",
];

function ForumRulesNote({ className }: { className?: string }) {
  return (
    <details className={cn("mb-2 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground", className ?? "border-border/70 bg-background/70")}>
      <summary className="flex cursor-pointer items-center gap-1.5 font-semibold text-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
        Pravila zajednice
      </summary>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
        {FORUM_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </details>
  );
}
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { experiencePageClass, resolveExperienceMode, type MojPutExperienceMode } from "@/lib/experience";
import { cn } from "@/lib/utils";
import { CARD, JBack, JuniorBlobs, PageHero, StatTile } from "@/components/junior-kit";
import { PageHero as SeniorHero, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";
import { MessagesSquare as ForumHeroIcon } from "lucide-react";

type ForumMessage = {
  id: number;
  userId: number;
  username: string;
  text: string;
  timestamp: Date;
  likeCount: number;
  userLiked: boolean;
  replyToId?: number | null;
  replyToUsername?: string | null;
  replyToSnippet?: string | null;
  /** Autor je uklonio poruku s prikaza; tekst ostaje u bazi za evidenciju. */
  deletedByUser?: boolean;
  /** Skrivena nakon prijava korisnika, čeka moderatora. */
  hidden?: boolean;
};

type ForumConversation = {
  id: number;
  title: string;
  description: string;
  creator: string;
  creatorId: number;
  createdAt: Date;
  messageCount: number;
  messages: ForumMessage[];
};

type SortMode = "recent" | "active";

const FORUM_LOCAL_KEY_PREFIX = "mojput_forum_local_conversations";

function forumLocalKey(audience: MojPutExperienceMode): string {
  return `${FORUM_LOCAL_KEY_PREFIX}_${audience}`;
}

function porukeOznaka(n: number): string {
  const k = n % 100;
  const m = n % 10;
  if (k >= 11 && k <= 14) return "poruka";
  if (m === 1) return "poruka";
  if (m >= 2 && m <= 4) return "poruke";
  return "poruka";
}

const SENIOR_FALLBACK_CONVERSATIONS: ForumConversation[] = [
  {
    id: 1001,
    title: "Kako se najbolje pripremiti za maturu iz matematike?",
    description: "Podijelite strategije učenja, skripte i što vam je najviše pomoglo.",
    creator: "AnaMatura",
    creatorId: -1,
    createdAt: new Date("2026-03-10T18:30:00+01:00"),
    messageCount: 3,
    messages: [
      {
        id: 5001,
        userId: -1,
        username: "AnaMatura",
        text: "Meni je najviše pomoglo rješavanje starih ispita po temama.",
        timestamp: new Date("2026-03-10T18:35:00+01:00"),
        likeCount: 4,
        userLiked: false,
      },
      {
        id: 5002,
        userId: -2,
        username: "Marko95",
        text: "Isto, plus kratke ponavljajuće bilješke za formule prije spavanja.",
        timestamp: new Date("2026-03-10T19:02:00+01:00"),
        likeCount: 2,
        userLiked: false,
      },
      {
        id: 5003,
        userId: -3,
        username: "Lana",
        text: "Probajte i timer metodu 50/10, meni je puno dignula fokus.",
        timestamp: new Date("2026-03-10T19:20:00+01:00"),
        likeCount: 1,
        userLiked: false,
      },
    ],
  },
  {
    id: 1002,
    title: "FER vs TVZ za softverski razvoj",
    description: "Iskustva, težina kolegija, praksa i mogućnosti zapošljavanja.",
    creator: "NikolaIT",
    creatorId: -1,
    createdAt: new Date("2026-03-12T16:10:00+01:00"),
    messageCount: 2,
    messages: [
      {
        id: 5101,
        userId: -4,
        username: "NikolaIT",
        text: "Ako netko studira na jednom od ta dva faksa, super bi došli realni dojmovi.",
        timestamp: new Date("2026-03-12T16:11:00+01:00"),
        likeCount: 3,
        userLiked: false,
      },
      {
        id: 5102,
        userId: -5,
        username: "MiaDev",
        text: "FER je teorijski intenzivniji, TVZ je često više praktično orijentiran.",
        timestamp: new Date("2026-03-12T18:07:00+01:00"),
        likeCount: 5,
        userLiked: false,
      },
    ],
  },
  {
    id: 1003,
    title: "Kako odabrati fakultet ako nisam siguran što želim?",
    description: "Pitanja o interesima, testovima samoprocjene i savjetovanju.",
    creator: "Petra",
    creatorId: -1,
    createdAt: new Date("2026-03-13T12:00:00+01:00"),
    messageCount: 1,
    messages: [
      {
        id: 5201,
        userId: -6,
        username: "Petra",
        text: "Ako ste bili neodlučni, kako ste na kraju donijeli odluku?",
        timestamp: new Date("2026-03-13T12:03:00+01:00"),
        likeCount: 2,
        userLiked: false,
      },
    ],
  },
];

const JUNIOR_FALLBACK_CONVERSATIONS: ForumConversation[] = [
  {
    id: 2001,
    title: "Kako odabrati srednju školu ako nisam siguran što želim?",
    description: "Pitanja o interesima, smjerovima i savjetima starijih učenika.",
    creator: "Petra",
    creatorId: -1,
    createdAt: new Date("2026-03-13T12:00:00+01:00"),
    messageCount: 1,
    messages: [
      {
        id: 6001,
        userId: -6,
        username: "Petra",
        text: "Ako ste bili neodlučni pri upisu u srednju, kako ste na kraju donijeli odluku?",
        timestamp: new Date("2026-03-13T12:03:00+01:00"),
        likeCount: 2,
        userLiked: false,
      },
    ],
  },
  {
    id: 2002,
    title: "Gimnazija ili strukovna škola — kako ste odlučili?",
    description: "Iskustva, praksa u učenju i što biste danas drugačije odabrali.",
    creator: "LukaSS",
    creatorId: -1,
    createdAt: new Date("2026-03-11T15:20:00+01:00"),
    messageCount: 2,
    messages: [
      {
        id: 6101,
        userId: -7,
        username: "LukaSS",
        text: "Ne znam je li bolje ići na gimnaziju ili neki IT smjer u strukovnoj — tko ima iskustva?",
        timestamp: new Date("2026-03-11T15:22:00+01:00"),
        likeCount: 3,
        userLiked: false,
      },
      {
        id: 6102,
        userId: -8,
        username: "MajaGim",
        text: "Ja sam na gimnaziji i zadovoljna sam, ali kolege na strukovnoj puno više rade praktične stvari.",
        timestamp: new Date("2026-03-11T17:45:00+01:00"),
        likeCount: 4,
        userLiked: false,
      },
    ],
  },
  {
    id: 2003,
    title: "Koji smjer u srednjoj za medicinu, IT ili ekonomiju?",
    description: "Preporuke smjera, škola i savjeti za daljnji put nakon srednje.",
    creator: "IvanaUpis",
    creatorId: -1,
    createdAt: new Date("2026-03-09T10:00:00+01:00"),
    messageCount: 2,
    messages: [
      {
        id: 6201,
        userId: -9,
        username: "IvanaUpis",
        text: "Zanima me medicina poslije srednje — koji smjer i škola vam se čine najbolji start?",
        timestamp: new Date("2026-03-09T10:05:00+01:00"),
        likeCount: 5,
        userLiked: false,
      },
      {
        id: 6202,
        userId: -10,
        username: "TomoMed",
        text: "Prirodoslovna gimnazija je klasičan put, ali znam i ljude koji su krenuli preko medicinske sestre u strukovnoj.",
        timestamp: new Date("2026-03-09T11:30:00+01:00"),
        likeCount: 3,
        userLiked: false,
      },
    ],
  },
];

function fallbackConversationsFor(audience: MojPutExperienceMode): ForumConversation[] {
  return audience === "junior" ? JUNIOR_FALLBACK_CONVERSATIONS : SENIOR_FALLBACK_CONVERSATIONS;
}

const readLocalConversations = (audience: MojPutExperienceMode): ForumConversation[] => {
  try {
    const raw = localStorage.getItem(forumLocalKey(audience));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{
      id: number;
      title: string;
      description: string;
      creator: string;
      creatorId: number;
      createdAt: string;
      messageCount: number;
      messages: Array<{
        id: number;
        userId: number;
        username: string;
        text: string;
        timestamp: string;
        likeCount: number;
        userLiked: boolean;
      }>;
    }>;
    return parsed.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      messages: conv.messages.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) })),
    }));
  } catch {
    return [];
  }
};

const writeLocalConversations = (audience: MojPutExperienceMode, conversations: ForumConversation[]) => {
  localStorage.setItem(forumLocalKey(audience), JSON.stringify(conversations));
};

/** Cache poruka po ID-u razgovora (server ili lokalno) — pamti poruke kad API nakratko zakaže ili nakon slanja. */
const FORUM_MSG_CACHE_PREFIX = "mojput_forum_conv_msgs:";

type ForumMessageStored = Omit<ForumMessage, "timestamp"> & { timestamp: string };

function readForumMessagesCache(conversationId: number): ForumMessage[] | null {
  try {
    const raw = localStorage.getItem(`${FORUM_MSG_CACHE_PREFIX}${conversationId}`);
    if (!raw) return null;
    const arr = JSON.parse(raw) as ForumMessageStored[];
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return null;
  }
}

function writeForumMessagesCache(conversationId: number, messages: ForumMessage[]) {
  try {
    localStorage.setItem(
      `${FORUM_MSG_CACHE_PREFIX}${conversationId}`,
      JSON.stringify(
        messages.map((m) => ({
          ...m,
          timestamp: m.timestamp.toISOString(),
        })),
      ),
    );
  } catch {
    /* kvota / privatni način */
  }
}

const Forum = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const fallbackConversations = fallbackConversationsFor(audience);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const canUseForum = Boolean(currentUser);
  /** U ADMIN_EMAILS (npr. mojputhr@gmail.com) – može ukloniti i tuđe poruke. */
  const isForumModerator = Boolean(currentUser?.is_admin);

  const [conversations, setConversations] = useState<ForumConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState<ForumConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConvTitle, setNewConvTitle] = useState("");
  const [newConvDescription, setNewConvDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<ForumMessage | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
  /** Server nedostupan — prikazujemo lokalne i primjer teme, jasno označene. */
  const [offline, setOffline] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());
  /** Skrolani kontejner poruka — skrolamo samo njega da se ne pomiče cijela stranica. */
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      const user = userFromAuthMe(res);
      setCurrentUser(user ?? null);
      setAuthChecked(true);
    });
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      authMe().then((res) => {
        const user = userFromAuthMe(res);
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await apiGet<{ data: unknown }>(`/api/forum/conversations?audience=${audience}`);
      if (res.success) {
        const raw = (res as { data?: unknown }).data;
        const rows = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { data?: unknown[] } | undefined)?.data)
            ? ((raw as { data?: unknown[] }).data as unknown[])
            : [];
        const mapped = (rows as Array<{
          id: number;
          title: string;
          description: string;
          creator_username: string;
          created_at: string;
          message_count: number;
        }>).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description || "",
          creator: c.creator_username || "",
          creatorId: -1,
          createdAt: new Date(c.created_at),
          messageCount: typeof c.message_count === "number" ? c.message_count : 0,
          messages: [],
        }));
        setOffline(false);
        setConversations(mapped);
      } else {
        setOffline(true);
        setConversations([...readLocalConversations(audience), ...fallbackConversations]);
      }
    } catch {
      setOffline(true);
      setConversations([...readLocalConversations(audience), ...fallbackConversations]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const applyMessagesToConversation = (conversationId: number, messages: ForumMessage[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages, messageCount: messages.length } : c,
      ),
    );
    setSelectedConversation((prev) => {
      if (!prev || prev.id !== conversationId) return prev;
      return { ...prev, messages, messageCount: messages.length };
    });
    writeForumMessagesCache(conversationId, messages);
  };

  const loadMessages = async (conversationId: number, options?: { silent?: boolean }) => {
    if (!options?.silent) setLoadingMessages(true);
    try {
      const res = await apiGet<{ data: unknown }>(`/api/forum/conversations/${conversationId}/messages`);
      if (res.success) {
        const raw = (res as { data?: unknown }).data;
        const rows = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { data?: unknown[] } | undefined)?.data)
            ? ((raw as { data?: unknown[] }).data as unknown[])
            : [];
        const messages: ForumMessage[] = (rows as Array<{
          id: number;
          user_id: number;
          username: string;
          text: string;
          created_at: string;
          like_count: number;
          user_liked: boolean;
          reply_to_id?: number | null;
          deleted_by_user_at?: string | null;
          hidden?: boolean;
          reply_to_username?: string | null;
          reply_to_snippet?: string | null;
        }>).map((m) => ({
          id: Number(m.id),
          userId: Number(m.user_id),
          username: String(m.username ?? ""),
          text: m.text ?? "",
          timestamp: new Date(m.created_at as string),
          likeCount: Number(m.like_count ?? 0),
          userLiked: Boolean(m.user_liked),
          replyToId: m.reply_to_id ?? null,
          replyToUsername: m.reply_to_username ?? null,
          replyToSnippet: m.reply_to_snippet ?? null,
          deletedByUser: Boolean(m.deleted_by_user_at),
          hidden: Boolean(m.hidden),
        }));

        applyMessagesToConversation(conversationId, messages);
      } else {
        const cached = readForumMessagesCache(conversationId);
        if (cached?.length) {
          applyMessagesToConversation(conversationId, cached);
        } else {
          const fallbackConv = fallbackConversations.find((c) => c.id === conversationId);
          if (fallbackConv) {
            applyMessagesToConversation(conversationId, fallbackConv.messages);
          }
        }
      }
    } catch {
      const cached = readForumMessagesCache(conversationId);
      if (cached?.length) {
        applyMessagesToConversation(conversationId, cached);
      } else {
        const fallbackConv = fallbackConversations.find((c) => c.id === conversationId);
        if (fallbackConv) {
          applyMessagesToConversation(conversationId, fallbackConv.messages);
        }
      }
    } finally {
      if (!options?.silent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    setSelectedConversation(null);
    loadConversations();
  }, [audience]);

  useEffect(() => {
    if (!selectedConversation?.messages.length) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    // NE koristimo scrollIntoView jer on skrola i `window`, pa cijela stranica
    // skoči prema dolje kad se otvori razgovor ili stigne nova poruka.
    el.scrollTop = el.scrollHeight;
  }, [selectedConversation?.messages]);

  const handleLogout = async () => {
    await authLogout(currentUser?.email);
    setCurrentUser(null);
    setSelectedConversation(null);
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newConvTitle.trim()) return;

    const res = await apiPost<{
      id: number;
      title: string;
      description: string;
      created_at: string;
      creator_username: string;
      message_count: number;
    }>("/api/forum/conversations", { title: newConvTitle.trim(), description: newConvDescription.trim(), audience });
    let newConversation: ForumConversation | null = null;
    if (res.success) {
      const c = res.data;
      if (c) {
        newConversation = {
          id: c.id,
          title: c.title,
          description: c.description || "",
          creator: c.creator_username || currentUser.username,
          creatorId: currentUser.id,
          createdAt: new Date(c.created_at),
          messageCount: c.message_count ?? 0,
          messages: [],
        };
      }
    } else if (!isOfflineError(res)) {
      toast.error(res.message || "Tema nije objavljena.");
      return;
    } else {
      toast("Server nije dostupan — tema je spremljena samo na ovom uređaju.");
      newConversation = {
        id: Date.now(),
        title: newConvTitle.trim(),
        description: newConvDescription.trim(),
        creator: currentUser.username,
        creatorId: currentUser.id,
        createdAt: new Date(),
        messageCount: 0,
        messages: [],
      };
    }
    if (!newConversation) return;

    setConversations((prev) => [newConversation, ...prev]);
    if (isLocalForumConversationId(newConversation.id)) {
      writeLocalConversations(audience, [newConversation, ...readLocalConversations(audience)]);
    }
    setNewConvTitle("");
    setNewConvDescription("");
    setShowNewConversationModal(false);
    setSelectedConversation(newConversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedConversation || !messageInput.trim()) return;

    const replyId = replyingTo?.id;
    const convId = selectedConversation.id;
    const textTrim = messageInput.trim();
    setSendingMessage(true);

    const res = await apiPost<{
      data?: {
        id: number;
        user_id: number;
        username: string;
        text: string;
        created_at: string;
        like_count: number;
        user_liked: boolean;
        reply_to_id?: number | null;
        reply_to_username?: string | null;
        reply_to_snippet?: string | null;
      };
    }>(`/api/forum/conversations/${convId}/messages`, {
      text: textTrim,
      ...(replyId != null && !isLocalForumConversationId(replyId) ? { reply_to_id: replyId } : {}),
    });

    if (res.success) {
      setMessageInput("");
      setReplyingTo(null);
      await loadMessages(convId, { silent: true });
      setSendingMessage(false);
      return;
    }

    if (!isOfflineError(res) && !isLocalForumConversationId(convId)) {
      toast.error(res.message || "Poruka nije poslana.");
      setSendingMessage(false);
      return;
    }

    // Backend nedostupan — spremi poruku lokalno da ostane nakon osvježavanja stranice
    const newMessage: ForumMessage = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      text: textTrim,
      timestamp: new Date(),
      likeCount: 0,
      userLiked: false,
      replyToId: replyingTo?.id,
      replyToUsername: replyingTo?.username,
      replyToSnippet: replyingTo
        ? replyingTo.deletedByUser
          ? "(poruka uklonjena od autora)"
          : (replyingTo.text || "").slice(0, 120)
        : undefined,
      deletedByUser: false,
    };

    const nextMessages = [...selectedConversation.messages, newMessage];
    writeForumMessagesCache(convId, nextMessages);

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId
          ? { ...conv, messages: nextMessages, messageCount: nextMessages.length }
          : conv,
      ),
    );
    setSelectedConversation((prev) =>
      prev && prev.id === convId
        ? { ...prev, messages: nextMessages, messageCount: nextMessages.length }
        : prev,
    );

    if (isLocalForumConversationId(convId)) {
      const localConvs = readLocalConversations(audience);
      const updatedLocal = localConvs.map((conv) =>
        conv.id === convId ? { ...conv, messages: nextMessages, messageCount: nextMessages.length } : conv,
      );
      writeLocalConversations(audience, updatedLocal);
    }

    setMessageInput("");
    setReplyingTo(null);
    setSendingMessage(false);
  };

  const handleSoftDeleteMessage = async (msg: ForumMessage) => {
    if (!currentUser || msg.deletedByUser) return;
    const canDelete = currentUser.id === msg.userId || currentUser.is_admin === true;
    if (!canDelete) return;
    if (!selectedConversation) return;

    if (isLocalForumConversationId(msg.id)) {
      const mark = (m: ForumMessage) =>
        m.id === msg.id ? { ...m, text: "", deletedByUser: true, replyToSnippet: m.replyToSnippet } : m;
      const nextMsgs = selectedConversation.messages.map(mark);
      writeForumMessagesCache(selectedConversation.id, nextMsgs);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, messages: c.messages.map(mark) }
            : c,
        ),
      );
      setSelectedConversation((prev) =>
        prev ? { ...prev, messages: prev.messages.map(mark) } : prev,
      );
      if (isLocalForumConversationId(selectedConversation.id)) {
        const localConvs = readLocalConversations(audience);
        const updated = localConvs.map((c) =>
          c.id === selectedConversation.id ? { ...c, messages: c.messages.map(mark) } : c,
        );
        writeLocalConversations(audience, updated);
      }
      return;
    }

    setDeletingMessageId(msg.id);
    try {
      const res = await apiPost<{ success?: boolean }>(`/api/forum/messages/${msg.id}/soft-delete`, {});
      if (res.success) {
        const mark = (m: ForumMessage) =>
          m.id === msg.id ? { ...m, text: "", deletedByUser: true } : m;
        const nextMsgs = selectedConversation.messages.map(mark);
        writeForumMessagesCache(selectedConversation.id, nextMsgs);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id ? { ...c, messages: c.messages.map(mark) } : c,
          ),
        );
        setSelectedConversation((prev) =>
          prev ? { ...prev, messages: prev.messages.map(mark) } : prev,
        );
        if (replyingTo?.id === msg.id) setReplyingTo(null);
      }
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleReportMessage = async (msg: ForumMessage) => {
    if (!currentUser || msg.userId === currentUser.id || reportedIds.has(msg.id)) return;
    if (isLocalForumConversationId(msg.id)) return;
    if (!window.confirm("Prijaviti ovu poruku moderatorima? Poruka se skriva nakon više prijava.")) return;
    const res = await apiPost<{ hidden?: boolean }>(`/api/forum/messages/${msg.id}/report`, { reason: "neprimjereno" });
    if (!res.success) {
      toast.error(res.message || "Prijava nije poslana.");
      return;
    }
    setReportedIds((prev) => new Set(prev).add(msg.id));
    toast.success("Hvala, prijava je zaprimljena.");
    if ((res as { hidden?: boolean }).hidden && selectedConversation) {
      await loadMessages(selectedConversation.id, { silent: true });
    }
  };

  const handleLikeMessage = async (messageId: number) => {
    if (!canUseForum || !currentUser || !selectedConversation) return;

    const res = await apiPost<{ liked?: boolean; like_count?: number }>(`/api/forum/messages/${messageId}/like`, {});
    let liked = false;
    let like_count = 0;
    if (res.success) {
      ({ liked = false, like_count = 0 } = res as { liked?: boolean; like_count?: number });
    } else {
      const msg = selectedConversation.messages.find((m) => m.id === messageId);
      if (!msg) return;
      liked = !msg.userLiked;
      like_count = liked ? msg.likeCount + 1 : Math.max(0, msg.likeCount - 1);
    }
    const updateMsg = (m: ForumMessage) =>
      m.id === messageId ? { ...m, likeCount: like_count, userLiked: liked } : m;

    const nextMsgs = selectedConversation.messages.map(updateMsg);
    writeForumMessagesCache(selectedConversation.id, nextMsgs);

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: conv.messages.map(updateMsg) }
          : conv,
      ),
    );
    setSelectedConversation((prev) =>
      prev ? { ...prev, messages: prev.messages.map(updateMsg) } : prev,
    );
    if (isLocalForumConversationId(selectedConversation.id)) {
      const localConvs = readLocalConversations(audience);
      if (localConvs.length) {
        const updatedLocal = localConvs.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: conv.messages.map(updateMsg) }
            : conv,
        );
        writeLocalConversations(audience, updatedLocal);
      }
    }
  };

  const sortedConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(term) || conv.description.toLowerCase().includes(term),
    );
    const copy = [...filtered];
    if (sortMode === "recent") {
      copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      copy.sort(
        (a, b) =>
          b.messageCount - a.messageCount || b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }
    return copy;
  }, [conversations, searchTerm, sortMode]);

  const forumStats = useMemo(() => {
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, c) => sum + (c.messageCount ?? 0), 0);
    const uniqueAuthors = new Set(conversations.map((c) => c.creator).filter(Boolean)).size;
    return { totalConversations, totalMessages, uniqueAuthors };
  }, [conversations]);

  return (
    <Layout>
      <PageSeo title="Forum za učenike i studente – MojPut" description="Pitaj učenike i studente o upisu, fakultetima i srednjim školama. Moderirani forum s pravilima i prijavom neprimjerenih objava." />
      <section className={cn(experiencePageClass(isJunior), "relative mx-auto max-w-6xl px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:py-8")}>
        {isJunior ? <JuniorBlobs /> : <SeniorBlobs />}
        {isJunior ? (
          <div className={cn(selectedConversation && "max-md:hidden")}>
            <JBack crumb="Forum" />
            <PageHero
              icon={ForumHeroIcon}
              tone="rose"
              kicker="Zajednica"
              badge="Forum"
              title={
                <>
                  Forum o <span className="text-[hsl(var(--jh-rose))]">srednjoj školi</span>
                </>
              }
              lead="Pitaj o smjerovima, bodovima i upisu. Teme su odmah ispod."
              stats={[
                forumStats.totalConversations > 0 ? { label: "Teme", value: forumStats.totalConversations } : null,
                forumStats.totalMessages > 0 ? { label: "Poruke", value: forumStats.totalMessages } : null,
                forumStats.uniqueAuthors > 0 ? { label: "Članovi", value: forumStats.uniqueAuthors } : null,
              ].filter(Boolean) as { label: string; value: number }[]}
            />
          </div>
        ) : (
          <div className={cn(selectedConversation && "max-md:hidden")}>
            <SBack crumb="Forum" />
            <SeniorHero
              icon={ForumHeroIcon}
              tone="fuchsia"
              index="08"
              kicker="Forum"
              badge="Zajednica"
              title={
                <>
                  Forum za <span className="text-[hsl(var(--sr-fuchsia))]">učenike</span>
                </>
              }
              lead="Pitaj o maturi, fakultetima i studentskom životu. Teme su odmah ispod."
              stats={[
                forumStats.totalConversations > 0 ? { label: "Teme", value: forumStats.totalConversations } : null,
                forumStats.totalMessages > 0 ? { label: "Poruke", value: forumStats.totalMessages } : null,
                forumStats.uniqueAuthors > 0 ? { label: "Članovi", value: forumStats.uniqueAuthors } : null,
              ].filter(Boolean) as { label: string; value: number }[]}
            />
          </div>
        )}

        {authChecked && !canUseForum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "mb-4 rounded-2xl border-2 p-3 shadow-sm md:mb-6 md:p-4",
              isJunior
                ? "border-[hsl(var(--jh-teal)/0.28)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.12)] via-card to-[hsl(var(--jh-violet)/0.08)]"
                : "border-[hsl(var(--sr-gold)/0.32)] bg-gradient-to-r from-[hsl(var(--sr-gold)/0.12)] via-card to-[hsl(var(--sr-cyan)/0.08)]",
              selectedConversation && "max-md:hidden",
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center",
                    isJunior
                      ? "jh-blob-shape bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white"
                      : "sr-hex bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))]",
                  )}
                >
                  <LogIn className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-foreground">Čitaš kao gost</p>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-muted-foreground">
                    Sve teme i poruke su ti vidljive. Za slanje poruka, lajkanje i otvaranje novih tema — prijavi se.
                  </p>
                </div>
              </div>
              <Link
                to="/prijava"
                className={cn(
                  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold shadow-md sm:min-h-0 sm:py-2.5 touch-manipulation",
                  isJunior ? "jh-cta" : "sr-gold-btn",
                )}
              >
                <LogIn className="h-4 w-4" />
                Prijavi se
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={cn(
            "overflow-hidden border-2",
            isJunior
              ? cn(CARD, "border-2 border-[hsl(var(--jh-teal)/0.32)]")
              : cn(SCARD, "border-[hsl(var(--sr-cyan)/0.32)]"),
          )}
        >
          <div
            className={cn(
              "flex min-h-0 flex-col md:h-[620px] md:flex-row",
              // On mobile, when a conversation is selected, use near-full viewport height so the
              // chat is comfortable to read; otherwise let the list flow naturally on the page.
              selectedConversation
                ? "h-[calc(100dvh-8rem)] max-md:min-h-[520px]"
                : "max-md:h-auto",
            )}
          >
            {/* Sidebar */}
            <div
              className={cn(
                "flex min-h-0 w-full shrink-0 flex-col md:w-[min(100%,20rem)]",
                isJunior
                  ? "border-b border-[hsl(var(--jh-teal)/0.16)] bg-gradient-to-b from-[hsl(var(--jh-teal)/0.08)] via-[hsl(var(--jh-violet)/0.05)] to-card md:border-b-0 md:border-r md:border-[hsl(var(--jh-teal)/0.16)]"
                  : "border-b border-[hsl(var(--sr-cyan)/0.18)] bg-gradient-to-b from-[hsl(var(--sr-night)/0.07)] via-[hsl(var(--sr-cyan)/0.05)] to-card md:border-b-0 md:border-r md:border-[hsl(var(--sr-cyan)/0.18)]",
                selectedConversation && "max-md:hidden",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3 p-3 sm:p-4",
                  isJunior ? "border-b border-[hsl(var(--jh-violet)/0.16)]" : "border-b border-[hsl(var(--sr-gold)/0.18)]",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center text-sm font-extrabold shadow-md",
                    isJunior
                      ? "jh-blob-shape bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white"
                      : "sr-hex bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))] shadow-[var(--sr-page-glow-gold)]",
                  )}
                >
                  {(currentUser?.username?.[0] || "G").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-foreground">{currentUser?.username || "Gost"}</p>
                  <p className={cn("text-xs font-medium", isJunior ? "text-[hsl(var(--jh-teal-t))]" : "text-[hsl(var(--sr-gold-t))]")}>
                    {canUseForum ? "Član foruma" : "Samo pregled"}
                  </p>
                </div>
                {canUseForum ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={cn(
                      "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors touch-manipulation sm:p-2",
                      isJunior
                        ? "hover:bg-[hsl(var(--jh-teal)/0.1)] hover:text-[hsl(var(--jh-teal-t))]"
                        : "hover:bg-[hsl(var(--sr-gold)/0.12)] hover:text-[hsl(var(--sr-gold-t))]",
                    )}
                    title="Odjava"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className={cn(
                      "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors touch-manipulation sm:p-2",
                      isJunior
                        ? "hover:bg-[hsl(var(--jh-teal)/0.1)] hover:text-[hsl(var(--jh-teal-t))]"
                        : "hover:bg-[hsl(var(--sr-gold)/0.12)] hover:text-[hsl(var(--sr-gold-t))]",
                    )}
                    title="Prijava"
                  >
                    <LogIn className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className={cn("p-3", isJunior ? "border-b border-[hsl(var(--jh-teal)/0.16)]" : "border-b border-[hsl(var(--sr-cyan)/0.16)]")}>
                {canUseForum ? (
                  <button
                    type="button"
                    onClick={() => setShowNewConversationModal(true)}
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold shadow-md transition-all hover:shadow-lg active:scale-[0.98] sm:min-h-10 sm:py-2.5 touch-manipulation",
                      isJunior ? "jh-cta" : "sr-gold-btn",
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    Novi razgovor
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-extrabold transition-colors sm:min-h-10 sm:py-2.5 touch-manipulation",
                      isJunior
                        ? "border-[hsl(var(--jh-teal)/0.42)] bg-[hsl(var(--jh-teal)/0.1)] text-[hsl(var(--jh-teal-t))] hover:bg-[hsl(var(--jh-teal)/0.16)]"
                        : "border-[hsl(var(--sr-gold)/0.42)] bg-[hsl(var(--sr-gold)/0.1)] text-[hsl(var(--sr-gold-t))] hover:bg-[hsl(var(--sr-gold)/0.16)]",
                    )}
                  >
                    <LogIn className="h-4 w-4" />
                    Prijavi se za pisanje
                  </Link>
                )}
              </div>

              <div className={cn("p-3", isJunior ? "border-b border-[hsl(var(--jh-teal)/0.16)]" : "border-b border-[hsl(var(--sr-cyan)/0.16)]")}>
                <div className="relative">
                  <Search
                    className={cn(
                      "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                      isJunior ? "text-[hsl(var(--jh-teal-t))]" : "text-[hsl(var(--sr-cyan-t))]",
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Pretraži teme…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      "h-11 w-full rounded-xl border-2 bg-background py-2.5 pl-9 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 sm:h-10 sm:text-sm",
                      isJunior
                        ? "border-[hsl(var(--jh-teal)/0.28)] focus:border-[hsl(var(--jh-teal))] focus:ring-[hsl(var(--jh-teal)/0.22)]"
                        : "border-[hsl(var(--sr-cyan)/0.28)] focus:border-[hsl(var(--sr-cyan))] focus:ring-[hsl(var(--sr-cyan)/0.22)]",
                    )}
                  />
                </div>
              </div>

              <div className={cn("px-3 py-2.5", isJunior ? "border-b border-[hsl(var(--jh-teal)/0.16)]" : "border-b border-[hsl(var(--sr-cyan)/0.16)]")}>
                <p
                  className={cn(
                    "mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em]",
                    isJunior ? "text-[hsl(var(--jh-violet-t))]" : "text-[hsl(var(--sr-cyan-t))]",
                  )}
                >
                  Poredaj
                </p>
                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setSortMode("recent")}
                    className={cn(
                      "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-extrabold transition-all touch-manipulation",
                      sortMode === "recent"
                        ? isJunior
                          ? "border-transparent bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-teal)/0.8)]"
                          : "border-transparent sr-gold-btn shadow-sm"
                        : isJunior
                          ? "border-[hsl(var(--jh-teal)/0.28)] bg-background text-foreground hover:border-[hsl(var(--jh-teal)/0.5)]"
                          : "border-[hsl(var(--sr-gold)/0.25)] bg-background text-foreground hover:border-[hsl(var(--sr-gold)/0.5)]",
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Najnovije
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode("active")}
                    className={cn(
                      "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-extrabold transition-all touch-manipulation",
                      sortMode === "active"
                        ? isJunior
                          ? "border-transparent bg-gradient-to-br from-[hsl(var(--jh-violet))] to-[hsl(248_80%_68%)] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-violet)/0.8)]"
                          : "border-transparent bg-[hsl(var(--sr-cyan))] text-[hsl(var(--sr-night))] shadow-[var(--sr-page-glow-cyan)]"
                        : isJunior
                          ? "border-[hsl(var(--jh-violet)/0.28)] bg-background text-foreground hover:border-[hsl(var(--jh-violet)/0.5)]"
                          : "border-[hsl(var(--sr-cyan)/0.28)] bg-background text-foreground hover:border-[hsl(var(--sr-cyan)/0.55)]",
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Najživlje
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 md:overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-8 text-center">
                    <div
                      className={cn(
                        "inline-block h-6 w-6 animate-spin rounded-full border-2 border-t-transparent",
                        isJunior ? "border-[hsl(var(--jh-teal))]" : "border-[hsl(var(--sr-gold))]",
                      )}
                    />
                    <p className="mt-3 text-xs text-muted-foreground">Učitavam razgovore…</p>
                  </div>
                ) : sortedConversations.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <div
                      className={cn(
                        "mx-auto mb-3 flex h-12 w-12 items-center justify-center",
                        isJunior
                          ? "jh-blob-shape bg-[hsl(var(--jh-violet)/0.14)] text-[hsl(var(--jh-violet-t))]"
                          : "sr-hex bg-[hsl(var(--sr-gold)/0.16)] text-[hsl(var(--sr-gold-t))]",
                      )}
                    >
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-extrabold text-foreground">
                      {isJunior ? "Još nema tema o srednjoj" : "Još nema tema"}
                    </p>
                    <p className="mx-auto mt-1 max-w-[16rem] text-xs font-medium leading-relaxed text-muted-foreground">
                      {canUseForum
                        ? isJunior
                          ? "Otvori prvu: gimnazija ili struka, bodovi, upis, grad."
                          : "Otvori prvu temu i pitaj ono što te muči."
                        : "Teme će se pojaviti čim netko napiše."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 p-2">
                    {sortedConversations.map((conv) => {
                      const isActive = selectedConversation?.id === conv.id;
                      const initial = (conv.creator?.[0] || "?").toUpperCase();
                      return (
                        <button
                          key={conv.id}
                          type="button"
                          onClick={async () => {
                            setSelectedConversation(conv);
                            if (conv.messages.length === 0) await loadMessages(conv.id);
                          }}
                          className={cn(
                            "group flex w-full items-start gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all duration-200 touch-manipulation sm:px-3.5",
                            isActive
                              ? isJunior
                                ? "border-[hsl(var(--jh-teal)/0.42)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.14)] to-[hsl(var(--jh-violet)/0.08)] shadow-sm"
                                : "border-[hsl(var(--sr-gold)/0.42)] bg-gradient-to-r from-[hsl(var(--sr-gold)/0.16)] to-[hsl(var(--sr-cyan)/0.08)] shadow-sm"
                              : isJunior
                                ? "border-transparent hover:border-[hsl(var(--jh-violet)/0.28)] hover:bg-[hsl(var(--jh-violet)/0.07)] active:scale-[0.99]"
                                : "border-transparent hover:border-[hsl(var(--sr-cyan)/0.28)] hover:bg-[hsl(var(--sr-cyan)/0.07)] active:scale-[0.99]",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center text-sm font-extrabold transition-colors",
                              isJunior ? "jh-blob-shape" : "sr-hex",
                              isActive
                                ? isJunior
                                  ? "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white shadow-sm"
                                  : "bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))]"
                                : isJunior
                                  ? "bg-[hsl(var(--jh-teal)/0.12)] text-[hsl(var(--jh-teal-t))] group-hover:bg-[hsl(var(--jh-violet)/0.16)] group-hover:text-[hsl(var(--jh-violet-t))]"
                                  : "bg-[hsl(var(--sr-night)/0.08)] text-[hsl(var(--sr-cyan-t))] group-hover:bg-[hsl(var(--sr-cyan)/0.16)]",
                            )}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-extrabold leading-snug text-foreground">
                              {conv.title}
                            </p>
                            {conv.description ? (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {conv.description}
                              </p>
                            ) : null}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                              {conv.messageCount > 0 ? (
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-extrabold",
                                    isActive
                                      ? isJunior
                                        ? "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white"
                                        : "sr-gold-btn"
                                      : isJunior
                                        ? "bg-[hsl(var(--jh-sky)/0.16)] text-[hsl(var(--jh-sky-t))]"
                                        : "bg-[hsl(var(--sr-cyan)/0.14)] text-[hsl(var(--sr-cyan-t))]",
                                  )}
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  {conv.messageCount}
                                </span>
                              ) : (
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 font-extrabold",
                                    isJunior
                                      ? "bg-[hsl(var(--jh-violet)/0.12)] text-[hsl(var(--jh-violet-t))]"
                                      : "bg-[hsl(var(--sr-gold)/0.14)] text-[hsl(var(--sr-gold-t))]",
                                  )}
                                >
                                  Nova tema
                                </span>
                              )}
                              <span className="truncate">
                                {conv.createdAt.toLocaleDateString("hr-HR", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                              <span className="truncate">· {conv.creator || "Anonim"}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col",
                isJunior
                  ? "bg-[radial-gradient(ellipse_at_78%_8%,hsl(var(--jh-violet)/0.1),transparent_42%),radial-gradient(ellipse_at_12%_92%,hsl(var(--jh-teal)/0.1),transparent_48%)] bg-background"
                  : "bg-[radial-gradient(ellipse_at_78%_8%,hsl(var(--sr-gold)/0.11),transparent_42%),radial-gradient(ellipse_at_12%_92%,hsl(var(--sr-cyan)/0.1),transparent_48%)] bg-background",
                !selectedConversation && "max-md:hidden",
              )}
            >
              <AnimatePresence mode="wait">
                {selectedConversation ? (
                  <motion.div
                    key={selectedConversation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col"
                  >
                    <div
                      className={cn(
                        "shrink-0 p-3 sm:p-4",
                        isJunior
                          ? "border-b border-[hsl(var(--jh-teal)/0.18)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.12)] via-[hsl(var(--jh-violet)/0.07)] to-transparent"
                          : "border-b border-[hsl(var(--sr-gold)/0.22)] bg-gradient-to-r from-[hsl(var(--sr-gold)/0.14)] via-[hsl(var(--sr-cyan)/0.07)] to-transparent",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedConversation(null)}
                        className="mb-2 inline-flex min-h-[44px] -ml-1 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden touch-manipulation"
                      >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        Popis razgovora
                      </button>
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center text-sm font-extrabold shadow-sm sm:h-11 sm:w-11",
                            isJunior
                              ? "jh-blob-shape bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white"
                              : "sr-hex bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))]",
                          )}
                        >
                          {(selectedConversation.creator?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-pretty text-base font-extrabold leading-tight text-foreground sm:text-lg">
                            {selectedConversation.title}
                          </h2>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                            {selectedConversation.description || "Bez opisa"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-extrabold",
                                isJunior
                                  ? "bg-[hsl(var(--jh-sky)/0.16)] text-[hsl(var(--jh-sky-t))]"
                                  : "bg-[hsl(var(--sr-cyan)/0.16)] text-[hsl(var(--sr-cyan-t))]",
                              )}
                            >
                              <MessageCircle className="h-3 w-3" />
                              {selectedConversation.messageCount}{" "}
                              {porukeOznaka(selectedConversation.messageCount)}
                            </span>
                            <span className="truncate">
                              Autor: {selectedConversation.creator || "Anonim"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={messagesScrollRef}
                      className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-3 sm:p-4 [scrollbar-gutter:stable] [overscroll-behavior:contain]"
                    >
                      {loadingMessages ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <div
                              className={cn(
                                "mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-t-transparent",
                                isJunior ? "border-[hsl(var(--jh-teal))]" : "border-[hsl(var(--sr-gold))]",
                              )}
                            />
                            <p className="text-sm text-muted-foreground">Učitavam poruke…</p>
                          </div>
                        </div>
                      ) : selectedConversation.messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="max-w-xs text-center">
                            <MessageCircle
                              className={cn(
                                "mx-auto mb-4 h-14 w-14",
                                isJunior ? "text-[hsl(var(--jh-violet)/0.4)]" : "text-[hsl(var(--sr-gold)/0.45)]",
                              )}
                            />
                            <p className="text-sm text-muted-foreground">
                              {canUseForum
                                ? "Nema poruka. Budi prvi koji će započeti razgovor!"
                                : "U ovoj temi još nema poruka."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        selectedConversation.messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.userId === currentUser?.id ? "flex-row-reverse" : ""}`}
                          >
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center text-xs font-extrabold",
                                isJunior ? "jh-blob-shape" : "sr-hex",
                                msg.userId === currentUser?.id
                                  ? isJunior
                                    ? "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white"
                                    : "bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))]"
                                  : isJunior
                                    ? "bg-[hsl(var(--jh-sky)/0.16)] text-[hsl(var(--jh-sky-t))]"
                                    : "bg-[hsl(var(--sr-cyan)/0.16)] text-[hsl(var(--sr-cyan-t))]",
                              )}
                            >
                              {msg.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div
                              className={`flex max-w-[min(92%,20rem)] flex-col sm:max-w-[85%] md:max-w-sm ${msg.userId === currentUser?.id ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`mb-1 flex items-center gap-2 ${msg.userId === currentUser?.id ? "flex-row-reverse" : ""}`}
                              >
                                <span className="text-xs font-semibold text-foreground">{msg.username}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {msg.timestamp.toLocaleTimeString("hr-HR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              {msg.replyToId != null && (msg.replyToSnippet || msg.replyToUsername) && (
                                <div
                                  className={cn(
                                    "mb-1 max-w-full rounded-lg border px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground",
                                    isJunior
                                      ? "border-[hsl(var(--jh-violet)/0.22)] bg-[hsl(var(--jh-violet)/0.06)]"
                                      : "border-[hsl(var(--sr-cyan)/0.22)] bg-[hsl(var(--sr-cyan)/0.06)]",
                                    msg.userId === currentUser?.id ? "self-end" : "self-start",
                                  )}
                                >
                                  <Reply className="inline h-3 w-3 shrink-0 opacity-70" aria-hidden />
                                  {msg.replyToUsername && (
                                    <span className="font-semibold text-foreground"> {msg.replyToUsername}</span>
                                  )}
                                  {msg.replyToSnippet && (
                                    <span className="line-clamp-2 text-muted-foreground"> · {msg.replyToSnippet}</span>
                                  )}
                                </div>
                              )}
                              <div
                                className={cn(
                                  "rounded-2xl px-4 py-2.5 text-sm",
                                  msg.deletedByUser || msg.hidden
                                    ? "rounded-br-md rounded-bl-md border border-dashed border-border bg-muted/50 text-muted-foreground"
                                    : msg.userId === currentUser?.id
                                      ? isJunior
                                        ? "rounded-br-md bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white"
                                        : "rounded-br-md sr-gold-btn"
                                      : isJunior
                                        ? "rounded-bl-md border border-[hsl(var(--jh-sky)/0.28)] bg-[hsl(var(--jh-sky)/0.1)] text-foreground"
                                        : "rounded-bl-md border border-[hsl(var(--sr-cyan)/0.22)] bg-[hsl(var(--sr-cyan)/0.08)] text-foreground",
                                )}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {msg.deletedByUser ? (
                                    <span className="italic">
                                      Ova je poruka uklonjena s prikaza; u temi ostaje zapis radi konteksta.
                                    </span>
                                  ) : msg.hidden ? (
                                    <span className="italic">
                                      Poruka je skrivena nakon prijava korisnika i čeka pregled moderatora.
                                    </span>
                                  ) : (
                                    msg.text
                                  )}
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1",
                                  msg.userId === currentUser?.id ? "justify-end" : "justify-start",
                                )}
                              >
                                {canUseForum && !msg.deletedByUser && (
                                  <button
                                    type="button"
                                    onClick={() => setReplyingTo(msg)}
                                    className={cn(
                                      "inline-flex min-h-9 items-center gap-1 px-1 text-xs text-muted-foreground transition-colors touch-manipulation",
                                      isJunior ? "hover:text-[hsl(var(--jh-teal-t))]" : "hover:text-[hsl(var(--sr-gold-t))]",
                                    )}
                                  >
                                    <Reply className="h-3.5 w-3.5" />
                                    Odgovori
                                  </button>
                                )}
                                {canUseForum &&
                                  (currentUser?.id === msg.userId || isForumModerator) &&
                                  !msg.deletedByUser && (
                                  <button
                                    type="button"
                                    disabled={deletingMessageId === msg.id}
                                    onClick={() => void handleSoftDeleteMessage(msg)}
                                    className="inline-flex min-h-9 items-center gap-1 px-1 text-xs text-muted-foreground transition-colors hover:text-destructive touch-manipulation disabled:opacity-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    {isForumModerator && currentUser?.id !== msg.userId
                                      ? "Ukloni (moderator)"
                                      : "Ukloni s prikaza"}
                                  </button>
                                )}
                                {canUseForum && (
                                  <button
                                    type="button"
                                    onClick={() => handleLikeMessage(msg.id)}
                                    className={cn(
                                      "inline-flex min-h-9 items-center gap-1.5 px-1 text-xs transition-colors touch-manipulation",
                                      msg.userLiked
                                        ? isJunior
                                          ? "text-[hsl(var(--jh-violet-t))]"
                                          : "text-[hsl(var(--sr-gold-t))]"
                                        : "text-muted-foreground hover:text-foreground",
                                    )}
                                  >
                                    <ThumbsUp className={`h-3.5 w-3.5 ${msg.userLiked ? "fill-current" : ""}`} />
                                    {msg.likeCount > 0 && <span>{msg.likeCount}</span>}
                                  </button>
                                )}
                                {canUseForum &&
                                  !offline &&
                                  currentUser?.id !== msg.userId &&
                                  !msg.deletedByUser &&
                                  !msg.hidden && (
                                    <button
                                      type="button"
                                      disabled={reportedIds.has(msg.id)}
                                      onClick={() => void handleReportMessage(msg)}
                                      className="inline-flex min-h-9 items-center gap-1 px-1 text-xs text-muted-foreground transition-colors hover:text-destructive touch-manipulation disabled:opacity-50"
                                    >
                                      <Flag className="h-3.5 w-3.5" />
                                      {reportedIds.has(msg.id) ? "Prijavljeno" : "Prijavi"}
                                    </button>
                                  )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {canUseForum ? (
                      <form
                        onSubmit={handleSendMessage}
                        className={cn(
                          "shrink-0 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
                          isJunior
                            ? "border-t border-[hsl(var(--jh-teal)/0.18)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.08)] to-[hsl(var(--jh-violet)/0.07)]"
                            : "border-t border-[hsl(var(--sr-gold)/0.22)] bg-gradient-to-r from-[hsl(var(--sr-gold)/0.08)] to-[hsl(var(--sr-cyan)/0.07)]",
                        )}
                      >
                        <ForumRulesNote
                          className={
                            isJunior
                              ? "border-[hsl(var(--jh-teal)/0.25)] bg-[hsl(var(--jh-teal)/0.06)]"
                              : "border-[hsl(var(--sr-gold)/0.28)] bg-[hsl(var(--sr-gold)/0.07)]"
                          }
                        />
                        {replyingTo && (
                          <div
                            className={cn(
                              "mb-2 flex items-start justify-between gap-2 rounded-xl border px-3 py-2 text-xs text-foreground",
                              isJunior
                                ? "border-[hsl(var(--jh-violet)/0.28)] bg-[hsl(var(--jh-violet)/0.08)]"
                                : "border-[hsl(var(--sr-gold)/0.28)] bg-[hsl(var(--sr-gold)/0.1)]",
                            )}
                          >
                            <span className="min-w-0 leading-snug">
                              <Reply
                                className={cn(
                                  "inline h-3.5 w-3.5 shrink-0",
                                  isJunior ? "text-[hsl(var(--jh-violet-t))]" : "text-[hsl(var(--sr-gold-t))]",
                                )}
                                aria-hidden
                              />
                              <span className="font-medium"> Odgovor na {replyingTo.username}</span>
                              {!replyingTo.deletedByUser && replyingTo.text && (
                                <span className="text-muted-foreground"> — {replyingTo.text.slice(0, 100)}</span>
                              )}
                              {replyingTo.deletedByUser && (
                                <span className="text-muted-foreground"> — (poruka uklonjena)</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Odustani od odgovora"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-end gap-2 sm:gap-3">
                          <label className="sr-only" htmlFor="forum-message-input">
                            Poruka
                          </label>
                          <textarea
                            id="forum-message-input"
                            rows={1}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (messageInput.trim() && !sendingMessage) {
                                  (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                                }
                              }
                            }}
                            placeholder="Upiši poruku…"
                            className={cn(
                              "min-h-12 max-h-32 flex-1 resize-y rounded-xl border-2 bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 sm:min-h-10 sm:text-sm touch-manipulation",
                              isJunior
                                ? "border-[hsl(var(--jh-teal)/0.28)] focus:border-[hsl(var(--jh-teal))] focus:ring-[hsl(var(--jh-teal)/0.22)]"
                                : "border-[hsl(var(--sr-cyan)/0.28)] focus:border-[hsl(var(--sr-cyan))] focus:ring-[hsl(var(--sr-cyan)/0.22)]",
                            )}
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim() || sendingMessage}
                            className={cn(
                              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
                              isJunior ? "jh-cta" : "sr-gold-btn",
                            )}
                            aria-label="Pošalji poruku"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="mt-1.5 hidden text-[11px] text-muted-foreground sm:block">
                          Enter šalje poruku, Shift+Enter novi red.
                        </p>
                      </form>
                    ) : (
                      <div
                        className={cn(
                          "flex shrink-0 flex-col items-stretch justify-between gap-3 p-3 sm:flex-row sm:items-center sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
                          isJunior
                            ? "border-t border-[hsl(var(--jh-teal)/0.18)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.1)] to-[hsl(var(--jh-violet)/0.07)]"
                            : "border-t border-[hsl(var(--sr-gold)/0.22)] bg-gradient-to-r from-[hsl(var(--sr-gold)/0.1)] to-[hsl(var(--sr-cyan)/0.07)]",
                        )}
                      >
                        <p className="text-sm font-medium leading-snug text-muted-foreground">Prijavi se za slanje poruka</p>
                        <Link
                          to="/prijava"
                          className={cn(
                            "inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors sm:py-2.5 touch-manipulation",
                            isJunior ? "jh-cta" : "sr-gold-btn",
                          )}
                        >
                          <LogIn className="h-4 w-4" />
                          Prijavi se
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hidden flex-1 items-center justify-center md:flex"
                  >
                    <div className="max-w-xs text-center">
                      <div
                        className={cn(
                          "mx-auto mb-4 flex items-center justify-center",
                          isJunior
                            ? "h-16 w-16 jh-blob-shape bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-violet))] text-white shadow-[0_16px_32px_-14px_hsl(var(--jh-violet)/0.7)]"
                            : "h-16 w-16 sr-hex bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-[hsl(var(--sr-night))] shadow-[var(--sr-page-glow-gold)]",
                        )}
                      >
                        <MessageCircle className="h-8 w-8" />
                      </div>
                      <p className="text-lg font-extrabold tracking-tight text-foreground">
                        {isJunior ? "Odaberi temu" : "Odaberi razgovor"}
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-muted-foreground">
                        {canUseForum
                          ? "Ili otvori novu temu s lijeve strane."
                          : "Poruke su otvorene za čitanje. Za pisanje treba prijava."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Modal za novi razgovor */}
        <AnimatePresence>
          {showNewConversationModal && canUseForum && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewConversationModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pb-[env(safe-area-inset-bottom)]"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "max-h-[min(92dvh,560px)] w-full max-w-md overflow-y-auto rounded-t-2xl border-2 p-5 shadow-2xl sm:m-0 sm:rounded-2xl sm:p-6",
                  isJunior
                    ? cn(CARD, "border-[hsl(var(--jh-teal)/0.32)] bg-card")
                    : cn(SCARD, "border-[hsl(var(--sr-gold)/0.32)] bg-card"),
                )}
              >
                <h3 className="mb-1 text-lg font-bold text-foreground">Novi razgovor</h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  {isJunior
                    ? "Postavi pitanje ili otvori temu o odabiru srednje škole, smjerovima i iskustvima učenika."
                    : "Postavi pitanje ili otvori temu o maturi, fakultetima ili studentskom životu."}
                </p>
                <form onSubmit={handleCreateConversation} className="space-y-4">
                  <ForumRulesNote
                    className={
                      isJunior
                        ? "border-[hsl(var(--jh-teal)/0.25)] bg-[hsl(var(--jh-teal)/0.06)]"
                        : "border-[hsl(var(--sr-gold)/0.28)] bg-[hsl(var(--sr-gold)/0.07)]"
                    }
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground" htmlFor="forum-new-title">
                      Naziv
                    </label>
                    <input
                      id="forum-new-title"
                      type="text"
                      value={newConvTitle}
                      onChange={(e) => setNewConvTitle(e.target.value)}
                      placeholder={isJunior ? "npr. Gimnazija ili strukovna?" : "npr. Koji fakultet za IT?"}
                      className={cn(
                        "w-full rounded-xl border-2 bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2",
                        isJunior
                          ? "border-[hsl(var(--jh-teal)/0.28)] focus:border-[hsl(var(--jh-teal))] focus:ring-[hsl(var(--jh-teal)/0.22)]"
                          : "border-[hsl(var(--sr-cyan)/0.28)] focus:border-[hsl(var(--sr-cyan))] focus:ring-[hsl(var(--sr-cyan)/0.22)]",
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground" htmlFor="forum-new-desc">
                      Opis (opcionalno)
                    </label>
                    <textarea
                      id="forum-new-desc"
                      value={newConvDescription}
                      onChange={(e) => setNewConvDescription(e.target.value)}
                      placeholder="Ukratko opiši temu..."
                      rows={3}
                      className={cn(
                        "w-full resize-none rounded-xl border-2 bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2",
                        isJunior
                          ? "border-[hsl(var(--jh-teal)/0.28)] focus:border-[hsl(var(--jh-teal))] focus:ring-[hsl(var(--jh-teal)/0.22)]"
                          : "border-[hsl(var(--sr-cyan)/0.28)] focus:border-[hsl(var(--sr-cyan))] focus:ring-[hsl(var(--sr-cyan)/0.22)]",
                      )}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className={cn(
                        "flex-1 rounded-xl py-2.5 text-sm font-extrabold transition-colors",
                        isJunior ? "jh-cta" : "sr-gold-btn",
                      )}
                    >
                      Kreiraj
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewConversationModal(false);
                        setNewConvTitle("");
                        setNewConvDescription("");
                      }}
                      className="flex-1 rounded-xl border-2 border-border bg-muted py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
                    >
                      Odustani
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default Forum;
