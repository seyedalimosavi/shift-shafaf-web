import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GROUPS, GROUP_LABELS, type Group } from "@/lib/shift";
import { useSettings } from "@/lib/settings";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { CalendarClock, Check, Moon, Palette, Sun, SunMoon, Users } from "lucide-react";

const STEPS = ["خوش آمدید", "شیفت کاری", "پوسته"] as const;

export function OnboardingPage() {
  const { settings, set } = useSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    set({ onboardingCompleted: true, lastRoute: "/calendar" });
    void navigate({ to: "/calendar" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 py-8">
      <div className="mb-6 flex gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 ? (
          <div className="text-center">
            <span className="hero-gradient mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-primary-foreground">
              <CalendarClock className="h-10 w-10" aria-hidden />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold">به شیفت‌کار خوش آمدید</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              تقویم شمسی شیفت با چرخهٔ ۸ روزه، یادداشت روزانه و کارکرد کامل آفلاین.
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-4 text-xl font-extrabold">شیفت کاری خود را انتخاب کنید</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              این انتخاب، شیفت امروز و فیلتر پیش‌فرض تقویم را تعیین می‌کند.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {GROUPS.map((g: Group) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set({ userGroup: g, filterGroup: g })}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-bold transition-colors",
                    settings.userGroup === g
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-accent",
                  )}
                >
                  شیفت {GROUP_LABELS[g]}
                  {settings.userGroup === g ? <Check className="h-4 w-4" aria-hidden /> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Palette className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-4 text-xl font-extrabold">پوستهٔ دلخواه</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              هر زمان می‌توانید از تنظیمات آن را تغییر دهید.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {([
                { id: "light", label: "روشن", Icon: Sun },
                { id: "dark", label: "تیره", Icon: Moon },
                { id: "system", label: "پیروی از سیستم", Icon: SunMoon },
              ] as const).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set({ mode: id })}
                  aria-pressed={settings.mode === id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-bold transition-colors",
                    settings.mode === id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => set({ theme: t.id })}
                  className={cn(
                    "rounded-2xl border p-3 text-right transition-colors",
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
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-2">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            قبلی
          </Button>
        ) : null}
        <Button className="flex-1" onClick={next}>
          {step === STEPS.length - 1 ? "شروع" : "بعدی"}
        </Button>
      </div>
    </div>
  );
}
