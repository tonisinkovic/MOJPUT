import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Target, Users } from "lucide-react";
import Layout from "@/components/Layout";

const teamMembers = [
  {
    name: "Ivano Perišić Marušić",
    role: "Osnivač i UI/UX dizajner",
    bio: "Vodi viziju proizvoda i oblikuje korisničko iskustvo koje pomaže mladima donijeti sigurnije odluke.",
    avatar: "https://placehold.co/200x200?text=IPM",
  },
  {
    name: "Toni Šinković",
    role: "Full-stack developer",
    bio: "Razvija stabilnu i skalabilnu platformu kako bi MojPut radio brzo, sigurno i pouzdano.",
    avatar: "https://placehold.co/200x200?text=TS",
  },
  {
    name: "Josip Šinković",
    role: "Full-stack developer",
    bio: "Povezuje backend i frontend sustav u cjelinu koja je jednostavna za korištenje i laka za nadogradnju.",
    avatar: "https://placehold.co/200x200?text=JS",
  },
];

const About = () => {
  return (
    <Layout>
      <section className="container py-12 md:py-16 space-y-8 md:space-y-10">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10 shadow-card"
        >
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -left-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              Naša priča
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4">O nama</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              MojPut je nastao kako bismo maturantima uklonili stres i nesigurnost pri odabiru fakulteta.
              Gradimo jedno jasno digitalno mjesto gdje mladi dobivaju alate, informacije i smjernice za
              donošenje odluka koje oblikuju njihovu budućnost.
            </p>
          </div>
        </motion.article>

        <article className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Što radimo</h2>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="rounded-xl border p-4 bg-background/50">
              <Target className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pretvaramo složene informacije o fakultetima u jednostavne i korisne uvide.
              </p>
            </div>
            <div className="rounded-xl border p-4 bg-background/50">
              <Users className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pomažemo učenicima i roditeljima da zajedno planiraju sljedeći obrazovni korak.
              </p>
            </div>
            <div className="rounded-xl border p-4 bg-background/50">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Gradimo pouzdanu platformu koja spaja povjerenje, jasnoću i moderan digitalni pristup.
              </p>
            </div>
          </div>
        </article>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tim</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Mali, fokusiran tim koji spaja dizajn, razvoj i edukacijski kontekst u jednu platformu.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />
                <h3 className="font-semibold text-lg mt-4">{member.name}</h3>
                <p className="text-sm text-primary mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default About;
