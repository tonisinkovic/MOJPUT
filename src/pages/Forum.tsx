import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  LogOut,
  LogIn,
  MessageCircle,
  Plus,
  Search,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Link } from "react-router-dom";
import { authLogout, authMe, type AuthUser } from "@/lib/auth";

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

const Forum = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [conversations, setConversations] = useState<ForumConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState<ForumConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
      if (res.success) {
        const user = (res as { user?: AuthUser }).user ?? (res as { data?: { user?: AuthUser } }).data?.user ?? null;
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadConversations = async () => {
    setLoadingConversations(true);
    const res = await apiGet<{ data: unknown }>("/api/forum/conversations");
    if (res.success) {
      const rows = ((res as { data?: unknown }).data ?? []) as Array<{
        id: number;
        title: string;
        description: string;
        creator_username: string;
        created_at: string;
        message_count: number;
      }>;
      setConversations(
        rows.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description || "",
          creator: c.creator_username || "",
          creatorId: -1,
          createdAt: new Date(c.created_at),
          messageCount: typeof c.message_count === "number" ? c.message_count : 0,
          messages: [],
        })),
      );
    } else {
      setConversations(FALLBACK_CONVERSATIONS);
    }
    setLoadingConversations(false);
  };

  const loadMessages = async (conversationId: number) => {
    setLoadingMessages(true);
    const res = await apiGet<{ data: unknown }>(`/api/forum/conversations/${conversationId}/messages`);
    if (res.success) {
      const rows = ((res as { data?: unknown }).data ?? []) as Array<{
        id: number;
        user_id: number;
        username: string;
        text: string;
        created_at: string;
        like_count: number;
        user_liked: boolean;
      }>;
      const messages: ForumMessage[] = rows.map((m) => ({
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
    setLoadingMessages(false);
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
    setIsAuthenticated(false);
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
    if (!res.success) {
      alert((res as { message?: string }).message);
      return;
    }
    const c = (res as { data?: { id: number; title: string; description: string; created_at: string; creator_username: string; message_count: number } }).data;
    if (!c) return;
    const newConversation: ForumConversation = {
      id: c.id,
      title: c.title,
      description: c.description || "",
      creator: c.creator_username || currentUser.username,
      creatorId: currentUser.id,
      createdAt: new Date(c.created_at),
      messageCount: c.message_count ?? 0,
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
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
    if (!res.success) {
      alert((res as { message?: string }).message);
      return;
    }
    const payload = (res as { data?: { id: number; user_id: number; username: string; text: string; created_at: string; like_count: number; user_liked: boolean } }).data;
    if (!payload) return;
    const newMessage: ForumMessage = {
      id: payload.id,
      userId: payload.user_id,
      username: payload.username,
      text: payload.text,
      timestamp: new Date(payload.created_at),
      likeCount: payload.like_count ?? 0,
      userLiked: payload.user_liked ?? false,
    };

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
    setMessageInput("");
  };

  const handleLikeMessage = async (messageId: number) => {
    if (!isAuthenticated || !currentUser || !selectedConversation) return;

    const res = await apiPost<{ liked?: boolean; like_count?: number }>(`/api/forum/messages/${messageId}/like`, {});
    if (!res.success) return;

    const { liked = false, like_count = 0 } = res as { liked?: boolean; like_count?: number };
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
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <section className="container py-8 md:py-12 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Forum za učenike
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
            Razmijeni iskustva i postavi pitanja o maturi, fakultetima i studentskom životu.
          </p>
        </motion.div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 p-4 md:p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Samo pregled poruka</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Možeš čitati razgovore, ali za slanje poruka, lajkanje i kreiranje tema potrebna je prijava.
                </p>
              </div>
              <Link
                to="/prijava"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
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
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row h-[min(75vh,640px)] md:h-[580px]">
            {/* Sidebar */}
            <div className="md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {(currentUser?.username?.[0] || "G").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {currentUser?.username || "Gost"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAuthenticated ? "Član foruma" : "Samo pregled"}
                  </p>
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                    title="Odjava"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                    title="Prijava"
                  >
                    <LogIn className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowNewConversationModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Novi razgovor
                  </button>
                ) : (
                  <Link
                    to="/prijava"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Prijavi se za pisanje
                  </Link>
                )}
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pretraži razgovore..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {loadingConversations ? (
                  <div className="p-8 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-500 mt-3">Učitavam razgovore...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isAuthenticated ? "Nema razgovora. Kreiraj prvi!" : "Trenutno nema razgovora."}
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={async () => {
                          setSelectedConversation(conv);
                          if (conv.messages.length === 0) await loadMessages(conv.id);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                          selectedConversation?.id === conv.id
                            ? "bg-teal-500/15 dark:bg-teal-500/20 border-l-4 border-teal-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">
                          {conv.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {conv.description || "Bez opisa"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                          {conv.messageCount} poruka · {conv.creator || "Anonim"}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
              <AnimatePresence mode="wait">
                {selectedConversation ? (
                  <motion.div
                    key={selectedConversation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="inline-flex md:hidden items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-2 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Natrag
                      </button>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {selectedConversation.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {selectedConversation.description || "Bez opisa"}
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loadingMessages ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm text-slate-500">Učitavam poruke...</p>
                          </div>
                        </div>
                      ) : selectedConversation.messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center max-w-xs">
                            <MessageCircle className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
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
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${
                                msg.userId === currentUser?.id
                                  ? "bg-gradient-to-br from-teal-500 to-cyan-600"
                                  : "bg-gradient-to-br from-slate-400 to-slate-600"
                              }`}
                            >
                              {msg.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div
                              className={`max-w-[85%] md:max-w-sm ${msg.userId === currentUser?.id ? "items-end" : "items-start"} flex flex-col`}
                            >
                              <div
                                className={`flex items-center gap-2 mb-1 ${msg.userId === currentUser?.id ? "flex-row-reverse" : ""}`}
                              >
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  {msg.username}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {msg.timestamp.toLocaleTimeString("hr-HR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-sm ${
                                  msg.userId === currentUser?.id
                                    ? "bg-teal-500 text-white rounded-br-md"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"
                                }`}
                              >
                                <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                              </div>
                              {isAuthenticated && (
                                <button
                                  onClick={() => handleLikeMessage(msg.id)}
                                  className={`mt-1.5 inline-flex items-center gap-1.5 text-xs transition-colors ${
                                    msg.userLiked
                                      ? "text-teal-600 dark:text-teal-400"
                                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                  } ${msg.userId === currentUser?.id ? "self-end" : ""}`}
                                >
                                  <ThumbsUp
                                    className={`h-3.5 w-3.5 ${msg.userLiked ? "fill-current" : ""}`}
                                  />
                                  {msg.likeCount > 0 && <span>{msg.likeCount}</span>}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {isAuthenticated ? (
                      <form
                        onSubmit={handleSendMessage}
                        className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 shrink-0"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Upiši poruku..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim() || sendingMessage}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Prijavi se za slanje poruka
                        </p>
                        <Link
                          to="/prijava"
                          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors"
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
                    className="flex-1 hidden md:flex items-center justify-center"
                  >
                    <div className="text-center">
                      <MessageCircle className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                        Odaberi razgovor
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        {isAuthenticated ? "ili kreiraj novi za početak." : "kako bi pročitao poruke."}
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
          {showNewConversationModal && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewConversationModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Novi razgovor
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Postavi pitanje ili otvori temu o maturi, fakultetima ili studentskom životu.
                </p>
                <form onSubmit={handleCreateConversation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Naziv
                    </label>
                    <input
                      type="text"
                      value={newConvTitle}
                      onChange={(e) => setNewConvTitle(e.target.value)}
                      placeholder="npr. Koji fakultet za IT?"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Opis (opcionalno)
                    </label>
                    <textarea
                      value={newConvDescription}
                      onChange={(e) => setNewConvDescription(e.target.value)}
                      placeholder="Ukratko opiši temu..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
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
                      className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors"
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
