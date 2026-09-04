import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  LogOut,
  LogIn,
  MessageCircle,
  MessagesSquare,
  Plus,
  Reply,
  Search,
  Send,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

/** Razgovori/poruke iz localStorage (offline fallback) koriste velike ID-eve; serverski su mali autoincrement. */
function isLocalForumConversationId(id: number): boolean {
  return id >= 1_000_000_000_000;
}
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { resolveExperienceMode, type MojPutExperienceMode } from "@/lib/experience";
import { cn } from "@/lib/utils";
import HeaderDecor, { HeaderHero } from "@/components/header-animations/HeaderDecor";
import {
  JUNIOR_FORUM_CITIES,
  JUNIOR_FORUM_TRACKS,
  attachForumMeta,
  emptyForumMeta,
  forumTrackLabel,
  stripForumMeta,
  type JuniorForumMeta,
  type JuniorForumTrackId,
} from "@/lib/juniorForum";

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
    title: "Gimnazija ili strukovna — kako ste odlučili?",
    description: attachForumMeta(
      "Ne znam je li bolje ići na gimnaziju ili strukovnu. Tko je u 3. razredu i što bi danas drugačije odabrao?",
      { city: null, track: "gimnazija", askSenior: true },
    ),
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
    title: "IT u Zagrebu: gimnazija ili tehnička?",
    description: attachForumMeta(
      "Tko je u 3. razredu na informatičkom ili elektrotehničkom? Kako izgleda tjedan, ima li prakse?",
      { city: "Zagreb", track: "it", askSenior: true },
    ),
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
    title: "Split, medicinska — treba li dodatna provjera?",
    description: attachForumMeta(
      "Zanima me medicinska u Splitu. Tko je već u školi — kakav je prijemni i kako ste se pripremali?",
      { city: "Split", track: "medicinska", askSenior: true },
    ),
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
  {
    id: 2004,
    title: "Dodatna provjera — što stvarno traže?",
    description: attachForumMeta(
      "Koji programi imaju dodatnu provjeru i kako izgleda priprema? Pitam treći razred.",
      { city: null, track: "upis", askSenior: true },
    ),
    creator: "Ena8",
    creatorId: -1,
    createdAt: new Date("2026-03-08T09:00:00+01:00"),
    messageCount: 1,
    messages: [
      {
        id: 6301,
        userId: -11,
        username: "Ena8",
        text: "Gdje ste našli točan raspored dodatnih provjera za svoju školu?",
        timestamp: new Date("2026-03-08T09:10:00+01:00"),
        likeCount: 2,
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

/** Animirana tipkovnica s prstom koji tipka „hej!” — kao kalkulator na /kalkulator. */
function KeyboardTypingAnimation() {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U"],
    ["A", "S", "D", "F", "G", "H", "J"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  const keyW = 22;
  const keyH = 20;
  const gap = 3.5;
  const startY = 78;
  const startX = [30, 38, 46];
  const keyCenter = (row: number, col: number) => ({
    x: startX[row] + col * (keyW + gap) + keyW / 2,
    y: startY + row * (keyH + gap) + keyH / 2,
  });
  const bang = { x: 168, y: startY + 3 * (keyH + gap) + keyH / 2 };

  const seq = [
    { ...keyCenter(1, 5), ch: "h" },
    { ...keyCenter(0, 2), ch: "e" },
    { ...keyCenter(1, 6), ch: "j" },
    { ...bang, ch: "!" },
  ];

  const animDur = "5.8s";
  const stepPct = 100 / seq.length;
  const movePct = 6;
  let fingerKF = "";
  const pressKFs: string[] = [];
  const popKFs: string[] = [];
  const charKFs: string[] = [];

  for (let i = 0; i < seq.length; i++) {
    const arriveAt = i * stepPct + movePct;
    const pressAt = arriveAt + 3;
    const leaveAt = (i + 1) * stepPct - 1;
    const p = seq[i];
    const lx = (p.x / 220) * 100;
    const ty = (p.y / 190) * 100;
    fingerKF += `${arriveAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 11).toFixed(2)}%; }\n`;
    fingerKF += `${pressAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 6).toFixed(2)}%; }\n`;
    fingerKF += `${(pressAt + 2).toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 10).toFixed(2)}%; }\n`;
    fingerKF += `${leaveAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 10).toFixed(2)}%; }\n`;

    pressKFs.push(
      `0% { opacity: 0.28; transform: scale(1); } ${arriveAt.toFixed(1)}% { opacity: 0.28; transform: scale(1); } ${pressAt.toFixed(1)}% { opacity: 0.9; transform: scale(0.9); } ${(pressAt + 3).toFixed(1)}% { opacity: 0.4; transform: scale(1); } 100% { opacity: 0.28; transform: scale(1); }`,
    );
    popKFs.push(
      `0% { opacity: 0; transform: scale(0.4); } ${arriveAt.toFixed(1)}% { opacity: 0; transform: scale(0.4); } ${pressAt.toFixed(1)}% { opacity: 0.55; transform: scale(1.7); } ${(pressAt + 4).toFixed(1)}% { opacity: 0; transform: scale(2.1); } 100% { opacity: 0; transform: scale(0.4); }`,
    );
    charKFs.push(
      `0% { opacity: 0; transform: scale(0.5); } ${(pressAt - 0.1).toFixed(1)}% { opacity: 0; transform: scale(0.5); } ${pressAt.toFixed(1)}% { opacity: 0.9; transform: scale(1.2); } ${(pressAt + 2).toFixed(1)}% { opacity: 0.75; transform: scale(1); } 90% { opacity: 0.75; transform: scale(1); } 100% { opacity: 0; transform: scale(0.5); }`,
    );
  }
  fingerKF = `0% { left: ${((seq[0].x / 220) * 100).toFixed(2)}%; top: ${(((seq[0].y + 36) / 190) * 100).toFixed(2)}%; opacity: 0; }\n5% { opacity: 1; }\n${fingerKF}94% { opacity: 1; }\n100% { left: ${(((seq[3].x + 24) / 220) * 100).toFixed(2)}%; top: ${(((seq[3].y - 50) / 190) * 100).toFixed(2)}%; opacity: 0; }`;

  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes forumKbFinger { ${fingerKF} }
        ${pressKFs.map((kf, i) => `@keyframes forumKbGlow${i} { ${kf} }`).join("\n")}
        ${popKFs.map((kf, i) => `@keyframes forumKbPop${i} { ${kf} }`).join("\n")}
        ${charKFs.map((kf, i) => `@keyframes forumKbChar${i} { ${kf} }`).join("\n")}
        .forum-kb-finger { animation: forumKbFinger ${animDur} cubic-bezier(.4,0,.2,1) infinite; }
        ${pressKFs.map((_, i) => `.forum-kb-glow-${i} { animation: forumKbGlow${i} ${animDur} ease-out infinite; transform-origin: center; }`).join("\n")}
        ${popKFs.map((_, i) => `.forum-kb-pop-${i} { animation: forumKbPop${i} ${animDur} ease-out infinite; }`).join("\n")}
        ${charKFs.map((_, i) => `.forum-kb-char-${i} { animation: forumKbChar${i} ${animDur} ease-out infinite; }`).join("\n")}
      `}</style>
      <svg viewBox="0 0 220 190" fill="none" className="h-full w-full">
        <rect x="18" y="10" width="184" height="170" rx="16" className="fill-current text-foreground" opacity="0.88" />
        <rect x="30" y="20" width="160" height="42" rx="8" className="fill-current text-background" opacity="0.38" />
        {seq.map((s, i) => (
          <text
            key={s.ch}
            x={78 + i * 18}
            y="48"
            textAnchor="middle"
            className={`fill-current text-foreground forum-kb-char-${i}`}
            fontSize="20"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            opacity="0"
          >
            {s.ch}
          </text>
        ))}
        {rows.map((row, r) =>
          row.map((label, c) => {
            const x = startX[r] + c * (keyW + gap);
            const y = startY + r * (keyH + gap);
            const pressIdx = seq.findIndex((s) => Math.abs(s.x - (x + keyW / 2)) < 0.5 && Math.abs(s.y - (y + keyH / 2)) < 0.5);
            return (
              <g key={`${r}-${label}`}>
                <rect
                  x={x}
                  y={y}
                  width={keyW}
                  height={keyH}
                  rx="5"
                  className={cn("fill-current text-background", pressIdx >= 0 && `forum-kb-glow-${pressIdx}`)}
                  opacity="0.32"
                />
                {pressIdx >= 0 && (
                  <circle
                    cx={x + keyW / 2}
                    cy={y + keyH / 2}
                    r="12"
                    className={`fill-current text-background forum-kb-pop-${pressIdx}`}
                    opacity="0"
                  />
                )}
                <text
                  x={x + keyW / 2}
                  y={y + 14}
                  textAnchor="middle"
                  className="fill-current text-foreground"
                  fontSize="9"
                  fontWeight="700"
                  opacity="0.8"
                >
                  {label}
                </text>
              </g>
            );
          }),
        )}
        <rect x="46" y={startY + 3 * (keyH + gap)} width="88" height={keyH} rx="5" className="fill-current text-background" opacity="0.28" />
        <rect
          x={bang.x - keyW / 2}
          y={bang.y - keyH / 2}
          width={keyW}
          height={keyH}
          rx="5"
          className="fill-current text-background forum-kb-glow-3"
          opacity="0.32"
        />
        <circle cx={bang.x} cy={bang.y} r="12" className="fill-current text-background forum-kb-pop-3" opacity="0" />
        <text x={bang.x} y={bang.y + 4} textAnchor="middle" className="fill-current text-foreground" fontSize="11" fontWeight="700" opacity="0.85">
          !
        </text>
      </svg>
      <div className="forum-kb-finger absolute h-6 w-4 -translate-x-1/2 -translate-y-1/2 sm:h-10 sm:w-7">
        <svg viewBox="0 0 30 44" fill="none" className="h-full w-full drop-shadow-md">
          <ellipse cx="15" cy="41" rx="11" ry="3" className="fill-current text-foreground" opacity="0.25" />
          <path
            d="M9 40 C9 40 6 30 6 20 C6 11 10 4 15 4 C20 4 24 11 24 20 C24 30 21 40 21 40 Z"
            className="fill-current text-foreground"
            opacity="0.6"
          />
          <ellipse cx="15" cy="10" rx="5.5" ry="4.5" className="fill-current text-foreground" opacity="0.3" />
          <ellipse cx="15" cy="37" rx="6.5" ry="4.5" className="fill-current text-foreground" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
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
  const [newConvCity, setNewConvCity] = useState("");
  const [newConvTrack, setNewConvTrack] = useState<JuniorForumTrackId | "">("");
  const [newConvAsk, setNewConvAsk] = useState(false);
  const [forumCity, setForumCity] = useState("all");
  const [forumTrack, setForumTrack] = useState("all");
  const [forumAskOnly, setForumAskOnly] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<ForumMessage | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
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
        const localOnly = readLocalConversations(audience);
        const merged = [...localOnly, ...mapped];
        setConversations(merged.length > 0 ? merged : fallbackConversations);
      } else {
        const localOnly = readLocalConversations(audience);
        setConversations([...localOnly, ...fallbackConversations]);
      }
    } catch {
      const localOnly = readLocalConversations(audience);
      setConversations([...localOnly, ...fallbackConversations]);
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

    const meta: JuniorForumMeta = isJunior
      ? {
          city: newConvCity.trim() || null,
          track: newConvTrack || null,
          askSenior: newConvAsk,
        }
      : emptyForumMeta();
    const description = isJunior
      ? attachForumMeta(newConvDescription.trim(), meta)
      : newConvDescription.trim();

    const res = await apiPost<{ data?: { id: number; title: string; description: string; created_at: string; creator_username: string; message_count: number } }>(
      "/api/forum/conversations",
      { title: newConvTitle.trim(), description, audience },
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
        description,
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
    setNewConvCity("");
    setNewConvTrack("");
    setNewConvAsk(false);
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
    const filtered = conversations.filter((conv) => {
      const { meta, body } = stripForumMeta(conv.description || "");
      const textHit =
        conv.title.toLowerCase().includes(term) ||
        body.toLowerCase().includes(term) ||
        (meta.city ?? "").toLowerCase().includes(term);
      if (!textHit) return false;
      if (!isJunior) return true;
      if (forumCity !== "all" && meta.city !== forumCity) return false;
      if (forumTrack !== "all" && meta.track !== forumTrack) return false;
      if (forumAskOnly && !meta.askSenior) return false;
      return true;
    });
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
  }, [conversations, searchTerm, sortMode, isJunior, forumCity, forumTrack, forumAskOnly]);

  const forumStats = useMemo(() => {
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, c) => sum + (c.messageCount ?? 0), 0);
    const uniqueAuthors = new Set(conversations.map((c) => c.creator).filter(Boolean)).size;
    return { totalConversations, totalMessages, uniqueAuthors };
  }, [conversations]);

  return (
    <Layout>
      <section className="container py-4 sm:py-8 md:py-12 max-w-6xl mx-auto px-3 sm:px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative mb-4 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:p-5 md:mb-6 md:p-6",
            selectedConversation && "max-md:hidden",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />

          <HeaderHero
            icon={
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
                <MessagesSquare className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            }
            decor={
              <HeaderDecor className="opacity-[0.42] sm:opacity-[0.18]">
                <KeyboardTypingAnimation />
              </HeaderDecor>
            }
          >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" />
                  Zajednica
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {isJunior ? "Forum o srednjoj školi" : "Forum za učenike"}
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {isJunior
                  ? "Razmijeni iskustva i postavi pitanja o odabiru srednje škole, smjerovima i upisu — sve jasno poredano, brzo za pronalazak."
                  : "Razmijeni iskustva i postavi pitanja o maturi, fakultetima i studentskom životu — sve jasno poredano, brzo za pronalazak."}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    Teme
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {forumStats.totalConversations}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Poruke
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {forumStats.totalMessages}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Članovi
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {forumStats.uniqueAuthors}
                  </p>
                </div>
              </div>
          </HeaderHero>
        </motion.div>

        {authChecked && !canUseForum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "mb-4 rounded-2xl border-2 border-primary/15 bg-primary/[0.04] p-3 shadow-sm md:mb-6 md:p-4",
              selectedConversation && "max-md:hidden",
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LogIn className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Čitaš kao gost</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Sve teme i poruke su ti vidljive. Za slanje poruka, lajkanje i otvaranje novih tema — prijavi se.
                  </p>
                </div>
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
                "flex min-h-0 w-full shrink-0 flex-col border-b border-border bg-muted/25 md:w-[min(100%,20rem)] md:border-b-0 md:border-r",
                selectedConversation && "max-md:hidden",
              )}
            >
              <div className="flex items-center gap-3 border-b border-border p-3 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-hero text-sm font-bold text-primary-foreground shadow-md">
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

              {isJunior ? (
                <div className="border-b border-border px-3 py-2">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Grad i smjer
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setForumAskOnly((v) => !v)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        forumAskOnly
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background",
                      )}
                    >
                      Pitaj 3. razred
                    </button>
                    <select
                      value={forumCity}
                      onChange={(e) => setForumCity(e.target.value)}
                      className="h-8 rounded-full border border-border bg-background px-2 text-[11px] font-semibold"
                    >
                      <option value="all">Svi gradovi</option>
                      {JUNIOR_FORUM_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <select
                      value={forumTrack}
                      onChange={(e) => setForumTrack(e.target.value)}
                      className="h-8 rounded-full border border-border bg-background px-2 text-[11px] font-semibold"
                    >
                      <option value="all">Svi smjerovi</option>
                      {JUNIOR_FORUM_TRACKS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <div className="min-h-0 flex-1 md:overflow-y-auto">
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
                    {sortedConversations.map((conv) => {
                      const isActive = selectedConversation?.id === conv.id;
                      const initial = (conv.creator?.[0] || "?").toUpperCase();
                      const { meta, body } = stripForumMeta(conv.description || "");
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
                              ? "border-primary/40 bg-primary/10 shadow-sm"
                              : "border-transparent hover:border-border hover:bg-muted/60 active:scale-[0.99]",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors",
                              isActive
                                ? "gradient-hero text-primary-foreground shadow-sm"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary",
                            )}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                              {conv.title}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {body || "Bez opisa"}
                            </p>
                            {isJunior && (meta.city || meta.track || meta.askSenior) ? (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {meta.city ? (
                                  <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                                    {meta.city}
                                  </span>
                                ) : null}
                                {forumTrackLabel(meta.track) ? (
                                  <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                                    {forumTrackLabel(meta.track)}
                                  </span>
                                ) : null}
                                {meta.askSenior ? (
                                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200">
                                    3. razred
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/15 text-primary",
                                )}
                              >
                                <MessageCircle className="h-3 w-3" />
                                {conv.messageCount}
                              </span>
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
                    <div className="shrink-0 border-b border-border bg-gradient-to-r from-primary/[0.08] via-muted/20 to-muted/20 p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedConversation(null)}
                        className="mb-2 inline-flex min-h-[44px] -ml-1 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden touch-manipulation"
                      >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        Popis razgovora
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-hero text-sm font-bold text-primary-foreground shadow-sm sm:h-11 sm:w-11">
                          {(selectedConversation.creator?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-pretty text-base font-bold leading-tight text-foreground sm:text-lg">
                            {selectedConversation.title}
                          </h2>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                            {stripForumMeta(selectedConversation.description || "").body || "Bez opisa"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
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
                            <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Učitavam poruke…</p>
                          </div>
                        </div>
                      ) : selectedConversation.messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="max-w-xs text-center">
                            <MessageCircle className="mx-auto mb-4 h-14 w-14 text-muted-foreground/35" />
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
                              {msg.replyToId != null && (msg.replyToSnippet || msg.replyToUsername) && (
                                <div
                                  className={cn(
                                    "mb-1 max-w-full rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground",
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
                                className={`rounded-2xl px-4 py-2.5 text-sm ${
                                  msg.deletedByUser
                                    ? "rounded-br-md rounded-bl-md border border-dashed border-border bg-muted/50 text-muted-foreground"
                                    : msg.userId === currentUser?.id
                                      ? "rounded-br-md bg-primary text-primary-foreground"
                                      : "rounded-bl-md border border-border bg-muted/60 text-foreground"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {msg.deletedByUser ? (
                                    <span className="italic">
                                      Ova je poruka uklonjena s prikaza; u temi ostaje zapis radi konteksta.
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
                                    className="inline-flex min-h-9 items-center gap-1 px-1 text-xs text-muted-foreground transition-colors hover:text-primary touch-manipulation"
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
                                      msg.userLiked ? "text-primary" : "text-muted-foreground hover:text-foreground",
                                    )}
                                  >
                                    <ThumbsUp className={`h-3.5 w-3.5 ${msg.userLiked ? "fill-current" : ""}`} />
                                    {msg.likeCount > 0 && <span>{msg.likeCount}</span>}
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
                        className="shrink-0 border-t border-border bg-muted/30 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                      >
                        {replyingTo && (
                          <div className="mb-2 flex items-start justify-between gap-2 rounded-xl border border-primary/25 bg-primary/[0.06] px-3 py-2 text-xs text-foreground">
                            <span className="min-w-0 leading-snug">
                              <Reply className="inline h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
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
                    <div className="max-w-xs text-center">
                      <MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground/35" />
                      <p className="text-base font-medium text-muted-foreground">Odaberi razgovor</p>
                      <p className="mt-1 text-sm text-muted-foreground/80">
                        {canUseForum
                          ? "ili kreiraj novi za početak."
                          : "da pročitaš što drugi pišu. Za vlastite poruke treba ti prijava."}
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
                  {isJunior
                    ? "Postavi pitanje ili otvori temu o odabiru srednje škole, smjerovima i iskustvima učenika."
                    : "Postavi pitanje ili otvori temu o maturi, fakultetima ili studentskom životu."}
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
                      placeholder={isJunior ? "npr. Split, medicinska — prijemni?" : "npr. Koji fakultet za IT?"}
                      className="w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  {isJunior ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold" htmlFor="forum-city">
                          Grad
                        </label>
                        <select
                          id="forum-city"
                          value={newConvCity}
                          onChange={(e) => setNewConvCity(e.target.value)}
                          className="w-full rounded-xl border-2 border-input bg-background px-3 py-2.5 text-sm"
                        >
                          <option value="">Svi / nije važno</option>
                          {JUNIOR_FORUM_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold" htmlFor="forum-track">
                          Smjer
                        </label>
                        <select
                          id="forum-track"
                          value={newConvTrack}
                          onChange={(e) => setNewConvTrack(e.target.value as JuniorForumTrackId | "")}
                          className="w-full rounded-xl border-2 border-input bg-background px-3 py-2.5 text-sm"
                        >
                          <option value="">Odaberi</option>
                          {JUNIOR_FORUM_TRACKS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="col-span-2 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newConvAsk}
                          onChange={(e) => setNewConvAsk(e.target.checked)}
                          className="h-4 w-4 accent-primary"
                        />
                        Pitaj treći razred
                      </label>
                    </div>
                  ) : null}
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
                        setNewConvCity("");
                        setNewConvTrack("");
                        setNewConvAsk(false);
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
