import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SchoolLoginForm from "@/components/school/SchoolLoginForm";
import { authMe, userFromAuthMe } from "@/lib/auth";
import { safeSchoolReturnPath } from "@/lib/schoolCmsApi";

export default function SchoolLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      const user = userFromAuthMe(res);
      if (user && (user.user_type === "skola" || user.school)) {
        navigate(safeSchoolReturnPath(searchParams.get("next")), { replace: true });
        return;
      }
      setChecking(false);
    });
    return () => {
      alive = false;
    };
  }, [navigate, searchParams]);

  if (checking) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSeo
        title="Prijava za srednje škole | MojPut"
        description="Prijava školskog računa za uređivanje profila i objava na MojPut Junioru."
        canonical="https://mojput.com/srednje-skole/prijava"
      />
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[var(--hero-gradient-soft)] opacity-70 blur-3xl"
        />
        <div className="container relative mx-auto max-w-md px-4 py-8 md:py-12">
          <Link
            to="/srednje-skole/profili"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na škole
          </Link>
          <SchoolLoginForm resetOk={searchParams.get("reset") === "ok"} />
        </div>
      </section>
    </Layout>
  );
}
