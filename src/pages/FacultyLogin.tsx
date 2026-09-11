import Layout from "@/components/Layout";
import FacultyLoginForm from "@/components/faculty/FacultyLoginForm";
import PageSeo from "@/components/seo/PageSeo";

const FacultyLogin = () => {
  return (
    <Layout>
      <PageSeo
        title="Prijava fakulteta | MojPut"
        description="Prijava namijenjena isključivo fakultetskim računima za uređivanje profila i objava."
        canonical="https://mojput.com/fakulteti/prijava"
      />
      <section className="container py-16 max-w-md">
        <FacultyLoginForm />
      </section>
    </Layout>
  );
};

export default FacultyLogin;
