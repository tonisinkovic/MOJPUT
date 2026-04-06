import { execSync } from "node:child_process";
import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/MOJPUT/",
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
  plugins: [
    react(),
    injectDeployMetaPlugin(),
    mode === "development" && writeDevFrontendOriginPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
