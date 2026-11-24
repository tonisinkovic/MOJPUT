const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { validatePayload, buildPublicPayload } = require("./adventLeaguePrizes.cjs");

describe("adventLeaguePrizes", () => {
  const valid = {
    partners: [
      {
        id: "p1",
        name: "Partner demo",
        description: "Opis",
        logoUrl: null,
        websiteUrl: "https://example.com",
        isDemo: true,
      },
    ],
    prizes: [
      {
        id: "prize1",
        name: "Nagrada",
        description: "Opis nagrade ovdje.",
        imageUrl: null,
        category: "sezona",
        tier: "main",
        partnerId: "p1",
        isDemo: true,
        sortOrder: 1,
      },
      {
        id: "daily1",
        name: "Dnevna",
        description: "Dnevna nagrada opis.",
        tier: "daily",
        category: "dnevno",
        partnerId: "p1",
        isDemo: false,
        sortOrder: 1,
      },
    ],
  };

  it("validatePayload accepts valid data", () => {
    const v = validatePayload(valid);
    assert.equal(v.ok, true);
  });

  it("validatePayload rejects unknown partnerId", () => {
    const v = validatePayload({
      partners: [],
      prizes: [{ ...valid.prizes[0], partnerId: "missing" }],
    });
    assert.equal(v.ok, false);
  });

  it("buildPublicPayload splits main and daily", () => {
    const pub = buildPublicPayload(valid);
    assert.equal(pub.mainPrizes.length, 1);
    assert.equal(pub.dailyPrizes.length, 1);
    assert.equal(pub.mainPrizes[0].partner?.name, "Partner demo");
    assert.equal(pub.hasDemoContent, true);
  });
});