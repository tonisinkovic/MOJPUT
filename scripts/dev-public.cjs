/**
 * API + (čekaj port) tunnel + Vite — bez concurrently/wait-on CLI.
 */
const { spawn } = require("child_process");
const net = require("net");
const path = require("path");

const root = path.join(__dirname, "..");
const isWin = process.platform === "win32";
const PORT = Number(process.env.PORT || 3000);

function waitForPort(host, port, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function attempt() {
      const socket = net.createConnection({ host, port }, () => {
        socket.destroy();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Čekanje na ${host}:${port} je isteklo (${timeoutMs} ms).`));
          return;
        }
        setTimeout(attempt, 400);
      });
    }
    attempt();
  });
}

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

const backend = spawn(process.execPath, ["server.cjs"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

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

let tunnel = null;
waitForPort("127.0.0.1", PORT)
  .then(() => {
    tunnel = spawn(process.execPath, ["scripts/tunnel.cjs"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    tunnel.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error("[dev-public] tunnel exited with", code);
      }
    });
  })
  .catch((err) => {
    console.error("[dev-public]", err.message);
  });

function shutdown() {
  killTree(tunnel);
  killTree(frontend);
  killTree(backend);
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", shutdown);

backend.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    shutdown();
    process.exit(code ?? 1);
  }
});
frontend.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    shutdown();
    process.exit(code ?? 1);
  }
});
