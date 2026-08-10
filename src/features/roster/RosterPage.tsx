import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ZoomViewer } from "@/components/ZoomViewer";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import rosterAsset from "@/assets/roster-1405.png.asset.json";

/** Roster (لوحه نوبتکاری سال ۱۴۰۵) with pan / pinch / wheel zoom viewer. */
export function RosterPage() {
  const [open, setOpen] = useState(false);
  const src = rosterAsset.url;
  const alt = "لوحه نوبتکاری سال ۱۴۰۵";

  return (
    <AppShell>
      <PageHeader title="لوحه نوبتکاری ۱۴۰۵" subtitle="مشاهده و بزرگ‌نمایی لوحه" />

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full overflow-hidden rounded-2xl border border-border bg-card elevated"
          aria-label="باز کردن نمایشگر بزرگ‌نمایی"
        >
          <img src={src} alt={alt} className="w-full object-contain" />
        </button>

        <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
          <Maximize2 className="h-4 w-4" aria-hidden />
          بزرگ‌نمایی
        </Button>

        <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 text-sm elevated">
          <p className="text-xs font-bold text-muted-foreground">راهنما</p>
          <p className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-[4px] bg-holiday" aria-hidden />
            رنگ قرمز روزهای جمعه
          </p>
          <p className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-[4px] bg-official" aria-hidden />
            رنگ زرد تعطیلات رسمی
          </p>
          <p className="text-muted-foreground">جهت زوم بر روی عکس کلیک کنید.</p>
        </div>
      </div>

      {open ? <ZoomViewer src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </AppShell>
  );
}
