import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ZoomViewer } from "@/components/ZoomViewer";
import { deleteFile, getFile, putFile } from "@/lib/db";
import { ImageUp, Maximize2, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Roster (چارت شیفت ۱۴۰۵).
 * The Android asset `img_roster_1405` was not part of the provided bundle, so
 * this is a clearly marked asset slot: the user supplies the roster image and
 * it is stored offline in IndexedDB, then rendered in the zoom viewer.
 */
const FILE_KEY = "img_roster_1405";

export function RosterPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    void getFile(FILE_KEY).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob);
        setSrc(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    await putFile(FILE_KEY, file);
    setSrc(URL.createObjectURL(file));
    toast.success("تصویر چارت ذخیره شد.");
  };

  return (
    <AppShell>
      <PageHeader title="چارت شیفت ۱۴۰۵" subtitle="مشاهده و بزرگ‌نمایی تصویر چارت" />

      <div className="px-4 py-4">
        {src ? (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="block w-full overflow-hidden rounded-2xl border border-border bg-card elevated"
              aria-label="باز کردن نمایشگر بزرگ‌نمایی"
            >
              <img src={src} alt="چارت شیفت سال ۱۴۰۵" className="w-full object-contain" />
            </button>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1" onClick={() => setOpen(true)}>
                <Maximize2 className="h-4 w-4" aria-hidden />
                بزرگ‌نمایی
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await deleteFile(FILE_KEY);
                  setSrc(null);
                  toast.success("تصویر چارت حذف شد.");
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                حذف
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
            <ImageUp className="mx-auto h-9 w-9 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-bold">جای‌گاه تصویر چارت (img_roster_1405)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              تصویر چارت در بستهٔ منبع موجود نبود. فایل تصویر چارت را انتخاب کنید تا به‌صورت آفلاین
              روی همین دستگاه ذخیره و در نمایشگر بزرگ‌نمایی نشان داده شود.
            </p>
          </div>
        )}

        <label className="mt-4 block">
          <span className="sr-only">انتخاب تصویر چارت</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full cursor-pointer rounded-xl border border-border bg-card p-2 text-sm file:ml-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
            onChange={(e) => void onPick(e.target.files?.[0])}
          />
        </label>
      </div>

      {open && src ? (
        <ZoomViewer src={src} alt="چارت شیفت سال ۱۴۰۵" onClose={() => setOpen(false)} />
      ) : null}
    </AppShell>
  );
}
