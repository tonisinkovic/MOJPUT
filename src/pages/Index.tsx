import { useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { scrollDocumentToTopInstant } from "@/components/ScrollToTop";
import { storeExperience, storePreferredExperience } from "@/lib/experience";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import MojPutEntryIntro from "@/components/MojPutEntryIntro";
import JuniorHome from "@/components/junior-home/JuniorHome";
import SeniorHome from "@/components/senior-home/SeniorHome";

type MojPutExperience = "junior" | "senior";

const HOME_SEO_TITLE = "MojPut – karijerni usmjerivač za upis u srednju školu i na fakultet";
const HOME_SEO_DESCRIPTION =
  "Kviz interesa, kalkulator bodova za srednje škole i fakultete, karta fakulteta, rokovi upisa i forum — besplatno, na jednom mjestu.";
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MojPut",
  url: "https://www.mojput.com/",
  inLanguage: "hr",
  description: HOME_SEO_DESCRIPTION,
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const experienceFromUrl = searchParams.get("experience");
  const hasExperienceInUrl = experienceFromUrl === "junior" || experienceFromUrl === "senior";
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showEntryIntro, setShowEntryIntro] = useState(!hasExperienceInUrl);
  const [selectedExperience, setSelectedExperience] = useState<MojPutExperience>(
    hasExperienceInUrl ? experienceFromUrl : "senior",
  );

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
    });
    const sync = () => {
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    window.addEventListener("mojput-auth-changed", sync);
    return () => {
      alive = false;
      window.removeEventListener("mojput-auth-changed", sync);
    };
  }, []);

  const updateExperienceUrl = (experience: MojPutExperience | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (experience) {
      nextParams.set("experience", experience);
    } else {
      nextParams.delete("experience");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const openExperience = (experience: MojPutExperience) => {
    scrollDocumentToTopInstant();
    setSelectedExperience(experience);
    setShowEntryIntro(false);
    updateExperienceUrl(experience);
    storeExperience(experience);
    // Zapamti kao preferirani mod za sljedeći ulazak ("Nastavi u MojPut X")
    storePreferredExperience(experience, user?.email);
  };

  const returnToExperienceChoice = () => {
    scrollDocumentToTopInstant();
    setShowEntryIntro(true);
    updateExperienceUrl(null);
    storeExperience(null);
  };

  const switchExperience = (experience: MojPutExperience) => {
    if (experience === selectedExperience) return;
    scrollDocumentToTopInstant();
    setSelectedExperience(experience);
    updateExperienceUrl(experience);
    storeExperience(experience);
  };

  useEffect(() => {
    if (experienceFromUrl === "junior" || experienceFromUrl === "senior") {
      setSelectedExperience(experienceFromUrl);
      setShowEntryIntro(false);
      storeExperience(experienceFromUrl);
      return;
    }
    setShowEntryIntro(true);
  }, [experienceFromUrl]);

  useLayoutEffect(() => {
    if (showEntryIntro) return;
    scrollDocumentToTopInstant();
    const t = window.setTimeout(scrollDocumentToTopInstant, 0);
    const t2 = window.setTimeout(scrollDocumentToTopInstant, 120);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [showEntryIntro]);

  const seo = <PageSeo title={HOME_SEO_TITLE} description={HOME_SEO_DESCRIPTION} jsonLd={HOME_JSON_LD} />;

  if (showEntryIntro) {
    return (
      <>
        {seo}
        <MojPutEntryIntro
          onEnterJunior={() => openExperience("junior")}
          onEnterSenior={() => openExperience("senior")}
        />
      </>
    );
  }

  const isJunior = selectedExperience === "junior";

  return (
    <div data-mojput-experience={selectedExperience}>
      <Layout>
        {seo}
        {isJunior ? (
          <JuniorHome user={user} onReturn={returnToExperienceChoice} onSwitch={switchExperience} />
        ) : (
          <SeniorHome user={user} onReturn={returnToExperienceChoice} onSwitch={switchExperience} />
        )}
      </Layout>
    </div>
  );
};

export default Index;
