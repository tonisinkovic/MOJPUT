const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const {
  getOrCreateReferralCode,
  trackReferralVisit,
  claimReferralSignup,
  getVisitorHash,
} = require("./adventLeagueReferral.cjs");

function createTestDb() {
  const raw = new Database(":memory:");
  raw.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE advent_referral_codes (
      user_id INTEGER PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE advent_referral_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT NOT NULL,
      referrer_user_id INTEGER NOT NULL,
      visitor_hash TEXT NOT NULL,
      landing_path TEXT NOT NULL DEFAULT '/adventska-liga',
      day_key TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE advent_referral_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT NOT NULL,
      referrer_user_id INTEGER NOT NULL,
      referred_user_id INTEGER NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return {
    prepare(sql) {
      return {
        get: (...p) => raw.prepare(sql).get(...p),
        all: (...p) => raw.prepare(sql).all(...p),
        run: (...p) => raw.prepare(sql).run(...p),
      };
    },
    _raw: raw,
  };
}

function mockReq(ip = "1.2.3.4", user = null) {
  return {
    ip,
    headers: { "user-agent": "test-agent", "x-forwarded-for": ip },
    user,
    socket: { remoteAddress: ip },
  };
}

describe("adventLeagueReferral", () => {
  let db;
  let referrerId;
  let referredId;

  before(() => {
    db = createTestDb();
    const r1 = db.prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)").run("ref", "r@test.com", "h");
    referrerId = r1.lastInsertRowid;
    const r2 = db
      .prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)")
      .run("new", "n@test.com", "h");
    referredId = r2.lastInsertRowid;
  });

  after(() => {
    db._raw.close();
  });

  it("generates stable referral code per user", async () => {
    const a = await getOrCreateReferralCode(db, referrerId);
    const b = await getOrCreateReferralCode(db, referrerId);
    assert.equal(a, b);
    assert.match(a, /^[a-z0-9]{6,16}$/);
  });

  it("tracks visit and blocks self-referral", async () => {
    const code = await getOrCreateReferralCode(db, referrerId);
    const self = await trackReferralVisit(db, mockReq("9.9.9.9", { id: referrerId }), {
      code,
      landingPath: "/adventska-liga",
    });
    assert.equal(self.recorded, false);
    assert.equal(self.reason, "self_referral");

    const ok = await trackReferralVisit(db, mockReq("9.9.9.9"), { code, landingPath: "/adventska-liga" });
    assert.equal(ok.recorded, true);
  });

  it("attributes signup for new account", async () => {
    const code = await getOrCreateReferralCode(db, referrerId);
    const claim = await claimReferralSignup(db, referredId, code);
    assert.equal(claim.attributed, true);

    const again = await claimReferralSignup(db, referredId, code);
    assert.equal(again.code, "already_attributed");
  });

  it("visitor hash is opaque", () => {
    const h = getVisitorHash(mockReq("1.1.1.1"));
    assert.equal(h.length, 40);
    assert.doesNotMatch(h, /1\.1\.1\.1/);
  });
});