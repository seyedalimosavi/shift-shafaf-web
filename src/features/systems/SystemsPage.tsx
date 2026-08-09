import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Link2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface SystemLink {
  id: string;
  title: string;
  url: string;
}

const KEY = "shiftkar.systems.v1";

function load(): SystemLink[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is SystemLink =>
        typeof l === "object" && l !== null && "id" in l && "title" in l && "url" in l,
    );
  } catch {
    return [];
  }
}

function persist(links: SystemLink[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(links));
  } catch {
    /* ignore */
  }
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function SystemsPage() {
  const [links, setLinks] = useState<SystemLink[]>([]);
  const [editing, setEditing] = useState<SystemLink | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setLinks(load());
  }, []);

  const commit = (next: SystemLink[]) => {
    setLinks(next);
    persist(next);
  };

  const openForm = (link: SystemLink | null) => {
    setEditing(link);
    setTitle(link?.title ?? "");
    setUrl(link?.url ?? "");
    setOpen(true);
  };

  const submit = () => {
    const finalUrl = normalizeUrl(url);
    if (!title.trim() || !finalUrl) {
      toast.error("عنوان و نشانی سامانه را وارد کنید.");
      return;
    }
    if (editing) {
      commit(
        links.map((l) => (l.id === editing.id ? { ...l, title: title.trim(), url: finalUrl } : l)),
      );
      toast.success("سامانه ویرایش شد.");
    } else {
      commit([...links, { id: crypto.randomUUID(), title: title.trim(), url: finalUrl }]);
      toast.success("سامانه افزوده شد.");
    }
    setOpen(false);
  };

  return (
    <AppShell>
      <PageHeader title="سامانه‌ها" subtitle="دسترسی سریع به سامانه‌های سازمانی" />

      <div className="px-4 py-4">
        <p className="mb-3 rounded-2xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
          نشانی سامانه‌ها در بستهٔ منبع در دسترس نبود؛ بنابراین فهرست به‌صورت قابل‌ویرایش ارائه شده
          است. سامانه‌های خود را اضافه کنید تا روی این دستگاه ذخیره شوند.
        </p>

        {links.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center elevated">
            <Link2 className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">هنوز سامانه‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {links.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 elevated"
              >
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-1 items-center gap-2 overflow-hidden"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{l.title}</span>
                    <span className="block truncate text-xs text-muted-foreground" dir="ltr">
                      {l.url}
                    </span>
                  </span>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`ویرایش ${l.title}`}
                  onClick={() => openForm(l)}
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`حذف ${l.title}`}
                  onClick={() => {
                    commit(links.filter((x) => x.id !== l.id));
                    toast.success("سامانه حذف شد.");
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Button className="mt-4 w-full" onClick={() => openForm(null)}>
          <Plus className="h-4 w-4" aria-hidden />
          افزودن سامانه
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader className="text-right">
            <DialogTitle>{editing ? "ویرایش سامانه" : "افزودن سامانه"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان سامانه"
            />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.ir"
              dir="ltr"
            />
            <Button className="w-full" onClick={submit}>
              ذخیره
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
