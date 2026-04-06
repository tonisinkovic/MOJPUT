import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  LogOut,
  LogIn,
  MessageCircle,
  Plus,
  Search,
  Send,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Link, useLocation } from "react-router-dom";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ForumMessage = {
  id: number;
  userId: number;
  username: string;
  text: string;
  timestamp: Date;
  likeCount: number;
  userLiked: boolean;
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

const FORUM_LOCAL_KEY = "mojput_forum_local_conversations";

function porukeOznaka(n: number): string {
  const k = n % 100;
  const m = n % 10;
  if (k >= 11 && k <= 14) return "poruka";
  if (m === 1) return "poruka";
  if (m >= 2 && m <= 4) return "poruke";
  return "poruka";
}

const FALLBACK_CONVERSATIONS: ForumConversation[] = [
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

const readLocalConversations = (): ForumConversation[] => {
  try {
    const raw = localStorage.getItem(FORUM_LOCAL_KEY);
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

const writeLocalConversations = (conversations: ForumConversation[]) => {
  localStorage.setItem(FORUM_LOCAL_KEY, JSON.stringify(conversations));
};

const Forum = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const canUseForum = Boolean(currentUser);

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
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      const user = userFromAuthMe(res);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
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
      const res = await apiGet<{ data: unknown }>("/api/forum/conversations");
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
        const localOnly = readLocalConversations();
        setConversations([...localOnly, ...mapped]);
      } else {
        const localOnly = readLocalConversations();
        setConversations([...localOnly, ...FALLBACK_CONVERSATIONS]);
      }
    } catch {
      const localOnly = readLocalConversations();
      setConversations([...localOnly, ...FALLBACK_CONVERSATIONS]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    setLoadingMessages(true);
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
        }>).map((m) => ({
          id: m.id,
          userId: m.user_id,
          username: m.username,
          text: m.text,
          timestamp: new Date(m.created_at),
          likeCount: m.like_count ?? 0,
          userLiked: m.user_liked ?? false,
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? { ...c, messages, messageCount: messages.length }
              : c,
          ),
        );
        setSelectedConversation((prev) => {
          if (!prev || prev.id !== conversationId) return prev;
          return { ...prev, messages, messageCount: messages.length };
        });
      } else {
        const fallbackConv = FALLBACK_CONVERSATIONS.find((c) => c.id === conversationId);
        if (fallbackConv) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    messages: fallbackConv.messages,
                    messageCount: fallbackConv.messages.length,
                  }
                : c,
            ),
          );
          setSelectedConversation((prev) => {
            if (!prev || prev.id !== conversationId) return prev;
            return {
              ...prev,
              messages: fallbackConv.messages,
              messageCount: fallbackConv.messages.length,
            };
          });
        }
      }
    } catch {
      const fallbackConv = FALLBACK_CONVERSATIONS.find((c) => c.id === conversationId);
      if (fallbackConv) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: fallbackConv.messages,
                  messageCount: fallbackConv.messages.length,
                }
              : c,
          ),
        );
        setSelectedConversation((prev) => {
          if (!prev || prev.id !== conversationId) return prev;
          return {
            ...prev,
            messages: fallbackConv.messages,
            messageCount: fallbackConv.messages.length,
          };
        });
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  const handleLogout = async () => {
    await authLogout();
    setCurrentUser(null);
    setSelectedConversation(null);
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newConvTitle.trim()) return;

    const res = await apiPost<{ data?: { id: number; title: string; description: string; created_at: string; creator_username: string; message_count: number } }>(
      "/api/forum/conversations",
      { title: newConvTitle.trim(), description: newConvDescription.trim() },
    );
    let newConversation: ForumConversation | null = null;
    if (res.success) {
      const c = (res as { data?: { id: number; title: string; description: string; created_at: string; creator_username: string; message_count: number } }).data;
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
    } else {
      // Backend fallback: create locally so authenticated users can always open new topics.
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
    writeLocalConversations([newConversation, ...readLocalConversations()]);
    setNewConvTitle("");
    setNewConvDescription("");
    setShowNewConversationModal(false);
    setSelectedConversation(newConversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedConversation || !messageInput.trim()) return;

    setSendingMessage(true);
    const res = await apiPost<{ data?: { id: number; user_id: number; username: string; text: string; created_at: string; like_count: number; user_liked: boolean } }>(
      `/api/forum/conversations/${selectedConversation.id}/messages`,
      { text: messageInput.trim() },
    );
    setSendingMessage(false);
    let newMessage: ForumMessage | null = null;
    if (res.success) {
      const payload = (res as { data?: { id: number; user_id: number; username: string; text: string; created_at: string; like_count: number; user_liked: boolean } }).data;
      if (payload) {
        newMessage = {
          id: payload.id,
          userId: payload.user_id,
          username: payload.username,
          text: payload.text,
          timestamp: new Date(payload.created_at),
          likeCount: payload.like_count ?? 0,
          userLiked: payload.user_liked ?? false,
        };
      }
    } else {
      // Backend fallback: keep forum interactive for logged-in users.
      newMessage = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        text: messageInput.trim(),
        timestamp: new Date(),
        likeCount: 0,
        userLiked: false,
      };
    }
    if (!newMessage) return;

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage], messageCount: conv.messageCount + 1 }
          : conv,
      ),
    );
    setSelectedConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage], messageCount: prev.messageCount + 1 } : prev,
    );
    const localConvs = readLocalConversations();
    const updatedLocal = localConvs.map((conv) =>
      conv.id === selectedConversation.id
        ? { ...conv, messages: [...conv.messages, newMessage], messageCount: conv.messageCount + 1 }
        : conv,
    );
    writeLocalConversations(updatedLocal);
    setMessageInput("");
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
    const localConvs = readLocalConversations();
    if (localConvs.length) {
      const updatedLocal = localConvs.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: conv.messages.map(updateMsg) }
          : conv,
      );
      writeLocalConversations(updatedLocal);
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

  return (
    <Layout>
      <section className="container py-4 sm:py-8 md:py-12 max-w-6xl mx-auto px-3 sm:px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "mb-4 rounded-2xl border-2 border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-card p-4 shadow-sm md:mb-6 md:p-5",
            selectedConversation && "max-md:hidden",
          )}
        >
          <h1 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            Forum za učenike
          </h1>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Razmijeni iskustva i postavi pitanja o maturi, fakultetima i studentskom životu — sve jasno poredano, brzo za pronalazak.
          </p>
        </motion.div>

        {!canUseForum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-2xl border-2 border-border bg-muted/40 p-4 shadow-sm md:mb-6 md:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Samo pregled poruka</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Možeš čitati razgovore, ali za slanje poruka, lajkanje i kreiranje tema potrebna je prijava.
                </p>
              </div>
              <Link
                to="/prijava"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:min-h-0 sm:py-2.5 touch-manipulation"
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
          className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-card"
        >
          <div className="flex h-[min(calc(100dvh-11rem),720px)] min-h-0 flex-col sm:h-[min(78dvh,680px)] md:h-[580px] md:flex-row">
            {/* Sidebar */}
            <div
              className={cn(
                "flex min-h-0 w-full shrink-0 flex-col border-b border-border bg-muted/25 md:w-[min(100%,20rem)] md:border-b-0 md:border-r",
                selectedConversation && "max-md:hidden",
              )}
            >
              <div className="flex items-center gap-3 border-b border-border p-3 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-hero text-sm font-bold text-primary-foreground shadow-md">
                  {(currentUser?.username?.[0] || "G").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{currentUser?.username || "Gost"}</p>
                  <p className="text-xs text-muted-foreground">{canUseForum ? "Član foruma" : "Samo pregled"}</p>
                </div>
                {canUseForum ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted touch-manipulation sm:p-2"
                    title="Odjava"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted touch-manipulation sm:p-2"
                    title="Prijava"
                  >
                    <LogIn className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="border-b border-border p-3">
                {canUseForum ? (
                  <button
                    type="button"
                    onClick={() => setShowNewConversationModal(true)}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] sm:min-h-10 sm:py-2.5 touch-manipulation"
                  >
                    <Plus className="h-4 w-4" />
                    Novi razgovor
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:min-h-10 sm:py-2.5 touch-manipulation"
                  >
                    <LogIn className="h-4 w-4" />
                    Prijavi se za pisanje
                  </Link>
                )}
              </div>

              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Pretraži teme…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-xl border-2 border-input bg-background py-2.5 pl-9 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring sm:h-10 sm:text-sm"
                  />
                </div>
              </div>

              <div className="border-b border-border px-3 py-2">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Poredaj</p>
                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setSortMode("recent")}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-semibold transition-all touch-manipulation",
                      sortMode === "recent"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Najnovije
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode("active")}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-semibold transition-all touch-manipulation",
                      sortMode === "active"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Najživlje
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="mt-3 text-xs text-muted-foreground">Učitavam razgovore…</p>
                  </div>
                ) : sortedConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      {canUseForum ? "Nema razgovora. Kreiraj prvi!" : "Trenutno nema razgovora."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 p-2">
                    {sortedConversations.map((conv) => (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={async () => {
                          setSelectedConversation(conv);
                          if (conv.messages.length === 0) await loadMessages(conv.id);
                        }}
                        className={cn(
                          "w-full rounded-xl border-2 px-3 py-3 text-left transition-all duration-200 touch-manipulation sm:px-4 sm:py-3",
                          selectedConversation?.id === conv.id
                            ? "border-primary/40 bg-primary/10 shadow-sm"
                            : "border-transparent hover:border-border hover:bg-muted/60 active:scale-[0.99]",
                        )}
                      >
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{conv.title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{conv.description || "Bez opisa"}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
                            {conv.messageCount} {porukeOznaka(conv.messageCount)}
                          </span>
                          <span>
                            {conv.createdAt.toLocaleDateString("hr-HR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="truncate">· {conv.creator || "Anonim"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col bg-background",
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
                    <div className="shrink-0 border-b border-border bg-muted/20 p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedConversation(null)}
                        className="mb-2 inline-flex min-h-[44px] -ml-1 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden touch-manipulation"
                      >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        Popis razgovora
                      </button>
                      <h2 className="text-pretty text-lg font-bold text-foreground">{selectedConversation.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{selectedConversation.description || "Bez opisa"}</p>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-3 sm:p-4 [scrollbar-gutter:stable]">
                      {loadingMessages ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Učitavam poruke…</p>
                          </div>
                        </div>
                      ) : selectedConversation.messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="max-w-xs text-center">
                            <MessageCircle className="mx-auto mb-4 h-14 w-14 text-muted-foreground/35" />
                            <p className="text-sm text-muted-foreground">
                              Nema poruka. Budi prvi koji će započeti razgovor!
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
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground ${
                                msg.userId === currentUser?.id ? "gradient-hero" : "bg-muted text-muted-foreground"
                              }`}
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
                              <div
                                className={`rounded-2xl px-4 py-2.5 text-sm ${
                                  msg.userId === currentUser?.id
                                    ? "rounded-br-md bg-primary text-primary-foreground"
                                    : "rounded-bl-md border border-border bg-muted/60 text-foreground"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                              </div>
                              {canUseForum && (
                                <button
                                  type="button"
                                  onClick={() => handleLikeMessage(msg.id)}
                                  className={cn(
                                    "mt-1.5 -ml-1 inline-flex min-h-9 items-center gap-1.5 px-1 text-xs transition-colors touch-manipulation",
                                    msg.userLiked ? "text-primary" : "text-muted-foreground hover:text-foreground",
                                    msg.userId === currentUser?.id && "self-end",
                                  )}
                                >
                                  <ThumbsUp className={`h-3.5 w-3.5 ${msg.userLiked ? "fill-current" : ""}`} />
                                  {msg.likeCount > 0 && <span>{msg.likeCount}</span>}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {canUseForum ? (
                      <form
                        onSubmit={handleSendMessage}
                        className="shrink-0 border-t border-border bg-muted/30 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                      >
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
                            className="min-h-12 max-h-32 flex-1 resize-y rounded-xl border-2 border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring sm:min-h-10 sm:text-sm touch-manipulation"
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim() || sendingMessage}
                            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
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
                      <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                        <p className="text-sm leading-snug text-muted-foreground">Prijavi se za slanje poruka</p>
                        <Link
                          to="/prijava"
                          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:py-2.5 touch-manipulation"
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
                    <div className="text-center">
                      <MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground/35" />
                      <p className="text-base font-medium text-muted-foreground">Odaberi razgovor</p>
                      <p className="mt-1 text-sm text-muted-foreground/80">
                        {canUseForum ? "ili kreiraj novi za početak." : "kako bi pročitao poruke."}
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
                className="max-h-[min(92dvh,560px)] w-full max-w-md overflow-y-auto rounded-t-2xl border-2 border-border bg-card p-5 shadow-2xl sm:m-0 sm:rounded-2xl sm:p-6"
              >
                <h3 className="mb-1 text-lg font-bold text-foreground">Novi razgovor</h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  Postavi pitanje ili otvori temu o maturi, fakultetima ili studentskom životu.
                </p>
                <form onSubmit={handleCreateConversation} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground" htmlFor="forum-new-title">
                      Naziv
                    </label>
                    <input
                      id="forum-new-title"
                      type="text"
                      value={newConvTitle}
                      onChange={(e) => setNewConvTitle(e.target.value)}
                      placeholder="npr. Koji fakultet za IT?"
                      className="w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
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
                      className="w-full resize-none rounded-xl border-2 border-input bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
