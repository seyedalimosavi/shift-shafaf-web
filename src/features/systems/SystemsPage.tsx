import { AppShell, PageHeader } from "@/components/AppShell";
import { ExternalLink } from "lucide-react";

interface SystemLink {
  id: string;
  title: string;
  description: string;
  url: string;
  initials: string;
  tone: string;
}

/** Sample systems (نمونهٔ آزمایشی) — replace URLs with the real organizational systems. */
const SYSTEMS: SystemLink[] = [
  {
    id: "hr",
    title: "سامانه منابع انسانی",
    description: "کارگزینی، مرخصی و احکام",
    url: "https://hr.example.ir",
    initials: "HR",
    tone: "season-1",
  },
  {
    id: "payroll",
    title: "فیش حقوقی",
    description: "مشاهده و دریافت فیش ماهانه",
    url: "https://payroll.example.ir",
    initials: "PY",
    tone: "season-2",
  },
  {
    id: "attendance",
    title: "سامانه تردد",
    description: "ثبت ورود و خروج و کارکرد",
    url: "https://attendance.example.ir",
    initials: "AT",
    tone: "season-3",
  },
  {
    id: "automation",
    title: "اتوماسیون اداری",
    description: "نامه‌ها و کارتابل سازمانی",
    url: "https://automation.example.ir",
    initials: "OA",
    tone: "season-4",
  },
  {
    id: "hse",
    title: "سامانه ایمنی و HSE",
    description: "گزارش حوادث و بازرسی",
    url: "https://hse.example.ir",
    initials: "HS",
    tone: "season-1",
  },
  {
    id: "maintenance",
    title: "نگهداری و تعمیرات",
    description: "درخواست کار و سفارش تعمیر",
    url: "https://cmms.example.ir",
    initials: "PM",
    tone: "season-3",
  },
  {
    id: "welfare",
    title: "سامانه رفاهی",
    description: "بیمه، وام و خدمات رفاهی",
    url: "https://welfare.example.ir",
    initials: "WF",
    tone: "season-4",
  },
];

export function SystemsPage() {
  return (
    <AppShell>
      <PageHeader title="سامانه‌ها" subtitle="دسترسی سریع به سامانه‌های سازمانی" />

      <div className="px-4 py-4">
        <ul className="grid gap-3 sm:grid-cols-2">
          {SYSTEMS.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-accent elevated"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-primary-foreground ${s.tone}`}
                  aria-hidden
                >
                  {s.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{s.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.description}
                  </span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
          این فهرست نمونه است؛ نشانی سامانه‌های واقعی سازمان جایگزین آن خواهد شد.
        </p>
      </div>
    </AppShell>
  );
}
