import { useEffect, useState } from "react";

const PARTICLE_COUNT = 30;
const COLORS = [
  "hsl(43 96% 56%)",
  "hsl(43 60% 70%)",
  "hsl(152 60% 50%)",
  "hsl(210 40% 80%)",
  "hsl(350 65% 60%)",
  "hsl(0 0% 95%)",
];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

/**
 * Gold confetti burst for celebration moments.
 * Renders CSS-animated particles then removes them after 2.5s.
 */
export function AdventConfetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ps: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.4,
    }));
    setParticles(ps);

    const timer = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="advent-confetti-particle"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animation: `advent-confetti-fall 2s cubic-bezier(0.22,1,0.36,1) ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes advent-confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
