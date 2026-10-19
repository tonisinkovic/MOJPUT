import { describe, expect, it } from "vitest";
import { highSchools } from "@/data/highSchools";
import {
  JUNIOR_CALCULATOR_SCHOOL_COUNT,
  JUNIOR_CATALOG_NOTE,
  JUNIOR_MAP_SCHOOL_COUNT,
  JUNIOR_MISSING_NEARBY_NOTE,
  JUNIOR_MISSING_SCHOOL_NOTE,
  JUNIOR_SCHOOL_COUNT_NOTE,
} from "@/lib/juniorHonesty";
import { JUNIOR_PROGRAM_FAMILY_COUNT } from "@/lib/juniorQuizEngine";
import Database from "better-sqlite3";
import { EDITORIAL_SEED_EMAILS, removeJuniorThirdYearForum } from "../../server/juniorThirdYearRemove.cjs";

describe("junior honesty copy", () => {
  it("kaže da vrste smjerova nisu cijeli popis", () => {
    expect(JUNIOR_PROGRAM_FAMILY_COUNT).toBe(39);
    expect(JUNIOR_CATALOG_NOTE).toMatch(/39/);
    expect(JUNIOR_CATALOG_NOTE).toMatch(/nije cijeli službeni popis/i);
    expect(JUNIOR_CATALOG_NOTE).not.toMatch(/obitelj/i);
  });

  it("razlikuje broj škola na karti i u kalkulatoru", () => {
    expect(JUNIOR_MAP_SCHOOL_COUNT).toBe(highSchools.length);
    expect(JUNIOR_CALCULATOR_SCHOOL_COUNT).toBeGreaterThan(JUNIOR_MAP_SCHOOL_COUNT);
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(/karta/i);
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(/kalkulator/i);
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(String(JUNIOR_MAP_SCHOOL_COUNT));
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(String(JUNIOR_CALCULATOR_SCHOOL_COUNT));
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(/nisu isti popisi/i);
  });

  it("jasno kaže kad škole nema u bazi", () => {
    expect(JUNIOR_MISSING_SCHOOL_NOTE).toMatch(/ne izmišljamo/i);
    expect(JUNIOR_MISSING_NEARBY_NOTE).toMatch(/ne znači da škole nema/i);
  });
});

describe("izmišljeni 3. razred", () => {
  function memoryDb() {
    const raw = new Database(":memory:");
    raw.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email_verified INTEGER NOT NULL DEFAULT 0,
        email_verify_token TEXT,
        email_verify_expires_at TEXT
      );
      CREATE TABLE forum_conversations (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        creator_user_id INTEGER NOT NULL
      );
      CREATE TABLE forum_messages (
        id INTEGER PRIMARY KEY,
        conversation_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        reply_to_id INTEGER
      );
      CREATE TABLE forum_likes (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL
      );
      CREATE TABLE forum_reports (
        id INTEGER PRIMARY KEY,
        message_id INTEGER NOT NULL,
        reporter_user_id INTEGER NOT NULL
      );
      CREATE TABLE app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    `);
    return {
      prepare(sql: string) {
        return {
          get: (...params: unknown[]) => raw.prepare(sql).get(...params),
          all: (...params: unknown[]) => raw.prepare(sql).all(...params),
          run: (...params: unknown[]) => {
            const info = raw.prepare(sql).run(...params);
            return { changes: info.changes, lastInsertRowid: Number(info.lastInsertRowid) };
          },
        };
      },
      raw,
    };
  }

  it("prepoznaje samo seed adrese na mojput.invalid", () => {
    expect(EDITORIAL_SEED_EMAILS).toContain("seed.marta3med@mojput.invalid");
    expect(EDITORIAL_SEED_EMAILS.every((email: string) => email.endsWith("@mojput.invalid"))).toBe(true);
  });

  it("briše izmišljene poruke i ostavlja pravu temu", async () => {
    const db = memoryDb();
    db.raw.prepare("INSERT INTO users (id, username, email, password_hash, email_verified) VALUES (1, 'Marta3Med', 'seed.marta3med@mojput.invalid', 'tajna', 1)").run();
    db.raw.prepare("INSERT INTO users (id, username, email, password_hash, email_verified) VALUES (2, 'PravaUcenica', 'prava@skola.hr', 'tajna', 1)").run();
    db.raw.prepare("INSERT INTO forum_conversations (id, title, description, creator_user_id) VALUES (10, 'Što te najviše iznenadilo u 1. razredu?', 'izmišljeno', 1)").run();
    db.raw.prepare("INSERT INTO forum_conversations (id, title, description, creator_user_id) VALUES (11, 'Pravo pitanje osmaša', 'živo', 2)").run();
    db.raw.prepare("INSERT INTO forum_messages (id, conversation_id, user_id, text) VALUES (100, 10, 1, 'Marta, 3. r., Medicinska Split: tempo.')").run();
    db.raw.prepare("INSERT INTO forum_messages (id, conversation_id, user_id, text, reply_to_id) VALUES (101, 11, 2, 'Stvarno pitanje', NULL)").run();
    db.raw.prepare("INSERT INTO forum_messages (id, conversation_id, user_id, text, reply_to_id) VALUES (102, 11, 1, 'Marta odgovara na tuđu temu', 101)").run();
    db.raw.prepare("INSERT INTO forum_likes (id, user_id, message_id) VALUES (1, 1, 101)").run();

    const result = await removeJuniorThirdYearForum(db);
    expect(result.removed).toBe(true);

    const titles = db.raw.prepare("SELECT title FROM forum_conversations ORDER BY id").all() as { title: string }[];
    expect(titles.map((row) => row.title)).toEqual(["Pravo pitanje osmaša"]);
    const texts = db.raw.prepare("SELECT text, user_id FROM forum_messages").all() as { text: string; user_id: number }[];
    expect(texts).toEqual([{ text: "Stvarno pitanje", user_id: 2 }]);
    const marta = db.raw.prepare("SELECT username, password_hash, email_verified FROM users WHERE id = 1").get() as {
      username: string;
      password_hash: string;
      email_verified: number;
    };
    expect(marta.username).toBe("uklonjeni-primjer-1");
    expect(marta.password_hash).not.toBe("tajna");
    expect(marta.email_verified).toBe(0);
    const real = db.raw.prepare("SELECT username FROM users WHERE id = 2").get() as { username: string };
    expect(real.username).toBe("PravaUcenica");
    expect(db.raw.prepare("SELECT COUNT(*) AS c FROM forum_likes").get()).toEqual({ c: 0 });

    const again = await removeJuniorThirdYearForum(db);
    expect(again).toEqual({ removed: false, reason: "already" });
  });
});
