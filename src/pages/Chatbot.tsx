import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  RotateCcw,
  LogIn,
  Crown,
  Timer,
  Loader2,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { facultyInstitutions } from "@/data/faculties";
import { highSchools } from "@/data/highSchools";
import { resolveExperienceMode } from "@/lib/experience";
import { API_BASE_URL } from "@/config/apiBase";
import { apiGet, getStoredAuthToken, setStoredAuthToken } from "@/lib/api";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const API_BASE = API_BASE_URL;

const SENIOR_SUGGESTIONS = [
  "Usporedi FER i FOI za računarstvo — prednosti i mane",
  "Je li TVZ ili FOI bolji izbor ako želim brzo raditi praktične projekte?",
  "Što znači ići na PMF ako volim matematiku, a i programiranje?",
  "Kako bih odabrao između FER-a i TVZ-a za karijeru u IT-u?",
];

const JUNIOR_SUGGESTIONS = [
  "Koje su najbolje gimnazije u Zagrebu?",
  "Strukovna ili gimnazija za informatiku — što je bolje?",
  "Koja srednja škola u Splitu ima medicinski smjer?",
  "Kako odabrati između opće gimnazije i jezične?",
];

type ChatAttachment = {
  id: string;
  name: string;
  mime: string;
  dataUrl?: string;
  textContent?: string;
  /** Učitavanje s diska u tijeku — ime je već vidljivo u text baru */
  loading?: boolean;
};

interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
}

const MAX_ATTACH_BYTES = 4 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Windows / neki preglednici često vrate prazan MIME za slike — koristi i ekstenziju. */
const IMAGE_FILE_RE = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif|ico)$/i;

/** Tekstualni prilozi — širok skup ekstenzija. */
const TEXT_FILE_RE = /\.(txt|csv|md|json|xml|html?|css|s?css|js|m?js|ts|tsx|jsx|vue|log|ini|yaml|yml|env|sh|bat|cmd|ps1|rtf|tex|gitignore|editorconfig)$/i;

function isImageAttachment(a: Pick<ChatAttachment, "mime" | "dataUrl" | "name">): boolean {
  if (a.dataUrl && /^data:image\//i.test(a.dataUrl)) return true;
  if (a.mime && a.mime.startsWith("image/")) return true;
  return IMAGE_FILE_RE.test(a.name || "");
}

function fileDisplayLabel(file: File): string {
  const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
  return (rel || file.name || "datoteka").replace(/\\/g, "/");
}

/** Samo ime datoteke (za prikaz u retku), put ostaje u title. */
function fileBasename(path: string): string {
  const parts = path.replace(/\\/g, "/").split("/").filter((p) => p.length > 0);
  const base = parts.length > 0 ? parts[parts.length - 1]! : path.trim();
  return base.trim() || "datoteka";
}

async function readFileAsAttachment(file: File, presetId?: string): Promise<ChatAttachment> {
  if (file.size > MAX_ATTACH_BYTES) {
    throw new Error("Datoteka je prevelika (najviše 4 MB po prilogu).");
  }
  const id = presetId ?? crypto.randomUUID();
  const name = fileDisplayLabel(file);

  const looksLikeImage = file.type.startsWith("image/") || IMAGE_FILE_RE.test(name);

  if (looksLikeImage) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const dataUrl = r.result as string;
        const fromData = dataUrl.match(/^data:([^;]+);/)?.[1]?.trim();
        const mime = fromData || file.type || "image/jpeg";
        resolve({ id, name, mime, dataUrl });
      };
      r.onerror = () => reject(new Error("Čitanje slike nije uspjelo."));
      r.readAsDataURL(file);
    });
  }

  if (file.type === "application/pdf" || /\.pdf$/i.test(name)) {
    return {
      id,
      name,
      mime: file.type || "application/pdf",
      textContent:
        `[PDF: ${name} · ${formatFileSize(file.size)}] — automatsko čitanje PDF-a nije uključeno; opiši što trebaš ili priloži sliku.`,
    };
  }

  /** Word .docx — tekst iz Open XML (mammoth, dinamički import) */
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.docx$/i.test(name)
  ) {
    try {
      const buffer = await file.arrayBuffer();
      const { default: mammoth } = await import("mammoth");
      const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
      const text = (value || "").replace(/\s+/g, " ").trim().slice(0, 32000);
      return {
        id,
        name,
        mime:
          file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        textContent:
          text ||
          `[Word (.docx): ${name}] — Nema izvučenog teksta (npr. samo slike ili prazan dokument).`,
      };
    } catch {
      throw new Error("Ne mogu pročitati ovaj Word (.docx) dokument. Pokušaj ponovo ili kopiraj tekst ručno.");
    }
  }

  /** Stari Word .doc — binarni format, nema pouzdanog čitanja u pregledniku */
  if (file.type === "application/msword" || /\.doc$/i.test(name)) {
    return {
      id,
      name,
      mime: file.type || "application/msword",
      textContent: `[Word (.doc): ${name} · ${formatFileSize(file.size)}] — stari .doc format nije podržan u pregledniku. U Wordu ga spremi kao „.docx“ ili zalijepi tekst u poruku.`,
    };
  }

  const looksLikeText =
    file.type.startsWith("text/") ||
    file.type === "application/json" ||
    file.type === "application/xml" ||
    file.type === "application/javascript" ||
    file.type === "application/x-javascript" ||
    TEXT_FILE_RE.test(name);

  if (looksLikeText) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const text = String(r.result ?? "");
        resolve({ id, name, mime: file.type || "text/plain", textContent: text.slice(0, 32000) });
      };
      r.onerror = () => reject(new Error("Čitanje teksta nije uspjelo."));
      r.readAsText(file);
    });
  }

  return {
    id,
    name,
    mime: file.type || "application/octet-stream",
    textContent: `[Datoteka: ${name} · ${formatFileSize(file.size)}] — sadržaj nije učitan kao tekst; opiši što trebaš ili priloži sliku/tekst ako želiš analizu.`,
  };
}

function buildApiUserContent(
  text: string,
  attachments: ChatAttachment[],
): string | Array<{ type: string; text?: string; image_url?: { url: string; detail?: "low" | "auto" } }> {
  const imgs = attachments.filter((a) => !a.loading && a.dataUrl && isImageAttachment(a));
  const textFromFiles = attachments
    .filter((a) => !a.loading && a.textContent != null && a.textContent.length > 0)
    .map((a) => `📎 ${a.name}:\n${a.textContent}`)
    .join("\n\n");

  const userText = text.trim();
  let textParts = [userText, textFromFiles].filter(Boolean).join("\n\n");

  /** Samo prilog (npr. Word) bez teksta u polju — modelu jasno reci da koristi sadržaj priloga. */
  if (textFromFiles && !userText) {
    textParts = `Korisnik je priložio dokument(e). Odgovori na temelju teksta ispod (to je sadržaj datoteka).\n\n${textParts}`;
  }

  let fallback = textParts || (imgs.length ? "Molim pogledaj prilog." : "");
  if (!fallback.trim() && attachments.some((a) => !a.loading)) {
    fallback = "Prilog je dodan — obradi ga ako je moguće.";
  }

  if (imgs.length === 0) {
    return fallback;
  }

  const parts: Array<{
    type: string;
    text?: string;
    image_url?: { url: string; detail?: "low" | "auto" };
  }> = [];
  parts.push({ type: "text", text: fallback || "Molim pogledaj prilog." });
  for (const img of imgs) {
    parts.push({
      type: "image_url",
      image_url: { url: img.dataUrl!, detail: "low" },
    });
  }
  return parts;
}

function buildUserSearchQuery(text: string, attachments: ChatAttachment[] | undefined): string {
  const textFromFiles = (attachments ?? [])
    .filter((a) => a.textContent != null && a.textContent.length > 0)
    .map((a) => `📎 ${a.name}:\n${a.textContent}`)
    .join("\n\n");
  const hasImg = attachments?.some((a) => !a.loading && a.dataUrl && isImageAttachment(a));
  const imgNote = hasImg && !text.trim() && !textFromFiles ? "(Korisnik je priložio sliku.)" : "";
  const docOnly = textFromFiles && !text.trim() && !imgNote;
  const prefix = docOnly ? "Dokument priložen u poruci. " : "";
  return (
    [prefix + text.trim(), textFromFiles, imgNote].filter(Boolean).join("\n\n") || "prilog"
  );
}

const AI_NAME = "Dražen";
const AI_WELCOME_SENIOR = `Bok! Ja sam ${AI_NAME} 👋
Pomažem ti sa svim pitanjima o fakultetima u Hrvatskoj. Što te zanima?`;
const AI_WELCOME_JUNIOR = `Bok! Ja sam ${AI_NAME} 👋
Pomažem ti sa svim pitanjima o srednjim školama u Hrvatskoj. Što te zanima?`;

function buildLocalChatReplySenior(question: string): string {
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

function buildLocalChatReplyJunior(question: string): string {
  const q = question.toLowerCase();
  const cities = Array.from(new Set(highSchools.map((s) => s.city)));
  const matchedCity = cities.find((city) => q.includes(city.toLowerCase()));

  if (matchedCity) {
    const inCity = highSchools.filter((s) => s.city.toLowerCase() === matchedCity.toLowerCase()).slice(0, 10);
    if (inCity.length) {
      return `U gradu ${matchedCity} sam pronašao ove srednje škole:\n- ${inCity.map((s) => s.name).join("\n- ")}\n\nMogu ti reći više o bilo kojoj školi ili smjerovima.`;
    }
  }

  if (q.includes("gimnazij")) {
    const matches = highSchools.filter((s) => /gimnazij/i.test(s.name)).slice(0, 10);
    if (matches.length) {
      return `Pronašao sam ove gimnazije:\n- ${matches.map((s) => `${s.name} (${s.city})`).join("\n- ")}`;
    }
  }

  if (q.includes("strukovna") || q.includes("strukovno") || q.includes("obrt")) {
    const matches = highSchools
      .filter((s) => /strukovna|strukovn|obrt/i.test(s.name))
      .slice(0, 10);
    if (matches.length) {
      return `Strukovne škole koje sam pronašao:\n- ${matches.map((s) => `${s.name} (${s.city})`).join("\n- ")}`;
    }
  }

  if (q.includes("medicin") || q.includes("zdrav")) {
    const matches = highSchools
      .filter((s) => /medicin|zdrav|bolničar/i.test(s.name))
      .slice(0, 10);
    if (matches.length) {
      return `Škole s medicinskim/zdravstvenim smjerom:\n- ${matches.map((s) => `${s.name} (${s.city})`).join("\n- ")}`;
    }
  }

  if (q.includes("informatič") || q.includes("računar") || q.includes("it")) {
    const matches = highSchools
      .filter((s) => /informatič|računar|tehničk|elektrotehni/i.test(s.name))
      .slice(0, 10);
    if (matches.length) {
      return `Škole s IT/tehničkim smjerovima:\n- ${matches.map((s) => `${s.name} (${s.city})`).join("\n- ")}`;
    }
  }

  const sample = highSchools.slice(0, 8);
  return `Trenutno radim u lokalnom modu (bez backenda), ali i dalje mogu pomoći kroz podatke o 443 srednje škole u Hrvatskoj.\n\nPrimjeri pitanja:\n- Srednje škole u određenom gradu (npr. Zagreb, Split, Rijeka)\n- Gimnazije ili strukovne škole\n- Škole s određenim smjerom (IT, medicina, jezici)\n\nPrimjeri škola:\n- ${sample.map((s) => `${s.name} (${s.city})`).join("\n- ")}`;
}

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
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const suggestions = isJunior ? JUNIOR_SUGGESTIONS : SENIOR_SUGGESTIONS;
  const aiWelcome = isJunior ? AI_WELCOME_JUNIOR : AI_WELCOME_SENIOR;

  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([{ role: "assistant", content: aiWelcome }]);
  }, [aiWelcome]);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);

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

  /** Prilog se može odabrati i bez prijave (prikaz u traci); slanje i dalje zahtijeva prijavu. */
  const canPickAttachments = !isLoading;

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
    if (pendingAttachments.some((a) => a.loading)) return;
    const content = (text !== undefined ? text : input).trim();
    const attachments = [...pendingAttachments];
    if ((!content && attachments.length === 0) || isLoading) return;

    if (!user && !STATIC_NO_API) {
      toast.error("Za slanje poruka i priloga (slike, dokumenti) moraš biti prijavljen.", { duration: 6000 });
      return;
    }
    if (atDailyLimit) {
      setPremiumOpen(true);
      return;
    }

    setInput("");
    setPendingAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const userMsg: Message = {
      role: "user",
      content,
      attachments: attachments.length ? attachments : undefined,
    };
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);

    const conversationHistory = [...messages, userMsg].map((m) => {
      if (m.role === "user") {
        return {
          role: "user" as const,
          content: buildApiUserContent(m.content, m.attachments ?? []),
        };
      }
      return { role: "assistant" as const, content: m.content };
    });

    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    const assistantIdx = conversationHistory.length;

    // Static hosting fallback: when backend is unavailable, answer from local dataset.
    const shouldUseLocalFallback = !API_BASE && !import.meta.env.DEV;
    if (shouldUseLocalFallback) {
      const localReply = isJunior
        ? buildLocalChatReplyJunior(buildUserSearchQuery(content, userMsg.attachments))
        : buildLocalChatReplySenior(buildUserSearchQuery(content, userMsg.attachments));
      setMessages((m) => {
        const next = [...m];
        next[assistantIdx] = { role: "assistant", content: localReply };
        return next;
      });
      setIsLoading(false);
      return;
    }

    try {
      const authHdr = getStoredAuthToken();
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(authHdr ? { Authorization: `Bearer ${authHdr}` } : {}),
        },
        body: JSON.stringify({ messages: conversationHistory, audience }),
      });

      if (res.status === 401) {
        setStoredAuthToken(null);
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
        msg = isJunior
          ? buildLocalChatReplyJunior(buildUserSearchQuery(content, userMsg.attachments))
          : buildLocalChatReplySenior(buildUserSearchQuery(content, userMsg.attachments));
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
      void sendMessage();
    }
  };

  const processPickedFiles = async (files: File[] | null | undefined) => {
    if (!files?.length) return;
    for (const file of files) {
      if (file.size > MAX_ATTACH_BYTES) {
        toast.error("Datoteka je prevelika (najviše 4 MB po prilogu).");
        continue;
      }

      const id = crypto.randomUUID();
      const label = fileDisplayLabel(file);
      let added = false;
      setPendingAttachments((p) => {
        if (p.length >= MAX_ATTACHMENTS) return p;
        added = true;
        return [...p, { id, name: label, mime: file.type || "", loading: true }];
      });
      if (!added) {
        toast.error("Najviše 5 priloga odjednom.");
        break;
      }

      try {
        const att = await readFileAsAttachment(file, id);
        setPendingAttachments((p) => p.map((x) => (x.id === id ? { ...att, loading: false } : x)));
      } catch (err) {
        setPendingAttachments((p) => p.filter((x) => x.id !== id));
        toast.error(err instanceof Error ? err.message : "Datoteka nije učitana.");
      }
    }
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    /** Odmah kopiraj u polje — brisanje value može isprazniti FileList u nekim preglednicima. */
    const picked = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    await processPickedFiles(picked);
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((p) => p.filter((a) => a.id !== id));
  };

  const attachmentsStillLoading = pendingAttachments.some((a) => a.loading);
  const hasOutgoingContent = Boolean(input.trim() || pendingAttachments.length > 0);

  /** Pošalji bez blokiranja prijavom prikaza (toast ako nije prijavljen); blok samo limit / učitavanje. */
  const canClickSend =
    !isLoading &&
    !authLoading &&
    hasOutgoingContent &&
    !attachmentsStillLoading &&
    !(Boolean(user) && atDailyLimit);

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

      <section className="mx-auto max-w-6xl px-3 pb-10 pt-6 sm:px-4 sm:pb-12 sm:pt-8 md:py-14 md:pb-16 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col lg:flex-row gap-6">
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
                  <h2 className="font-semibold text-base sm:text-[1.05rem]">{AI_NAME}</h2>
                  <p className="chat-status">
                    <span className={cn("chat-status-dot", (atDailyLimit || showLoginGate) && "chat-status-dot--muted")} />
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
                    className="chat-new-btn text-xs"
                    onClick={() => {
                      setMessages([{ role: "assistant", content: aiWelcome }]);
                      setPendingAttachments([]);
                      void refreshQuota();
                    }}
                    title={
                      atDailyLimit
                        ? "Isprazni razgovor — limit 12 poruka danas je iscrpljen; slanje novih poruka nije moguće do sutra."
                        : "Novi razgovor"
                    }
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    <span className="hidden sm:inline">Novi razgovor</span>
                    <span className="sm:hidden">Novi</span>
                  </Button>
                  <div className="chat-badge" title="Podaci iz baze u promptu; tekst generira OpenAI">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Baza + AI
                  </div>
                </div>
              </div>

              <div className="chat-messages" ref={messagesContainerRef}>
                {showLoginGate && (
                  <div className="chat-login-gate">
                    <div className="chat-login-gate-icon" aria-hidden>
                      <LogIn className="h-5 w-5" />
                    </div>
                    <div className="chat-login-gate-body">
                      <h3 className="text-sm font-semibold text-foreground">Prijavi se za razgovor</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        Za Dražena trebaš biti prijavljen. Svaki dan imaš <strong className="text-foreground">12 besplatnih poruka</strong>.
                      </p>
                      <Button asChild size="sm" className="mt-3 rounded-xl">
                        <Link to="/prijava" className="inline-flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Prijavi se
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="chat-welcome">
                    <div className="chat-welcome-icon" aria-hidden>
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">Što te zanima?</h3>
                    <p className="text-sm text-muted-foreground max-w-[340px]">
                      Odgovori su u razgovornom tonu i koriste podatke iz baze kad odgovaraju na tvoje pitanje.
                    </p>
                    <div className="chat-suggestions">
                      <p className="chat-suggestions-label">Brzi primjeri</p>
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="chat-sug-btn"
                          disabled={!canSendChat}
                          onClick={() => sendMessage(s)}
                        >
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primary" />
                          <span className="chat-sug-btn-text">{s}</span>
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
                            <div className="chat-source-tag">
                              📚 Podaci iz {isJunior ? "baze srednjih škola" : "baze"} u kontekstu · ✨ tekst (OpenAI) — provjeri službene uvjete na {isJunior ? "školi" : "fakultetu"}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {msg.attachments?.map((a) =>
                            a.dataUrl && isImageAttachment(a) ? (
                              <img
                                key={a.id}
                                src={a.dataUrl}
                                alt={a.name}
                                className="chat-attachment-img mb-2 max-h-48 w-auto rounded-md border border-border object-contain"
                              />
                            ) : a.textContent ? (
                              <div
                                key={a.id}
                                className="mb-2 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground"
                              >
                                📎 {a.name}
                              </div>
                            ) : null,
                          )}
                          {msg.content ? (
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                          ) : msg.attachments?.some((a) => a.textContent) ? (
                            <span className="text-xs text-muted-foreground">
                              Tekst dokumenta poslan je u poruci chatbotu.
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chat-message assistant chat-typing">
                    <div className="chat-msg-avatar">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="chat-typing-dots" aria-live="polite" aria-label="Piše odgovor">
                      <span className="chat-typing-label">Piše</span>
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-area shrink-0">
                <div className="chat-input-row">
                  {pendingAttachments.length > 0 && (
                    <div
                      className={cn(
                        "chat-pending-strip flex w-full min-h-10 flex-wrap items-center gap-2 border-b-2 border-primary/40",
                        "bg-primary/15 px-2 py-2 text-foreground dark:bg-primary/25",
                      )}
                      aria-live="polite"
                      aria-label="Prilozi prije slanja"
                    >
                      {pendingAttachments.map((a) => {
                        const isImg = isImageAttachment(a);
                        const shortName = fileBasename(a.name) || "Prilog";
                        return (
                          <div
                            key={a.id}
                            className="chat-pending-chip-compact inline-flex max-w-[min(100%,20rem)] min-h-7 min-w-0 items-center gap-1 rounded-full border-2 border-primary/50 bg-background px-2 py-1 text-xs font-semibold text-foreground shadow-sm"
                            title={a.name || shortName}
                          >
                            <span className="select-none text-sm leading-none" aria-hidden>
                              📎
                            </span>
                            <span className="chat-pending-icon shrink-0" aria-hidden>
                              {isImg ? (
                                <ImageIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.25} />
                              )}
                            </span>
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-primary">
                              {isImg ? "Slika" : "Datoteka"}
                            </span>
                            <span className="text-muted-foreground" aria-hidden>
                              ·
                            </span>
                            <span className="min-w-0 max-w-[11rem] truncate font-medium">{shortName}</span>
                            {a.loading ? (
                              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" aria-hidden />
                            ) : null}
                            <button
                              type="button"
                              className="chat-pending-chip-remove shrink-0"
                              onClick={() => removePendingAttachment(a.id)}
                              aria-label={`Ukloni ${a.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="chat-input-row-main">
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
                              : pendingAttachments.length > 0
                                ? "Napiši poruku uz prilog (opcionalno)…"
                                : "Npr. FER ili FOI za računarstvo?"
                      }
                      rows={1}
                      className="chat-textarea"
                      disabled={isLoading || authLoading || (Boolean(user) && atDailyLimit)}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={(e) => void handleFilesSelected(e)}
                      aria-hidden
                      tabIndex={-1}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="chat-attach-btn shrink-0"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!canPickAttachments}
                      title="Priloži datoteke (više odjednom)"
                    >
                      <Plus className="h-7 w-7" strokeWidth={2.75} aria-hidden />
                    </Button>
                    <Button
                      size="icon"
                      className="chat-send-btn shrink-0"
                      onClick={() => void sendMessage()}
                      disabled={!canClickSend}
                      title="Pošalji"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="chat-footer-hint">
                  Enter za slanje · Shift+Enter novi red · + za prilog datoteka · razgovorni odgovori, podaci iz baze kad
                  odgovaraju
                </p>
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

        /* ── Container ───────────────────────────────────────────── */
        .chat-container {
          display: flex;
          flex-direction: column;
          height: min(720px, 78dvh);
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        @media (min-width: 640px) {
          .chat-container { border-radius: 1.5rem; }
        }

        /* ── Header ──────────────────────────────────────────────── */
        .chat-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.625rem 0.875rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid hsl(var(--border));
          background:
            linear-gradient(90deg, hsl(var(--primary) / 0.08), transparent 60%),
            hsl(var(--muted) / 0.55);
          backdrop-filter: blur(10px);
        }
        @media (min-width: 640px) {
          .chat-header { padding: 1rem 1.25rem; }
        }

        .chat-avatar {
          width: 44px; height: 44px;
          border-radius: 0.875rem;
          background: var(--hero-gradient);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
        }
        .chat-status {
          font-size: 0.6875rem;
          font-weight: 500;
          color: hsl(var(--primary));
          display: inline-flex; align-items: center; gap: 0.375rem;
          margin-top: 2px;
        }
        .chat-status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
          animation: chatPulse 2s ease-in-out infinite;
        }
        .chat-status-dot--muted {
          background: hsl(var(--muted-foreground));
          box-shadow: 0 0 0 3px hsl(var(--muted-foreground) / 0.15);
          animation: none;
        }

        .chat-new-btn {
          border-radius: 0.625rem;
          height: 32px;
          padding: 0 0.75rem;
        }

        .chat-badge {
          font-size: 0.6875rem;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.12);
          border: 1px solid hsl(var(--primary) / 0.3);
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.02em;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          white-space: nowrap;
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

        /* ── Messages ────────────────────────────────────────────── */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scroll-behavior: smooth;
          background:
            radial-gradient(ellipse at top, hsl(var(--primary) / 0.04), transparent 60%),
            hsl(var(--background));
        }
        @media (min-width: 640px) {
          .chat-messages { padding: 1.5rem; gap: 1.25rem; }
        }
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        /* ── Login gate ──────────────────────────────────────────── */
        .chat-login-gate {
          display: flex;
          gap: 0.875rem;
          align-items: flex-start;
          padding: 0.875rem 1rem;
          border-radius: 1rem;
          border: 2px solid hsl(var(--primary) / 0.25);
          background:
            linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.03));
        }
        .chat-login-gate-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 0.75rem;
          background: var(--hero-gradient);
          color: hsl(var(--primary-foreground));
          box-shadow: 0 4px 10px hsl(var(--primary) / 0.3);
        }
        .chat-login-gate-body { min-width: 0; flex: 1; }

        /* ── Welcome ─────────────────────────────────────────────── */
        .chat-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          text-align: center;
          padding: 1.5rem 1rem;
        }
        .chat-welcome-icon {
          width: 52px; height: 52px;
          border-radius: 1rem;
          background: var(--hero-gradient);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px hsl(var(--primary) / 0.35);
          margin-bottom: 0.25rem;
        }
        .chat-suggestions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          width: 100%;
          max-width: 420px;
        }
        .chat-suggestions-label {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.125rem;
          text-align: left;
        }
        .chat-sug-btn {
          background: hsl(var(--card));
          border: 1.5px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.75rem 0.875rem;
          color: hsl(var(--foreground));
          font-size: 0.8125rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s;
          line-height: 1.45;
          font-family: inherit;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          box-shadow: 0 1px 2px hsl(var(--foreground) / 0.04);
        }
        .chat-sug-btn:hover:not(:disabled) {
          border-color: hsl(var(--primary) / 0.4);
          background: hsl(var(--primary) / 0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px hsl(var(--primary) / 0.08);
        }
        .chat-sug-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .chat-sug-btn-text { min-width: 0; }

        /* ── Message bubbles ─────────────────────────────────────── */
        .chat-message {
          display: flex;
          gap: 0.625rem;
          animation: chatFadeUp 0.3s ease-out both;
        }
        .chat-message.user { flex-direction: row-reverse; }
        .chat-msg-avatar {
          width: 32px; height: 32px;
          border-radius: 0.625rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chat-message.assistant .chat-msg-avatar {
          background: hsl(var(--primary) / 0.12);
          border: 1px solid hsl(var(--primary) / 0.2);
        }
        .chat-message.user .chat-msg-avatar {
          background: var(--hero-gradient);
          box-shadow: 0 2px 6px hsl(var(--primary) / 0.3);
        }
        .chat-bubble {
          max-width: min(82%, 640px);
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        @media (min-width: 640px) {
          .chat-bubble { padding: 0.875rem 1.125rem; }
        }
        .chat-message.assistant .chat-bubble {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          color: hsl(var(--foreground));
          box-shadow: 0 1px 2px hsl(var(--foreground) / 0.04);
        }
        .chat-message.user .chat-bubble {
          background: linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.08));
          border: 1px solid hsl(var(--primary) / 0.35);
          border-radius: 1rem 4px 1rem 1rem;
          color: hsl(var(--foreground));
        }
        .chat-code {
          background: hsl(var(--primary) / 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
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
          line-height: 1.4;
        }

        /* ── Typing ──────────────────────────────────────────────── */
        .chat-typing-dots {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 1px 2px hsl(var(--foreground) / 0.04);
        }
        .chat-typing-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          margin-right: 0.125rem;
        }
        .chat-typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          animation: chatBounce 1.2s ease-in-out infinite;
        }
        .chat-typing-dots > span.chat-typing-dot:nth-child(2) { animation-delay: 0s; }
        .chat-typing-dots > span.chat-typing-dot:nth-child(3) { animation-delay: 0.2s; }
        .chat-typing-dots > span.chat-typing-dot:nth-child(4) { animation-delay: 0.4s; }

        /* ── Input area ──────────────────────────────────────────── */
        .chat-input-area {
          padding: 0.75rem;
          border-top: 1px solid hsl(var(--border));
          background:
            linear-gradient(180deg, hsl(var(--muted) / 0.25), hsl(var(--muted) / 0.5));
          backdrop-filter: blur(10px);
        }
        @media (min-width: 640px) {
          .chat-input-area { padding: 1rem 1.25rem; }
        }
        .chat-input-row {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          border-radius: 1rem;
          padding: 0.5rem 0.625rem;
          transition: all 0.2s;
        }
        .chat-input-row-main {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
        }
        .chat-input-row:focus-within {
          border-color: hsl(var(--primary) / 0.55);
          box-shadow: 0 0 0 4px hsl(var(--primary) / 0.08);
          outline: none;
        }
        .chat-pending-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: hsl(var(--foreground));
          font-size: 0.9375rem;
          line-height: 1.5;
          resize: none;
          max-height: 120px;
          min-height: 24px;
          padding: 0.375rem 0.25rem;
          font-family: inherit;
        }
        @media (min-width: 640px) {
          .chat-textarea { font-size: 0.875rem; }
        }
        .chat-textarea::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .chat-send-btn {
          width: 40px; height: 40px;
          border-radius: 0.75rem;
          background: var(--hero-gradient) !important;
          border: none !important;
          color: white !important;
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.35);
          transition: all 0.2s;
        }
        .chat-send-btn:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.03);
          filter: brightness(1.05);
          box-shadow: 0 6px 16px hsl(var(--primary) / 0.45);
        }
        .chat-send-btn:disabled {
          opacity: 0.55;
          box-shadow: none;
        }
        .chat-attach-btn {
          width: 40px;
          height: 40px;
          border-radius: 0.75rem;
          background: hsl(var(--muted)) !important;
          border: 1.5px solid hsl(var(--border)) !important;
          color: hsl(var(--muted-foreground)) !important;
          transition: all 0.2s;
        }
        .chat-attach-btn:hover:not(:disabled) {
          background: hsl(var(--primary) / 0.08) !important;
          border-color: hsl(var(--primary) / 0.3) !important;
          color: hsl(var(--primary)) !important;
        }
        .chat-pending-chip-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.125rem;
          border-radius: 0.375rem;
          color: hsl(var(--muted-foreground));
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }
        .chat-pending-chip-remove:hover {
          color: hsl(var(--destructive));
          background: hsl(var(--destructive) / 0.1);
        }
        .chat-footer-hint {
          font-size: 0.6875rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
          margin-top: 0.5rem;
          letter-spacing: 0.01em;
          line-height: 1.5;
        }
      `}</style>
    </Layout>
  );
};

export default Chatbot;
