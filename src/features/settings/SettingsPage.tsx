import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { baseDateOf, useSettings } from "@/lib/settings";
import { GROUPS, GROUP_LABELS, getShift, type Group } from "@/lib/shift";
import { THEMES } from "@/lib/themes";
import { formatJalaliLong, todayJalali } from "@/lib/jalali";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Info, LifeBuoy, Mail, Moon, RefreshCcw, Sun } from "lucide-react";
import { ShiftBadge } from "@/components/ShiftBadge";

type DialogKind = "help" | "about" | "contact" | null;

export function SettingsPage() {
  const { settings, set } = useSettings();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const today = todayJalali();
  const baseDate = baseDateOf(settings);

  return (
    <AppShell>
      <PageHeader title="تنظیمات" subtitle="گروه کاری، نمایش تقویم و پوسته" />

      <div className="space-y-4 px-4 py-4">
        <section className="rounded-2xl border border-border bg-card p-4 elevated">
          <h2 className="text-sm font-bold">گروه کاری من</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            انتخاب گروه، فیلتر تقویم را نیز به همان گروه تغییر می‌دهد.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {GROUPS.map((g: Group) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  set({ userGroup: g, filterGroup: g });
                  toast.success(`گروه کاری روی «${GROUP_LABELS[g]}» تنظیم شد.`);
                }}
                className={cn(
                  "rounded-xl border px-2 py-3 text-sm font-bold transition-colors",
                  settings.userGroup === g
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                {GROUP_LABELS[g]}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
            <span>شیفت امروز ({formatJalaliLong(today)})</span>
            <ShiftBadge shift={getShift(today, settings.userGroup, baseDate)} size="sm" showCode />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 elevated">
          <h2 className="text-sm font-bold">نمای تقویم</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["GRID", "LIST"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set({ calendarView: v })}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                  settings.calendarView === v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                {v === "GRID" ? "شبکه‌ای" : "لیستی"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 elevated">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">پوستهٔ رنگی</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => set({ mode: settings.mode === "dark" ? "light" : "dark" })}
            >
              {settings.mode === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden />
              ) : (
                <Moon className="h-4 w-4" aria-hidden />
              )}
              {settings.mode === "dark" ? "حالت روشن" : "حالت تیره"}
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set({ theme: t.id })}
                aria-pressed={settings.theme === t.id}
                className={cn(
                  "rounded-xl border p-2 text-right transition-colors",
                  settings.theme === t.id ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                <span className="flex gap-1">
                  {t.preview.map((c) => (
                    <span
                      key={c}
                      className="h-5 flex-1 rounded-md"
                      style={{ backgroundColor: c }}
                      aria-hidden
                    />
                  ))}
                </span>
                <span className="mt-2 block text-xs font-bold">{t.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">پیش‌نمایش زندهٔ پوسته</p>
            <div className="hero-gradient rounded-xl px-3 py-3 text-primary-foreground">
              <p className="text-sm font-bold">شیفت‌کار</p>
              <p className="text-xs opacity-90">نمونهٔ سربرگ با رنگ انتخابی</p>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm">دکمهٔ اصلی</Button>
              <Button size="sm" variant="secondary">
                دکمهٔ فرعی
              </Button>
              <Button size="sm" variant="outline">
                دکمهٔ خطی
              </Button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card elevated">
          <button
            type="button"
            onClick={() => setDialog("help")}
            className="flex w-full items-center gap-3 px-4 py-3 text-right hover:bg-accent"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden /> راهنما
          </button>
          <button
            type="button"
            onClick={() => setDialog("about")}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-right hover:bg-accent"
          >
            <Info className="h-4 w-4" aria-hidden /> درباره برنامه
          </button>
          <button
            type="button"
            onClick={() => setDialog("contact")}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-right hover:bg-accent"
          >
            <Mail className="h-4 w-4" aria-hidden /> ارتباط با ما
          </button>
          <button
            type="button"
            onClick={() => {
              set({ onboardingCompleted: false });
              void navigate({ to: "/onboarding" });
            }}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-right text-destructive hover:bg-accent"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden /> اجرای دوبارهٔ راه‌اندازی اولیه
          </button>
        </section>
      </div>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-sm rounded-3xl text-right">
          <DialogHeader className="text-right">
            <DialogTitle>
              {dialog === "help" ? "راهنما" : dialog === "about" ? "درباره برنامه" : "ارتباط با ما"}
            </DialogTitle>
          </DialogHeader>
          {dialog === "help" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• چرخهٔ شیفت ۸ روزه است: صبح ۱، صبح ۲، شب ۱، شب ۲ و چهار روز استراحت.</p>
              <p>• با کشیدن افقی روی تقویم، ماه بعد یا قبل نمایش داده می‌شود.</p>
              <p>• با لمس هر روز، جزئیات روز و یادداشت آن باز می‌شود.</p>
              <p>• فیلتر گروه، شیفت همان گروه را روی تقویم نشان می‌دهد.</p>
            </div>
          ) : null}
          {dialog === "about" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>«شیفت‌کار» تقویم شیفت شمسی با چرخهٔ ۸ روزه و گروه‌های الف، ب، ج و د است.</p>
              <p>
                مبدأ محاسبه: {formatJalaliLong(baseDate)} — همهٔ داده‌ها فقط روی همین دستگاه ذخیره
                می‌شود و برنامه به‌صورت آفلاین کار می‌کند.
              </p>
            </div>
          ) : null}
          {dialog === "contact" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>برای ارسال بازخورد یا گزارش خطا با ما در تماس باشید:</p>
              <a className="block font-bold text-primary" href="mailto:support@shiftkar.app" dir="ltr">
                support@shiftkar.app
              </a>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
