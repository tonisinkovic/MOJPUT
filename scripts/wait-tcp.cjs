/**
 * Čeka da TCP port bude otvoren, zatim pokreće naredbu.
 * Primjer: node scripts/wait-tcp.cjs 3000 node scripts/tunnel.cjs
 */
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

const port = Number(process.argv[2]);
const rest = process.argv.slice(3);
if (!port || rest.length === 0) {
  console.error("Uporaba: node scripts/wait-tcp.cjs <port> node <skripta.cjs> [arg ...]");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const timeoutMs = 120000;
const start = Date.now();

function runCommand() {
  const cmd = rest[0];
  const args = rest.slice(1);
  if (cmd === "node" || cmd === "node.exe") {
    const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
    child.on("exit", (c) => process.exit(c ?? 0));
    return;
  }
  const child = spawn(cmd, args, { cwd: root, stdio: "inherit", shell: true });
  child.on("exit", (c) => process.exit(c ?? 0));
}

function tryConnect() {
  const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
    socket.destroy();
    runCommand();
  });
  socket.on("error", () => {
    socket.destroy();
    if (Date.now() - start > timeoutMs) {
      console.error(`[wait-tcp] Timeout čekanja na 127.0.0.1:${port}`);
      process.exit(1);
    }
    setTimeout(tryConnect, 400);
  });
}

tryConnect();
