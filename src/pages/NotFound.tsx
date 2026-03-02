import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-muted">
      <main className="flex flex-1 items-start justify-center pt-12">
        <div className="max-w-2xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            O nama
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            MojPut je platforma stvorena s ciljem da mladima od 16 do 18 godina
            olakša odabir karijere i fakulteta.
          </p>
          <p className="mb-8 text-lg text-muted-foreground">
            Naša misija je pružiti jasne informacije, korisne alate i inspiraciju
            koja pomaže maturantima da donesu važne odluke o svojoj budućnosti.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">
            Platformu su osmislili i razvili:
          </h2>
          <ul className="mb-8 space-y-2 text-left text-lg text-muted-foreground">
            <li>
              <span className="font-semibold">Toni Šinković</span> – autor i
              dizajner
            </li>
            <li>
              <span className="font-semibold">Ivano Perišić</span> – developer
            </li>
            <li>
              <span className="font-semibold">Josip Šinković</span> – developer i
              UX dizajn
            </li>
          </ul>

          <p className="text-lg text-muted-foreground">
            Za sve upite ili suradnju, možete nas kontaktirati na{" "}
            <a
              href="mailto:moj-put@gmail.com"
              className="font-semibold text-primary underline hover:text-primary/90"
            >
              moj-put@gmail.com
            </a>
            .
          </p>
        </div>
      </main>

      <div className="pb-8 text-center">
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
