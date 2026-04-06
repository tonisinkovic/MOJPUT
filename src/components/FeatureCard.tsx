import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover sm:p-6"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
        aria-hidden
      />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-inner ring-2 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15 group-hover:ring-primary/25 [&_svg]:h-6 [&_svg]:w-6">
          {icon}
        </div>
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground transition-all duration-300 group-hover:border-primary/25 group-hover:text-primary sm:flex sm:opacity-0 sm:group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <h3 className="mb-2 text-balance font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-lg">
        {title}
      </h3>
      <p className="flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
      <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
        Otvori
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      </p>
    </motion.div>
  );
};

export default FeatureCard;
