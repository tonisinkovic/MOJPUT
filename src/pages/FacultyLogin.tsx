import Layout from "@/components/Layout";
import FacultyLoginForm from "@/components/faculty/FacultyLoginForm";
import PageSeo from "@/components/seo/PageSeo";
import { SBack, SeniorBlobs } from "@/components/senior-kit";

const FacultyLogin = () => {
  return (
    <Layout>
      <PageSeo
        title="Prijava fakulteta | MojPut"
        description="Prijava namijenjena isključivo fakultetskim računima za uređivanje profila i objava."
        canonical="https://mojput.com/fakulteti/prijava"
      />
      <section className="sr-page relative mx-auto max-w-md px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:pt-8 md:py-12">
        <SeniorBlobs />
        <SBack to="/fakulteti" label="Fakulteti" crumb="Prijava" />
        <div className="mx-auto w-full max-w-md">
          <FacultyLoginForm />
        </div>
      </section>
    </Layout>
  );
};

export default FacultyLogin;
