import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  appendMessage,
  createConversation,
  loadConversations,
  readDisplayName,
  readLikedMessageIds,
  saveConversations,
  toggleMessageLike,
  totalThreadLikes,
  writeDisplayName,
  writeLikedMessageIds,
  type ParentForumConversation,
} from "@/lib/parentForumStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type SortMode = "newest" | "popular";

function porukaOznaka(n: number): string {
  const k = n % 100;
  const m = n % 10;
  if (k >= 11 && k <= 14) return "poruka";
  if (m === 1) return "poruka";
  if (m >= 2 && m <= 4) return "poruke";
  return "poruka";
}

const ParentForum = () => {
  const [conversations, setConversations] = useState<ParentForumConversation[]>(() => loadConversations());
  const [likedIds, setLikedIds] = useState(() => readLikedMessageIds());
  const [displayName, setDisplayName] = useState(() => readDisplayName());

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");
  const [search, setSearch] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFirstMessage, setNewFirstMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    writeLikedMessageIds(likedIds);
  }, [likedIds]);

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  useEffect(() => {
    if (selected) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected?.id, selected?.messages.length]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = conversations.filter((c) => {
      if (!q) return true;
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) return true;
      return c.messages.some((m) => m.text.toLowerCase().includes(q));
    });
    list = [...list].sort((a, b) => {
      if (sort === "popular") {
        const diff = totalThreadLikes(b) - totalThreadLikes(a);
        if (diff !== 0) return diff;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [conversations, search, sort]);

  const authorLabel = displayName.trim() || "Gost";

  const handleDisplayNameBlur = () => {
    writeDisplayName(displayName);
  };

  const openNewConversation = () => {
    if (!newTitle.trim() || !newFirstMessage.trim()) return;
    const conv = createConversation(newTitle, newFirstMessage, authorLabel);
    setConversations((prev) => [conv, ...prev]);
    setSelectedId(conv.id);
    setNewTitle("");
    setNewFirstMessage("");
    setNewOpen(false);
  };

  const sendReply = () => {
    if (!selected || !messageDraft.trim()) return;
    setConversations((prev) => appendMessage(prev, selected.id, messageDraft, authorLabel));
    setMessageDraft("");
  };

  const onToggleLike = (messageId: string) => {
    const { conversations: next, likedIds: nextLiked } = toggleMessageLike(conversations, messageId, likedIds);
    setConversations(next);
    setLikedIds(nextLiked);
  };

  return (
    <Layout>
      <section className="container max-w-6xl px-3 py-8 sm:px-4 sm:py-10 md:py-14 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/roditeljski-kutak"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Natrag na Roditeljski kutak
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-card p-5 shadow-sm md:p-6"
            >
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Zajednica</span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">Forum za roditelje</h1>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Otvorite novu temu ili se pridružite razgovoru. Poruke i lajkovi spremaju se u vašem pregledniku (bez
                slanja na poslužitelj).
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xs space-y-1.5">
            <label htmlFor="parent-forum-name" className="text-xs font-medium text-muted-foreground">
              Ime za potpis poruka
            </label>
            <Input
              id="parent-forum-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={handleDisplayNameBlur}
              placeholder="npr. Ana, roditelj"
              className="h-10 rounded-xl border-2"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-card"
        >
          <div className="flex h-[min(calc(100dvh-11rem),720px)] min-h-0 flex-col md:h-[600px] md:flex-row">
            {/* Sidebar */}
            <div
              className={cn(
                "flex min-h-0 w-full shrink-0 flex-col border-b border-border bg-muted/20 md:w-[min(100%,22rem)] md:border-b-0 md:border-r",
                selected && "max-md:hidden",
              )}
            >
              <div className="border-b border-border p-3 sm:p-4">
                <Dialog open={newOpen} onOpenChange={setNewOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="h-11 w-full min-h-[44px] rounded-xl border-0 bg-primary font-semibold text-primary-foreground shadow-md touch-manipulation sm:h-10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novi razgovor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[min(90dvh,540px)] overflow-y-auto rounded-2xl sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Nova tema</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Naslov</label>
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Kratko pitanje ili tema"
                          className="mt-1 rounded-xl border-2"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Prva poruka</label>
                        <Textarea
                          value={newFirstMessage}
                          onChange={(e) => setNewFirstMessage(e.target.value)}
                          placeholder="Opišite situaciju ili pitanje…"
                          className="mt-1 min-h-[120px] rounded-xl border-2"
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full rounded-xl"
                        disabled={!newTitle.trim() || !newFirstMessage.trim()}
                        onClick={openNewConversation}
                      >
                        Objavi temu
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Pretraži teme i poruke…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 w-full rounded-xl border-2 border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="border-b border-border px-3 py-2">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Poredaj</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSort("newest")}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-semibold transition-all touch-manipulation",
                      sort === "newest"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Najnovije
                  </button>
                  <button
                    type="button"
                    onClick={() => setSort("popular")}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-semibold transition-all touch-manipulation",
                      sort === "popular"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Najpopularnije
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {filteredSorted.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nema rezultata. Pokušaj drugi pojam ili očisti pretragu.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {filteredSorted.map((conv) => (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setSelectedId(conv.id)}
                        className={cn(
                          "w-full rounded-xl border-2 px-3 py-3 text-left transition-all touch-manipulation sm:px-4",
                          selectedId === conv.id
                            ? "border-primary/40 bg-primary/10 shadow-sm"
                            : "border-transparent hover:border-border hover:bg-muted/60",
                        )}
                      >
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{conv.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{conv.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
                            {conv.messages.length} {porukaOznaka(conv.messages.length)}
                          </span>
                          <span>{totalThreadLikes(conv)} lajkova</span>
                          <span>
                            {new Date(conv.updatedAt).toLocaleDateString("hr-HR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thread */}
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col bg-background",
                !selected && "max-md:hidden",
              )}
            >
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col"
                  >
                    <div className="shrink-0 border-b border-border bg-muted/15 p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="mb-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground md:hidden touch-manipulation"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Sve teme
                      </button>
                      <h2 className="text-pretty text-lg font-bold text-foreground">{selected.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{selected.description}</p>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-3 sm:p-4 [scrollbar-gutter:stable]">
                      {selected.messages.map((msg) => {
                        const userLiked = likedIds.has(msg.id);
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-sm font-bold text-primary">
                              {msg.authorName.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-baseline gap-2">
                                <span className="text-sm font-semibold text-foreground">{msg.authorName}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleString("hr-HR", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div className="rounded-2xl rounded-tl-md border border-border/80 bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onToggleLike(msg.id)}
                                  className={cn(
                                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-colors touch-manipulation",
                                    userLiked
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                                  )}
                                >
                                  <ThumbsUp className={cn("h-3.5 w-3.5", userLiked && "fill-current")} />
                                  <span>{msg.likeCount}</span>
                                  <span className="sr-only">lajkova</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="shrink-0 border-t border-border bg-muted/30 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <Textarea
                          value={messageDraft}
                          onChange={(e) => setMessageDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (messageDraft.trim()) sendReply();
                            }
                          }}
                          placeholder="Napišite odgovor…"
                          rows={2}
                          className="min-h-[88px] flex-1 resize-y rounded-xl border-2 border-input bg-background text-base sm:text-sm"
                        />
                        <Button
                          type="button"
                          onClick={sendReply}
                          disabled={!messageDraft.trim()}
                          className="h-11 shrink-0 rounded-xl border-0 px-5 sm:self-stretch"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Pošalji
                        </Button>
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">Enter šalje, Shift+Enter novi red.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden flex-1 flex-col items-center justify-center p-8 md:flex"
                  >
                    <Heart className="mb-4 h-14 w-14 text-muted-foreground/30" />
                    <p className="text-center text-base font-medium text-muted-foreground">Odaberi razgovor</p>
                    <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground/90">
                      Ili klikni „Novi razgovor” i započni vlastitu temu.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Podaci o razgovorima ostaju samo u ovom pregledniku. Za potpuno anonimne savjete obratite se stručnjacima.
        </p>
      </section>
    </Layout>
  );
};

export default ParentForum;
