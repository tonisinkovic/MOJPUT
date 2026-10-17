import { describe, expect, it } from "vitest";
import { escapeHtml, formatChatMessage, normalizeChatSource } from "./chatFormat";

describe("formatChatMessage", () => {
  it("pretvara osnovni markdown", () => {
    expect(formatChatMessage("**FER** i *PMF*\n`kod`")).toBe(
      '<strong>FER</strong> i <em>PMF</em><br><code class="chat-code">kod</code>',
    );
  });

  it("ne propušta HTML iz odgovora", () => {
    const out = formatChatMessage('<img src=x onerror="alert(1)"> **ok**');
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(out).toContain("<strong>ok</strong>");
  });

  it("escapea i unutar markdowna", () => {
    expect(formatChatMessage("**<script>**")).toBe("<strong>&lt;script&gt;</strong>");
  });

  it("escapeHtml pokriva navodnike i ampersand", () => {
    expect(escapeHtml(`a & "b" 'c'`)).toBe("a &amp; &quot;b&quot; &#39;c&#39;");
  });
});

describe("normalizeChatSource", () => {
  it("prihvaća samo poznate izvore", () => {
    expect(normalizeChatSource("openai")).toBe("openai");
    expect(normalizeChatSource("local")).toBe("local");
    expect(normalizeChatSource("gpt")).toBeUndefined();
    expect(normalizeChatSource(undefined)).toBeUndefined();
  });
});
