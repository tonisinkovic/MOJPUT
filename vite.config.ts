import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), injectDeployMetaPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
