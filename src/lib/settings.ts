import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_BASE_DATE, type FilterGroup, type Group } from "./shift";
import { dateKey, parseDateKey, type JalaliDate } from "./jalali";
import { THEME_IDS, type ThemeId, type ThemeMode } from "./themes";

export type CalendarViewType = "GRID" | "LIST";

export interface Settings {
  onboardingCompleted: boolean;
  theme: ThemeId;
  mode: ThemeMode;
  userGroup: Group;
  filterGroup: FilterGroup;
  calendarView: CalendarViewType;
  baseDateKey: string;
  lastRoute: string;
}

const STORAGE_KEY = "shiftkar.settings.v1";

export const DEFAULT_SETTINGS: Settings = {
  onboardingCompleted: false,
  theme: "blue",
  mode: "system",
  userGroup: "A",
  filterGroup: "ALL",
  calendarView: "GRID",
  baseDateKey: dateKey(DEFAULT_BASE_DATE),
  lastRoute: "/calendar",
};

let current: Settings = DEFAULT_SETTINGS;
let hydrated = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): Settings {
  const value = (raw ?? {}) as Partial<Settings>;
  const theme = THEME_IDS.includes(value.theme as ThemeId) ? (value.theme as ThemeId) : "blue";
  return {
    onboardingCompleted: Boolean(value.onboardingCompleted),
    theme,
    mode: value.mode === "dark" || value.mode === "light" ? value.mode : "system",
    userGroup: (["A", "B", "C", "D"] as const).includes(value.userGroup as Group)
      ? (value.userGroup as Group)
      : "A",
    filterGroup: (["ALL", "A", "B", "C", "D"] as const).includes(value.filterGroup as FilterGroup)
      ? (value.filterGroup as FilterGroup)
      : "ALL",
    calendarView: value.calendarView === "LIST" ? "LIST" : "GRID",
    baseDateKey:
      typeof value.baseDateKey === "string" && parseDateKey(value.baseDateKey)
        ? value.baseDateKey
        : DEFAULT_SETTINGS.baseDateKey,
    lastRoute: typeof value.lastRoute === "string" ? value.lastRoute : "/calendar",
  };
}

function emit() {
  listeners.forEach((l) => l());
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return current;
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      current = sanitize(raw ? JSON.parse(raw) : {});
    } catch {
      current = DEFAULT_SETTINGS;
    }
    applyTheme(current);
  }
  return current;
}

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveMode(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? (prefersDark() ? "dark" : "light") : mode;
}

let systemListenerAttached = false;

export function applyTheme(s: Settings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", s.theme);
  root.classList.toggle("dark", resolveMode(s.mode) === "dark");

  if (!systemListenerAttached && typeof window !== "undefined" && window.matchMedia) {
    systemListenerAttached = true;
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (current.mode === "system") {
        document.documentElement.classList.toggle("dark", prefersDark());
        emit();
      }
    });
  }
}

export function updateSettings(patch: Partial<Settings>) {
  current = sanitize({ ...loadSettings(), ...patch });
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
  applyTheme(current);
  emit();
}

export function resetSettings() {
  current = { ...DEFAULT_SETTINGS };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  applyTheme(current);
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    () => loadSettings(),
    () => DEFAULT_SETTINGS,
  );
  const set = useCallback((patch: Partial<Settings>) => updateSettings(patch), []);
  return { settings, set, reset: resetSettings };
}

export function baseDateOf(settings: Settings): JalaliDate {
  return parseDateKey(settings.baseDateKey) ?? DEFAULT_BASE_DATE;
}
