/**
 * Jalali (Persian / Shamsi) calendar utilities.
 * Port of the well-known jalaali algorithm (Behrang Norouzinia / Kazimierz Borkowski).
 */

function div(a: number, b: number): number {
  return ~~(a / b);
}
function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

const breaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
];

interface JalCal {
  leap: number;
  gy: number;
  march: number;
}

function jalCal(jy: number): JalCal {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0]!;

  if (jy < jp || jy >= breaks[bl - 1]!) {
    // Out of the supported range; clamp gracefully instead of throwing.
    jy = Math.min(Math.max(jy, jp), breaks[bl - 1]! - 1);
  }

  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i]!;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

export function isLeapJalaaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): JalaliDate {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      const jm = 1 + div(k, 31);
      const jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function toJalaali(date: Date): JalaliDate {
  return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

export function toGregorian(j: JalaliDate): Date {
  const { gy, gm, gd } = d2g(j2d(j.jy, j.jm, j.jd));
  return new Date(gy, gm - 1, gd);
}

/** Julian day number for a Jalali date — used for stable day arithmetic. */
export function jalaaliToJdn(j: JalaliDate): number {
  return j2d(j.jy, j.jm, j.jd);
}

export function jdnToJalaali(jdn: number): JalaliDate {
  return d2j(jdn);
}

export function addJalaaliDays(j: JalaliDate, days: number): JalaliDate {
  return d2j(j2d(j.jy, j.jm, j.jd) + days);
}

/** 0 = شنبه ... 6 = جمعه */
export function jalaaliWeekDay(j: JalaliDate): number {
  const g = toGregorian(j);
  // JS: 0=Sunday. Saturday(6) -> 0
  return (g.getDay() + 1) % 7;
}

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const PERSIAN_WEEKDAYS = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export const PERSIAN_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]!);
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function dateKey(j: JalaliDate): string {
  return `${j.jy}-${pad2(j.jm)}-${pad2(j.jd)}`;
}

export function parseDateKey(key: string): JalaliDate | null {
  const m = /^(\d{3,4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  return { jy: Number(m[1]), jm: Number(m[2]), jd: Number(m[3]) };
}

export function formatJalali(j: JalaliDate): string {
  return toPersianDigits(`${j.jy}/${pad2(j.jm)}/${pad2(j.jd)}`);
}

export function formatJalaliLong(j: JalaliDate): string {
  return `${toPersianDigits(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersianDigits(j.jy)}`;
}

export function formatGregorian(j: JalaliDate): string {
  const g = toGregorian(j);
  return toPersianDigits(`${g.getFullYear()}-${pad2(g.getMonth() + 1)}-${pad2(g.getDate())}`);
}

/** Official Iranian holidays that fall on fixed Jalali dates. */
const FIXED_HOLIDAYS: Record<string, string> = {
  "01-01": "نوروز — جشن سال نو",
  "01-02": "عید نوروز",
  "01-03": "عید نوروز",
  "01-04": "عید نوروز",
  "01-12": "روز جمهوری اسلامی ایران",
  "01-13": "روز طبیعت (سیزده‌بدر)",
  "03-14": "رحلت امام خمینی",
  "03-15": "قیام ۱۵ خرداد",
  "11-22": "پیروزی انقلاب اسلامی",
  "12-29": "روز ملی شدن صنعت نفت",
};

export interface HolidayInfo {
  isHoliday: boolean;
  isFriday: boolean;
  title: string | null;
}

export function getHoliday(j: JalaliDate): HolidayInfo {
  const key = `${pad2(j.jm)}-${pad2(j.jd)}`;
  const title = FIXED_HOLIDAYS[key] ?? null;
  const isFriday = jalaaliWeekDay(j) === 6;
  return { isHoliday: Boolean(title) || isFriday, isFriday, title };
}

export function todayJalali(): JalaliDate {
  return toJalaali(new Date());
}

export function monthDays(jy: number, jm: number): JalaliDate[] {
  const len = jalaaliMonthLength(jy, jm);
  const out: JalaliDate[] = [];
  for (let d = 1; d <= len; d += 1) out.push({ jy, jm, jd: d });
  return out;
}

export function addMonths(jy: number, jm: number, delta: number): { jy: number; jm: number } {
  const total = jy * 12 + (jm - 1) + delta;
  return { jy: Math.floor(total / 12), jm: (total % 12) + 1 };
}
