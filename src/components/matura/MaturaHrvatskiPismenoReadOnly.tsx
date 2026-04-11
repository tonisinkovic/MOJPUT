import { motion } from "framer-motion";
import { HRV_D073_ESEJ, HRV_D073_SAZETAK } from "@/data/maturaHrvatskiPismenoD073";
import { FileText, PenLine } from "lucide-react";

type Props = { section: "sazetak" | "esej" };

const MaturaHrvatskiPismenoReadOnly = ({ section }: Props) => {
  const block = section === "sazetak" ? HRV_D073_SAZETAK : HRV_D073_ESEJ;
  const Icon = section === "sazetak" ? FileText : PenLine;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{block.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">D-S073 • samo smjernice (bez unosa u aplikaciji)</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{block.body}</p>
    </motion.section>
  );
};

export default MaturaHrvatskiPismenoReadOnly;
