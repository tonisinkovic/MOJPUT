import PageSeo from "@/components/seo/PageSeo";
import { getAdventSeoProps, type AdventSeoPageKey } from "@/lib/adventLeagueSeo";

type AdventPageSeoProps = {
  page: AdventSeoPageKey;
};

/** Jedan izvor SEO/OG metapodataka za javne advent stranice. */
export function AdventPageSeo({ page }: AdventPageSeoProps) {
  const cfg = getAdventSeoProps(page);
  return (
    <PageSeo
      title={cfg.title}
      description={cfg.description}
      canonical={cfg.canonical}
      image={cfg.image}
      imageWidth={1200}
      imageHeight={630}
      jsonLd={cfg.jsonLd}
    />
  );
}