import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[var(--hero-gradient-soft)] opacity-70 blur-3xl"
        />
        <div className="container relative mx-auto max-w-md px-4 py-8 md:py-12">
          <Link
            to="/fakulteti"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na fakultete
          </Link>
          <FacultyLoginForm />
        </div>
      </section>
    </Layout>
  );
};

export default FacultyLogin;
