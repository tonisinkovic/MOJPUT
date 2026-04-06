/**
 * Pokreće Vite, čeka .dev-frontend-origin (stvarni port), zatim API (server.cjs).
 * Tako link u mailu uvijek dobije ispravan URL prije prvog zahtjeva na /api.
 * Zaustavi Ctrl+C (oba procesa).
 */
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const isWin = process.platform === "win32";
const devOriginFile = path.join(root, ".dev-frontend-origin");

/** Inače API krene odmah na starom .dev-frontend-origin dok novi Vite još nije zapisao port. */
try {
  if (fs.existsSync(devOriginFile)) fs.unlinkSync(devOriginFile);
} catch (_) {
  /* ignore */
}

/** Na Windowsu Node 20+ spawn('npm.cmd', …) bez ljuske često daje EINVAL. */
const frontend = isWin
  ? spawn(process.env.ComSpec || "cmd.exe", ["/d", "/c", "npm", "run", "dev"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    })
  : spawn("npm", ["run", "dev"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });

let backend = null;

function startBackend() {
  if (backend) return;
  backend = spawn(process.execPath, ["server.cjs"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  backend.on("exit", (code, signal) => {
    if (signal) return;
    if (code !== 0) {
      shutdown();
      process.exit(code ?? 1);
    }
  });
}

const waitMs = 90000;
const startWait = Date.now();

function waitForViteOriginThenStartApi() {
  try {
    if (fs.existsSync(devOriginFile)) {
      const s = fs.readFileSync(devOriginFile, "utf8").trim();
      if (s && /^https?:\/\//i.test(s)) {
        startBackend();
        return;
      }
    }
  } catch (_) {
    /* retry */
  }
  if (Date.now() - startWait > waitMs) {
    console.warn("[dev-full] Nema .dev-frontend-origin na vrijeme — pokrećem API (pokreni Vite prije registracije ako link u mailu krene krivo).");
    startBackend();
    return;
  }
  setTimeout(waitForViteOriginThenStartApi, 120);
}

waitForViteOriginThenStartApi();

function killTree(child) {
  if (!child || child.killed) return;
  try {
    if (isWin) {
      spawn("taskkill", ["/pid", String(child.pid), "/f", "/t"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  } catch (_) {
    try {
      child.kill();
    } catch (_) {}
  }
}

function shutdown() {
  killTree(frontend);
  killTree(backend);
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", shutdown);

frontend.on("exit", (code, signal) => {
  if (signal) return;
  if (code !== 0) {
    shutdown();
    process.exit(code ?? 1);
  }
});
