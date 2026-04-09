import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, ChevronRight, RotateCcw, LogIn, Crown, Timer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { facultyInstitutions } from "@/data/faculties";
import { API_BASE_URL } from "@/config/apiBase";
import { apiGet } from "@/lib/api";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";

const API_BASE = API_BASE_URL;

const SUGGESTIONS = [
  "Usporedi FER i FOI za računarstvo — prednosti i mane",
  "Je li TVZ ili FOI bolji izbor ako želim brzo raditi praktične projekte?",
  "Što znači ići na PMF ako volim matematiku, a i programiranje?",
  "Kako bih odabrao između FER-a i TVZ-a za karijeru u IT-u?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AI_NAME = "Dražen";
const AI_WELCOME = `Bok, ja sam ${AI_NAME}. Odgovaram na sva pitanja koja te zanimaju o fakultetima u Hrvatskoj. Što te zanima?`;

function buildLocalChatReply(question: string): string {
  const q = question.toLowerCase();
  const cities = Array.from(new Set(facultyInstitutions.map((f) => f.city)));
  const matchedCity = cities.find((city) => q.includes(city.toLowerCase()));

  if (matchedCity) {
    const inCity = facultyInstitutions.filter((f) => f.city.toLowerCase() === matchedCity.toLowerCase()).slice(0, 8);
    if (inCity.length) {
      return `U gradu ${matchedCity} sam pronašao ove ustanove:\n- ${inCity.map((f) => f.name).join("\n- ")}\n\nAko želiš, mogu suziti popis po području (npr. računarstvo, ekonomija, medicina).`;
    }
  }

  if (q.includes("računar") || q.includes("informat") || q.includes("it")) {
    const matches = facultyInstitutions
      .filter((f) => f.programs.some((p) => /računar|informat|softver|it/i.test(p.name)))
      .slice(0, 8);
    if (matches.length) {
      return `Za računarstvo/informatiku pronašao sam:\n- ${matches.map((f) => `${f.name} (${f.city})`).join("\n- ")}\n\nMogu ti odmah izdvojiti i bodovne pragove gdje su dostupni.`;
    }
  }

  if (q.includes("medicin")) {
    const matches = facultyInstitutions.filter((f) => /medicin|zdrav/i.test(f.name)).slice(0, 8);
    if (matches.length) {
      return `Medicinski i srodni fakulteti koje vidim u bazi:\n- ${matches.map((f) => `${f.name} (${f.city})`).join("\n- ")}`;
    }
  }

  const sample = facultyInstitutions.slice(0, 6);
  return `Trenutno radim u lokalnom modu (bez backenda), ali i dalje mogu pomoći kroz podatke iz baze.\n\nPrimjeri koje mogu odmah odgovoriti:\n- Fakulteti u određenom gradu (npr. Zagreb, Split, Rijeka)\n- Studiji računarstva/informatike\n- Osnovni popis fakulteta po području\n\nPrimjer ustanova iz baze:\n- ${sample.map((f) => `${f.name} (${f.city})`).join("\n- ")}`;
}

const RobotAIWindow = () => {
  // Mali robot s hrvatskim bojama (plavo-crveno-bijelo + šahovnica) koji drži "AI prozor".
  return (
    <svg viewBox="0 0 120 120" width="76" height="76" aria-hidden="true">
      <defs>
        <linearGradient id="aiWindow" x1="38" y1="56" x2="86" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Robot arms */}
      <path
        d="M36 66 C30 74, 30 85, 39 90 C47 94, 52 90, 54 84"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M84 66 C90 74, 90 85, 81 90 C73 94, 68 90, 66 84"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="60" cy="38" r="18" fill="#ffffff" stroke="#1d4ed8" strokeWidth="4" />
      {/* Antenna */}
      <path d="M60 20 C58 15, 56 13, 53 11" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="10.5" r="4" fill="#dc2626" stroke="#1d4ed8" strokeWidth="2" />

      {/* Eyes */}
      <circle cx="53" cy="38" r="3.2" fill="#0f172a" />
      <circle cx="67" cy="38" r="3.2" fill="#0f172a" />
      <path d="M54 47 C58 51, 62 51, 66 47" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />

      {/* Body */}
      <rect x="38" y="54" width="44" height="50" rx="14" fill="#ffffff" stroke="#1d4ed8" strokeWidth="4" />

      {/* Chessboard (4x4) */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((__, col) => {
          const isRed = (row + col) % 2 === 0;
          const x = 46 + col * 7;
          const y = 66 + row * 6;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="7"
              height="6"
              fill={isRed ? "#dc2626" : "#ffffff"}
              stroke={isRed ? "#dc2626" : "#1d4ed8"}
              strokeWidth="0.5"
            />
          );
        })
      )}

      {/* AI window (the "held window") */}
      <rect x="42" y="62" width="36" height="24" rx="6" fill="url(#aiWindow)" stroke="#1d4ed8" strokeWidth="3" />
      <path d="M49 68 H71" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M49 74 H67" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <text x="60" y="79" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
        AI
      </text>
    </svg>
  );
};

type ChatQuotaState = {
  authenticated: boolean;
  limit: number;
  used: number;
  remaining: number;
  /** ISO — sljedeća ponoć u Europe/Zagreb (reset limita) */
  resetsAt?: string | null;
};

/** Produkcijski statički build bez API URL-a — lokalni odgovori, nema prijave. */
const STATIC_NO_API = !API_BASE && !import.meta.env.DEV;

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([{ role: "assistant", content: AI_WELCOME }]);
  }, []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [quota, setQuota] = useState<ChatQuotaState | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState(false);
  const [quotaErrorMessage, setQuotaErrorMessage] = useState<string | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [limitCountdown, setLimitCountdown] = useState("");
  /** Samo ovaj element skrola — ne koristimo scrollIntoView jer pomiče cijelu stranicu. */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollChatToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isLoading]);

  const refreshQuota = useCallback(async () => {
    if (STATIC_NO_API) return;
    setQuotaLoading(true);
    setQuotaError(false);
    setQuotaErrorMessage(null);
    try {
      const res = await apiGet<{
        authenticated?: boolean;
        limit?: number;
        used?: number;
        remaining?: number;
        resetsAt?: string | null;
      }>("/api/chat/quota");
      if (!res.success) {
        setQuotaError(true);
        setQuotaErrorMessage(
          "message" in res && typeof res.message === "string" ? res.message : "Kvota se nije učitala.",
        );
        return;
      }
      const data = res as {
        success: true;
        authenticated?: boolean;
        limit?: number;
        used?: number;
        remaining?: number;
        resetsAt?: string | null;
      };
      setQuota({
        authenticated: Boolean(data.authenticated),
        limit: Number(data.limit) || 12,
        used: Number(data.used) || 0,
        remaining: Math.max(0, Number(data.remaining) || 0),
        resetsAt: typeof data.resetsAt === "string" ? data.resetsAt : null,
      });
    } catch {
      setQuotaError(true);
      setQuotaErrorMessage("Neočekivana greška pri učitavanju kvote.");
    } finally {
      setQuotaLoading(false);
    }
  }, []);

  const loadAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const res = await authMe();
      const u = userFromAuthMe(res);
      setUser(u);
      if (u) {
        setQuota(null);
        await refreshQuota();
      } else {
        setQuota({
          authenticated: false,
          limit: 12,
          used: 0,
          remaining: 0,
        });
      }
    } finally {
      setAuthLoading(false);
    }
  }, [refreshQuota]);

  useEffect(() => {
    void loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    const onAuth = () => void loadAuth();
    window.addEventListener("mojput-auth-changed", onAuth);
    return () => window.removeEventListener("mojput-auth-changed", onAuth);
  }, [loadAuth]);

  /** Blokiraj samo kad znamo iz API-ja da je limit iscrpljen. null kvota = još učitavamo ili fetch pao — ne blokiraj prijavu. */
  const atDailyLimit = useMemo(
    () =>
      Boolean(user) &&
      !STATIC_NO_API &&
      quota != null &&
      quota.authenticated === true &&
      (quota.remaining ?? 0) <= 0,
    [user, quota],
  );

  /** Odbrojavanje do ponoći (Europe/Zagreb) kad je limit iscrpljen — format 16h 54m 33s. */
  useEffect(() => {
    if (!atDailyLimit || !quota?.resetsAt) {
      setLimitCountdown("");
      return;
    }
    const end = new Date(quota.resetsAt).getTime();
    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLimitCountdown(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [atDailyLimit, quota?.resetsAt]);

  const canSendChat =
    !isLoading && (STATIC_NO_API || (Boolean(user) && !authLoading && !atDailyLimit));

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "24px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>')
      .replace(/\n/g, "<br>");
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    if (!user && !STATIC_NO_API) {
      return;
    }
    if (atDailyLimit) {
      setPremiumOpen(true);
      return;
    }

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const userMsg: Message = { role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);

    const conversationHistory = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    const assistantIdx = conversationHistory.length;

    // Static hosting fallback: when backend is unavailable, answer from local dataset.
    const shouldUseLocalFallback = !API_BASE && !import.meta.env.DEV;
    if (shouldUseLocalFallback) {
      const localReply = buildLocalChatReply(content);
      setMessages((m) => {
        const next = [...m];
        next[assistantIdx] = { role: "assistant", content: localReply };
        return next;
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (res.status === 401) {
        setMessages((m) => m.slice(0, -2));
        setUser(null);
        await refreshQuota();
        throw new Error("Moraš biti prijavljen za chatbot.");
      }

      if (res.status === 403) {
        const errBody = await res.json().catch(() => ({}));
        if (errBody?.code === "CHAT_DAILY_LIMIT") {
          setMessages((m) => m.slice(0, -2));
          setQuota((q) =>
            q
              ? {
                  ...q,
                  used: errBody.limit ?? q.limit,
                  remaining: 0,
                }
              : q,
          );
          void refreshQuota();
          setPremiumOpen(true);
          setIsLoading(false);
          return;
        }
        throw new Error(errBody?.message || "Pristup odbijen.");
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Greška (${res.status})`);
      }

      const ct = res.headers.get("content-type") || "";
      let fullText = "";

      if (ct.includes("application/json")) {
        const data = await res.json();
        fullText = typeof data?.content === "string" ? data.content : "";
      } else {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split("\n");
            sseBuffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6);
              if (payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                if (parsed?.content) fullText += parsed.content;
              } catch {
                /* nepuni chunk — čeka se sljedeći */
              }
            }
          }
          if (sseBuffer.startsWith("data: ") && sseBuffer.slice(6) !== "[DONE]") {
            try {
              const parsed = JSON.parse(sseBuffer.slice(6));
              if (parsed?.content) fullText += parsed.content;
            } catch {
              /* ignore */
            }
          }
        }
        setMessages((m) => {
          const next = [...m];
          if (next[assistantIdx]) next[assistantIdx] = { ...next[assistantIdx], content: fullText };
          return next;
        });
      }

      if (ct.includes("application/json") && fullText) {
        setMessages((m) => {
          const next = [...m];
          if (next[assistantIdx]) next[assistantIdx] = { role: "assistant", content: fullText };
          return next;
        });
      }

      if (!fullText) {
        setMessages((m) => {
          const next = [...m];
          next[assistantIdx] = { role: "assistant", content: "Nisam mogao generirati odgovor. Pokušaj ponovo." };
          return next;
        });
      }
      await refreshQuota();
    } catch (err) {
      let msg = err instanceof Error ? err.message : "Došlo je do greške. Pokušajte ponovo.";
      if (msg.includes("404") || msg.includes("502") || msg.includes("Failed to fetch")) {
        msg = buildLocalChatReply(content);
      } else if (msg.includes("429") || msg.includes("quota") || msg.includes("OpenAI")) {
        msg = "OpenAI trenutno nije dostupan (kvota ili limit). Pokušaj za chvili ili provjeri račun na platform.openai.com.";
      }
      setMessages((m) => {
        const next = [...m];
        next[assistantIdx] = { role: "assistant", content: msg };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showLoginGate = !authLoading && !user && !STATIC_NO_API;

  return (
    <Layout>
      <Dialog open={premiumOpen} onOpenChange={setPremiumOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Crown className="w-6 h-6 shrink-0" />
              <DialogTitle>MojPut Premium (uskoro)</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Dnevni besplatni limit poruka dosegnut. Premium plan s dodatnim mogućnostima uskoro.
            </DialogDescription>
            <div className="text-left space-y-4 pt-1 text-sm text-foreground">
              <p>
                Iskoristio si besplatnih <strong>{quota?.limit ?? 12}</strong> poruka s Draženom za danas (besplatni
                limit se osvježava u ponoć po hrvatskom vremenu).
              </p>
              {atDailyLimit && limitCountdown && (
                <p className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                  <Timer className="w-4 h-4 shrink-0" />
                  <span>
                    Nova poruka za: <strong className="tabular-nums text-base">{limitCountdown}</strong>
                  </span>
                </p>
              )}
              <div className="space-y-2">
                <p className="font-medium">Premium će donijeti (plan se još dogovara):</p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Više poruka</strong> dnevno ili neograničeno ovisno o paketu
                  </li>
                  <li>
                    <strong className="text-foreground">Dodatne mogućnosti</strong> — dublje usporedbe fakulteta,
                    osobni podsjetnici, prioritet odgovora
                  </li>
                  <li>
                    <strong className="text-foreground">Rani pristup</strong> novim alatima na MojPutu
                  </li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                Pretplata još nije aktivna — pratite obavijesti na stranici i društvenim mrežama MojPuta.
              </p>
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setPremiumOpen(false)}>
              Razumijem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
          {/* Samo robot (drži AI prozor) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 shrink-0"
          >
            <div className="h-fit lg:sticky lg:top-24">
              <div className="flex items-center justify-center">
                <RobotAIWindow />
              </div>
            </div>
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <div className="chat-container">
              <div className="chat-header">
                <div className="chat-avatar">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="chat-header-title min-w-0 flex-1">
                  <h2 className="font-semibold">{AI_NAME}</h2>
                  <p className="chat-status">
                    <span className="chat-status-dot" />
                    {authLoading
                      ? "Učitavanje…"
                      : STATIC_NO_API
                        ? "Lokalni način (bez API)"
                        : showLoginGate
                          ? "Samo za prijavljene korisnike"
                          : "Online · baza + OpenAI"}
                  </p>
                </div>
                {user && !STATIC_NO_API && !authLoading && (quotaLoading || quotaError || quota?.authenticated) && (
                  <div
                    className={`chat-quota-pill ${atDailyLimit ? "chat-quota-pill--limit" : ""}`}
                    role="status"
                    aria-live="polite"
                    aria-label="Dnevna kvota besplatnih poruka s Draženom"
                  >
                    {quotaLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 shrink-0 animate-spin text-primary" aria-hidden />
                        <span className="text-sm">Učitavanje kvote…</span>
                      </>
                    ) : quotaError ? (
                      <>
                        <span
                          className="text-xs text-muted-foreground max-w-[min(100%,14rem)] leading-snug"
                          title={quotaErrorMessage || undefined}
                        >
                          {quotaErrorMessage || "Kvota se nije učitala."}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs shrink-0"
                          onClick={() => void refreshQuota()}
                        >
                          Osvježi
                        </Button>
                      </>
                    ) : quota?.authenticated ? (
                      <>
                        <span className="chat-quota-pill-label">Preostalo</span>
                        <span
                          className={`chat-quota-pill-nums tabular-nums ${atDailyLimit ? "text-destructive" : "text-primary"}`}
                        >
                          <strong>{quota.remaining}</strong>
                          <span className="text-muted-foreground font-normal">/</span>
                          <strong>{quota.limit}</strong>
                        </span>
                        <span className="chat-quota-pill-suffix">poruka danas</span>
                        {atDailyLimit && (
                          <>
                            <span className="chat-quota-pill-divider" aria-hidden />
                            <Timer className="w-3.5 h-3.5 shrink-0 text-muted-foreground" aria-hidden />
                            <span className="tabular-nums text-xs font-medium text-foreground">
                              {limitCountdown || "…"}
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-7 px-2 text-xs shrink-0"
                              onClick={() => setPremiumOpen(true)}
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Button>
                          </>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
                <div className="chat-header-actions flex items-center gap-2 shrink-0 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setMessages([{ role: "assistant", content: AI_WELCOME }]);
                      void refreshQuota();
                    }}
                    title={
                      atDailyLimit
                        ? "Isprazni razgovor — limit 12 poruka danas je iscrpljen; slanje novih poruka nije moguće do sutra."
                        : "Novi razgovor"
                    }
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Novi razgovor
                  </Button>
                  <div className="chat-badge" title="Podaci iz baze u promptu; tekst generira OpenAI">
                    📚 Baza + AI
                  </div>
                </div>
              </div>

              <div className="chat-messages" ref={messagesContainerRef}>
                {showLoginGate && (
                  <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-center space-y-3">
                    <p>Za Dražena trebaš biti prijavljen. Svaki dan imaš besplatnih 12 poruka.</p>
                    <Button asChild size="sm">
                      <Link to="/prijava" className="inline-flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Prijavi se
                      </Link>
                    </Button>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="chat-welcome">
                    <Sparkles className="w-10 h-10 text-primary opacity-70 mb-2" />
                    <h3 className="font-semibold text-foreground">Što te zanima?</h3>
                    <p className="text-sm text-muted-foreground max-w-[320px]">
                      Odgovori su u razgovornom tonu; koriste podatke iz baze kad odgovaraju na tvoje pitanje.
                    </p>
                    <div className="chat-suggestions">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="chat-sug-btn"
                          disabled={!canSendChat}
                          onClick={() => sendMessage(s)}
                        >
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.role}`}>
                    <div className="chat-msg-avatar">
                      {msg.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>
                    <div className={`chat-bubble ${msg.role}`}>
                      {msg.role === "assistant" ? (
                        <>
                          <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                          {i > 0 &&
                            msg.content &&
                            !msg.content.includes("Backend nije") &&
                            !msg.content.includes("Greška pri") && (
                            <div className="chat-source-tag">📚 Podaci iz baze u kontekstu · ✨ tekst (OpenAI) — provjeri službene uvjete na fakultetu</div>
                          )}
                        </>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chat-message assistant chat-typing">
                    <div className="chat-msg-avatar">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="chat-typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <div className="chat-input-row">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      autoResize(e.target);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      showLoginGate
                        ? "Prijavi se za slanje poruka…"
                        : authLoading
                          ? "Učitavanje…"
                          : atDailyLimit
                            ? "Dnevni limit poruka (12) iscrpljen…"
                            : "Npr. FER ili FOI za računarstvo?"
                    }
                    rows={1}
                    className="chat-textarea"
                    disabled={isLoading || !canSendChat}
                  />
                  <Button
                    size="icon"
                    className="chat-send-btn shrink-0"
                    onClick={() => sendMessage()}
                    disabled={isLoading || !canSendChat}
                    title="Pošalji"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="chat-footer-hint">Enter za slanje · Shift+Enter novi red · razgovorni odgovori, podaci iz baze kad odgovaraju</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes chatFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .chat-container {
          display: flex;
          flex-direction: column;
          height: min(680px, 75vh);
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        .chat-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.625rem 0.875rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.5);
          backdrop-filter: blur(10px);
        }
        .chat-quota-pill {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--primary) / 0.35);
          background: hsl(var(--card));
          box-shadow: 0 1px 2px hsl(var(--foreground) / 0.06);
          max-width: 100%;
        }
        .chat-quota-pill--limit {
          border-color: hsl(var(--destructive) / 0.45);
          background: hsl(var(--destructive) / 0.06);
        }
        .chat-quota-pill-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: hsl(var(--muted-foreground));
        }
        .chat-quota-pill-nums {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1;
        }
        .chat-quota-pill-suffix {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        .chat-quota-pill-divider {
          width: 1px;
          height: 1.25rem;
          background: hsl(var(--border));
          margin: 0 0.15rem;
        }
        @media (max-width: 639px) {
          .chat-header .chat-avatar {
            order: 1;
          }
          .chat-header .chat-header-title {
            order: 2;
            flex: 1 1 auto;
            min-width: 0;
          }
          .chat-header .chat-header-actions {
            order: 3;
            margin-left: auto;
          }
          .chat-header .chat-quota-pill {
            order: 4;
            width: 100%;
            justify-content: flex-start;
          }
        }
        .chat-avatar {
          width: 40px; height: 40px;
          border-radius: 0.75rem;
          background: var(--hero-gradient);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chat-status {
          font-size: 0.6875rem;
          color: hsl(var(--primary));
          display: flex; align-items: center; gap: 0.375rem;
          margin-top: 2px;
        }
        .chat-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          animation: chatPulse 2s ease-in-out infinite;
        }
        .chat-badge {
          margin-left: auto;
          font-size: 0.625rem;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          border: 1px solid hsl(var(--primary) / 0.25);
          padding: 4px 10px;
          border-radius: 1.25rem;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .chat-message {
          display: flex;
          gap: 0.75rem;
        }
        .chat-message.user { flex-direction: row-reverse; }
        .chat-msg-avatar {
          width: 34px; height: 34px;
          border-radius: 0.625rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chat-message.assistant .chat-msg-avatar {
          background: hsl(var(--primary) / 0.15);
          border: 1px solid hsl(var(--border));
        }
        .chat-message.user .chat-msg-avatar {
          background: var(--hero-gradient);
        }
        .chat-bubble {
          max-width: 75%;
          padding: 0.875rem 1.125rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.65;
        }
        .chat-message.assistant .chat-bubble {
          background: hsl(var(--muted) / 0.6);
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          color: hsl(var(--foreground));
        }
        .chat-message.user .chat-bubble {
          background: linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.08));
          border: 1px solid hsl(var(--primary) / 0.3);
          border-radius: 1rem 4px 1rem 1rem;
          color: hsl(var(--foreground));
        }
        .chat-code {
          background: hsl(var(--primary) / 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .chat-source-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.625rem;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.08);
          border: 1px solid hsl(var(--primary) / 0.2);
          padding: 3px 8px;
          border-radius: 0.375rem;
          margin-top: 0.5rem;
        }
        .chat-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-align: center;
          padding: 2rem;
        }
        .chat-suggestions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          width: 100%;
          max-width: 380px;
        }
        .chat-sug-btn {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 0.625rem;
          padding: 0.625rem 0.875rem;
          color: hsl(var(--foreground));
          font-size: 0.75rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          line-height: 1.4;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .chat-sug-btn:hover {
          border-color: hsl(var(--primary) / 0.5);
          background: hsl(var(--primary) / 0.08);
        }
        .chat-typing-dots {
          background: hsl(var(--muted) / 0.6);
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          padding: 0.875rem 1.125rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .chat-typing-dots span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          animation: chatBounce 1.2s ease-in-out infinite;
        }
        .chat-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .chat-input-area {
          padding: 1rem 1.25rem;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.4);
          backdrop-filter: blur(10px);
        }
        .chat-input-row {
          display: flex;
          gap: 0.625rem;
          align-items: flex-end;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.875rem;
          padding: 0.625rem 0.875rem;
          transition: border-color 0.2s;
        }
        .chat-input-row:focus-within {
          border-color: hsl(var(--primary) / 0.5);
          outline: none;
        }
        .chat-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          line-height: 1.5;
          resize: none;
          max-height: 120px;
          min-height: 24px;
          font-family: inherit;
        }
        .chat-textarea::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .chat-send-btn {
          width: 36px; height: 36px;
          border-radius: 0.625rem;
          background: var(--hero-gradient) !important;
          border: none !important;
          color: white !important;
        }
        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          filter: brightness(1.05);
        }
        .chat-footer-hint {
          font-size: 0.625rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
          margin-top: 0.5rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </Layout>
  );
};

export default Chatbot;
