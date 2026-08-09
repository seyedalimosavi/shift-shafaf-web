import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CalendarClock } from "lucide-react";
import { loadSettings } from "@/lib/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "شیفت‌کار — تقویم شیفت شمسی" },
      {
        name: "description",
        content:
          "شیفت‌کار: تقویم شمسی شیفت با چرخهٔ ۸ روزه، گروه‌های الف تا د، یادداشت روزانه و کارکرد آفلاین.",
      },
      { property: "og:title", content: "شیفت‌کار — تقویم شیفت شمسی" },
      {
        property: "og:description",
        content: "تقویم شیفت شمسی با چرخهٔ ۸ روزه، یادداشت روزانه و کارکرد کامل آفلاین.",
      },
    ],
  }),
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const settings = loadSettings();
    const target = settings.onboardingCompleted
      ? ((settings.lastRoute || "/calendar") as "/calendar")
      : ("/onboarding" as const);
    const timer = window.setTimeout(() => {
      void navigate({ to: target, replace: true });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="hero-gradient flex min-h-screen flex-col items-center justify-center gap-4 text-primary-foreground">
      <span className="flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl bg-card/20">
        <CalendarClock className="h-12 w-12" aria-hidden />
      </span>
      <h1 className="text-3xl font-extrabold">شیفت‌کار</h1>
      <p className="text-sm opacity-90">تقویم شیفت شمسی</p>
    </div>
  );
}
