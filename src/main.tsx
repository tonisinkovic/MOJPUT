import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { registerSW } from "virtual:pwa-register";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

const rootEl = document.getElementById("root");

function showBootError(err: unknown) {
  console.error(err);
  if (!rootEl || rootEl.childElementCount > 0) return;
  rootEl.innerHTML = `
    <main style="min-height:100dvh;display:grid;place-items:center;padding:24px;font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a">
      <div style="max-width:28rem;text-align:center">
        <p style="margin:0;font-size:1.25rem;font-weight:700">MojPut se nije učitao</p>
        <p style="margin:10px 0 0;color:#64748b">Osvježi stranicu (Ctrl+Shift+R). Ako ostane prazno, javi nam.</p>
      </div>
    </main>
  `;
}

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
  onRegisteredSW(_url, registration) {
    void registration?.update();
  },
});
initAnalytics();

void import("./App.tsx")
  .then(({ default: App }) => {
    if (!rootEl) throw new Error("Nedostaje #root");
    createRoot(rootEl).render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>,
    );
  })
  .catch(showBootError);
