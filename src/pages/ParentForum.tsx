import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parentForumAudience, parentForumBoardTitle, parentForumBoards } from "@/data/parentForumBoards";
import { apiGet, apiPost } from "@/lib/api";
import { AUTH_CHANGED, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { resolveExperienceMode } from "@/lib/experience";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LogIn, MessageCircle, Plus, Search, Send, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type ParentThread = {
  id: number;
  title: string;
  description: string;
  category: string;
  creator: string;
  createdAt: string;
  messageCount: number;
};

type ParentMessage = {
  id: number;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
  likeCount: number;
  userLiked: boolean;
  deleted: boolean;
};

function objavaOznaka(n: number): string {
  const k = n % 100;
  const m = n % 10;
  if (k >= 11 && k <= 14) return "objava";
  if (m === 1) return "objava";
  if (m >= 2 && m <= 4) return "objave";
  return "objava";
}

function porukaOznaka(n: number): string {
  const k = n % 100;
  const m = n % 10;
  if (k >= 11 && k <= 14) return "poruka";
  if (m === 1) return "poruka";
  if (m >= 2 && m <= 4) return "poruke";
  return "poruka";
}

function asRows(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: unknown[] }).data;
  }
  return [];
}

function mapThread(row: Record<string, unknown>): ParentThread | null {
  const id = Number(row.id);
  if (!Number.isFinite(id)) return null;
  return {
    id,
    title: String(row.title || ""),
    description: String(row.description || ""),
    category: String(row.category || "opce"),
    creator: String(row.creator_username || ""),
    createdAt: String(row.created_at || ""),
    messageCount: Number(row.message_count ?? 0) || 0,
  };
}

function mapMessage(row: Record<string, unknown>): ParentMessage | null {
  const id = Number(row.id);
  if (!Number.isFinite(id)) return null;
  return {
    id,
    userId: Number(row.user_id) || 0,
    username: String(row.username || ""),
    text: String(row.text || ""),
    createdAt: String(row.created_at || ""),
    likeCount: Number(row.like_count ?? 0) || 0,
    userLiked: Boolean(row.user_liked),
    deleted: Boolean(row.deleted_by_user_at),
  };
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("hr-HR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const ParentForum = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = resolveExperienceMode(searchParams);
  const isJunior = mode === "junior";
  const audience = parentForumAudience(mode);
  const boards = useMemo(() => parentForumBoards(mode), [mode]);
  const hubPath = isJunior ? "/roditelji?experience=junior" : "/roditeljski-kutak";

  const rubrika = searchParams.get("rubrika") || "sve";
  const temaId = Number(searchParams.get("tema"));
  const wantNew = searchParams.get("nova") === "1";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [threads, setThreads] = useState<ParentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(Number.isFinite(temaId) && temaId > 0 ? temaId : null);
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [composerError, setComposerError] = useState("");

  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newBoard, setNewBoard] = useState(boards[0]?.id ?? "razgovor");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loginHref = useMemo(() => {
    const next = `/roditeljski-kutak/forum${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return `/prijava?next=${encodeURIComponent(next)}`;
  }, [searchParams]);

  const refreshUser = useCallback(() => {
    authMe().then((res) => {
      setUser(userFromAuthMe(res));
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    refreshUser();
    const onAuth = () => refreshUser();
    window.addEventListener(AUTH_CHANGED, onAuth);
    return () => window.removeEventListener(AUTH_CHANGED, onAuth);
  }, [refreshUser]);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const res = await apiGet<unknown>(`/api/forum/conversations?audience=${audience}`);
    if (!res.success) {
      setThreads([]);
      setLoadError(res.message || "Forum trenutno nije dostupan.");
      setLoading(false);
      return;
    }
    const mapped = asRows((res as { data?: unknown }).data)
      .map((row) => mapThread(row as Record<string, unknown>))
      .filter((row): row is ParentThread => row !== null);
    setThreads(mapped);
    setLoading(false);
  }, [audience]);

  useEffect(() => {
    setSelectedId(null);
    setMessages([]);
    setSearch("");
    setNewBoard(parentForumBoards(mode)[0]?.id ?? "razgovor");
    void loadThreads();
  }, [audience, mode, loadThreads]);

  useEffect(() => {
    if (!Number.isFinite(temaId) || temaId <= 0) return;
    if (threads.some((t) => t.id === temaId)) setSelectedId(temaId);
  }, [temaId, threads]);

  const loadMessages = useCallback(async (id: number) => {
    setLoadingMessages(true);
    setComposerError("");
    const res = await apiGet<unknown>(`/api/forum/conversations/${id}/messages`);
    if (!res.success) {
      setMessages([]);
      setComposerError(res.message || "Poruke nisu učitane.");
      setLoadingMessages(false);
      return;
    }
    const mapped = asRows((res as { data?: unknown }).data)
      .map((row) => mapMessage(row as Record<string, unknown>))
      .filter((row): row is ParentMessage => row !== null);
    setMessages(mapped);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, messageCount: mapped.length } : t)));
    setLoadingMessages(false);
  }, []);

  useEffect(() => {
    if (selectedId) void loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (wantNew && authReady && user) setNewOpen(true);
  }, [wantNew, authReady, user]);

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      if (rubrika !== "sve" && t.category !== rubrika) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.creator.toLowerCase().includes(q)
      );
    });
  }, [threads, rubrika, search]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of threads) map.set(t.category, (map.get(t.category) ?? 0) + 1);
    return map;
  }, [threads]);

  const setRubrika = (id: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id === "sve") next.delete("rubrika");
        else next.set("rubrika", id);
        next.delete("nova");
        next.delete("tema");
        return next;
      },
      { replace: true },
    );
    setSelectedId(null);
  };

  const openThread = (id: number) => {
    setSelectedId(id);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tema", String(id));
        next.delete("nova");
        return next;
      },
      { replace: true },
    );
  };

  const closeThread = () => {
    setSelectedId(null);
    setMessages([]);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("tema");
        return next;
      },
      { replace: true },
    );
  };

  const openComposer = () => {
    setCreateError("");
    if (rubrika !== "sve" && boards.some((b) => b.id === rubrika)) setNewBoard(rubrika);
    setNewOpen(true);
  };

  const publish = async () => {
    if (!user || !newTitle.trim() || !newBody.trim() || creating) return;
    setCreating(true);
    setCreateError("");
    const body = newBody.trim();
    const created = await apiPost<Record<string, unknown>>("/api/forum/conversations", {
      title: newTitle.trim(),
      description: body.slice(0, 180),
      audience,
      category: newBoard,
    });
    if (!created.success) {
      setCreateError(created.message || "Objava nije spremljena.");
      setCreating(false);
      return;
    }
    const thread = mapThread(((created as { data?: unknown }).data ?? created) as Record<string, unknown>);
    if (!thread) {
      setCreateError("Objava je spremljena, ali je nije moguće otvoriti. Osvježite stranicu.");
      setCreating(false);
      return;
    }
    const posted = await apiPost<unknown>(`/api/forum/conversations/${thread.id}/messages`, { text: body });
    if (!posted.success) {
      setCreateError(posted.message || "Tema je otvorena, ali prva poruka nije prošla.");
    }
    setThreads((prev) => [{ ...thread, messageCount: posted.success ? 1 : 0 }, ...prev.filter((t) => t.id !== thread.id)]);
    setNewTitle("");
    setNewBody("");
    setNewOpen(false);
    setCreating(false);
    openThread(thread.id);
  };

  const sendReply = async () => {
    if (!user || !selected || !draft.trim() || sending) return;
    setSending(true);
    setComposerError("");
    const res = await apiPost<unknown>(`/api/forum/conversations/${selected.id}/messages`, { text: draft.trim() });
    setSending(false);
    if (!res.success) {
      setComposerError(res.message || "Poruka nije poslana.");
      return;
    }
    const msg = mapMessage(((res as { data?: unknown }).data ?? {}) as Record<string, unknown>);
    if (msg) setMessages((prev) => [...prev, msg]);
    setDraft("");
    setThreads((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, messageCount: t.messageCount + (msg ? 1 : 0) } : t)),
    );
  };

  const toggleLike = async (messageId: number) => {
    if (!user) return;
    const res = await apiPost<{ liked?: boolean; like_count?: number }>(`/api/forum/messages/${messageId}/like`, {});
    if (!res.success) return;
    const liked = Boolean((res as { liked?: boolean }).liked);
    const count = Number((res as { like_count?: number }).like_count ?? 0);
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, userLiked: liked, likeCount: count } : m)));
  };

  return (
    <Layout>
      <section className="container max-w-6xl px-3 py-8 sm:px-4 sm:py-10 md:py-14 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <Link
          to={hubPath}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Natrag na Roditeljski kutak
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-primary/[0.14] via-card to-card p-5 shadow-card sm:p-7"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Zajednica roditelja</p>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {isJunior ? "Forum — odabir srednje škole" : "Forum — odabir studija"}
              </h1>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Četiri rubrike, jedan razgovor. Svaki prijavljeni MojPut račun može otvoriti objavu i odgovoriti.
                Ime uz poruku je korisničko ime s računa.
              </p>
            </div>
            {user ? (
              <Button type="button" className="h-11 shrink-0 rounded-xl px-5" onClick={openComposer}>
                <Plus className="mr-2 h-4 w-4" />
                Nova objava
              </Button>
            ) : (
              <Button asChild className="h-11 shrink-0 rounded-xl px-5">
                <Link to={loginHref}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Prijavi se i piši
                </Link>
              </Button>
            )}
          </div>
          {user ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Prijavljeni ste kao <span className="font-semibold text-foreground">{user.username}</span>
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">Objave možete čitati i bez prijave. Pisanje traži račun.</p>
          )}
        </motion.header>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {boards.map((board) => {
            const active = rubrika === board.id;
            const n = counts.get(board.id) ?? 0;
            return (
              <button
                key={board.id}
                type="button"
                onClick={() => setRubrika(active ? "sve" : board.id)}
                className={cn(
                  "rounded-2xl border-2 px-3 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:border-primary/35",
                )}
              >
                <span className="block text-sm font-semibold leading-snug">{board.title}</span>
                <span className={cn("mt-1 block text-[11px] leading-snug", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {board.blurb}
                </span>
                <span className={cn("mt-2 block text-[11px] font-semibold tabular-nums", active ? "text-primary-foreground" : "text-primary")}>
                  {n} {objavaOznaka(n)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži objave…"
              className="h-11 w-full rounded-xl border-2 border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {rubrika !== "sve" ? (
            <button type="button" onClick={() => setRubrika("sve")} className="text-sm font-medium text-primary hover:underline">
              Sve rubrike
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div className={cn("space-y-2", selected && "max-lg:hidden")}>
            {loading ? (
              <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">Učitavanje objava…</p>
            ) : loadError ? (
              <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
                <p className="text-sm text-foreground">{loadError}</p>
                <Button type="button" variant="outline" className="mt-3 rounded-xl" onClick={() => void loadThreads()}>
                  Pokušaj ponovno
                </Button>
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[0.04] px-4 py-8 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-primary/70" />
                <p className="mt-3 text-sm font-semibold">U ovoj rubrici još nema objava</p>
                <p className="mt-1 text-sm text-muted-foreground">Otvorite prvu temu. Ostali prijavljeni korisnici mogu odgovoriti.</p>
                {user ? (
                  <Button type="button" className="mt-4 rounded-xl" onClick={openComposer}>
                    Nova objava
                  </Button>
                ) : (
                  <Button asChild className="mt-4 rounded-xl">
                    <Link to={loginHref}>Prijavi se</Link>
                  </Button>
                )}
              </div>
            ) : (
              visible.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => openThread(thread.id)}
                  className={cn(
                    "w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors",
                    selectedId === thread.id ? "border-primary bg-primary/[0.08]" : "border-border/80 bg-card hover:border-primary/30",
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {parentForumBoardTitle(mode, thread.category)}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug">{thread.title}</p>
                  {thread.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{thread.description}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {thread.creator} · {thread.messageCount} {porukaOznaka(thread.messageCount)} · {formatWhen(thread.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className={cn("min-h-[28rem] rounded-3xl border-2 border-border bg-card", !selected && "max-lg:hidden")}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[28rem] flex-col">
                  <div className="border-b border-border px-4 py-4 sm:px-5">
                    <button type="button" onClick={closeThread} className="mb-2 text-sm font-medium text-primary lg:hidden">
                      ← Sve objave
                    </button>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {parentForumBoardTitle(mode, selected.category)}
                    </p>
                    <h2 className="mt-1 text-lg font-bold leading-snug">{selected.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Autor: {selected.creator}</p>
                  </div>
                  <div className="flex-1 space-y-4 px-4 py-4 sm:px-5">
                    {loadingMessages ? (
                      <p className="text-sm text-muted-foreground">Učitavanje poruka…</p>
                    ) : (
                      messages.map((msg) => {
                        const mine = user?.id === msg.userId;
                        return (
                          <div key={msg.id} className="flex gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                                mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                              )}
                            >
                              {(msg.username || "?").slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{msg.username}</span>
                                <span className="ml-2 text-[11px] text-muted-foreground">{formatWhen(msg.createdAt)}</span>
                              </p>
                              <div
                                className={cn(
                                  "mt-1 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed",
                                  mine ? "bg-primary/[0.1]" : "bg-muted/60",
                                )}
                              >
                                {msg.deleted ? (
                                  <p className="italic text-muted-foreground">Poruka je uklonjena.</p>
                                ) : (
                                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                )}
                              </div>
                              {!msg.deleted ? (
                                user ? (
                                  <button
                                    type="button"
                                    onClick={() => void toggleLike(msg.id)}
                                    className={cn(
                                      "mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                      msg.userLiked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
                                    )}
                                  >
                                    <ThumbsUp className={cn("h-3.5 w-3.5", msg.userLiked && "fill-current")} />
                                    {msg.likeCount}
                                  </button>
                                ) : (
                                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    {msg.likeCount}
                                  </span>
                                )
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="border-t border-border p-4 sm:p-5">
                    {user ? (
                      <>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                          <Textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void sendReply();
                              }
                            }}
                            placeholder="Napišite odgovor…"
                            rows={2}
                            className="min-h-[88px] flex-1 rounded-xl border-2"
                          />
                          <Button type="button" className="h-11 rounded-xl" disabled={!draft.trim() || sending} onClick={() => void sendReply()}>
                            <Send className="mr-2 h-4 w-4" />
                            {sending ? "Šaljem…" : "Pošalji"}
                          </Button>
                        </div>
                        {composerError ? <p className="mt-2 text-sm text-destructive">{composerError}</p> : null}
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 rounded-2xl bg-primary/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-foreground">Odgovor mogu poslati samo prijavljeni korisnici.</p>
                        <Button asChild className="rounded-xl">
                          <Link to={loginHref}>Prijava</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 text-center">
                  <MessageCircle className="h-10 w-10 text-primary/50" />
                  <p className="mt-3 text-base font-semibold">Odaberite objavu</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Rubrike gore sužavaju popis. Nova objava ide u rubriku koju odaberete u obrascu.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Dialog
        open={newOpen}
        onOpenChange={(open) => {
          setNewOpen(open);
          if (!open) {
            setSearchParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.delete("nova");
                return next;
              },
              { replace: true },
            );
          }
        }}
      >
        <DialogContent className="max-h-[min(90dvh,640px)] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova objava</DialogTitle>
          </DialogHeader>
          {user ? (
            <div className="space-y-3 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Rubrika</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      type="button"
                      onClick={() => setNewBoard(board.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        newBoard === board.id ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                    >
                      {board.title}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor="parent-forum-title">
                  Naslov
                </label>
                <Input
                  id="parent-forum-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={160}
                  placeholder="Kratko pitanje"
                  className="mt-1 rounded-xl border-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor="parent-forum-body">
                  Poruka
                </label>
                <Textarea
                  id="parent-forum-body"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  maxLength={4000}
                  placeholder="Opišite situaciju. Drugi roditelji i prijavljeni korisnici mogu odgovoriti."
                  className="mt-1 min-h-[140px] rounded-xl border-2"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Objava ide pod imenom {user.username}.</p>
              {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
              <Button
                type="button"
                className="w-full rounded-xl"
                disabled={!newTitle.trim() || !newBody.trim() || creating}
                onClick={() => void publish()}
              >
                {creating ? "Objavljujem…" : "Objavi"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">Objava treba MojPut račun. Nakon prijave vraćate se na ovaj forum.</p>
              <Button asChild className="w-full rounded-xl">
                <Link to={loginHref}>Prijava</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ParentForum;
