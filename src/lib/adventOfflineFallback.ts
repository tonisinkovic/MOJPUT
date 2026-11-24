import type { AdventPrizesPublicPayload } from "@/lib/adventLeaguePrizesApi";
import prizesPartners from "@/data/advent-league/prizes-partners.json";

/** API vratio HTML/404 (stari backend, samo Vite, ili frontend bez VITE_API_URL). */
export function isAdventApiUnavailableMessage(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.includes("Odgovor nije JSON") ||
    message.includes("Greška (404)") ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Cannot GET /api/advent")
  );
}

function buildStaticPrizesPayload(): AdventPrizesPublicPayload {
  const partners = (prizesPartners.partners || []).map((p) => ({
    id: String(p.id),
    name: String(p.name),
    description: p.description ? String(p.description) : undefined,
    logoUrl: p.logoUrl ?? null,
    websiteUrl: p.websiteUrl ?? null,
    isDemo: Boolean(p.isDemo),
  }));
  const partnerById = new Map(partners.map((p) => [p.id, p]));

  const prizes = (prizesPartners.prizes || [])
    .map((p) => ({
      id: String(p.id),
      name: String(p.name),
      description: String(p.description),
      imageUrl: p.imageUrl ?? null,
      category: String(p.category),
      tier: p.tier === "daily" ? ("daily" as const) : ("main" as const),
      partnerId: p.partnerId ? String(p.partnerId) : null,
      isDemo: Boolean(p.isDemo),
      sortOrder: Number(p.sortOrder) || 0,
    }))
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "main" ? -1 : 1;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });

  const withPartners = prizes.map((prize) => {
    const partner = prize.partnerId ? partnerById.get(prize.partnerId) : null;
    return {
      ...prize,
      partner: partner
        ? {
            id: partner.id,
            name: partner.name,
            logoUrl: partner.logoUrl,
            websiteUrl: partner.websiteUrl,
            isDemo: partner.isDemo,
          }
        : null,
    };
  });

  return {
    partners,
    mainPrizes: withPartners.filter((p) => p.tier === "main"),
    dailyPrizes: withPartners.filter((p) => p.tier === "daily"),
    hasDemoContent: partners.some((p) => p.isDemo) || prizes.some((p) => p.isDemo),
  };
}

export function staticAdventPrizesFallback() {
  return buildStaticPrizesPayload();
}