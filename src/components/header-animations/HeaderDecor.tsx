import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Desni stupac za header animacije — u toku rasporeda, raste s visinom kartice. */
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
        "pointer-events-none relative shrink-0 self-stretch overflow-hidden",
        "w-[6.75rem] min-h-[8rem]",
        "min-[400px]:w-[8rem]",
        "sm:w-[11.5rem] sm:min-h-[9.5rem]",
        "md:w-[13.5rem] md:min-h-[10.5rem]",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}

/** Red: ikona (od sm naviše) + slobodan tekst + animacija. */
export function HeaderHero({
  icon,
  children,
  decor,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  decor: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-stretch gap-2.5 sm:gap-4", className)}>
      {icon ? <div className="hidden shrink-0 sm:block">{icon}</div> : null}
      <div className="min-w-0 flex-1">{children}</div>
      {decor}
    </div>
  );
}
