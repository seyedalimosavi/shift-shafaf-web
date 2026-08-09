import { formatJalaliLong, getHoliday, jalaaliWeekDay, PERSIAN_WEEKDAYS, type JalaliDate } from "@/lib/jalali";
import { getAllShifts, GROUPS, GROUP_LABELS, type Group } from "@/lib/shift";
import { ShiftBadge } from "./ShiftBadge";

export function TodayShiftCard({
  today,
  baseDate,
  userGroup,
}: {
  today: JalaliDate;
  baseDate: JalaliDate;
  userGroup: Group;
}) {
  const all = getAllShifts(today, baseDate);
  const mine = all[userGroup];
  const holiday = getHoliday(today);

  return (
    <section className="hero-gradient px-4 pb-3 pt-4 text-primary-foreground">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] opacity-90">شیفت امروز شما</p>
          <h1 className="text-xl font-extrabold leading-tight">
            {mine.statusLabel}
            <span className="mr-1.5 text-sm font-medium opacity-90">
              شیفت {GROUP_LABELS[userGroup]}
            </span>
          </h1>
        </div>
        <div className="shrink-0 text-left text-xs opacity-95">
          <p className="font-bold">{PERSIAN_WEEKDAYS[jalaaliWeekDay(today)]}</p>
          <p>{formatJalaliLong(today)}</p>
          {holiday.isHoliday ? (
            <p className="mt-0.5 text-[10px]">{holiday.title ?? "تعطیل رسمی"}</p>
          ) : null}
        </div>
      </div>

      <ul className="mt-2.5 grid grid-cols-4 gap-1.5">
        {GROUPS.map((g) => (
          <li
            key={g}
            className="flex items-center justify-center gap-1 rounded-lg bg-card/85 px-1 py-1 text-card-foreground"
          >
            <span className="text-[11px] font-bold">شیفت {GROUP_LABELS[g]}</span>
            <ShiftBadge shift={all[g]} size="xs" />
          </li>
        ))}
      </ul>
    </section>
  );
}
