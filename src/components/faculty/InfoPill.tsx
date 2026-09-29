import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InfoPillProps = {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
};

const InfoPill = ({ icon, label, value, className }: InfoPillProps) => {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-card/80 p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-bold tracking-tight md:text-base">{value}</p>
    </article>
  );
};

export default InfoPill;
