import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Grid2X2, Image, Settings as SettingsIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { updateSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/calendar", label: "تقویم", icon: CalendarDays },
  { to: "/systems", label: "سامانه‌ها", icon: Grid2X2 },
  { to: "/roster", label: "چارت", icon: Image },
  { to: "/settings", label: "تنظیمات", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (TABS.some((t) => t.to === pathname)) updateSettings({ lastRoute: pathname });
  }, [pathname]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-background">
      <main className="flex-1 pb-24">{children}</main>

      <nav
        aria-label="ناوبری اصلی"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur"
      >
        <ul className="mx-auto flex w-full max-w-3xl items-stretch">
          {TABS.map((tab) => {
            const active = pathname === tab.to;
            const Icon = tab.icon;
            return (
              <li key={tab.to} className="flex-1">
                <Link
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
                      active && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="hero-gradient px-4 pb-6 pt-6 text-primary-foreground">
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm opacity-90">{subtitle}</p> : null}
    </header>
  );
}
