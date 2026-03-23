import Layout from "@/components/Layout";
import { forumSeed } from "@/data/parentHub";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ParentForum = () => {
  const [topics, setTopics] = useState(forumSeed);
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const sorted = useMemo(() => {
    return [...topics].sort((a, b) =>
      sort === "popular"
        ? b.likes - a.likes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [sort, topics]);

  return (
    <Layout>
      <section className="container py-10 md:py-14">
        <h1 className="text-3xl font-bold">Forum za roditelje</h1>
        <p className="text-muted-foreground mt-2">Postavite pitanje, podijelite iskustvo i pomozite drugim roditeljima.</p>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 mt-6">
          <article className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Novo pitanje</h2>
            <div className="space-y-3 mt-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Naslov pitanja" />
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Opišite pitanje..." className="min-h-28" />
              <Button
                onClick={() => {
                  if (!title.trim() || !content.trim()) return;
                  setTopics((prev) => [
                    {
                      id: `f-${Date.now()}`,
                      title,
                      content,
                      author: "Vi",
                      createdAt: new Date().toISOString(),
                      likes: 0,
                      comments: [],
                    },
                    ...prev,
                  ]);
                  setTitle("");
                  setContent("");
                }}
              >
                Objavi pitanje
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Teme</h2>
              <select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "popular")} className="h-9 rounded-md border bg-background px-3 text-sm">
                <option value="newest">Najnovije</option>
                <option value="popular">Najpopularnije</option>
              </select>
            </div>
            <div className="space-y-3">
              {sorted.map((topic) => (
                <div key={topic.id} className="rounded-xl border p-4">
                  <h3 className="font-medium">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{topic.content}</p>
                  <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                    <span>{topic.author}</span>
                    <span>{new Date(topic.createdAt).toLocaleDateString("hr-HR")}</span>
                    <span>{topic.likes} lajkova</span>
                    <span>{topic.comments.length} odgovora</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
};

export default ParentForum;
