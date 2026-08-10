import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Share, SquarePlus, X } from "lucide-react";

const DISMISS_KEY = "shiftkar.install.dismissed.v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** One-time, dismissible install helper for Android (native prompt) and iOS (manual steps). */
export function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      setIos(true);
      timer = setTimeout(() => setOpen(true), 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-sm rounded-3xl text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>نصب «شیفت‌کار» روی دستگاه</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          با نصب برنامه، شیفت‌کار مثل یک اپلیکیشن روی صفحهٔ اصلی باز می‌شود و آفلاین هم کار می‌کند.
        </p>

        {ios ? (
          <ol className="space-y-2 rounded-2xl bg-muted p-3 text-sm">
            <li className="flex items-center gap-2">
              <Share className="h-4 w-4 shrink-0" aria-hidden />
              در سافاری دکمهٔ «اشتراک‌گذاری» را بزنید.
            </li>
            <li className="flex items-center gap-2">
              <SquarePlus className="h-4 w-4 shrink-0" aria-hidden />
              گزینهٔ «Add to Home Screen» را انتخاب کنید.
            </li>
          </ol>
        ) : null}

        <div className="mt-2 flex gap-2">
          {deferred ? (
            <Button
              className="flex-1"
              onClick={async () => {
                await deferred.prompt();
                await deferred.userChoice;
                close();
              }}
            >
              <Download className="h-4 w-4" aria-hidden />
              نصب برنامه
            </Button>
          ) : null}
          <Button variant="outline" className={deferred ? "" : "flex-1"} onClick={close}>
            <X className="h-4 w-4" aria-hidden />
            بعداً
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
