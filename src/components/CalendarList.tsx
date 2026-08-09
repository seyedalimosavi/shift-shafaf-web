import {
  getAllShifts,
  getShift,
  GROUPS,
  GROUP_LABELS,
  type FilterGroup,
} from "@/lib/shift";
import {
  dateKey,
  getHoliday,
  jalaaliWeekDay,
  monthDays,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  toPersianDigits,
  type JalaliDate,
} from "@/lib/jalali";
import { ShiftBadge } from "./ShiftBadge";
import { cn } from "@/lib/utils";
import { StickyNote } from "lucide-react";

export function seasonClass(jm: number): string {
  if (jm <= 3) return "season-1";
  if (jm <= 6) return "season-2";
  if (jm <= 9) return "season-3";
  return "season-4";
}

export function CalendarList({
  jy,
  jm,
  baseDate,
  filterGroup,
  notes,
  today,
  onSelect,
}: {
  jy: number;
  jm: number;
  baseDate: JalaliDate;
  filterGroup: FilterGroup;
  notes: Record<string, { noteText: string }>;
  today: JalaliDate;
  onSelect: (d: JalaliDate) => void;
}) {
  const days = monthDays(jy, jm);

  return (
    <div className="px-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-card elevated">
        <div className={cn("px-4 py-3 text-primary-foreground", seasonClass(jm))}>
          <p className="text-base font-bold">
            {PERSIAN_MONTHS[jm - 1]} {toPersianDigits(jy)}
          </p>
          <p className="text-xs opacity-90">
            {filterGroup === "ALL" ? "همه گروه‌ها" : `گروه ${GROUP_LABELS[filterGroup]}`}
          </p>
        </div>

        <ul className="divide-y divide-border">
          {days.map((d) => {
            const key = dateKey(d);
            const holiday = getHoliday(d);
            const isToday = d.jy === today.jy && d.jm === today.jm && d.jd === today.jd;
            const note = notes[key];
            const all = getAllShifts(d, baseDate);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect(d)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-right transition-colors hover:bg-accent",
                    isToday && "bg-accent/60",
                  )}
                >
                  <span
                    className={cn(
                      "w-8 shrink-0 text-base font-bold",
                      holiday.isHoliday ? "text-holiday" : "text-foreground",
                    )}
                  >
                    {toPersianDigits(d.jd)}
                  </span>
                  <span
                    className={cn(
                      "w-16 shrink-0 text-xs",
                      holiday.isFriday ? "text-holiday" : "text-muted-foreground",
                    )}
                  >
                    {PERSIAN_WEEKDAYS[jalaaliWeekDay(d)]}
                  </span>

                  <span className="flex flex-1 flex-wrap items-center gap-1">
                    {filterGroup === "ALL" ? (
                      GROUPS.map((g) => (
                        <ShiftBadge
                          key={g}
                          shift={all[g]}
                          size="xs"
                          className="min-w-11"
                        />
                      ))
                    ) : (
                      <ShiftBadge shift={getShift(d, filterGroup, baseDate)} size="sm" showCode />
                    )}
                  </span>

                  <span className="flex w-24 shrink-0 items-center justify-end gap-1 text-[11px] text-muted-foreground">
                    {note ? <StickyNote className="h-3.5 w-3.5 text-primary" aria-hidden /> : null}
                    <span className="truncate">{holiday.title ?? (note ? note.noteText : "")}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
