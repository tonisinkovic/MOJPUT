import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SchoolLoginForm from "@/components/school/SchoolLoginForm";
import { authMe, userFromAuthMe } from "@/lib/auth";

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
        navigate("/skola/dashboard", { replace: true });
        return;
      }
      setChecking(false);
    });
    return () => {
      alive = false;
    };
  }, [navigate]);

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
      <section className="container mx-auto max-w-md px-4 py-10 md:py-16">
        <SchoolLoginForm resetOk={searchParams.get("reset") === "ok"} />
      </section>
    </Layout>
  );
}
