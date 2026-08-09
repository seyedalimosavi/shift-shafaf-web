import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ZoomViewer } from "@/components/ZoomViewer";
import { Maximize2, MousePointerClick } from "lucide-react";

/** تصویر لوحهٔ چارت شیفت سال ۱۴۰۵. */
const ROSTER_SRC = "/roster-1405.png";
const ROSTER_ALT = "لوحهٔ چارت شیفت سال ۱۴۰۵";

/** راهنمای رنگ‌های لوحه. */
const LEGEND: { swatch: string; label: string }[] = [
  { swatch: "oklch(0.58 0.2 22)", label: "رنگ قرمز: روزهای جمعه" },
  { swatch: "oklch(0.86 0.16 96)", label: "رنگ زرد: تعطیلات رسمی" },
];

export function RosterPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell>
      <PageHeader title="چارت شیفت ۱۴۰۵" subtitle="مشاهده و بزرگ‌نمایی لوحهٔ چارت" />

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full overflow-hidden rounded-2xl border border-border bg-card elevated"
          aria-label="باز کردن نمایشگر بزرگ‌نمایی چارت"
        >
          <img
            src={ROSTER_SRC || "/placeholder.svg"}
            alt={ROSTER_ALT}
            className="w-full object-contain"
          />
        </button>

        <section className="mt-3 rounded-2xl border border-border bg-card p-4 elevated">
          <h2 className="text-sm font-bold">راهنما</h2>
          <ul className="mt-3 space-y-2">
            {LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className="h-4 w-4 shrink-0 rounded-md border border-border"
                  style={{ backgroundColor: item.swatch }}
                  aria-hidden
                />
                <span className="text-foreground">{item.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="h-4 w-4 shrink-0" aria-hidden />
              <span>جهت زوم بر روی عکس کلیک کنید.</span>
            </li>
          </ul>
        </section>

        <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
          <Maximize2 className="h-4 w-4" aria-hidden />
          بزرگ‌نمایی
        </Button>
      </div>

      {open ? <ZoomViewer src={ROSTER_SRC} alt={ROSTER_ALT} onClose={() => setOpen(false)} /> : null}
    </AppShell>
  );
}
