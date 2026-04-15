import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

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
    ],
  },
  {
    title: "Informacije",
    links: [
      { label: "O nama", path: "/o-nama" },
      { label: "Kontakt", path: "/kontakt" },
      { label: "Privatnost", path: "/privatnost" },
      { label: "Uvjeti korištenja", path: "/uvjeti" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
                <Compass className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-gradient">MojPut</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centralno digitalno mjesto za maturante koji donose odluku o budućem studiju i karijeri.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MojPut. Sva prava pridržana.
          </p>
          <p className="text-xs text-muted-foreground">
            Izrađeno sa ❤️ za maturante Hrvatske
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
