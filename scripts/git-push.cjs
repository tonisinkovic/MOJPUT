const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const repoRoot = path.join(__dirname, "..");
const output = [];

function run(cmd, allowFail) {
  try {
    const result = execSync(cmd, { cwd: repoRoot, encoding: "utf-8" });
    output.push(`$ ${cmd}\n${result}`);
    return result;
  } catch (e) {
    const err = `ERROR: ${e.message}\nstdout: ${e.stdout || ""}\nstderr: ${e.stderr || ""}`;
    output.push(`$ ${cmd}\n${err}`);
    if (!allowFail) throw e;
    return null;
  }
}

output.push("Repo root: " + repoRoot);
output.push("");

const COMMIT_MSG =
  process.env.GIT_COMMIT_MSG ||
  "feat: kalkulator doma, podaci o domovima, server i UI";

try {
  output.push("=== DROP SQLITE SIDECARS FROM INDEX (if tracked) ===");
  run("git rm --cached -f data/mojput.db-shm data/mojput.db-wal", true);
  output.push("\n=== GIT STATUS ===");
  run("git status");
  output.push("\n=== GIT ADD ===");
  run("git add -A");
  output.push("\n=== GIT STATUS AFTER ADD ===");
  run("git status");
  output.push("\n=== GIT COMMIT ===");
  run(`git commit -m ${JSON.stringify(COMMIT_MSG)}`, true);
  output.push("\n=== GIT PUSH ===");
  run("git push origin main");
  output.push("\n=== DONE ===");
} catch (e) {
  output.push("\n=== FAILED: " + e.message + " ===");
}

const outPath = path.join(repoRoot, "git-output.txt");
fs.writeFileSync(outPath, output.join("\n"), "utf-8");
