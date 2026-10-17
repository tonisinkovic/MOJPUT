import { Component, type ErrorInfo, type ReactNode } from "react";

const CHUNK_RELOAD_KEY = "mojput_chunk_reload_at";
const CHUNK_RELOAD_COOLDOWN_MS = 30_000;

export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|error loading dynamically/i.test(
    msg,
  );
}

/** Nakon novog deploya stari chunkovi nestanu — jedan automatski reload dohvaća svježi index.html. */
function tryReloadForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    if (Date.now() - last < CHUNK_RELOAD_COOLDOWN_MS) return false;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    if (isChunkLoadError(error)) tryReloadForStaleChunk();
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const chunk = isChunkLoadError(error);
    return (
      <main role="alert" className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-border/70 bg-card/90 p-6 text-center shadow-soft">
          <h1 className="text-lg font-semibold text-foreground">
            {chunk ? "Stranica je upravo ažurirana" : "Nešto je pošlo po zlu"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {chunk
              ? "Objavili smo novu verziju MojPuta. Osvježi stranicu da učitaš najnoviji sadržaj."
              : "Ovaj dio stranice se nije uspio prikazati. Osvježi stranicu ili se vrati na početnu — tvoji spremljeni podaci nisu izgubljeni."}
          </p>
          <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Osvježi stranicu
            </button>
            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Početna
            </a>
          </div>
        </div>
      </main>
    );
  }
}
