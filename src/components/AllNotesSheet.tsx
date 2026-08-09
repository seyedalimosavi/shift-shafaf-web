import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatJalaliLong, parseDateKey, type JalaliDate } from "@/lib/jalali";
import type { DayNote } from "@/lib/db";
import { CalendarSearch, Trash2 } from "lucide-react";

export function AllNotesSheet({
  open,
  notes,
  onClose,
  onOpenDate,
  onDelete,
}: {
  open: boolean;
  notes: DayNote[];
  onClose: () => void;
  onOpenDate: (d: JalaliDate) => void;
  onDelete: (key: string) => Promise<void> | void;
}) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="text-right">
          <SheetTitle>همه یادداشت‌ها</SheetTitle>
          <SheetDescription>یادداشت‌های ثبت‌شده روی روزهای تقویم</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {notes.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              هنوز یادداشتی ثبت نشده است.
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => {
                const d = parseDateKey(n.dateKey);
                return (
                  <li
                    key={n.dateKey}
                    className="rounded-2xl border border-border bg-card p-3 elevated"
                  >
                    <p className="text-sm font-bold">{d ? formatJalaliLong(d) : n.dateKey}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {n.noteText}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          if (d) onOpenDate(d);
                        }}
                      >
                        <CalendarSearch className="h-4 w-4" aria-hidden />
                        رفتن به تاریخ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(n.dateKey)}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                        حذف
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
