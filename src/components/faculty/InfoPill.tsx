import { ReactNode } from "react";

type InfoPillProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

const InfoPill = ({ icon, label, value }: InfoPillProps) => {
  return (
    <article className="rounded-2xl border bg-card/80 p-4 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm md:text-base font-semibold">{value}</p>
    </article>
  );
};

export default InfoPill;
