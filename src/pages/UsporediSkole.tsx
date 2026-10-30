import { Scale } from "lucide-react";
import Layout from "@/components/Layout";
import { JuniorPage, PageHero } from "@/components/junior-kit";
import JuniorPointsBox from "@/components/junior-quiz/JuniorPointsBox";
import JuniorSchoolCompare from "@/components/junior/JuniorSchoolCompare";

export default function UsporediSkole() {
  return (
    <Layout>
      <JuniorPage wide homeTo="/profil?tab=skole" crumb="Usporedba">
        <PageHero
          icon={Scale}
          tone="sky"
          kicker="Bodovi"
          badge="Usporedba"
          title={
            <>
              Usporedi <span className="text-[hsl(var(--jh-sky))]">škole</span>
            </>
          }
          lead="Do 5 škola i 3 programa. Vidi prag, udaljenost, podudaranje s kvizom i šansu s tvojim bodovima."
        />
        <div className="mt-2">
          <JuniorPointsBox />
        </div>
        <div className="mt-6">
          <JuniorSchoolCompare />
        </div>
      </JuniorPage>
    </Layout>
  );
}
