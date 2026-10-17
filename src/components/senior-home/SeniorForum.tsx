import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Eye, MessageCircle, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Reveal, SCARD, SeniorHead, STONE, type SrTone } from "./ui";

type Thread = { id: number; title: string; creator: string; messageCount: number; createdAt: Date };
type Status = "idle" | "loading" | "ok" | "error";

const FORUM_PATH = "/forum?experience=senior";
const AVATAR_TONES: SrTone[] = ["indigo", "fuchsia", "cyan", "gold", "emerald", "rose"];

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

const PERKS = [
  { icon: Eye, tone: "cyan" as const, title: "Čitaj bez računa", text: "Sve teme i poruke vidljive su svima, bez prijave." },
  { icon: PenLine, tone: "indigo" as const, title: "Piši uz besplatan račun", text: "Za slanje poruka, lajkanje i otvaranje novih tema treba prijava." },
  {
    icon: ShieldCheck,
    tone: "fuchsia" as const,
    title: "Moderirano",
    text: "Poruke koje više korisnika prijavi automatski se skrivaju dok ih moderator ne pregleda. Ne dijeli osobne podatke.",
  },
];

export default function SeniorForum() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [status, setStatus] = useState<Status>("idle");
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (!inView) return;
    let alive = true;
    setStatus("loading");
    apiGet<{ data: unknown }>("/api/forum/conversations?audience=senior")
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
          rows as Array<{ id: number; title: string; creator_username?: string; created_at: string; message_count?: number }>
        )
          .map((c) => ({
            id: c.id,
            title: c.title,
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
    <section id="forum" className="container py-16 sm:py-24" ref={ref}>
      <SeniorHead
        index="08"
        kicker="Forum"
        tone="fuchsia"
        title={
          <>
            Pitaj one koji su to <span className="text-[hsl(var(--sr-fuchsia-t))]">već prošli</span>
          </>
        }
        lead="FER ili FOI? Kako izgleda prvi semestar? Razmijeni iskustva s drugim maturantima i studentima."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        <Reveal kind="left">
          <div className={cn(SCARD, "flex h-full flex-col")}>
            <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", STONE.fuchsia.soft, STONE.fuchsia.text)}>
                <MessageSquare className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <b className="text-lg font-extrabold tracking-tight sm:text-xl">Najnovije teme</b>
              <span className="ml-auto text-xs font-extrabold text-muted-foreground">uživo s foruma</span>
            </div>

            <div className="flex-1">
              {status === "ok" && threads.length > 0 ? (
                <ul className="divide-y divide-border/60">
                  {threads.map((t, i) => {
                    const tone = STONE[AVATAR_TONES[t.id % AVATAR_TONES.length]];
                    return (
                      <motion.li
                        key={t.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          to={FORUM_PATH}
                          className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-7"
                        >
                          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white", tone.grad)} aria-hidden>
                            {(t.creator || "?").trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-extrabold tracking-tight sm:text-base">{t.title}</span>
                            <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                              {t.creator ? `${t.creator} · ` : ""}
                              {relativeDay(t.createdAt)}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-extrabold text-muted-foreground transition-colors group-hover:bg-[hsl(var(--sr-fuchsia)/0.14)] group-hover:text-[hsl(var(--sr-fuchsia-t))]">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {answers(t.messageCount)}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : status === "ok" ? (
                <div className="px-5 py-10 text-center sm:px-7">
                  <p className="text-base font-extrabold">Još nema tema. Budi prvi koji pita.</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Postavi pitanje o fakultetu, upisu ili životu u studentskom gradu.</p>
                </div>
              ) : status === "error" ? (
                <div className="px-5 py-10 text-center sm:px-7">
                  <p className="text-base font-extrabold">Teme se trenutno ne mogu učitati.</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Otvori forum i pokušaj ponovno.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/60" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="flex animate-pulse items-center gap-4 px-5 py-4 sm:px-7">
                      <span className="h-12 w-12 rounded-xl bg-muted" />
                      <span className="flex-1 space-y-2">
                        <span className="block h-3.5 w-3/4 rounded-full bg-muted" />
                        <span className="block h-3 w-1/3 rounded-full bg-muted/70" />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
              <span className="text-sm font-bold text-muted-foreground">Za objavu treba račun</span>
              <Link
                to={FORUM_PATH}
                className="group inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--sr-fuchsia))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--sr-fuchsia)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Otvori forum
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid content-start gap-4">
          {PERKS.map((p, i) => {
            const t = STONE[p.tone];
            const Icon = p.icon;
            return (
              <Reveal key={p.title} kind="right" delay={0.12 + i * 0.1}>
                <div className={cn(SCARD, "flex items-start gap-4 p-5 sm:p-6")}>
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", t.soft, t.text)}>
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
