import { jalaaliToJdn, type JalaliDate } from "./jalali";

/** The 8-day shift cycle, exactly as in the source. */
export const SHIFT_CYCLE = ["M1", "M2", "N1", "N2", "R1", "R2", "R3", "R4"] as const;
export type ShiftCode = (typeof SHIFT_CYCLE)[number];

export type ShiftStatus = "DAY" | "NIGHT" | "REST";

export type Group = "A" | "B" | "C" | "D";
export type FilterGroup = "ALL" | Group;

export const GROUPS: Group[] = ["A", "B", "C", "D"];
export const FILTER_GROUPS: FilterGroup[] = ["ALL", "A", "B", "C", "D"];

/** Group offsets, exactly as in the source. */
export const GROUP_OFFSETS: Record<Group, number> = { A: 7, B: 1, C: 5, D: 3 };

/** Default base date: 1405/05/04 */
export const DEFAULT_BASE_DATE: JalaliDate = { jy: 1405, jm: 5, jd: 4 };

export const GROUP_LABELS: Record<Group, string> = {
  A: "الف",
  B: "ب",
  C: "ج",
  D: "د",
};

export const FILTER_GROUP_LABELS: Record<FilterGroup, string> = {
  ALL: "همه",
  ...GROUP_LABELS,
};

export const SHIFT_CODE_LABELS: Record<ShiftCode, string> = {
  M1: "صبح ۱",
  M2: "صبح ۲",
  N1: "شب ۱",
  N2: "شب ۲",
  R1: "استراحت ۱",
  R2: "استراحت ۲",
  R3: "استراحت ۳",
  R4: "استراحت ۴",
};

export const STATUS_LABELS: Record<ShiftStatus, string> = {
  DAY: "روز",
  NIGHT: "شب",
  REST: "استراحت",
};

export const STATUS_SHORT: Record<ShiftStatus, string> = {
  DAY: "ر",
  NIGHT: "ش",
  REST: "ا",
};

export function statusOf(code: ShiftCode): ShiftStatus {
  if (code === "M1" || code === "M2") return "DAY";
  if (code === "N1" || code === "N2") return "NIGHT";
  return "REST";
}

/** Floor-mod, so dates before the base date wrap correctly. */
export function floorMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export interface ShiftInfo {
  code: ShiftCode;
  status: ShiftStatus;
  label: string;
  statusLabel: string;
}

export function getShift(date: JalaliDate, group: Group, baseDate: JalaliDate): ShiftInfo {
  const diff = jalaaliToJdn(date) - jalaaliToJdn(baseDate);
  const index = floorMod(diff + GROUP_OFFSETS[group], SHIFT_CYCLE.length);
  const code = SHIFT_CYCLE[index]!;
  const status = statusOf(code);
  return {
    code,
    status,
    label: SHIFT_CODE_LABELS[code],
    statusLabel: STATUS_LABELS[status],
  };
}

export function getAllShifts(
  date: JalaliDate,
  baseDate: JalaliDate,
): Record<Group, ShiftInfo> {
  return {
    A: getShift(date, "A", baseDate),
    B: getShift(date, "B", baseDate),
    C: getShift(date, "C", baseDate),
    D: getShift(date, "D", baseDate),
  };
}
