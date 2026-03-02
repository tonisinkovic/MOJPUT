import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SYSTEM_PROMPT = `Ti si MojPut AI asistent koji pomaže maturantima u odabiru fakulteta i karijere. Odgovaraj uvijek na hrvatskom jeziku.
Budi koristan, prijateljski i pružaj jasne informacije o fakultetima, studijskim programima, prijemnim ispitima i karijernim mogućnostima u Hrvatskoj.`;

const SUGGESTIONS = [
  "Koji su najbolji fakulteti za informatiku u Hrvatskoj?",
  "Kako se pripremiti za maturu iz matematike?",
  "Koje su karijerne mogućnosti nakon studija ekonomije?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isLoading]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "24px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>')
      .replace(/\n/g, "<br>");
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const userMsg: Message = { role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);

    const conversationHistory = [...messages, userMsg].map((m) => ({
      role: m.role === "user" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error("API ključ nije konfiguriran. Dodajte VITE_ANTHROPIC_API_KEY u .env.");
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      let fullText = "";

      if (data.content) {
        fullText = data.content
          .filter((b: { type: string }) => b.type === "text")
          .map((b: { text: string }) => b.text)
          .join("\n");
      }

      if (!fullText && data.error) {
        fullText = `Greška: ${data.error.message}`;
      }

      if (fullText) {
        setMessages((m) => [...m, { role: "assistant", content: fullText }]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Došlo je do greške. Pokušajte ponovo.";
      setMessages((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout>
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI ChatBot</h1>
          <p className="text-muted-foreground text-lg">
            Razgovaraj s umjetnom inteligencijom o odabiru fakulteta, karijere i
            svemu što te zanima u vezi mature i studija.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chat-container max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">MojPut AI Asistent</h2>
              <p className="chat-status">
                <span className="chat-status-dot" />
                Online · pretraživanje weba
              </p>
            </div>
            <div className="chat-badge">🌐 WEB SEARCH</div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <Sparkles className="w-10 h-10 text-primary opacity-70 mb-2" />
                <h3 className="font-semibold text-foreground">Što te zanima?</h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  Postavljam pitanja na internetu u stvarnom vremenu i donosim ti
                  najsvježije informacije o fakultetima i studijima.
                </p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="chat-sug-btn"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.role}`}
                style={{ animation: "chatFadeUp 0.3s ease" }}
              >
                <div className="chat-msg-avatar">
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <span className="text-sm">👤</span>
                  )}
                </div>
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.role === "assistant" ? (
                    <>
                      <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      <div className="chat-source-tag">🌐 Temelji se na podacima s weba</div>
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message assistant chat-typing" style={{ animation: "chatFadeUp 0.3s ease" }}>
                <div className="chat-msg-avatar">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="chat-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Postavi pitanje…"
                rows={1}
                className="chat-textarea"
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="chat-send-btn shrink-0"
                onClick={() => sendMessage()}
                disabled={isLoading}
                title="Pošalji"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="chat-footer-hint">Enter za slanje · Shift+Enter novi red</p>
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes chatFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes chatPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          height: min(680px, 75vh);
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.5);
          backdrop-filter: blur(10px);
        }

        .chat-avatar {
          width: 40px; height: 40px;
          border-radius: 0.75rem;
          background: var(--hero-gradient);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .chat-status {
          font-size: 0.6875rem;
          color: hsl(var(--primary));
          display: flex; align-items: center; gap: 0.375rem;
          margin-top: 2px;
        }

        .chat-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          animation: chatPulse 2s ease-in-out infinite;
        }

        .chat-badge {
          margin-left: auto;
          font-size: 0.625rem;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          border: 1px solid hsl(var(--primary) / 0.25);
          padding: 4px 10px;
          border-radius: 1.25rem;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          scroll-behavior: smooth;
        }

        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }

        .chat-message {
          display: flex;
          gap: 0.75rem;
        }

        .chat-message.user { flex-direction: row-reverse; }

        .chat-msg-avatar {
          width: 34px; height: 34px;
          border-radius: 0.625rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .chat-message.assistant .chat-msg-avatar {
          background: hsl(var(--primary) / 0.15);
          border: 1px solid hsl(var(--border));
        }

        .chat-message.user .chat-msg-avatar {
          background: var(--hero-gradient);
        }

        .chat-bubble {
          max-width: 75%;
          padding: 0.875rem 1.125rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.65;
        }

        .chat-message.assistant .chat-bubble {
          background: hsl(var(--muted) / 0.6);
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          color: hsl(var(--foreground));
        }

        .chat-message.user .chat-bubble {
          background: linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.08));
          border: 1px solid hsl(var(--primary) / 0.3);
          border-radius: 1rem 4px 1rem 1rem;
          color: hsl(var(--foreground));
        }

        .chat-code {
          background: hsl(var(--primary) / 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .chat-source-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.625rem;
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.08);
          border: 1px solid hsl(var(--primary) / 0.2);
          padding: 3px 8px;
          border-radius: 0.375rem;
          margin-top: 0.5rem;
        }

        .chat-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-align: center;
          padding: 2rem;
        }

        .chat-suggestions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          width: 100%;
          max-width: 340px;
        }

        .chat-sug-btn {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 0.625rem;
          padding: 0.625rem 0.875rem;
          color: hsl(var(--foreground));
          font-size: 0.75rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          line-height: 1.4;
          font-family: inherit;
        }

        .chat-sug-btn:hover {
          border-color: hsl(var(--primary) / 0.5);
          background: hsl(var(--primary) / 0.08);
        }

        .chat-typing-dots {
          background: hsl(var(--muted) / 0.6);
          border: 1px solid hsl(var(--border));
          border-radius: 4px 1rem 1rem 1rem;
          padding: 0.875rem 1.125rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .chat-typing-dots span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: hsl(var(--primary));
          animation: chatBounce 1.2s ease-in-out infinite;
        }

        .chat-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        .chat-input-area {
          padding: 1rem 1.25rem;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.4);
          backdrop-filter: blur(10px);
        }

        .chat-input-row {
          display: flex;
          gap: 0.625rem;
          align-items: flex-end;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.875rem;
          padding: 0.625rem 0.875rem;
          transition: border-color 0.2s;
        }

        .chat-input-row:focus-within {
          border-color: hsl(var(--primary) / 0.5);
          outline: none;
        }

        .chat-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          line-height: 1.5;
          resize: none;
          max-height: 120px;
          min-height: 24px;
          font-family: inherit;
        }

        .chat-textarea::placeholder {
          color: hsl(var(--muted-foreground));
        }

        .chat-send-btn {
          width: 36px; height: 36px;
          border-radius: 0.625rem;
          background: var(--hero-gradient) !important;
          border: none !important;
          color: white !important;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          filter: brightness(1.05);
        }

        .chat-footer-hint {
          font-size: 0.625rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
          margin-top: 0.5rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </Layout>
  );
};

export default Chatbot;
