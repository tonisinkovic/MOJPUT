import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Send,
  Lock,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { authLogin, authLogout, authMe, authRegister, type AuthUser } from "@/lib/auth";

type ForumMessage = {
  id: number;
  userId: number;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
};

type ForumConversation = {
  id: number;
  title: string;
  description: string;
  creator: string;
  creatorId: number;
  createdAt: Date;
  participants: number[];
  messages: ForumMessage[];
};

const Forum = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [conversations, setConversations] = useState<ForumConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState<ForumConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConvTitle, setNewConvTitle] = useState("");
  const [newConvDescription, setNewConvDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      if (res.success) {
        const user = (res as any).user ?? (res as any).data?.user ?? null;
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadConversations = async () => {
    setLoadingConversations(true);
    const res = await apiGet<{ data: any[] }>("/api/forum/conversations");
    if (res.success) {
      const rows = (res as any).data ?? (res as any).data?.data ?? (res as any).data;
      const list = (rows?.data ?? rows ?? []) as any[];
      setConversations(
        list.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description || "",
          creator: c.creator_username || "",
          creatorId: -1,
          createdAt: new Date(c.created_at),
          participants: [],
          messages: [],
        })),
      );
    }
    setLoadingConversations(false);
  };

  const loadMessages = async (conversationId: number) => {
    setLoadingMessages(true);
    const res = await apiGet<{ data: any[] }>(`/api/forum/conversations/${conversationId}/messages`);
    if (res.success) {
      const rows = (res as any).data ?? (res as any).data?.data ?? (res as any).data;
      const list = (rows?.data ?? rows ?? []) as any[];
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: list.map((m) => ({
                  id: m.id,
                  userId: m.user_id,
                  username: m.username,
                  text: m.text,
                  timestamp: new Date(m.created_at),
                  likes: 0,
                })),
              }
            : c,
        ),
      );
      setSelectedConversation((prev) => {
        if (!prev || prev.id !== conversationId) return prev;
        return {
          ...prev,
          messages: list.map((m) => ({
            id: m.id,
            userId: m.user_id,
            username: m.username,
            text: m.text,
            timestamp: new Date(m.created_at),
            likes: 0,
          })),
        };
      });
    }
    setLoadingMessages(false);
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversation?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (authMode === "login") {
      // Login is by email + password (real auth)
      const res = await authLogin({ email: authForm.username.trim(), password: authForm.password });
      if (!res.success) {
        setAuthError(res.message);
        return;
      }
      const user = (res as any).user ?? (res as any).data?.user ?? null;
      setCurrentUser(user);
      setIsAuthenticated(true);
      setAuthForm({ username: "", email: "", password: "", confirmPassword: "" });
    } else {
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError("Lozinke se ne poklapaju!");
        return;
      }
      const res = await authRegister({
        username: authForm.username.trim(),
        email: authForm.email.trim(),
        password: authForm.password,
      });
      if (!res.success) {
        setAuthError(res.message);
        return;
      }
      // After registration we REQUIRE email verification. Do not log in automatically.
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthError("Registracija uspješna. Provjeri email i potvrdi račun pa se zatim prijavi.");
      setAuthForm({ username: "", email: "", password: "", confirmPassword: "" });
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedConversation(null);
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!newConvTitle.trim()) {
      alert("Unesi naziv razgovora!");
      return;
    }

    const res = await apiPost<any>("/api/forum/conversations", {
      title: newConvTitle.trim(),
      description: newConvDescription.trim(),
    });
    if (!res.success) {
      alert(res.message);
      return;
    }
    const c = (res as any).data ?? (res as any).data?.data ?? (res as any).data;
    const convRow = c?.data ?? c;
    const newConversation: ForumConversation = {
      id: convRow.id,
      title: convRow.title,
      description: convRow.description || "",
      creator: convRow.creator_username || currentUser.username,
      creatorId: currentUser.id,
      createdAt: new Date(convRow.created_at),
      participants: [],
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setNewConvTitle("");
    setNewConvDescription("");
    setShowNewConversationModal(false);
    setSelectedConversation(newConversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedConversation) return;
    if (!messageInput.trim()) return;

    const res = await apiPost<any>(`/api/forum/conversations/${selectedConversation.id}/messages`, {
      text: messageInput.trim(),
    });
    if (!res.success) {
      alert(res.message);
      return;
    }
    const payload = (res as any).data ?? (res as any).data?.data ?? (res as any).data;
    const msgRow = payload?.data ?? payload;
    const newMessage: ForumMessage = {
      id: msgRow.id,
      userId: msgRow.user_id,
      username: msgRow.username,
      text: msgRow.text,
      timestamp: new Date(msgRow.created_at),
      likes: 0,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv,
      ),
    );
    setSelectedConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev,
    );
    setMessageInput("");
  };

  const handleLikeMessage = (messageId: number) => {
    if (!selectedConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        const updatedMessages = conv.messages.map((msg) =>
          msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg,
        );
        const updatedConv: ForumConversation = { ...conv, messages: updatedMessages };
        setSelectedConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    });

    setConversations(updatedConversations);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <section className="container py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Forum</span> za učenike
          </h1>
          <p className="text-muted-foreground text-lg">
            Razmijeni iskustva i postavi pitanja o maturi, fakultetima i studentskom životu.
          </p>
        </motion.div>

        {/* Ako korisnik nije prijavljen – prikaz forme za prijavu/registraciju u sklopu stranice */}
        {!isAuthenticated ? (
          <div className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-8">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-1">Prijavi se</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Prijavi se ili kreiraj račun kako bi sudjelovao u raspravama.
              </p>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthForm({ username: "", email: "", password: "", confirmPassword: "" });
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    authMode === "login"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Prijava
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthForm({ username: "", email: "", password: "", confirmPassword: "" });
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    authMode === "register"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Registracija
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {authMode === "login" ? "Email" : "Korisničko ime"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type={authMode === "login" ? "email" : "text"}
                      value={authForm.username}
                      onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                      placeholder={authMode === "login" ? "Unesi email" : "Unesi korisničko ime"}
                      className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                    />
                  </div>
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="Unesi email"
                        className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Lozinka</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      placeholder="Unesi lozinku"
                      className="w-full pl-9 pr-9 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Potvrdi lozinku</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={authForm.confirmPassword}
                        onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                        placeholder="Ponovno unesi lozinku"
                        className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                      />
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {authMode === "login" ? "Prijavi se" : "Registriraj se"}
                </button>
              </form>

              <div className="pt-4 mt-4 border-t text-xs text-muted-foreground">
                <p className="mb-1">
                  Napomena: email nije “povezan s Gmailom” — samo se sprema u bazu kao identifikator.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Što možeš raditi na forumu?
              </h2>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Postavljati pitanja o fakultetima i upisima</li>
                <li>• Dijeliti iskustva s priprema za maturu</li>
                <li>• Razgovarati o studentskom životu i smještaju</li>
                <li>• Pomoći drugim učenicima svojim savjetima</li>
              </ul>
            </div>
          </div>
        ) : (
          // Glavni forum za prijavljenog korisnika
          <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
            <div className="flex flex-col md:flex-row h-[640px]">
              {/* Sidebar s razgovorima */}
              <div className="md:w-72 border-b md:border-b-0 md:border-r bg-muted/40 flex flex-col">
                <div className="p-4 border-b flex items-center justify-between gap-3">
                  {currentUser && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{currentUser.username}</p>
                        <p className="text-[11px] text-muted-foreground">Član foruma</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                    title="Odjava"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-3 border-b">
                  <button
                    onClick={() => setShowNewConversationModal(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs font-medium shadow hover:bg-primary/90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Novi razgovor
                  </button>
                </div>

                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Pretraži razgovore..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-md border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loadingConversations ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      Učitavam razgovore...
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-30" />
                      <p>Nema razgovora. Kreiraj prvi!</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={async () => {
                          setSelectedConversation(conv);
                          if (conv.messages.length === 0) await loadMessages(conv.id);
                        }}
                        className={`w-full text-left px-3 py-3 border-b text-xs transition-colors hover:bg-muted ${
                          selectedConversation?.id === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                        }`}
                      >
                        <p className="font-semibold truncate">{conv.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {conv.description || "Bez opisa"}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
                          <span>{conv.messages.length} poruka</span>
                          <span>{conv.participants.length} sudionika</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Glavni panel razgovora */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b flex items-start justify-between gap-3 bg-muted/40">
                      <div className="flex-1">
                        <button
                          onClick={() => setSelectedConversation(null)}
                          className="inline-flex md:hidden items-center gap-1 text-xs text-muted-foreground mb-2"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          Natrag na listu
                        </button>
                        <h2 className="text-base md:text-lg font-semibold">
                          {selectedConversation.title}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedConversation.description || "Bez opisa"}
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-muted-foreground">
                        <p>{selectedConversation.participants.length} sudionika</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {loadingMessages ? (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          Učitavam poruke...
                        </div>
                      ) : selectedConversation.messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          <div className="text-center max-w-xs">
                            <MessageCircle className="mx-auto mb-2 h-10 w-10 opacity-20" />
                            <p>Nema poruka. Budi prvi koji će započeti razgovor!</p>
                          </div>
                        </div>
                      ) : (
                        selectedConversation.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${
                              msg.userId === currentUser?.id ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base flex-shrink-0 text-white">
                              {msg.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className={`max-w-xs md:max-w-sm ${msg.userId === currentUser?.id ? "text-right" : ""}`}>
                              <div className="flex items-center gap-2 mb-0.5 text-[11px] text-muted-foreground">
                                <span className="font-medium text-foreground">{msg.username}</span>
                                <span>
                                  {msg.timestamp.toLocaleTimeString("hr-HR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div
                                className={`px-3 py-2 rounded-lg text-sm ${
                                  msg.userId === currentUser?.id
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                                }`}
                              >
                                <p className="break-words">{msg.text}</p>
                              </div>
                              <button
                                onClick={() => handleLikeMessage(msg.id)}
                                className={`mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-red-500 ${
                                  msg.userId === currentUser?.id ? "flex-row-reverse" : ""
                                }`}
                              >
                                <Heart
                                  className="h-3.5 w-3.5"
                                  fill={msg.likes > 0 ? "currentColor" : "none"}
                                />
                                {msg.likes > 0 && <span>{msg.likes}</span>}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form
                      onSubmit={handleSendMessage}
                      className="p-3 border-t bg-muted/40 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Upiši poruku..."
                        className="flex-1 px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="inline-flex items-center justify-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 hidden md:flex items-center justify-center text-center text-sm text-muted-foreground">
                    <div>
                      <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-30" />
                      <p className="font-medium mb-1">Odaberi razgovor</p>
                      <p>ili kreiraj novi kako bi započeo raspravu.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal za novi razgovor */}
        {showNewConversationModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border">
              <h3 className="text-lg font-semibold mb-1">Kreiraj novi razgovor</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Postavi pitanje ili otvori temu o maturi, fakultetima ili studentskom životu.
              </p>
              <form onSubmit={handleCreateConversation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Naziv</label>
                  <input
                    type="text"
                    value={newConvTitle}
                    onChange={(e) => setNewConvTitle(e.target.value)}
                    placeholder="Koji fakultet za IT karijeru?"
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Opis (opcionalno)</label>
                  <textarea
                    value={newConvDescription}
                    onChange={(e) => setNewConvDescription(e.target.value)}
                    placeholder="Ukratko opiši o čemu želiš razgovarati..."
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                  >
                    Kreiraj
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewConversationModal(false);
                      setNewConvTitle("");
                      setNewConvDescription("");
                    }}
                    className="flex-1 py-2 rounded-lg bg-muted text-sm font-semibold hover:bg-muted/80"
                  >
                    Odustani
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Forum;
