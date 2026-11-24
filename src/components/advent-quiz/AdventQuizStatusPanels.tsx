import { Link } from "react-router-dom";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

export function AdventQuizLoading() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center flex-col gap-3 text-center"
      role="status"
    >
      <Loader2
        className="h-6 w-6 animate-spin text-[hsl(var(--advent-gold))]"
        aria-hidden
      />
      <p className="text-sm font-bold advent-text-muted">
        Učitavam današnji kviz...
      </p>
    </div>
  );
}

export function AdventQuizError({
  title,
  message,
  loginRequired,
}: {
  title: string;
  message: string;
  loginRequired?: boolean;
}) {
  return (
    <div className="advent-glass rounded-2xl p-6 text-center sm:p-8 border border-[hsl(var(--advent-cranberry)/0.3)]">
      <AlertCircle
        className="mx-auto h-10 w-10 text-[hsl(var(--advent-cranberry))]"
        aria-hidden
      />
      <h1 className="mt-4 text-xl font-extrabold text-[hsl(var(--advent-ivory))]">
        {title}
      </h1>
      <p className="mt-2 text-sm font-medium advent-text-muted">{message}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {loginRequired ? (
          <Link
            to="/prijava?next=/adventska-liga/kviz"
            className="advent-btn-gold rounded-xl min-h-12 px-6 font-extrabold text-sm inline-flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Prijavi se
          </Link>
        ) : null}
        <Link
          to="/adventska-liga"
          className="advent-btn-ghost rounded-xl min-h-12 px-6 font-bold text-sm inline-flex items-center justify-center"
        >
          Natrag na ligu
        </Link>
      </div>
    </div>
  );
}

export function AdventQuizEmpty({ message }: { message: string }) {
  return (
    <div className="advent-glass-frost rounded-2xl p-6 border border-dashed border-[hsl(var(--advent-frost)/0.2)] text-center">
      <p className="text-sm font-semibold advent-text-muted">{message}</p>
    </div>
  );
}
