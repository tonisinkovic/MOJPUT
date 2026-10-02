import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MojPutExperience = "junior" | "senior";

type MojPutEntryIntroProps = {
  onEnterJunior: () => void;
  onEnterSenior: () => void;
};

const HOLD_MS = 9000;

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const cubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const inOut = (t: number) => {
  t = clamp(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const prog = (ms: number, a: number, b: number) => clamp((ms - a) / (b - a));
const out = (ms: number, a: number, b: number) => cubic(prog(ms, a, b));
const io = (ms: number, a: number, b: number) => inOut(prog(ms, a, b));
const lin = (ms: number, a: number, b: number) => prog(ms, a, b);

function back(ms: number, a: number, b: number) {
  const t = prog(ms, a, b);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function mixColor(a: string, b: string, t: number) {
  const parse = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const A = parse(a);
  const B = parse(b);
  const c = A.map((v, i) => Math.round(mix(v, B[i], t)));
  return `rgb(${c.join(",")})`;
}

function paintEntry(root: HTMLElement, ms: number, heights: { a: number; b: number }) {
  const q = (name: string) => root.querySelector(`[data-el="${name}"]`) as HTMLElement;

  const logo = q("logo");
  const line = q("line");
  const sub = q("sub");
  const w1 = q("w1");
  const w2 = q("w2");
  const w3 = q("w3");
  const stem = q("stem");
  const washA = q("washA");
  const washB = q("washB");
  const slotA = q("slotA");
  const slotB = q("slotB");
  const cardA = q("cardA");
  const cardB = q("cardB");
  const skip = q("skip");

  const logoIn = out(ms, 160, 980);
  const logoSpring = back(ms, 160, 1180);
  const lift = io(ms, 3480, 4380);
  const copyOut = out(ms, 3480, 4100);
  const tint = out(ms, 2300, 3300);
  const copyOn = 1 - copyOut;

  const logoScale = mix(0.8, 1, logoSpring) * mix(1, 0.6, lift);
  const size = 172 * logoScale;
  logo.style.opacity = String(logoIn);
  logo.style.width = `${size}px`;
  logo.style.height = `${size}px`;
  logo.style.borderRadius = `${size * 0.22}px`;
  logo.style.filter = `blur(${mix(12, 0, logoIn)}px)`;
  logo.style.transform = `translateY(${mix(26, 0, logoSpring) * (1 - lift)}px)`;
  logo.style.boxShadow = `0 16px 40px rgba(15, 23, 42, ${0.1 * logoIn})`;

  const lineIn = out(ms, 860, 1320);
  line.style.opacity = String(lineIn * copyOn);
  line.style.transform = `scaleX(${lineIn * copyOn})`;
  line.style.height = `${mix(3, 0, copyOut)}px`;
  line.style.marginTop = `${mix(18, 0, copyOut)}px`;
  line.style.background = `linear-gradient(90deg, ${mixColor("#14a096", "#f59e0b", tint)}, ${mixColor("#14a096", "#0f766e", tint * 0.35)})`;

  w1.style.opacity = String(out(ms, 1180, 1580));
  w1.style.transform = `translateY(${mix(14, 0, back(ms, 1180, 1700))}px)`;
  w2.style.opacity = String(out(ms, 1500, 1860));
  w2.style.transform = `translateY(${mix(14, 0, back(ms, 1500, 1980))}px)`;
  w3.style.opacity = String(out(ms, 1760, 2160));
  w3.style.transform = `translateY(${mix(14, 0, back(ms, 1760, 2280))}px)`;
  sub.style.opacity = String(copyOn);
  sub.style.marginTop = `${mix(16, 0, copyOut)}px`;
  sub.style.maxHeight = `${mix(40, 0, copyOut)}px`;

  const grow = out(ms, 4280, 4920);
  const stemFade = 1 - out(ms, 5480, 6000);
  stem.style.height = `${36 * grow * stemFade}px`;
  stem.style.opacity = String(grow * stemFade);
  stem.style.marginTop = `${8 * grow * stemFade}px`;

  washA.style.opacity = String(out(ms, 4480, 5300));
  washB.style.opacity = String(out(ms, 5600, 6400));

  const slotGap = window.matchMedia("(min-width: 1024px)").matches ? 44 : 16;

  const aIn = out(ms, 4520, 5080);
  const aSpring = back(ms, 4520, 5400);
  slotA.style.maxHeight = `${heights.a * aIn}px`;
  slotA.style.marginTop = `${slotGap * aIn}px`;
  cardA.style.opacity = String(aIn);
  cardA.style.transform = ms >= 5600 ? "" : `translateY(${mix(28, 0, aSpring)}px)`;
  cardA.style.pointerEvents = ms >= 5080 ? "auto" : "none";
  cardA.tabIndex = ms >= 5080 ? 0 : -1;
  q("capA").style.transform = `scaleX(${out(ms, 4680, 5480)})`;
  drift(q("kA"), ms, 4580);
  drift(q("tA"), ms, 4680);
  drift(q("whoA"), ms, 4780);
  drift(q("goA"), ms, 4900);
  q("arrowA").style.transform = `scale(${back(ms, 5200, 5680)})`;
  const shineA = lin(ms, 5480, 6120);
  const shineAEl = q("shineA");
  shineAEl.style.transform = `translateX(${mix(-160, 320, shineA)}%)`;
  shineAEl.style.opacity = shineA > 0 && shineA < 1 ? "0.85" : "0";

  const bIn = out(ms, 5680, 6240);
  const bSpring = back(ms, 5680, 6580);
  slotB.style.maxHeight = `${heights.b * bIn}px`;
  slotB.style.marginTop = `${slotGap * bIn}px`;
  cardB.style.opacity = String(bIn);
  cardB.style.transform = ms >= 6800 ? "" : `translateY(${mix(28, 0, bSpring)}px)`;
  cardB.style.pointerEvents = ms >= 6240 ? "auto" : "none";
  cardB.tabIndex = ms >= 6240 ? 0 : -1;
  q("capB").style.transform = `scaleX(${out(ms, 5840, 6640)})`;
  drift(q("kB"), ms, 5740);
  drift(q("tB"), ms, 5840);
  drift(q("whoB"), ms, 5940);
  drift(q("goB"), ms, 6060);
  q("arrowB").style.transform = `scale(${back(ms, 6360, 6840)})`;
  const shineB = lin(ms, 6680, 7320);
  const shineBEl = q("shineB");
  shineBEl.style.transform = `translateX(${mix(-160, 320, shineB)}%)`;
  shineBEl.style.opacity = shineB > 0 && shineB < 1 ? "0.85" : "0";

  const skipOn = ms > 700 && ms < 6240;
  skip.style.opacity = skipOn ? "1" : "0";
  skip.style.pointerEvents = skipOn ? "auto" : "none";
}

function drift(el: HTMLElement, ms: number, start: number) {
  const y = mix(14, 0, back(ms, start, start + 520));
  el.style.transform = ms >= start + 560 ? "" : `translateY(${y}px)`;
}

const MojPutEntryIntro = ({ onEnterJunior, onEnterSenior }: MojPutEntryIntroProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const skipRef = useRef(false);
  const msRef = useRef(0);
  const reducedRef = useRef(false);
  const heightsRef = useRef({ a: 240, b: 240 });
  const [launch, setLaunch] = useState<MojPutExperience | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;

    const cardA = root.querySelector('[data-el="cardA"]') as HTMLElement;
    const cardB = root.querySelector('[data-el="cardB"]') as HTMLElement;
    const slotA = root.querySelector('[data-el="slotA"]') as HTMLElement;
    const slotB = root.querySelector('[data-el="slotB"]') as HTMLElement;

    const measure = () => {
      const prev = {
        a: slotA.style.maxHeight,
        b: slotB.style.maxHeight,
        mtA: slotA.style.marginTop,
        mtB: slotB.style.marginTop,
      };
      slotA.style.maxHeight = "none";
      slotB.style.maxHeight = "none";
      slotA.style.marginTop = "0px";
      slotB.style.marginTop = "0px";
      const heights = {
        a: Math.ceil(cardA.getBoundingClientRect().height) + 2,
        b: Math.ceil(cardB.getBoundingClientRect().height) + 2,
      };
      slotA.style.maxHeight = prev.a;
      slotB.style.maxHeight = prev.b;
      slotA.style.marginTop = prev.mtA;
      slotB.style.marginTop = prev.mtB;
      heightsRef.current = heights;
      return heights;
    };

    let heights = measure();

    let raf = 0;
    let stopped = false;
    const start = performance.now();

    const frame = (ms: number) => {
      const t = Math.min(ms, HOLD_MS);
      msRef.current = t;
      paintEntry(root, t, heights);
    };

    const tick = (now: number) => {
      if (stopped) return;
      const elapsed = skipRef.current || reduced ? HOLD_MS : now - start;
      frame(elapsed);
      if (elapsed < HOLD_MS) raf = requestAnimationFrame(tick);
    };

    frame(reduced ? HOLD_MS : 0);
    if (!reduced) raf = requestAnimationFrame(tick);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (stopped) return;
        heights = measure();
        paintEntry(root, msRef.current, heights);
      }, 80);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const skip = () => {
    skipRef.current = true;
    const root = rootRef.current;
    if (!root) return;
    msRef.current = HOLD_MS;
    paintEntry(root, HOLD_MS, heightsRef.current);
  };

  const enter = (experience: MojPutExperience) => {
    if (launch) return;
    const ready = reducedRef.current || skipRef.current || (experience === "junior" ? msRef.current >= 5080 : msRef.current >= 6240);
    if (!ready) return;
    setLaunch(experience);
    window.setTimeout(() => {
      if (experience === "junior") onEnterJunior();
      else onEnterSenior();
    }, 480);
  };

  return (
    <>
      <main
        ref={rootRef}
        className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_50%_-8%,rgba(20,160,150,0.18),transparent_36%),linear-gradient(165deg,#f8fbfc_0%,#eef3f8_58%,#f4f7f6_100%)] text-slate-950"
      >
        <div data-el="washA" className="pointer-events-none absolute -left-16 top-[22%] h-56 w-56 rounded-full bg-amber-400/30 blur-3xl lg:left-[8%] lg:top-1/2 lg:h-80 lg:w-80 lg:-translate-y-1/2" style={{ opacity: 0 }} aria-hidden />
        <div data-el="washB" className="pointer-events-none absolute -right-20 top-[52%] h-56 w-56 rounded-full bg-teal-400/25 blur-3xl lg:right-[8%] lg:top-1/2 lg:h-80 lg:w-80 lg:-translate-y-1/2" style={{ opacity: 0 }} aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[28rem] flex-col items-center justify-center px-6 py-8 lg:max-w-[72rem] lg:px-10 lg:py-12">
          <div
            data-el="logo"
            className="flex items-center justify-center border border-white/90 bg-white/95 p-2.5"
            style={{ width: 138, height: 138, opacity: 0, borderRadius: 30 }}
          >
            <img src={`${import.meta.env.BASE_URL}mojput-logo.png`} alt="MojPut" className="h-full w-full object-contain" />
          </div>

          <div
            data-el="line"
            className="h-[3px] w-28 origin-center rounded-full"
            style={{ opacity: 0, transform: "scaleX(0)", marginTop: 18 }}
            aria-hidden
          />

          <p
            data-el="sub"
            className="overflow-hidden text-center text-[17px] font-bold tracking-[-0.03em] sm:text-lg"
            style={{ opacity: 0, marginTop: 16, maxHeight: 40 }}
          >
            <span data-el="w1" className="inline-block text-[#c2410c]" style={{ opacity: 0 }}>
              Srednja škola
            </span>
            <span data-el="w2" className="mx-1.5 inline-block font-semibold text-slate-500" style={{ opacity: 0 }}>
              ili
            </span>
            <span data-el="w3" className="inline-block text-[#0f766e]" style={{ opacity: 0 }}>
              fakultet.
            </span>
          </p>

          <div
            data-el="stem"
            className="w-[3px] rounded-full bg-gradient-to-b from-[#14a096] to-[#f59e0b]"
            style={{ height: 0, opacity: 0 }}
            aria-hidden
          />

          <div className="flex w-full flex-col lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10">
            <div data-el="slotA" className="w-full overflow-hidden lg:min-w-0 lg:flex-1" style={{ maxHeight: 0 }}>
              <ChoiceCard
                el="cardA"
                cap="capA"
                shine="shineA"
                kickerEl="kA"
                titleEl="tA"
                whoEl="whoA"
                goEl="goA"
                arrowEl="arrowA"
                tone="junior"
                kicker="MojPut Junior"
                title="Pronađi svoju"
                highlight="srednju školu"
                who="Za učenike osnovnih škola"
                cta="Istraži srednje škole"
                onClick={() => enter("junior")}
              />
            </div>

            <div data-el="slotB" className="w-full overflow-hidden lg:min-w-0 lg:flex-1" style={{ maxHeight: 0 }}>
              <ChoiceCard
                el="cardB"
                cap="capB"
                shine="shineB"
                kickerEl="kB"
                titleEl="tB"
                whoEl="whoB"
                goEl="goB"
                arrowEl="arrowB"
                tone="senior"
                kicker="MojPut Senior"
                title="Pronađi svoj"
                highlight="fakultet"
                who="Za srednjoškolce i maturante"
                cta="Istraži fakultete"
                onClick={() => enter("senior")}
              />
            </div>
          </div>
        </div>

        <button
          data-el="skip"
          data-choice="skip"
          type="button"
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-opacity"
          style={{ opacity: 0, pointerEvents: "none" }}
          onClick={(event) => {
            event.stopPropagation();
            skip();
          }}
        >
          Preskoči
        </button>
      </main>

      {launch && (
        <motion.div
          className={cn(
            "pointer-events-none fixed inset-0 z-[80]",
            launch === "junior" ? "bg-[#fff4e5]" : "bg-[#eefaf8]",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden
        />
      )}
    </>
  );
};

type ChoiceCardProps = {
  el: string;
  cap: string;
  shine: string;
  kickerEl: string;
  titleEl: string;
  whoEl: string;
  goEl: string;
  arrowEl: string;
  tone: "junior" | "senior";
  kicker: string;
  title: string;
  highlight: string;
  who: string;
  cta: string;
  onClick: () => void;
};

function ChoiceCard({
  el,
  cap,
  shine,
  kickerEl,
  titleEl,
  whoEl,
  goEl,
  arrowEl,
  tone,
  kicker,
  title,
  highlight,
  who,
  cta,
  onClick,
}: ChoiceCardProps) {
  const junior = tone === "junior";
  return (
    <button
      data-el={el}
      data-choice={tone}
      type="button"
      tabIndex={-1}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/90 bg-white/95 px-[18px] pb-4 pt-5 text-left shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:ring-4 lg:min-h-[22rem] lg:rounded-[1.85rem] lg:px-9 lg:pb-8 lg:pt-8 lg:shadow-[0_28px_70px_-36px_rgba(15,23,42,0.4)] lg:hover:-translate-y-1",
        junior ? "focus-visible:ring-amber-400/35" : "focus-visible:ring-teal-500/30",
      )}
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <span
        data-el={cap}
        className={cn("absolute inset-x-0 top-0 h-1 origin-center", junior ? "bg-[#f59e0b]" : "bg-[#0f9d94]")}
        style={{ transform: "scaleX(0)" }}
        aria-hidden
      />
      <span
        data-el={shine}
        className="pointer-events-none absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        style={{ opacity: 0, transform: "translateX(-160%)" }}
        aria-hidden
      />
      <span
        data-el={kickerEl}
        className={cn(
          "block text-[11px] font-extrabold uppercase tracking-[0.16em] lg:text-xs lg:tracking-[0.2em]",
          junior ? "text-amber-700" : "text-teal-700",
        )}
      >
        {kicker}
      </span>
      <span data-el={titleEl} className="mt-2 block text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 lg:mt-4 lg:text-[2.45rem] lg:leading-[1.02] xl:text-[2.7rem]">
        {title}
        <br />
        <span className={junior ? "text-[#c2410c]" : "text-[#0f766e]"}>{highlight}</span>
      </span>
      <span
        data-el={whoEl}
        className={cn(
          "mt-2.5 inline-block w-fit rounded-full px-2.5 py-1 text-xs font-bold lg:mt-4 lg:px-3.5 lg:py-1.5 lg:text-sm",
          junior ? "bg-orange-50 text-orange-800" : "bg-teal-50 text-teal-800",
        )}
      >
        {who}
      </span>
      <span
        data-el={goEl}
        className="mt-4 flex items-center justify-between border-t border-slate-900/10 pt-3 text-sm font-extrabold lg:mt-auto lg:pt-6 lg:text-base"
      >
        <span>{cta}</span>
        <span
          data-el={arrowEl}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full text-base text-white lg:h-11 lg:w-11 lg:text-lg",
            junior ? "bg-[#f59e0b]" : "bg-[#0f9d94]",
          )}
          style={{ transform: "scale(0)" }}
        >
          →
        </span>
      </span>
    </button>
  );
}

export default MojPutEntryIntro;
