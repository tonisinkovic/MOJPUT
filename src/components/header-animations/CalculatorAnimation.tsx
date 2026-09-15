import { cn } from "@/lib/utils";

/** Animirani kalkulator s prstom i brojevima koji iskaču — junior i senior header. */
export default function CalculatorAnimation() {
  const keyLabels = [
    ["1", "2", "3", "+"],
    ["4", "5", "6", "−"],
    ["7", "8", "9", "×"],
    [".", "0", "=", "÷"],
  ];
  const seq = [
    { r: 2, c: 0, ch: "7" },
    { r: 2, c: 1, ch: "8" },
    { r: 3, c: 0, ch: "." },
    { r: 1, c: 0, ch: "4" },
    { r: 1, c: 1, ch: "5" },
  ];

  const positions = seq.map((k) => ({
    x: 34 + k.c * 39 + 16.5,
    y: 100 + k.r * 38 + 15,
  }));

  const animDur = "5.5s";
  const stepPct = 100 / seq.length;
  const movePct = 6;

  let fingerKF = "";
  const pressKFs: string[] = seq.map(() => "");
  const popKFs: string[] = seq.map(() => "");
  const screenKFs: string[] = [];

  for (let i = 0; i < seq.length; i++) {
    const arriveAt = i * stepPct + movePct;
    const pressAt = arriveAt + 3;
    const leaveAt = (i + 1) * stepPct - 1;
    const p = positions[i];

    const lx = (p.x / 220) * 100;
    const ty = (p.y / 290) * 100;
    fingerKF += `${arriveAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 9).toFixed(2)}%; }\n`;
    fingerKF += `${pressAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 5.5).toFixed(2)}%; }\n`;
    fingerKF += `${(pressAt + 2).toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 8.2).toFixed(2)}%; }\n`;
    fingerKF += `${leaveAt.toFixed(1)}% { left: ${lx.toFixed(2)}%; top: ${(ty - 8.2).toFixed(2)}%; }\n`;

    pressKFs[i] += `0% { opacity: 0.3; transform: scale(1); }`;
    pressKFs[i] += `${arriveAt.toFixed(1)}% { opacity: 0.3; transform: scale(1); }`;
    pressKFs[i] += `${pressAt.toFixed(1)}% { opacity: 0.85; transform: scale(0.92); }`;
    pressKFs[i] += `${(pressAt + 3).toFixed(1)}% { opacity: 0.45; transform: scale(1); }`;
    pressKFs[i] += `100% { opacity: 0.3; transform: scale(1); }`;

    popKFs[i] += `0% { opacity: 0; transform: scale(0.5); }`;
    popKFs[i] += `${arriveAt.toFixed(1)}% { opacity: 0; transform: scale(0.5); }`;
    popKFs[i] += `${pressAt.toFixed(1)}% { opacity: 0.5; transform: scale(1.8); }`;
    popKFs[i] += `${(pressAt + 4).toFixed(1)}% { opacity: 0; transform: scale(2.2); }`;
    popKFs[i] += `100% { opacity: 0; transform: scale(0.5); }`;

    screenKFs.push(`${pressAt.toFixed(1)}`);
  }

  const charKFs: string[] = [];
  for (let i = 0; i < seq.length; i++) {
    const showAt = Number(screenKFs[i]);
    let kf = `0% { opacity: 0; transform: scale(0.5); }\n`;
    kf += `${(showAt - 0.1).toFixed(1)}% { opacity: 0; transform: scale(0.5); }\n`;
    kf += `${showAt}% { opacity: 0.8; transform: scale(1.15); }\n`;
    kf += `${(showAt + 2).toFixed(1)}% { opacity: 0.65; transform: scale(1); }\n`;
    kf += `92% { opacity: 0.65; transform: scale(1); }\n`;
    kf += `100% { opacity: 0; transform: scale(0.5); }`;
    charKFs.push(kf);
  }

  fingerKF = `0% { left: ${((positions[0].x / 220) * 100).toFixed(2)}%; top: ${(((positions[0].y + 40) / 290) * 100).toFixed(2)}%; opacity: 0; }\n4% { opacity: 1; }\n${fingerKF}95% { opacity: 1; }\n100% { left: ${(((positions[seq.length - 1].x + 30) / 220) * 100).toFixed(2)}%; top: ${(((positions[seq.length - 1].y - 60) / 290) * 100).toFixed(2)}%; opacity: 0; }`;

  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes calcFinger { ${fingerKF} }
        ${pressKFs.map((kf, i) => `@keyframes calcGlow${i} { ${kf} }`).join("\n")}
        ${popKFs.map((kf, i) => `@keyframes calcPop${i} { ${kf} }`).join("\n")}
        ${charKFs.map((kf, i) => `@keyframes calcChar${i} { ${kf} }`).join("\n")}
        .calc-finger { animation: calcFinger ${animDur} cubic-bezier(.4,0,.2,1) infinite; }
        ${pressKFs.map((_, i) => `.calc-glow-${i} { animation: calcGlow${i} ${animDur} ease-out infinite; transform-origin: center; }`).join("\n")}
        ${popKFs.map((_, i) => `.calc-pop-${i} { animation: calcPop${i} ${animDur} ease-out infinite; }`).join("\n")}
        ${charKFs.map((_, i) => `.calc-char-${i} { animation: calcChar${i} ${animDur} ease-out infinite; }`).join("\n")}
      `}</style>
      <svg viewBox="0 0 220 290" fill="none" className="h-full w-full">
        <rect x="20" y="20" width="180" height="250" rx="22" className="fill-current text-foreground" opacity="0.85" />
        <rect x="34" y="34" width="152" height="50" rx="10" className="fill-current text-background" opacity="0.35" />
        <rect x="34" y="34" width="152" height="50" rx="10" fill="url(#calcScreenGlow)" opacity="0.15">
          <animate attributeName="opacity" values="0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05" dur={animDur} repeatCount="indefinite" />
        </rect>
        <defs>
          <linearGradient id="calcScreenGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {seq.map((s, i) => (
          <text
            key={i}
            x={108 + i * 18}
            y="66"
            textAnchor="middle"
            className={`fill-current text-foreground calc-char-${i}`}
            fontSize="22"
            fontWeight="bold"
            fontFamily="monospace"
            opacity="0"
          >
            {s.ch}
          </text>
        ))}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const kx = 34 + col * 39;
            const ky = 100 + row * 38;
            const pressIdx = seq.findIndex((k) => k.r === row && k.c === col);
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={kx}
                  y={ky}
                  width="33"
                  height="30"
                  rx="7"
                  className={cn("fill-current text-background", pressIdx >= 0 && `calc-glow-${pressIdx}`)}
                  opacity="0.3"
                />
                {pressIdx >= 0 && (
                  <circle
                    cx={kx + 16.5}
                    cy={ky + 15}
                    r="16"
                    className={`fill-current text-background calc-pop-${pressIdx}`}
                    opacity="0"
                  />
                )}
                <text
                  x={kx + 16.5}
                  y={ky + 20}
                  textAnchor="middle"
                  className="fill-current text-foreground"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="system-ui"
                  opacity="0.8"
                >
                  {keyLabels[row][col]}
                </text>
              </g>
            );
          }),
        )}
      </svg>
      <div className="calc-finger absolute h-6 w-4 -translate-x-1/2 -translate-y-1/2 sm:h-11 sm:w-[30px]">
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
