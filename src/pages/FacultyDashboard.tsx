import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, ImagePlus, LayoutDashboard, Newspaper, Settings, UserRound, Video } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addFacultyMedia,
  createFacultyPost,
  deleteFacultyPost,
  getFacultyById,
  getFacultyPosts,
  getFacultySession,
  logoutFaculty,
  updateFacultyProfile,
  updateFacultyPost,
  deleteFacultyMedia,
} from "@/lib/facultyStore";

const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Upload nije uspio."));
    reader.readAsDataURL(file);
  });

const FacultyDashboard = () => {
  const session = getFacultySession();
  const [refreshKey, setRefreshKey] = useState(0);
  const faculty = useMemo(
    () => (session ? getFacultyById(session.facultyId) : null),
    [session, refreshKey],
  );
  const [posts, setPosts] = useState(() => (session ? getFacultyPosts(session.facultyId) : []));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: faculty?.name || "",
    city: faculty?.city || "",
    area: faculty?.area || "",
    description: faculty?.description || "",
    longDescription: faculty?.longDescription || "",
    logoUrl: faculty?.logoUrl || "",
    coverImageUrl: faculty?.coverImageUrl || "",
    websiteUrl: faculty?.websiteUrl || "",
  });
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaVideoUrl, setMediaVideoUrl] = useState("");

  const setSaved = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 1800);
  };

  if (!session) {
    return <Navigate to="/fakulteti/prijava" replace />;
  }

  const refreshPosts = () => {
    setPosts(getFacultyPosts(session.facultyId));
    setRefreshKey((prev) => prev + 1);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPostImage("");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateFacultyPost(editingId, session.facultyId, title, content, postImage);
    } else {
      createFacultyPost(session.facultyId, title, content, postImage);
    }
    refreshPosts();
    resetForm();
    setSaved("Objava je uspješno spremljena.");
  };

  const handleEdit = (postId: string) => {
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setPostImage(post.imageUrl || "");
  };

  const handleDelete = (postId: string) => {
    deleteFacultyPost(postId, session.facultyId);
    refreshPosts();
    if (editingId === postId) resetForm();
    setSaved("Objava je obrisana.");
  };

  const handleLogout = () => {
    logoutFaculty();
    window.location.assign("#/fakulteti/prijava");
  };

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    updateFacultyProfile(session.facultyId, {
      name: profileForm.name,
      city: profileForm.city,
      area: profileForm.area,
      description: profileForm.description,
      longDescription: profileForm.longDescription,
      logoUrl: profileForm.logoUrl,
      coverImageUrl: profileForm.coverImageUrl,
      websiteUrl: profileForm.websiteUrl,
    });
    setLoading(false);
    setRefreshKey((prev) => prev + 1);
    setSaved("Profil je uspješno spremljen.");
  };

  const uploadProfileImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "logoUrl" | "coverImageUrl",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await toDataUrl(file);
    setProfileForm((prev) => ({ ...prev, [key]: dataUrl }));
  };

  const uploadPostImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await toDataUrl(file);
    setPostImage(dataUrl);
  };

  const uploadMediaImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await toDataUrl(file);
    addFacultyMedia(session.facultyId, {
      id: `m-${Date.now()}`,
      type: "image",
      url: dataUrl,
      title: mediaTitle || "Nova slika",
    });
    setMediaTitle("");
    setRefreshKey((prev) => prev + 1);
    setSaved("Slika je dodana u medije.");
  };

  const addVideo = () => {
    if (!mediaVideoUrl.trim()) return;
    const isYoutube = /youtube\.com|youtu\.be/.test(mediaVideoUrl);
    const embedUrl = isYoutube
      ? mediaVideoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
      : mediaVideoUrl;
    addFacultyMedia(session.facultyId, {
      id: `m-${Date.now()}`,
      type: "video",
      url: embedUrl,
      title: mediaTitle || "Novi video",
      thumbnailUrl: "https://placehold.co/900x600?text=Video",
    });
    setMediaTitle("");
    setMediaVideoUrl("");
    setRefreshKey((prev) => prev + 1);
    setSaved("Video je dodan u medije.");
  };

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard fakulteta</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Prijavljen fakultet: <span className="font-medium text-foreground">{faculty?.name ?? "Nepoznato"}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Odjava
          </Button>
        </div>
        {success && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        <Tabs defaultValue="profil" className="space-y-6">
          <TabsList className="h-auto flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="profil" className="rounded-xl border data-[state=active]:border-primary/30">
              <UserRound className="w-4 h-4 mr-2" /> Profil
            </TabsTrigger>
            <TabsTrigger value="objave" className="rounded-xl border data-[state=active]:border-primary/30">
              <Newspaper className="w-4 h-4 mr-2" /> Objave
            </TabsTrigger>
            <TabsTrigger value="mediji" className="rounded-xl border data-[state=active]:border-primary/30">
              <ImagePlus className="w-4 h-4 mr-2" /> Mediji
            </TabsTrigger>
            <TabsTrigger value="postavke" className="rounded-xl border data-[state=active]:border-primary/30">
              <Settings className="w-4 h-4 mr-2" /> Postavke
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profil">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold">Uredi profil</h2>
                <form className="mt-4 space-y-4" onSubmit={handleProfileSave}>
                  <Input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Naziv fakulteta" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input value={profileForm.city} onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))} placeholder="Grad" />
                    <Input value={profileForm.area} onChange={(e) => setProfileForm((p) => ({ ...p, area: e.target.value }))} placeholder="Područje" />
                  </div>
                  <Textarea value={profileForm.description} onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))} placeholder="Kratki opis" />
                  <Textarea value={profileForm.longDescription} onChange={(e) => setProfileForm((p) => ({ ...p, longDescription: e.target.value }))} placeholder="Detaljniji opis" className="min-h-28" />
                  <Input value={profileForm.websiteUrl} onChange={(e) => setProfileForm((p) => ({ ...p, websiteUrl: e.target.value }))} placeholder="https://web-stranica.hr" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Logo</p>
                    <input type="file" accept="image/*" onChange={(e) => uploadProfileImage(e, "logoUrl")} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Cover slika</p>
                    <input type="file" accept="image/*" onChange={(e) => uploadProfileImage(e, "coverImageUrl")} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? "Spremanje..." : "Spremi profil"}</Button>
                </form>
              </article>

              <article className="rounded-2xl border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold mb-4">Live preview</h2>
                <div className="rounded-2xl overflow-hidden border">
                  <img src={profileForm.coverImageUrl || "https://placehold.co/1200x320?text=Cover"} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <div className="-mt-12">
                      <img src={profileForm.logoUrl || "https://placehold.co/120x120?text=Logo"} className="w-16 h-16 rounded-xl border-4 border-background object-cover" />
                    </div>
                    <h3 className="mt-3 font-semibold text-lg">{profileForm.name || "Naziv fakulteta"}</h3>
                    <p className="text-sm text-muted-foreground">{profileForm.city || "Grad"} • {profileForm.area || "Područje"}</p>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-4">{profileForm.description || "Opis fakulteta..."}</p>
                  </div>
                </div>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="objave">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <article className="rounded-2xl border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold">{editingId ? "Uredi objavu" : "Nova objava"}</h2>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Naslov objave" />
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Sadržaj objave" className="min-h-36" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Slika objave (opcionalno)</p>
                    <input type="file" accept="image/*" onChange={uploadPostImage} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit">{editingId ? "Spremi promjene" : "Objavi"}</Button>
                    {editingId && <Button type="button" variant="outline" onClick={resetForm}>Odustani</Button>}
                  </div>
                </form>
              </article>
              <article className="rounded-2xl border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold">Lista objava</h2>
                <div className="mt-4 space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="rounded-xl border p-4">
                      {post.imageUrl && <img src={post.imageUrl} className="w-full h-32 object-cover rounded-lg mb-3" />}
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(post.createdAt).toLocaleDateString("hr-HR")}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post.id)}>Uredi</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>Obriši</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="mediji">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <article className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
                <h2 className="text-lg font-semibold">Media library</h2>
                <Input value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} placeholder="Naslov medija" />
                <div>
                  <p className="text-sm font-medium mb-2">Upload slike</p>
                  <input type="file" accept="image/*" onChange={uploadMediaImage} />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Dodaj video (YouTube ili link)</p>
                  <Input value={mediaVideoUrl} onChange={(e) => setMediaVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                  <Button className="mt-3" onClick={addVideo}>
                    <Video className="w-4 h-4 mr-2" />
                    Dodaj video
                  </Button>
                </div>
              </article>
              <article className="rounded-2xl border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold mb-4">Galerija</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(faculty?.media || []).map((item) => (
                    <div key={item.id} className="rounded-xl border p-3">
                      <img src={item.type === "video" ? (item.thumbnailUrl || "https://placehold.co/600x360?text=Video") : item.url} className="w-full h-28 object-cover rounded-lg" />
                      <p className="text-sm font-medium mt-2">{item.title}</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-2"
                        onClick={() => {
                          deleteFacultyMedia(session.facultyId, item.id);
                          setRefreshKey((prev) => prev + 1);
                          setSaved("Medij je obrisan.");
                        }}
                      >
                        Obriši
                      </Button>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="postavke">
            <article className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Postavke računa
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Prijavljeni fakultet može uređivati samo svoj sadržaj. Sve promjene se automatski prikazuju na javnom profilu.
              </p>
              <div className="mt-4">
                <Button variant="outline" onClick={handleLogout}>Odjavi se</Button>
              </div>
            </article>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default FacultyDashboard;
