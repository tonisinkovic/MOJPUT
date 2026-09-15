import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import JuniorPointsBox from "@/components/junior-quiz/JuniorPointsBox";
import JuniorSchoolCompare from "@/components/junior/JuniorSchoolCompare";
import { Button } from "@/components/ui/button";

export default function UsporediSkole() {
  return (
    <Layout>
      <section className="container mx-auto max-w-6xl px-3 py-8 sm:px-4 md:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 rounded-xl">
          <Link to="/profil?tab=skole">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Natrag na profil
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Usporedi škole</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Do 5 škola i 3 programa. Vidi prag, udaljenost, podudaranje s kvizom i šansu s tvojim
          bodovima.
        </p>
        <div className="mt-6">
          <JuniorPointsBox />
        </div>
        <div className="mt-6">
          <JuniorSchoolCompare />
        </div>
      </section>
    </Layout>
  );
}
