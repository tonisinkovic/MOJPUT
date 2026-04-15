import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Dva gumba (sun/moon) za cijelu aplikaciju — kompaktno za navbar. */
export function HeaderThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn("h-9 w-[4.75rem] shrink-0 rounded-full border border-border/50 bg-muted/30", className)}
        aria-hidden
      />
    );
  }

  const activeLight = resolvedTheme === "light";

  return (
    <div
      role="group"
      aria-label="Izgled stranice: svijetli ili tamni način"
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full border border-border/60 bg-muted/40 p-0.5 shadow-sm",
        "dark:border-border/50 dark:bg-muted/25",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          activeLight
            ? "bg-background text-amber-600 shadow-sm dark:text-amber-400"
            : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
        )}
        aria-pressed={activeLight}
        aria-label="Svijetli način"
      >
        <Sun className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          !activeLight
            ? "bg-background text-indigo-600 shadow-sm dark:text-indigo-300"
            : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
        )}
        aria-pressed={!activeLight}
        aria-label="Tamni način"
      >
        <Moon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
