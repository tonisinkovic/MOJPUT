import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Eye, MessageCircle, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CARD, Reveal, SectionHead, TONE, type Tone } from "./ui";

type Thread = {
  id: number;
  title: string;
  description: string;
  creator: string;
  messageCount: number;
  createdAt: Date;
};

type Status = "idle" | "loading" | "ok" | "error";

const AVATAR_TONES: Tone[] = ["violet", "teal", "coral", "sky", "amber", "rose"];

function relativeDay(d: Date): string {
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (!Number.isFinite(days) || days < 0) return "";
  if (days === 0) return "danas";
  if (days === 1) return "jučer";
  if (days < 30) return `prije ${days} dana`;
  return d.toLocaleDateString("hr-HR", { day: "numeric", month: "long" });
}

function answers(n: number): string {
  if (n === 0) return "bez odgovora";
  if (n % 10 === 1 && n % 100 !== 11) return `${n} odgovor`;
  return `${n} odgovora`;
}

function ThreadRow({ t, i }: { t: Thread; i: number }) {
  const tone = TONE[AVATAR_TONES[t.id % AVATAR_TONES.length]];
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/forum?experience=junior"
        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-7"
      >
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-ink)/0.6)]",
            tone.grad,
          )}
          aria-hidden
        >
          {(t.creator || "?").trim().charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold tracking-tight sm:text-base">{t.title}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs font-semibold text-muted-foreground">
            {t.creator ? <span>{t.creator}</span> : null}
            <span>· {relativeDay(t.createdAt)}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-extrabold text-muted-foreground transition-colors group-hover:bg-[hsl(var(--jh-rose)/0.12)] group-hover:text-[hsl(var(--jh-rose-t))]">
          <MessageCircle className="h-3.5 w-3.5" />
          {answers(t.messageCount)}
        </span>
      </Link>
    </motion.li>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-border/60" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex animate-pulse items-center gap-4 px-5 py-4 sm:px-7">
          <span className="h-12 w-12 rounded-2xl bg-muted" />
          <span className="flex-1 space-y-2">
            <span className="block h-3.5 w-3/4 rounded-full bg-muted" />
            <span className="block h-3 w-1/3 rounded-full bg-muted/70" />
          </span>
        </li>
      ))}
    </ul>
  );
}

const STARTERS = ["Gimnazija ili strukovna?", "Kako izgleda običan dan u tehničkoj?", "Što ako ne upišem prvi izbor?", "Koje škole imaju računalstvo?"];

const PERKS = [
  {
    icon: Eye,
    tone: "teal" as const,
    title: "Čitaj bez računa",
    text: "Sve teme i poruke vidljive su svima, bez prijave.",
  },
  {
    icon: PenLine,
    tone: "violet" as const,
    title: "Piši uz besplatan račun",
    text: "Za slanje poruka, lajkanje i otvaranje novih tema treba prijava.",
  },
  {
    icon: ShieldCheck,
    tone: "coral" as const,
    title: "Moderirano",
    text: "Poruke koje više korisnika prijavi automatski se skrivaju dok ih moderator ne pregleda. Ne dijeli osobne podatke.",
  },
];

export default function JuniorForum() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [status, setStatus] = useState<Status>("idle");
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (!inView) return;
    let alive = true;
    setStatus("loading");
    apiGet<{ data: unknown }>("/api/forum/conversations?audience=junior")
      .then((res) => {
        if (!alive) return;
        if (!res.success) {
          setStatus("error");
          return;
        }
        const raw = (res as { data?: unknown }).data;
        const rows = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { data?: unknown[] } | undefined)?.data)
            ? ((raw as { data?: unknown[] }).data as unknown[])
            : [];
        const mapped = (
          rows as Array<{
            id: number;
            title: string;
            description?: string;
            creator_username?: string;
            created_at: string;
            message_count?: number;
          }>
        )
          .map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description ?? "",
            creator: c.creator_username ?? "",
            messageCount: typeof c.message_count === "number" ? c.message_count : 0,
            createdAt: new Date(c.created_at),
          }))
          .filter((t) => t.title && Number.isFinite(t.createdAt.getTime()))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 4);
        setThreads(mapped);
        setStatus("ok");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [inView]);

  return (
    <section className="container py-10 sm:py-16" ref={ref}>
      <SectionHead
        kicker="Forum"
        tone="rose"
        title="Pitaj one koji su to već prošli"
        lead="Gimnazija ili strukovna? Koja škola u tvom gradu? Razgovaraj s drugim osmašima i srednjoškolcima."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
        <Reveal kind="left" delay={0.1}>
          <div className={cn(CARD, "flex h-full flex-col")}>
            <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", TONE.rose.soft, TONE.rose.text)}>
                <MessageSquare className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <b className="text-lg font-extrabold tracking-tight sm:text-xl">Forum o srednjoj školi</b>
              <span className="ml-auto text-xs font-extrabold text-muted-foreground">najnovije teme</span>
            </div>

            <div className="flex gap-2 overflow-x-auto px-5 py-3.5 sm:px-7 [scrollbar-width:none]">
              {STARTERS.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="shrink-0"
                >
                  <Link
                    to="/forum?experience=junior"
                    className="block rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs font-extrabold text-muted-foreground transition-colors hover:border-[hsl(var(--jh-rose)/0.5)] hover:text-[hsl(var(--jh-rose-t))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex-1 border-t border-border/60">
              {status === "ok" && threads.length > 0 ? (
                <ul className="divide-y divide-border/60">
                  {threads.map((t, i) => (
                    <ThreadRow key={t.id} t={t} i={i} />
                  ))}
                </ul>
              ) : status === "ok" ? (
                <div className="px-5 py-8 text-center sm:px-7">
                  <Skeleton rows={2} />
                  <p className="mt-2 text-base font-extrabold">Još nema tema — budi prvi koji pita.</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Postavi pitanje o školi, smjeru ili upisu.</p>
                </div>
              ) : status === "error" ? (
                <div className="px-5 py-10 text-center sm:px-7">
                  <p className="text-base font-extrabold">Teme se trenutno ne mogu učitati.</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Otvori forum i pokušaj ponovno.</p>
                </div>
              ) : (
                <Skeleton rows={4} />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
              <span className="text-sm font-bold text-muted-foreground">Za objavu treba račun</span>
              <Link
                to="/forum?experience=junior"
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-rose))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--jh-rose)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Otvori forum
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid content-start gap-4">
          {PERKS.map((p, i) => {
            const t = TONE[p.tone];
            const Icon = p.icon;
            return (
              <Reveal key={p.title} kind="right" delay={0.15 + i * 0.12}>
                <div className={cn(CARD, "flex items-start gap-4 p-5 sm:p-6")}>
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", t.soft, t.text)}>
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">{p.title}</h3>
                    <p className="mt-1 text-[15px] font-medium leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
