import { Link } from "react-router-dom";
import { Compass, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Platforma",
    links: [
      { label: "Karta fakulteta", path: "/karta" },
      { label: "Kviz", path: "/kviz" },
      { label: "Kalkulator bodova", path: "/kalkulator" },
      { label: "Samoprocjena", path: "/samoprocjena" },
    ],
  },
  {
    title: "Zajednica",
    links: [
      { label: "Forum", path: "/forum" },
      { label: "Video predavanja", path: "/video" },
      { label: "Roditeljski kutak", path: "/roditelji" },
      { label: "Kalendar", path: "/kalendar" },
      { label: "Chatbot pomoćnik", path: "/chatbot" },
    ],
  },
  {
    title: "Informacije",
    links: [
      { label: "O nama", path: "/o-nama" },
      { label: "Kontakt (pomoć)", path: "/kontakt" },
      { label: "Privatnost", path: "/privatnost" },
      { label: "Uvjeti korištenja", path: "/uvjeti" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-b from-card to-card/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-primary/[0.07] blur-3xl"
      />

      <div className="container relative py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 font-bold text-lg mb-4"
            >
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-md shadow-primary/20 ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-gradient">MojPut</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centralno digitalno mjesto za maturante koji donose odluku o budućem studiju i karijeri.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="relative font-semibold text-sm mb-4 pb-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-8 after:rounded-full after:bg-gradient-to-r after:from-primary after:to-primary/40">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-0.5"
                    >
                      <span className="relative">
                        {link.label}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </span>
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-10 pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground tabular-nums">
              © {new Date().getFullYear()} MojPut. Sva prava pridržana.
            </p>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              Izrađeno sa ❤️ za maturante Hrvatske!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
