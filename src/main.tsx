import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>,
);
