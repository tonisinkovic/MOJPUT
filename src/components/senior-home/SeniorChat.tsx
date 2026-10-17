import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, Check, Send, ShieldCheck, Sparkles } from "lucide-react";
import { facultyCatalog } from "@/lib/facultyCatalog";
import { SENIOR_DEMO_QUESTIONS } from "@/lib/seniorChat";
import { cn } from "@/lib/utils";
import { Reveal } from "./ui";

type Msg = { id: number; role: "user" | "bot"; text: string };

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(line: string): ReactNode[] {
  return line.split(INLINE).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={i} to={link[2]} className="font-bold text-[hsl(var(--sr-indigo-t))] underline underline-offset-2">
          {link[1]}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function BotText({ text }: { text: string }) {
  return (
    <div className="space-y-1 text-[15px] font-medium leading-relaxed">
      {text.split("\n").map((l, i) =>
        l.startsWith("- ") ? (
          <p key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[hsl(var(--sr-indigo))]" aria-hidden />
            <span>{renderInline(l.slice(2))}</span>
          </p>
        ) : l.trim() === "" ? (
          <div key={i} className="h-1.5" />
        ) : (
          <p key={i}>{renderInline(l)}</p>
        ),
      )}
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1.5" aria-label="Dražen piše">
      {[0, 1, 2].map((i) => (
        <span key={i} className="sr-pulse h-2 w-2 rounded-full bg-muted-foreground/70" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

const FEATURES = [
  "Odgovori ispod dolaze iz iste baze koju koristi karta i kalendar",
  "Slobodna pitanja o fakultetima i karijeri postavljaš pravom Draženu",
  "Uvijek vidiš je li odgovor iz baze ili od AI-ja",
];

export default function SeniorChat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);

  const answers = useMemo(() => SENIOR_DEMO_QUESTIONS.map((x) => x.answer(facultyCatalog)), []);

  const ask = useCallback(
    (qi: number) => {
      if (typing) return;
      setAsked((s) => new Set(s).add(qi));
      setMsgs((m) => [...m, { id: ++idRef.current, role: "user", text: SENIOR_DEMO_QUESTIONS[qi].q }]);
      setTyping(true);
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setMsgs((m) => [...m, { id: ++idRef.current, role: "bot", text: answers[qi] }]);
        }, reduce ? 50 : 1100),
      );
    },
    [answers, reduce, typing],
  );

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => ask(0), reduce ? 0 : 700);
    timers.current.push(t);
    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, typing, reduce]);

  return (
    <section id="chatbot" className="container py-16 sm:py-24" ref={ref}>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-[hsl(var(--sr-night))] px-5 py-10 text-white shadow-[0_50px_100px_-50px_hsl(var(--sr-indigo)/0.9)] sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="sr-grid absolute inset-0 opacity-35 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" />
            <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-cyan)/0.3),transparent_65%)]" />
            <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-fuchsia)/0.3),transparent_65%)]" />
          </div>

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <div className="flex items-center gap-4">
                <span className="select-none text-6xl font-black leading-none tracking-tighter text-transparent sm:text-7xl [-webkit-text-stroke:1.5px_hsl(var(--sr-cyan))]" aria-hidden>
                  07
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-cyan))]">
                  <Sparkles className="h-3.5 w-3.5" /> Chatbot Dražen
                </span>
              </div>
              <h2 className="mt-5 text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Pitaj Dražena <span className="bg-gradient-to-r from-[hsl(var(--sr-cyan))] via-[hsl(var(--sr-indigo))] to-[hsl(var(--sr-fuchsia))] bg-clip-text text-transparent">o fakultetima i karijeri</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base font-medium leading-relaxed text-white/70 sm:text-lg">
                Isprobaj pitanja desno. Odgovori su sastavljeni iz stvarnih podataka platforme.
              </p>
              <ul className="mt-6 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] font-semibold text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--sr-cyan))] text-[hsl(var(--sr-night))]">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/chatbot"
                className="group mt-8 inline-flex h-12 items-center gap-2.5 rounded-xl bg-white px-6 text-base font-extrabold text-[hsl(var(--sr-night))] shadow-[0_22px_40px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))]"
              >
                Razgovaraj s Draženom
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-xs font-semibold text-white/55">Za slanje poruka potrebna je prijava.</p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-card text-card-foreground shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-5 py-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--sr-indigo))] to-[hsl(var(--sr-fuchsia))] text-white shadow-[0_10px_20px_-10px_hsl(var(--sr-indigo)/0.9)]">
                    <Bot className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <div>
                    <b className="block text-base font-extrabold leading-tight">Dražen</b>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <i className="h-2 w-2 rounded-full bg-emerald-500" /> fakulteti u Hrvatskoj
                    </span>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" /> Demo iz baze
                  </span>
                </div>

                <div ref={scroller} className="h-[22rem] space-y-3 overflow-y-auto scroll-smooth px-4 py-5 sm:h-[25rem] sm:px-5">
                  <AnimatePresence initial={false}>
                    {msgs.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[88%]",
                            m.role === "user"
                              ? "rounded-br-sm bg-gradient-to-br from-[hsl(var(--sr-indigo))] to-[hsl(var(--sr-fuchsia))] text-[15px] font-bold text-white"
                              : "rounded-bl-sm border border-border/60 bg-muted/50",
                          )}
                        >
                          {m.role === "user" ? m.text : <BotText text={m.text} />}
                        </div>
                      </motion.div>
                    ))}
                    {typing ? (
                      <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-muted/50 px-4 py-2.5">
                          <Typing />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="border-t border-border/60 bg-muted/30 px-4 py-3.5 sm:px-5">
                  <div className="flex flex-wrap gap-2">
                    {SENIOR_DEMO_QUESTIONS.map((x, i) => (
                      <button
                        key={x.q}
                        type="button"
                        disabled={typing || asked.has(i)}
                        onClick={() => ask(i)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-left text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          asked.has(i)
                            ? "border-border/50 bg-transparent text-muted-foreground/60"
                            : "border-[hsl(var(--sr-indigo)/0.45)] bg-card text-[hsl(var(--sr-indigo-t))] hover:-translate-y-0.5 hover:bg-[hsl(var(--sr-indigo)/0.1)] disabled:opacity-50",
                        )}
                      >
                        <Send className="h-3 w-3 shrink-0" />
                        {x.q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
