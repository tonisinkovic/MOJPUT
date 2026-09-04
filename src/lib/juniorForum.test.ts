import { describe, expect, it } from "vitest";
import { attachForumMeta, stripForumMeta } from "@/lib/juniorForum";

describe("junior forum meta", () => {
  it("sprema i čita grad, smjer i pitaj treći razred", () => {
    const tagged = attachForumMeta("Trebam savjet za prijemni.", {
      city: "Split",
      track: "medicinska",
      askSenior: true,
    });
    const { meta, body } = stripForumMeta(tagged);
    expect(meta.city).toBe("Split");
    expect(meta.track).toBe("medicinska");
    expect(meta.askSenior).toBe(true);
    expect(body).toMatch(/prijemni/);
  });
});
