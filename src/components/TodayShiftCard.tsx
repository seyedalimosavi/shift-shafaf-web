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
    <section className="hero-gradient px-4 pb-5 pt-6 text-primary-foreground">
      <p className="text-xs opacity-90">شیفت امروز شما</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">{mine.statusLabel}</h1>
          <p className="mt-1 text-sm opacity-90">
            گروه {GROUP_LABELS[userGroup]} — {mine.label}
          </p>
        </div>
        <div className="text-left text-sm opacity-95">
          <p className="font-bold">{PERSIAN_WEEKDAYS[jalaaliWeekDay(today)]}</p>
          <p>{formatJalaliLong(today)}</p>
          {holiday.isHoliday ? <p className="mt-1 text-xs">{holiday.title ?? "تعطیل رسمی"}</p> : null}
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-4 gap-2">
        {GROUPS.map((g) => (
          <li
            key={g}
            className="flex flex-col items-center gap-1 rounded-xl bg-card/85 py-2 text-card-foreground"
          >
            <span className="text-xs font-bold">گروه {GROUP_LABELS[g]}</span>
            <ShiftBadge shift={all[g]} size="xs" />
          </li>
        ))}
      </ul>
    </section>
  );
}
