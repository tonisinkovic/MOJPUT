export type ChatReplySource = "openai" | "local";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** Minimalni markdown (podebljano, kurziv, kod, novi red) → HTML. Ulaz se prvo escapea. */
export function formatChatMessage(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>')
    .replace(/\n/g, "<br>");
}

export function normalizeChatSource(value: unknown): ChatReplySource | undefined {
  return value === "openai" || value === "local" ? value : undefined;
}
