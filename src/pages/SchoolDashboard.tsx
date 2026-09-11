import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ImagePlus,
  LayoutDashboard,
  Loader2,
  Lock,
  Newspaper,
  Settings,
  Trash2,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import {
  changeSchoolPassword,
  createSchoolPost,
  deleteSchoolPost,
  fetchSchoolMe,
  fetchSchoolPosts,
  patchSchoolPost,
  patchSchoolProfile,
  schoolMediaUrl,
  uploadSchoolFile,
  type SchoolMePayload,
  type SchoolPost,
  type SchoolPostStatus,
} from "@/lib/schoolCmsApi";

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: "sve", label: "Sve" },
  { id: "PUBLISHED", label: "Objavljeno" },
  { id: "DRAFT", label: "Draft" },
  { id: "ARCHIVED", label: "Arhivirano" },
  { id: "HIDDEN", label: "Skriveno" },
];

export default function SchoolDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [me, setMe] = useState<SchoolMePayload | null>(null);
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [statusFilter, setStatusFilter] = useState("sve");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [saving, setSaving] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [extraWebsite, setExtraWebsite] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("obavijest");
  const [linkUrl, setLinkUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadMe = useCallback(async () => {
    const res = await fetchSchoolMe();
    if (!res.success || !res.data) {
      setError(res.message || "Nemaš pristup školskom dijelu.");
      return;
    }
    setMe(res.data);
    setAboutText(res.data.account.aboutText || "");
    setExtraWebsite(res.data.account.extraWebsite || "");
  }, []);

  const loadPosts = useCallback(async (status: string) => {
    const res = await fetchSchoolPosts(status === "sve" ? undefined : status);
    if (res.success && Array.isArray(res.data)) setPosts(res.data);
  }, []);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
      setAuthChecked(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!authChecked || !user) return;
    loadMe();
    loadPosts(statusFilter);
  }, [authChecked, user, loadMe, loadPosts, statusFilter]);

  if (authChecked && !user) return <Navigate to="/srednje-skole/prijava" replace />;
  if (authChecked && user && user.user_type !== "skola") {
    return <Navigate to={user.is_admin ? "/tim" : "/profil"} replace />;
  }

  const mustChange = Boolean(me?.account.mustChangePassword);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await patchSchoolProfile({ aboutText, extraWebsite });
    setSaving(false);
    if (!res.success) {
      setError(res.message || "Spremanje nije uspjelo.");
      return;
    }
    setInfo("Profil je spremljen.");
    loadMe();
  };

  const handleUpload = async (kind: "logo" | "cover" | "post", file: File, postId?: number) => {
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    if (postId) form.append("postId", String(postId));
    const res = await uploadSchoolFile(form);
    if (!res.success) {
      setError(res.message || "Prijenos slike nije uspio.");
      return;
    }
    setInfo(kind === "post" ? "Fotografija je dodana." : "Slika profila je spremljena.");
    await loadMe();
    await loadPosts(statusFilter);
  };

  const savePost = async (status: SchoolPostStatus) => {
    setSaving(true);
    setError("");
    const body = { title, content, category, linkUrl, status };
    const res = editingId ? await patchSchoolPost(editingId, body) : await createSchoolPost(body);
    setSaving(false);
    if (!res.success) {
      setError(res.message || "Objava nije spremljena.");
      return;
    }
    setInfo(status === "DRAFT" ? "Draft je spremljen." : "Objava je spremljena.");
    setTitle("");
    setContent("");
    setLinkUrl("");
    setEditingId(null);
    loadMe();
    loadPosts(statusFilter);
  };

  const startEdit = (post: SchoolPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category || "obavijest");
    setLinkUrl(post.linkUrl || "");
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await changeSchoolPassword({ currentPassword, newPassword });
    setSaving(false);
    if (!res.success) {
      setError(res.message || "Promjena lozinke nije uspjela.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setInfo("Lozinka je promijenjena.");
    loadMe();
  };

  return (
    <Layout>
      <section className="container max-w-5xl py-10 md:py-14">
        <h1 className="text-2xl font-bold md:text-3xl">{me?.catalog?.name || "Dashboard škole"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Uređuješ samo podatke i objave svoje škole.
          {me?.catalog?.slug && (
            <>
              {" "}
              <Link to={`/srednje-skole/${me.catalog.slug}`} className="font-semibold text-primary hover:underline">
                Otvori javni profil
              </Link>
            </>
          )}
        </p>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        {info && <p className="mt-3 text-sm text-primary">{info}</p>}

        {mustChange && (
          <div className="mt-6 rounded-2xl border-2 border-amber-400/50 bg-amber-50 p-5 dark:bg-amber-950/30">
            <h2 className="flex items-center gap-2 font-semibold">
              <Lock className="h-4 w-4" /> Promijeni početnu lozinku
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prije rada na profilu moraš postaviti vlastitu lozinku.
            </p>
            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handlePassword}>
              <Input
                type="password"
                placeholder="Trenutna lozinka"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Nova lozinka (min. 8)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
              <Button type="submit" disabled={saving} className="sm:col-span-2">
                Spremi novu lozinku
              </Button>
            </form>
          </div>
        )}

        <Tabs defaultValue="pregled" className="mt-8 space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="pregled" className="rounded-xl border">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Početna
            </TabsTrigger>
            <TabsTrigger value="profil" className="rounded-xl border" disabled={mustChange}>
              <Settings className="mr-2 h-4 w-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="objave" className="rounded-xl border" disabled={mustChange}>
              <Newspaper className="mr-2 h-4 w-4" /> Objave
            </TabsTrigger>
            <TabsTrigger value="lozinka" className="rounded-xl border">
              <Lock className="mr-2 h-4 w-4" /> Lozinka
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pregled">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-xs uppercase text-muted-foreground">Objave</p>
                <p className="text-2xl font-bold">{me?.stats.total ?? 0}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-xs uppercase text-muted-foreground">Objavljeno</p>
                <p className="text-2xl font-bold">{me?.stats.published ?? 0}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-xs uppercase text-muted-foreground">Draftovi</p>
                <p className="text-2xl font-bold">{me?.stats.draft ?? 0}</p>
              </div>
            </div>
            <h2 className="mt-6 text-lg font-semibold">Zadnje objave</h2>
            {me?.recentPosts?.length ? (
              <ul className="mt-3 space-y-2">
                {me.recentPosts.map((p) => (
                  <li key={p.id} className="rounded-xl border bg-card px-4 py-3 text-sm">
                    <span className="font-medium">{p.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl border bg-card p-5 text-sm text-muted-foreground">
                Vaša škola još nema objava. Objavite prvu novost i predstavite aktivnosti škole učenicima.
              </p>
            )}
          </TabsContent>

          <TabsContent value="profil">
            <form className="space-y-4 rounded-2xl border bg-card p-5" onSubmit={handleProfileSave}>
              <p className="text-sm text-muted-foreground">
                Naziv, adresa i programi dolaze iz MojPut kataloga i ovdje se ne mijenjaju.
              </p>
              <Textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Kratki opis škole za učenike 8. razreda"
                className="min-h-32"
              />
              <Input
                value={extraWebsite}
                onChange={(e) => setExtraWebsite(e.target.value)}
                placeholder="https://web-skole.hr"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Logo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="mt-2 block text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload("logo", file);
                    }}
                  />
                  {me?.account.logoUrl && (
                    <img src={schoolMediaUrl(me.account.logoUrl) || ""} alt="" className="mt-2 h-16 rounded-lg object-cover" />
                  )}
                </label>
                <label className="text-sm font-medium">
                  Naslovna fotografija
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="mt-2 block text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload("cover", file);
                    }}
                  />
                </label>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Spremi profil"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="objave">
            <form
              className="space-y-3 rounded-2xl border bg-card p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void savePost("PUBLISHED");
              }}
            >
              <h2 className="font-semibold">{editingId ? "Uredi objavu" : "Nova objava"}</h2>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Naslov" required />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tekst objave"
                className="min-h-28"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="obavijest">Obavijest</option>
                  <option value="dogadaj">Događaj</option>
                  <option value="upisi">Upisi</option>
                  <option value="uspjeh">Uspjeh učenika</option>
                  <option value="ostalo">Ostalo</option>
                </select>
                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Poveznica (nije obavezno)" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving || !title.trim()}>
                  Objavi
                </Button>
                <Button type="button" variant="outline" disabled={saving || !title.trim()} onClick={() => void savePost("DRAFT")}>
                  Spremi draft
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setTitle(""); setContent(""); }}>
                    Odustani
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <Button
                  key={f.id}
                  size="sm"
                  variant={statusFilter === f.id ? "default" : "outline"}
                  onClick={() => setStatusFilter(f.id)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {posts.length === 0 ? (
                <p className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
                  Vaša škola još nema objava. Objavite prvu novost i predstavite aktivnosti škole učenicima.
                </p>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.status}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.status !== "HIDDEN" && (
                          <Button size="sm" variant="outline" onClick={() => startEdit(post)}>
                            Uredi
                          </Button>
                        )}
                        {post.status === "PUBLISHED" && (
                          <Button size="sm" variant="outline" onClick={() => void patchSchoolPost(post.id, { status: "ARCHIVED" }).then(() => loadPosts(statusFilter))}>
                            Arhiviraj
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm("Obrisati objavu?")) void deleteSchoolPost(post.id).then(() => { loadPosts(statusFilter); loadMe(); });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {post.content && <p className="mt-2 text-sm text-muted-foreground">{post.content}</p>}
                    {post.images.length === 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">Još nema fotografija.</p>
                    ) : (
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {post.images.map((img) => {
                          const src = schoolMediaUrl(img.url);
                          return src ? <img key={img.id} src={src} alt="" className="h-16 rounded-md object-cover" /> : null;
                        })}
                      </div>
                    )}
                    {post.status !== "HIDDEN" && (
                      <label className="mt-3 inline-flex items-center gap-2 text-sm">
                        <ImagePlus className="h-4 w-4" />
                        Dodaj fotografiju
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleUpload("post", file, post.id);
                          }}
                        />
                      </label>
                    )}
                  </article>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="lozinka">
            <form className="max-w-md space-y-3 rounded-2xl border bg-card p-5" onSubmit={handlePassword}>
              <Input
                type="password"
                placeholder="Trenutna lozinka"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Nova lozinka (min. 8)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
              <Button type="submit" disabled={saving}>
                Promijeni lozinku
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
}
