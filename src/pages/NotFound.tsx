import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <main className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-card">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
          Stranica nije pronađena
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tražena stranica ne postoji ili je premještena. Vrati se na početnu i nastavi istraživati MojPut.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
          >
            Povratak na početnu
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
