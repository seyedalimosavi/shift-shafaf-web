import { formatJalaliLong, getHoliday, jalaaliWeekDay, PERSIAN_WEEKDAYS, type JalaliDate } from "@/lib/jalali";
import { getAllShifts, GROUPS, GROUP_LABELS, type Group } from "@/lib/shift";
import { GroupShiftChip } from "./ShiftBadge";

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
    <section className="hero-gradient px-4 py-3 text-primary-foreground">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] opacity-90">شیفت {GROUP_LABELS[userGroup]} — امروز</p>
          <h1 className="truncate text-lg font-extrabold leading-tight">{mine.label}</h1>
        </div>
        <div className="shrink-0 text-left text-[11px] leading-tight opacity-95">
          <p className="font-bold">{PERSIAN_WEEKDAYS[jalaaliWeekDay(today)]}</p>
          <p>{formatJalaliLong(today)}</p>
          {holiday.title ? <p className="truncate">{holiday.title}</p> : null}
        </div>
      </div>

      <ul className="mt-2 grid grid-cols-4 gap-1.5">
        {GROUPS.map((g) => (
          <li
            key={g}
            className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-card/85 px-1 py-1"
          >
            <span className="text-[10px] font-bold text-card-foreground">شیفت {GROUP_LABELS[g]}</span>
            <GroupShiftChip group={all[g].label} shift={all[g]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
