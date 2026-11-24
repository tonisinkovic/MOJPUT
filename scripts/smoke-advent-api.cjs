#!/usr/bin/env node
/**
 * Read-only smoke test za Advent API (+ opcionalna regresija core endpointa).
 * Ne piše u bazu, ne poziva POST /api/advent/start|answer|complete.
 *
 * Usage:
 *   node scripts/smoke-advent-api.cjs
 *   SMOKE_API_BASE=https://mojput.onrender.com node scripts/smoke-advent-api.cjs
 *   node scripts/smoke-advent-api.cjs --regression
 */
"use strict";

const base = String(process.env.SMOKE_API_BASE || "http://127.0.0.1:3000").replace(/\/$/, "");
const withRegression = process.argv.includes("--regression");

let failed = 0;

function ok(name, cond, detail = "") {
  if (cond) {
    console.log(`  ✔ ${name}${detail ? ` — ${detail}` : ""}`);
    return true;
  }
  failed += 1;
  console.error(`  ✘ ${name}${detail ? ` — ${detail}` : ""}`);
  return false;
}

async function getJson(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { url, status: res.status, body };
}

async function main() {
  console.log(`\n🔎 Smoke (read-only) → ${base}\n`);

  const health = await getJson("/api/health");
  ok("GET /api/health", health.status === 200 && health.body?.success === true, `status ${health.status}`);

  const meta = await getJson("/api/advent/meta");
  const metaData = meta.body?.data;
  ok(
    "GET /api/advent/meta",
    meta.status === 200 && meta.body?.success === true && metaData?.season,
    meta.body?.message || `todayKey=${metaData?.todayKey}`,
  );
  if (metaData?.season) {
    ok("meta season dates", Boolean(metaData.season.startDate && metaData.season.endDate));
  }

  const prizes = await getJson("/api/advent/prizes");
  ok(
    "GET /api/advent/prizes",
    prizes.status === 200 && prizes.body?.success === true,
    prizes.status !== 200 ? prizes.body?.message : undefined,
  );

  const lb = await getJson("/api/advent/leaderboard?limit=5");
  ok(
    "GET /api/advent/leaderboard",
    lb.status === 200 && lb.body?.success === true,
    `entries=${lb.body?.data?.entries?.length ?? "?"}`,
  );

  const me = await getJson("/api/advent/me");
  ok(
    "GET /api/advent/me (bez auth)",
    me.status === 401 || me.body?.success === false,
    `status ${me.status} (očekivano 401 bez tokena)`,
  );

  if (withRegression) {
    console.log("\n— Regresija (core) —\n");
    const authMe = await getJson("/api/auth/me");
    ok("GET /api/auth/me", authMe.status === 401 || authMe.body?.success === false, `status ${authMe.status}`);
  }

  console.log(failed === 0 ? "\n✅ Smoke prošao.\n" : `\n❌ ${failed} provjera nije prošlo.\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Smoke crashed:", err?.message || err);
  process.exit(2);
});