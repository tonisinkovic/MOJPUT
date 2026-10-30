import Layout from "@/components/Layout";
import JuniorQuizFlow from "@/components/junior-quiz/JuniorQuizFlow";
import { JuniorPage } from "@/components/junior-kit";

const KvizSrednja = () => {
  return (
    <Layout>
      <JuniorPage crumb="Kviz">
        <JuniorQuizFlow />
      </JuniorPage>
    </Layout>
  );
};

export default KvizSrednja;
