import { Link } from "react-router-dom";
import { Gift, Sparkles, Star, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * BRUTALNO PRIVLAČAN Advent banner sa mega božićnim animacijama.
 * Pozicioniran na vrhu Junior/Senior stranica.
 * 
 * Features:
 * - Pulsing gold gradient
 * - Rotating sparkles
 * - Floating gift icons
 * - Snow particles
 * - Shake animation on hover
 * - Multiple glow layers
 */
export function AdventMegaBanner({ className = "" }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after mount
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <Link
      to="/adventska-liga"
      className={`group relative block overflow-hidden rounded-2xl transition-all duration-500 touch-pan-y max-sm:hover:scale-100 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      } ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(340 35% 12%), hsl(350 70% 20%), hsl(38 92% 25%))",
        boxShadow: `
          0 8px 32px hsl(38 92% 58% / 0.4),
          0 0 60px hsl(350 70% 52% / 0.3),
          inset 0 1px 0 hsl(0 0% 100% / 0.1)
        `,
      }}
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(38 92% 58% / 0.3), transparent)",
          animation: "advent-shimmer 3s ease-in-out infinite",
        }}
      />

      {/* Snow particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${10 + i * 12}%`,
              top: "-5px",
              opacity: 0.6,
              animation: `advent-snowfall ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating gift icons */}
      <Gift
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-[hsl(350_70%_65%)] opacity-70 sm:block sm:left-8"
        size={36}
        style={{ animation: "advent-float 3s ease-in-out infinite" }}
      />
      <Gift
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-[hsl(38_92%_68%)] opacity-70 sm:block sm:right-8"
        size={36}
        style={{ animation: "advent-float 3s ease-in-out infinite", animationDelay: "1.5s" }}
      />

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center gap-3 px-4 py-5 sm:gap-8 sm:px-20 sm:py-10 lg:py-12 touch-pan-y max-sm:[&_svg.absolute]:hidden">
        {/* Left sparkle */}
        <Sparkles
          className="text-[hsl(38 92% 68%)] shrink-0"
          size={32}
          style={{
            animation: "advent-sparkle 1.5s ease-in-out infinite",
            filter: "drop-shadow(0 0 8px hsl(38 92% 58%))",
          }}
        />

        {/* Text content */}
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2.5">
            <Calendar className="h-6 w-6 text-[hsl(38 92% 68%)]" />
            <span
              className="text-sm font-extrabold uppercase tracking-wider text-[hsl(38 92% 85%)]"
              style={{ textShadow: "0 2px 8px hsl(38 92% 20%)" }}
            >
              Novo!
            </span>
          </div>
          <h3
            className="text-xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl"
            style={{
              fontFamily: "'Mountains of Christmas', cursive",
              textShadow: "0 2px 12px hsl(38 92% 58% / 0.8), 0 4px 24px hsl(350 70% 52% / 0.5)",
            }}
          >
            🎄 Adventska Kviz Liga 🎁
          </h3>
          <p className="mt-2 text-sm font-bold text-[hsl(38 70% 80%)] sm:text-base">
            20 dana kviza • bodovi samo iz igre • nagradna igra
          </p>
        </div>

        {/* Right sparkle */}
        <Sparkles
          className="text-[hsl(350 70% 65%)] shrink-0"
          size={32}
          style={{
            animation: "advent-sparkle 1.5s ease-in-out infinite",
            animationDelay: "0.75s",
            filter: "drop-shadow(0 0 8px hsl(350 70% 52%))",
          }}
        />
      </div>

      {/* Star burst on hover */}
      <Star
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[hsl(38 92% 68%)] opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-30"
        size={80}
        style={{ filter: "blur(8px)" }}
      />

      {/* Hover shake + scale */}
      <style>{`
        .group:hover {
          animation: advent-shake 0.5s ease-in-out;
        }
        @keyframes advent-shake {
          0%, 100% { transform: translateX(0) scale(1.02); }
          25% { transform: translateX(-4px) scale(1.02) rotate(-1deg); }
          75% { transform: translateX(4px) scale(1.02) rotate(1deg); }
        }
      `}</style>

      {/* Pulsing border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: "inset 0 0 20px hsl(38 92% 58% / 0.4), inset 0 0 40px hsl(350 70% 52% / 0.2)",
          animation: "advent-glow-pulse 2s ease-in-out infinite",
        }}
      />
    </Link>
  );
}
