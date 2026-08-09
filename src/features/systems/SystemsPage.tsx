import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Link2, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface SystemLink {
  id: string;
  title: string;
  url: string;
}

const KEY = "shiftkar.systems.v1";

/** هفت سامانهٔ نمونه (تستی) که در نخستین اجرا نمایش داده می‌شوند. */
const DEFAULT_SYSTEMS: SystemLink[] = [
  { id: "seed-attendance", title: "سامانه حضور و غیاب", url: "https://attendance.example.ir" },
  { id: "seed-payroll", title: "سامانه حقوق و دستمزد", url: "https://payroll.example.ir" },
  { id: "seed-automation", title: "اتوماسیون اداری", url: "https://automation.example.ir" },
  { id: "seed-leave", title: "سامانه مرخصی و مأموریت", url: "https://leave.example.ir" },
  { id: "seed-cartable", title: "کارتابل من", url: "https://cartable.example.ir" },
  { id: "seed-welfare", title: "سامانه رفاهی کارکنان", url: "https://welfare.example.ir" },
  { id: "seed-lms", title: "سامانه آموزش مجازی", url: "https://lms.example.ir" },
];

/** رنگ ثابت آواتار بر پایهٔ عنوان سامانه. */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.6 0.16 255), oklch(0.7 0.13 210))",
  "linear-gradient(135deg, oklch(0.62 0.15 162), oklch(0.72 0.12 190))",
  "linear-gradient(135deg, oklch(0.6 0.18 300), oklch(0.7 0.14 330))",
  "linear-gradient(135deg, oklch(0.66 0.16 48), oklch(0.78 0.14 70))",
  "linear-gradient(135deg, oklch(0.62 0.19 12), oklch(0.72 0.15 30))",
  "linear-gradient(135deg, oklch(0.58 0.12 195), oklch(0.7 0.1 220))",
  "linear-gradient(135deg, oklch(0.6 0.16 275), oklch(0.7 0.13 245))",
];

function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length]!;
}

function load(): SystemLink[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_SYSTEMS;
    const parsed: unknown = JSON.parse(raw);
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

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
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
    const initial = load();
    setLinks(initial);
    // اطمینان از ذخیرهٔ سامانه‌های نمونه در نخستین اجرا
    if (localStorage.getItem(KEY) === null) persist(initial);
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
        {links.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center elevated">
            <Link2 className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">هنوز سامانه‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {links.map((l) => (
              <li
                key={l.id}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 elevated transition-colors hover:border-primary/40"
              >
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-1 items-center gap-3 overflow-hidden"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white shadow-sm"
                    style={{ backgroundImage: gradientFor(l.id) }}
                    aria-hidden
                  >
                    {l.title.trim().charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {l.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                      <span className="truncate" dir="ltr">
                        {hostOf(l.url)}
                      </span>
                    </span>
                  </span>
                </a>
                <div className="flex shrink-0 flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`ویرایش ${l.title}`}
                    onClick={() => openForm(l)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 text-muted-foreground hover:text-destructive")}
                    aria-label={`حذف ${l.title}`}
                    onClick={() => {
                      commit(links.filter((x) => x.id !== l.id));
                      toast.success("سامانه حذف شد.");
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button className="mt-4 w-full" onClick={() => openForm(null)}>
          <Plus className="h-4 w-4" aria-hidden />
          افزودن سامانه
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          سامانه‌های نمایش‌داده‌شده نمونه (تستی) هستند و روی همین دستگاه ذخیره می‌شوند.
        </p>
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
