import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, SquarePlus, X } from "lucide-react";

const SEEN_KEY = "shiftkar.pwa.prompt.v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
  return window.matchMedia?.("(display-mode: standalone)").matches || iosStandalone === true;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ reports as Mac; detect touch to catch it.
  const iPadOS = /macintosh/i.test(ua) && typeof document !== "undefined" && "ontouchend" in document;
  return iOS || iPadOS;
}

function shouldSuppress(): boolean {
  if (typeof window === "undefined") return true;
  if (window.top !== window.self) return true; // hidden inside previews/iframes
  if (isStandalone()) return true; // already installed
  try {
    if (window.localStorage.getItem(SEEN_KEY)) return true; // already seen/dismissed
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Non-intrusive "add to home screen" prompt.
 * Shows once, is dismissible, and supports both Android (beforeinstallprompt)
 * and iOS Safari (manual instructions). Never shows in previews or once installed.
 */
export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (shouldSuppress()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => dismiss();
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt — show manual guidance after a short delay.
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      iosTimer = setTimeout(() => {
        setIosHelp(true);
        setVisible(true);
      }, 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const markSeen = () => {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const dismiss = () => {
    setVisible(false);
    markSeen();
  };

  const install = async () => {
    const ev = deferred.current;
    if (!ev) return;
    await ev.prompt();
    await ev.userChoice.catch(() => undefined);
    deferred.current = null;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto w-full max-w-3xl px-4">
      <div
        role="dialog"
        aria-label="نصب برنامه"
        className="relative flex items-start gap-3 rounded-2xl border border-border bg-card p-4 elevated"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Download className="h-5 w-5" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">نصب «شیفت‌کار» روی دستگاه</p>
          {iosHelp ? (
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              دکمهٔ اشتراک‌گذاری
              <Share className="inline h-3.5 w-3.5" aria-hidden />
              را بزنید و سپس «افزودن به صفحهٔ اصلی»
              <SquarePlus className="inline h-3.5 w-3.5" aria-hidden />
              را انتخاب کنید.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              برای دسترسی سریع‌تر و کارکرد آفلاین، برنامه را به صفحهٔ اصلی اضافه کنید.
            </p>
          )}

          {!iosHelp ? (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => void install()}>
                نصب برنامه
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                بعداً
              </Button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="بستن"
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
