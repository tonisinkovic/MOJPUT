import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, School } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SchoolLoginForm from "@/components/school/SchoolLoginForm";
import { JBack, JuniorBlobs, PageHero } from "@/components/junior-kit";
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
        <div className="flex min-h-[50vh] items-center justify-center pb-[max(6.5rem,env(safe-area-inset-bottom))] text-muted-foreground">
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
      <section className="jh-page relative flex min-h-[calc(100vh-4rem)] items-center">
        <JuniorBlobs />
        <div className="container relative mx-auto max-w-md px-4 py-8 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] md:py-12">
          <JBack to="/srednje-skole/profili" label="Natrag na škole" />
          <PageHero
            icon={School}
            tone="teal"
            badge="Škole"
            title="Prijava za škole"
            lead="Prijava školskog računa za uređivanje profila i objava na MojPut Junioru."
          />
          <div className="mt-6 sm:mt-8">
            <SchoolLoginForm resetOk={searchParams.get("reset") === "ok"} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
