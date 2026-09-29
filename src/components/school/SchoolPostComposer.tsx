import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { publishSchoolPostWithImages, type SchoolPostStatus } from "@/lib/schoolCmsApi";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 6;
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

type Pending = { id: string; file: File; url: string };

type Props = {
  onPublished: () => void;
  allowDraft?: boolean;
  className?: string;
};

export default function SchoolPostComposer({ onPublished, allowDraft = false, className }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("obavijest");
  const [linkUrl, setLinkUrl] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [saving, setSaving] = useState(false);

  const pendingRef = useRef<Pending[]>([]);
  pendingRef.current = pending;

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const reset = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.url));
    setTitle("");
    setContent("");
    setCategory("obavijest");
    setLinkUrl("");
    setPending([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setError("");
    setPending((prev) => {
      const next = [...prev];
      for (const file of Array.from(list)) {
        if (next.length >= MAX_IMAGES) break;
        const type = file.type.toLowerCase();
        if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
          setError("Dopušteni formati slika: JPEG, PNG i WebP.");
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError("Svaka slika smije imati najviše 4 MB.");
          continue;
        }
        next.push({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) });
      }
      return next;
    });
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const hit = prev.find((p) => p.id === id);
      if (hit) URL.revokeObjectURL(hit.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const submit = async (status: SchoolPostStatus) => {
    if (!title.trim()) {
      setError("Unesi naslov objave.");
      return;
    }
    setSaving(true);
    setError("");
    setInfo("");
    const res = await publishSchoolPostWithImages({
      title: title.trim(),
      content: content.trim(),
      category,
      linkUrl: linkUrl.trim(),
      status,
      files: pending.map((p) => p.file),
    });
    setSaving(false);
    if (!res.success) {
      setError(res.message || "Objava nije spremljena.");
      return;
    }
    if (res.imageWarning) setError(res.imageWarning);
    else setInfo(status === "DRAFT" ? "Draft je spremljen." : "Objava je na profilu.");
    reset();
    onPublished();
  };

  return (
    <form
      className={cn("rounded-2xl border border-primary/20 bg-card p-4 shadow-card md:p-5", className)}
      onSubmit={(e) => {
        e.preventDefault();
        void submit("PUBLISHED");
      }}
    >
      <p className="text-sm font-bold tracking-tight">Nova objava</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Naslov, tekst i slike. Kad objaviš, vidi se odmah ispod, na javnom profilu.
      </p>
      <Input
        className="mt-3 rounded-xl"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Naslov"
        maxLength={200}
        required
      />
      <Textarea
        className="mt-2 min-h-28 rounded-xl"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Što želite poručiti učenicima i roditeljima?"
        maxLength={20000}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <select
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="obavijest">Obavijest</option>
          <option value="dogadaj">Događaj</option>
          <option value="upisi">Upisi</option>
          <option value="uspjeh">Uspjeh učenika</option>
          <option value="ostalo">Ostalo</option>
        </select>
        <Input
          className="rounded-xl"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Poveznica (nije obavezno)"
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {pending.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {pending.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.url} alt="" className="h-20 w-full rounded-xl object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-foreground shadow"
                onClick={() => removePending(img.id)}
                aria-label="Ukloni sliku"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={saving || pending.length >= MAX_IMAGES}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          Dodaj slike
        </Button>
        <Button type="submit" className="rounded-full" disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Objavi na profilu
        </Button>
        {allowDraft && (
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            disabled={saving || !title.trim()}
            onClick={() => void submit("DRAFT")}
          >
            Spremi draft
          </Button>
        )}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Do {MAX_IMAGES} slika, JPEG/PNG/WebP, do 4 MB po slici.</p>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {info && <p className="mt-2 text-sm text-primary">{info}</p>}
    </form>
  );
}
