import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const mod = require("../../server/forumModeration.cjs") as {
  REPORT_HIDE_THRESHOLD: number;
  checkForumText: (t: string) => { ok: true; text: string; masked: boolean } | { ok: false; reason: string };
  createRateLimiter: (o: { windowMs: number; max: number }) => {
    hit: (key: string, now?: number) => { ok: boolean; retryAfterSec: number };
  };
  normalizeReportReason: (r: unknown) => string;
};

describe("checkForumText", () => {
  it("normalna poruka prolazi nepromijenjena", () => {
    const r = mod.checkForumText("Koliko bodova treba za FER? Ja imam 720.");
    expect(r).toEqual({ ok: true, text: "Koliko bodova treba za FER? Ja imam 720.", masked: false });
  });

  it("psovke maskira, i s dijakriticima i leetspeakom", () => {
    const r = mod.checkForumText("Ovo je sranje, kr3t3n jedan");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.masked).toBe(true);
      expect(r.text).not.toMatch(/sranje|kr3t3n/i);
      expect(r.text).toMatch(/^Ovo je s\*+, k\*+ jedan$/);
    }
  });

  it("uvrede i prijetnje blokira", () => {
    expect(mod.checkForumText("ubit ću te sutra").ok).toBe(false);
    expect(mod.checkForumText("Ti si p3d3r").ok).toBe(false);
    expect(mod.checkForumText("objesi se").ok).toBe(false);
  });

  it("ne dira riječi koje samo sadrže slova psovke usred riječi", () => {
    const r = mod.checkForumText("Studiram ekonomiju i računovodstvo, poslije idem u Split.");
    expect(r.ok && r.masked).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("pušta do max pa blokira do isteka prozora", () => {
    const limiter = mod.createRateLimiter({ windowMs: 60_000, max: 2 });
    expect(limiter.hit("u1", 0).ok).toBe(true);
    expect(limiter.hit("u1", 1000).ok).toBe(true);
    const blocked = limiter.hit("u1", 2000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBe(58);
    expect(limiter.hit("u2", 2000).ok).toBe(true);
    expect(limiter.hit("u1", 61_000).ok).toBe(true);
  });
});

describe("prijave", () => {
  it("prag za automatsko skrivanje je 3", () => {
    expect(mod.REPORT_HIDE_THRESHOLD).toBe(3);
  });

  it("nepoznat razlog postaje 'ostalo'", () => {
    expect(mod.normalizeReportReason("spam")).toBe("spam");
    expect(mod.normalizeReportReason("<script>")).toBe("ostalo");
  });
});
