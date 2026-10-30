import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Compass } from "lucide-react";
import Layout from "@/components/Layout";
import { experienceHomePath, resolveExperienceMode } from "@/lib/experience";
import { PageHero, SBack, SeniorBlobs } from "@/components/senior-kit";
import { CARD, JuniorBlobs } from "@/components/junior-kit";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isJunior = resolveExperienceMode(searchParams) === "junior";
  const home = experienceHomePath("senior");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  if (isJunior) {
    return (
      <div className="jh-page relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
        <JuniorBlobs />
        <main className={cn(CARD, "jh-hero w-full max-w-xl p-6 text-center sm:p-10")}>
          <p className="jh-type-kicker text-[hsl(var(--jh-teal-t))]">404</p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] md:text-4xl">
            Stranica nije pronađena
          </h1>
          <p className="jh-type-lead mx-auto mt-3 max-w-md text-pretty">
            Tražena stranica ne postoji ili je premještena. Vrati se na početnu i nastavi istraživati MojPut.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="jh-shine jh-cta relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-7 text-base font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Povratak na početnu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Layout>
      <section className="sr-page relative mx-auto max-w-xl px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:pt-8 md:py-16">
        <SeniorBlobs />
        <SBack crumb="404" />
        <div className="mx-auto w-full max-w-xl">
        <PageHero
          icon={Compass}
          tone="gold"
          kicker="Greška"
          badge="404"
          title={
            <>
              Stranica nije <span className="text-[hsl(var(--sr-gold))]">pronađena</span>
            </>
          }
          lead="Tražena stranica ne postoji ili je premještena. Vrati se na početnu i nastavi istraživati MojPut."
          actions={
            <Link
              to={home}
              className="sr-sheen sr-gold-btn inline-flex min-h-12 items-center justify-center rounded-xl px-6 text-base font-extrabold"
            >
              Povratak na početnu
            </Link>
          }
        />
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
