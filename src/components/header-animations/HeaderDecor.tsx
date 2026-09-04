import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Okvir za header animacije: kompaktan kut na mobitelu, veći na desktopu. */
export default function HeaderDecor({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 overflow-hidden",
        "right-0 top-0 h-[6.5rem] w-[5.5rem]",
        "max-[360px]:h-[5.5rem] max-[360px]:w-[4.75rem]",
        "sm:right-3 sm:top-0 sm:h-full sm:w-48",
        "md:right-4 md:w-56",
        className,
      )}
    >
      <div className="h-full w-full">{children}</div>
    </div>
  );
}

export const headerDecorTextPad = "pr-[5.75rem] sm:pr-24 md:pr-28";
