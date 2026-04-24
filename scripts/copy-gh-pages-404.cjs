/**
 * Deep linkovi (npr. /verify?… na statičkom hostu) — 404.html = index.html (SPA).
 */
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
const indexHtml = path.join(dist, "index.html");
const notFoundHtml = path.join(dist, "404.html");

if (!fs.existsSync(indexHtml)) {
  console.warn("[copy-gh-pages-404] dist/index.html ne postoji — preskačem.");
  process.exit(0);
}
fs.copyFileSync(indexHtml, notFoundHtml);
console.log("[copy-gh-pages-404] dist/404.html <- index.html");
