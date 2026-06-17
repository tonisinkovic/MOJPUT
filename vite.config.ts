import { execSync } from "node:child_process";
import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { componentTagger } from "lovable-tagger";

/**
 * Zapisuje http://127.0.0.1:PORT u korijen projekta — server.cjs čita za link na stranicu potvrde u mailu
 * (stvarni port kad su 8080–8082 zauzeti).
 */
function writeDevFrontendOriginPlugin(): Plugin {
  const file = path.join(__dirname, ".dev-frontend-origin");
  return {
    name: "write-dev-frontend-origin",
    apply: "serve",
    configureServer(server) {
      const httpServer = server.httpServer;
      if (!httpServer) return;
      httpServer.once("listening", () => {
        const addr = httpServer.address();
        if (!addr || typeof addr === "string") return;
        let host = addr.address;
        if (host === "::" || host === "0.0.0.0") host = "127.0.0.1";
        else if (host === "::1") host = "127.0.0.1";
        const origin = `http://${host}:${addr.port}`;
        try {
          fs.writeFileSync(file, `${origin}\n`, "utf8");
        } catch (err) {
          console.warn("[vite] could not write .dev-frontend-origin:", err);
        }
      });
    },
  };
}

/** Kratki SHA za HTML meta — na GitHub Actions postoji GITHUB_SHA. */
function shortGitSha(): string {
  const gh = process.env.GITHUB_SHA;
  if (gh && gh.length >= 7) return gh.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "dev";
  }
}

/** Meta oznaka deploya + blagi no-cache na shell (pomaže kad preglednik zadrži stari index.html). */
function injectDeployMetaPlugin() {
  return {
    name: "inject-deploy-meta",
    enforce: "post" as const,
    transformIndexHtml(html: string) {
      const rev = shortGitSha();
      return html.replace(
        "</head>",
        `    <meta name="deploy-revision" content="${rev}" />\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <!-- MojPut deploy ${rev} -->\n  </head>`,
      );
    },
  };
}

/**
 * mojput.com: korijen (`/`) iz `.env.production`. GitHub Pages CI postavlja `VITE_BASE_PATH=/MOJPUT/` u workflowu.
 */
function readViteBasePathFromProductionFile(root: string): string | undefined {
  const fp = path.join(root, ".env.production");
  if (!fs.existsSync(fp)) return undefined;
  for (const line of fs.readFileSync(fp, "utf8").split(/\r?\n/)) {
    const m = /^\s*VITE_BASE_PATH\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[1].replace(/\s+#.*$/, "").trim();
    if (!v || v.startsWith("#")) continue;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    return v.trim() || "/";
  }
  return undefined;
}

function publicBasePath(mode: string, root: string): string {
  const normalize = (raw: string) => {
    const t = raw.trim();
    if (!t || t === "/") return "/";
    return t.endsWith("/") ? t : `${t}/`;
  };

  // CI (npr. GitHub Pages) može eksplicitno postaviti VITE_BASE_PATH=/MOJPUT/
  const fromEnv = String(process.env.VITE_BASE_PATH ?? "").trim();
  if (fromEnv) return normalize(fromEnv);

  if (mode === "production") {
    const fromFile = readViteBasePathFromProductionFile(root);
    if (fromFile !== undefined) return normalize(fromFile);
  }
  return "/";
}

/** Workbox SPA fallback — usklađeno s `base` (npr. `/index.html` ili `/{segment}/index.html`). */
function spaNavigateFallback(base: string): string {
  if (base === "/") return "/index.html";
  return `${base.replace(/\/$/, "")}/index.html`;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = publicBasePath(mode, process.cwd());

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
        },
      },
    },
    /** Isto kao dev — `vite preview` inače vraća HTML 404 za /api/* umjesto JSON-a s node servera. */
    preview: {
      port: 4173,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        includeAssets: ["mojput-logo.png", "favicon.ico", "robots.txt"],
        manifest: {
          name: "MojPut",
          short_name: "MojPut",
          description: "Karijerni usmjerivač — alati za školu, fakultet i karijeru.",
          theme_color: "#1f9b8e",
          background_color: "#f4f8fb",
          display: "standalone",
          display_override: ["standalone", "browser"],
          orientation: "any",
          scope: base,
          start_url: base,
          lang: "hr",
          categories: ["education", "productivity"],
          icons: [
            {
              src: "mojput-logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "mojput-logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "mojput-logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,woff,ttf,webp}"],
          globIgnores: ["**/*.pdf"],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: spaNavigateFallback(base),
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets",
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts",
                expiration: {
                  maxEntries: 24,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
      injectDeployMetaPlugin(),
      mode === "development" && writeDevFrontendOriginPlugin(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
