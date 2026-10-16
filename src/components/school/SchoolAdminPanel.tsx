import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredAuthToken } from "@/lib/api";
import {
  adminCredentialsCsvUrl,
  adminCredentialsHtmlUrl,
  deleteAdminSchoolPost,
  fetchAdminSchoolMessages,
  fetchAdminSchoolPosts,
  fetchAdminSchools,
  type SchoolAdminMessage,
  moderateAdminSchoolPost,
  patchAdminSchool,
  resetAdminSchoolAccess,
  type AdminSchoolRow,
  type SchoolPost,
} from "@/lib/schoolCmsApi";

export default function SchoolAdminPanel() {
  const [q, setQ] = useState("");
  const [schools, setSchools] = useState<AdminSchoolRow[]>([]);
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [messages, setMessages] = useState<SchoolAdminMessage[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resetRow, setResetRow] = useState<{ name: string; username: string; password: string } | null>(null);

  const load = async () => {
    const [s, p, m] = await Promise.all([fetchAdminSchools(q), fetchAdminSchoolPosts(), fetchAdminSchoolMessages()]);
    if (!s.success) setError(s.message || "Nema pristupa školama.");
    else setSchools(s.data || []);
    if (p.success) setPosts(p.data || []);
    if (m.success) setMessages(m.data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = getStoredAuthToken();

  const downloadWithAuth = async (url: string, filename: string) => {
    const res = await fetch(url, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      setError("Početne lozinke više nisu dostupne. Koristi reset pristupa za pojedinu školu.");
      return;
    }
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="mt-12 space-y-8 border-t pt-8">
      <div>
        <h2 className="text-xl font-bold">Srednje škole — računi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pregled računa, deaktivacija, reset pristupa i moderacija objava.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraži školu, grad, username..."
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => void load()}>
            Traži
          </Button>
          <Button variant="outline" onClick={() => void downloadWithAuth(adminCredentialsCsvUrl(), "mojput-skole.csv")}>
            CSV početnih lozinki
          </Button>
          <Button
            variant="outline"
            onClick={() => void downloadWithAuth(adminCredentialsHtmlUrl(), "mojput-skole-pristup.html")}
          >
            HTML za ispis/PDF
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {info && <p className="mt-2 text-sm text-primary">{info}</p>}
        {resetRow && (
          <div className="mt-3 rounded-xl border bg-amber-50 p-4 text-sm dark:bg-amber-950/40">
            Nova lozinka za {resetRow.name}: <code className="font-semibold">{resetRow.username}</code> /{" "}
            <code className="font-semibold">{resetRow.password}</code>
            <p className="mt-1 text-xs text-muted-foreground">Pokaži ovo školi jednom. Nakon osvježavanja stranice više nije vidljivo.</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <h3 className="font-semibold">Poruke škola</h3>
        <p className="mt-1 text-sm text-muted-foreground">Škole javljaju pogreške koje same ne mogu ispraviti.</p>
        {messages.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nema novih poruka.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {messages.map((item) => (
              <li key={item.id} className="rounded-xl border px-3 py-2 text-sm">
                <p className="font-medium">
                  <Link to={`/srednje-skole/${item.slug}`} className="hover:underline">
                    {item.schoolName}
                  </Link>
                  {item.city ? <span className="font-normal text-muted-foreground"> · {item.city}</span> : null}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{item.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Škola</th>
              <th className="px-3 py-2">Username</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Zadnja prijava</th>
              <th className="px-3 py-2">Objave</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {schools.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">
                  <Link to={`/srednje-skole/${row.slug}`} className="font-medium hover:underline">
                    {row.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{row.city}</p>
                </td>
                <td className="px-3 py-2">
                  {row.username}
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </td>
                <td className="px-3 py-2">{row.isActive ? "aktivan" : "deaktiviran"}</td>
                <td className="px-3 py-2 text-xs">{row.lastLoginAt || "—"}</td>
                <td className="px-3 py-2">{row.postCount}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void patchAdminSchool(row.id, { isActive: !row.isActive }).then(() => {
                          setInfo(row.isActive ? "Račun je deaktiviran." : "Račun je aktiviran.");
                          load();
                        })
                      }
                    >
                      {row.isActive ? "Deaktiviraj" : "Aktiviraj"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void resetAdminSchoolAccess(row.id).then((res) => {
                          if (!res.success || !res.data) {
                            setError(res.message || "Reset nije uspio.");
                            return;
                          }
                          setResetRow({ name: row.name, username: res.data.username, password: res.data.password });
                        })
                      }
                    >
                      Reset pristupa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Moderacija objava</h3>
        <div className="mt-3 space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nema objava za pregled.</p>
          ) : (
            posts.slice(0, 40).map((post) => (
              <article key={post.id} className="rounded-xl border bg-card p-4 text-sm">
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  {post.schoolName} · {post.status}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => void moderateAdminSchoolPost(post.id, "HIDDEN").then(load)}>
                    Sakrij
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void moderateAdminSchoolPost(post.id, "PUBLISHED").then(load)}>
                    Objavi
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => void deleteAdminSchoolPost(post.id).then(load)}>
                    Obriši
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
