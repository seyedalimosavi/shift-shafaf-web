import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  dateKey,
  formatGregorian,
  formatJalaliLong,
  getHoliday,
  jalaaliWeekDay,
  PERSIAN_WEEKDAYS,
  type JalaliDate,
} from "@/lib/jalali";
import { getAllShifts, GROUPS, GROUP_LABELS } from "@/lib/shift";
import { ShiftBadge } from "./ShiftBadge";
import { Trash2, Save } from "lucide-react";

export function DayDetailSheet({
  date,
  baseDate,
  noteText,
  onClose,
  onSave,
  onDelete,
}: {
  date: JalaliDate | null;
  baseDate: JalaliDate;
  noteText: string;
  onClose: () => void;
  onSave: (key: string, text: string) => Promise<void> | void;
  onDelete: (key: string) => Promise<void> | void;
}) {
  const [text, setText] = useState(noteText);

  useEffect(() => {
    setText(noteText);
  }, [noteText, date]);

  if (!date) return null;
  const key = dateKey(date);
  const holiday = getHoliday(date);
  const all = getAllShifts(date, baseDate);

  return (
    <Sheet open={Boolean(date)} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="text-right">
          <SheetTitle className="text-lg">{formatJalaliLong(date)}</SheetTitle>
          <SheetDescription>
            {PERSIAN_WEEKDAYS[jalaaliWeekDay(date)]} — میلادی: {formatGregorian(date)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {holiday.isHoliday ? (
            <p className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-holiday">
              {holiday.title ?? "تعطیل رسمی (جمعه)"}
            </p>
          ) : null}

          <div>
            <h3 className="mb-2 text-sm font-bold">وضعیت گروه‌ها</h3>
            <ul className="grid grid-cols-2 gap-2">
              {GROUPS.map((g) => (
                <li
                  key={g}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2"
                >
                  <span className="text-sm font-medium">گروه {GROUP_LABELS[g]}</span>
                  <ShiftBadge shift={all[g]} size="sm" showCode />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold">یادداشت روز</h3>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="یادداشت خود را بنویسید…"
              rows={4}
              className="resize-none"
            />
            <div className="mt-3 flex gap-2">
              <Button
                className="flex-1"
                onClick={async () => {
                  await onSave(key, text);
                  onClose();
                }}
              >
                <Save className="h-4 w-4" aria-hidden />
                ذخیره
              </Button>
              <Button
                variant="outline"
                disabled={!noteText}
                onClick={async () => {
                  await onDelete(key);
                  onClose();
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                حذف
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
