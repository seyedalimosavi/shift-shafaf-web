import { getAllShifts, getShift, GROUPS, GROUP_LABELS, type FilterGroup } from "@/lib/shift";
import {
  getHoliday,
  jalaaliMonthLength,
  jalaaliWeekDay,
  PERSIAN_WEEKDAYS_SHORT,
  dateKey,
  toPersianDigits,
  type JalaliDate,
} from "@/lib/jalali";
import { GroupShiftChip, ShiftBadge } from "./ShiftBadge";
import { cn } from "@/lib/utils";

export function CalendarGrid({
  jy,
  jm,
  baseDate,
  filterGroup,
  noteKeys,
  today,
  onSelect,
}: {
  jy: number;
  jm: number;
  baseDate: JalaliDate;
  filterGroup: FilterGroup;
  noteKeys: Set<string>;
  today: JalaliDate;
  onSelect: (d: JalaliDate) => void;
}) {
  const length = jalaaliMonthLength(jy, jm);
  const firstWeekday = jalaaliWeekDay({ jy, jm, jd: 1 });
  const cells: (JalaliDate | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= length; d += 1) cells.push({ jy, jm, jd: d });

  return (
    <div className="px-3">
      <div className="mb-1 grid grid-cols-7 gap-1">
        {PERSIAN_WEEKDAYS_SHORT.map((w, i) => (
          <div
            key={w}
            className={cn(
              "py-1 text-center text-xs font-bold",
              i === 6 ? "text-holiday" : "text-muted-foreground",
            )}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const key = dateKey(cell);
          const holiday = getHoliday(cell);
          const isToday = cell.jy === today.jy && cell.jm === today.jm && cell.jd === today.jd;
          const hasNote = noteKeys.has(key);
          const all = getAllShifts(cell, baseDate);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(cell)}
              aria-label={`روز ${cell.jd}`}
              className={cn(
                "relative flex min-h-[68px] flex-col items-center justify-between rounded-xl border bg-card p-1 pt-1.5 text-center transition-colors hover:bg-accent",
                isToday ? "border-primary ring-2 ring-primary/40" : "border-border",
              )}
            >
              <span className="flex items-center gap-0.5">
                <span
                  className={cn(
                    "text-sm font-bold",
                    holiday.title
                      ? "text-official"
                      : holiday.isFriday
                        ? "text-holiday"
                        : "text-foreground",
                  )}
                >
                  {toPersianDigits(cell.jd)}
                </span>
                {hasNote ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="یادداشت" />
                ) : null}
              </span>

              {filterGroup === "ALL" ? (
                <span className="mt-1 flex w-full gap-0.5">
                  {GROUPS.map((g) => (
                    <GroupShiftChip key={g} group={GROUP_LABELS[g]} shift={all[g]} />
                  ))}
                </span>
              ) : (
                <ShiftBadge
                  shift={getShift(cell, filterGroup, baseDate)}
                  size="xs"
                  className="mt-1 w-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
