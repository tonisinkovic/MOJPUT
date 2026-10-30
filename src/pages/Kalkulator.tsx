import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SrednjaKalkulator from "@/components/SrednjaKalkulator";
import { JuniorPage } from "@/components/junior-kit";

export default function Kalkulator() {
  return (
    <Layout>
      <PageSeo title="Kalkulator bodova za upis u srednju školu – MojPut" description="Izračunaj bodove za upis u srednju školu iz ocjena i usporedi ih s lanjskim pragovima škola." />
      <JuniorPage wide crumb="Kalkulator">
        <SrednjaKalkulator />
      </JuniorPage>
    </Layout>
  );
}
