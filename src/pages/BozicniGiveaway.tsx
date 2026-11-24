import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { apiPost } from "@/lib/api";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";

const loginHref = "/prijava?next=/bozicni-giveaway";

const BozicniGiveaway = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<"new" | "already" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      const next = userFromAuthMe(res);
      setUser(next);
      if (next?.username) setName(next.username);
      setAuthChecked(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError("Upiši ispravan broj mobitela.");
      return;
    }
    setError("");
    setPending(true);
    const res = await apiPost<{ already?: boolean }>("/api/giveaway", {
      name: name.trim(),
      phone: digits,
    });
    setPending(false);
    if (!res.success) {
      setError(res.message || "Prijava se nije spremila. Pokušaj ponovno.");
      return;
    }
    setDone(res.data?.already ? "already" : "new");
  };

  return (
    <Layout>
      <PageSeo
        title="Božićni giveaway – MojPut"
        description="Prijavi se na božićni giveaway MojPuta. Prvo treba prijava u MojPut."
      />
      <main className="relative mx-auto min-h-[70vh] max-w-xl px-4 py-10">
        <div className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-red-400/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-10 top-24 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" aria-hidden />
        <Link
          to="/"
          className="relative inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Početna
        </Link>
        <section className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-white bg-white px-5 py-6 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.45)] sm:px-8 sm:py-8">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#b42318] via-[#d4a017] to-[#1f7a3a]" aria-hidden />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b42318]">Božićni giveaway</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Darujemo <span className="text-[#b42318]">priliku!</span>
          </h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-emerald-800">
            Prvo prijava u MojPut, pa tek onda na giveaway.
          </p>

          {!authChecked ? (
            <p className="mt-6 text-sm font-semibold text-slate-500">Provjeravam prijavu…</p>
          ) : !user ? (
            <div className="mt-6 space-y-4">
              <p className="rounded-2xl bg-red-50 px-4 py-4 text-sm font-semibold leading-relaxed text-[#9f1d14]">
                Giveaway je otvoren samo prijavljenim korisnicima MojPuta.
              </p>
              <Link
                to={loginHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#b42318] px-5 text-sm font-extrabold text-white transition hover:bg-[#9f1d14]"
              >
                Prijavi se u MojPut
              </Link>
            </div>
          ) : done ? (
            <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-semibold leading-relaxed text-emerald-900">
              {done === "already"
                ? "Već si prijavljen na giveaway ovim MojPut računom."
                : "Prijava je zaprimljena. Javimo ti se na e-mail ili mobitel ako te izvučemo."}
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-sm font-extrabold text-slate-900">
                Ime i prezime
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-red-900/10 bg-white px-4 text-base font-medium outline-none focus:border-[#b42318]"
                />
              </label>
              <label className="block text-sm font-extrabold text-slate-900">
                E-mail MojPut računa
                <input
                  readOnly
                  value={user.email}
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-red-900/10 bg-slate-50 px-4 text-base font-medium text-slate-600 outline-none"
                />
              </label>
              <label className="block text-sm font-extrabold text-slate-900">
                Broj mobitela
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="091 234 5678"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1.5 h-12 w-full rounded-xl border-2 border-red-900/10 bg-white px-4 text-base font-medium outline-none focus:border-[#b42318]"
                />
              </label>
              {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#b42318] px-5 text-sm font-extrabold text-white transition hover:bg-[#9f1d14] disabled:opacity-60"
              >
                {pending ? "Šaljem…" : "Prijavi se na giveaway"}
              </button>
            </form>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default BozicniGiveaway;
