export type ThemeId = "blue" | "emerald" | "purple" | "orange" | "rose" | "teal";
export type ThemeMode = "light" | "dark";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  /** Preview swatch colors (oklch strings used inline only for the picker preview). */
  preview: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  {
    id: "blue",
    name: "آبی پیش‌فرض",
    preview: ["oklch(0.55 0.17 255)", "oklch(0.72 0.12 245)", "oklch(0.95 0.02 250)"],
  },
  {
    id: "emerald",
    name: "زمرد",
    preview: ["oklch(0.58 0.14 162)", "oklch(0.74 0.12 158)", "oklch(0.95 0.02 160)"],
  },
  {
    id: "purple",
    name: "ارغوانی",
    preview: ["oklch(0.55 0.19 300)", "oklch(0.72 0.14 300)", "oklch(0.95 0.02 300)"],
  },
  {
    id: "orange",
    name: "نارنجی",
    preview: ["oklch(0.63 0.17 48)", "oklch(0.78 0.14 62)", "oklch(0.96 0.02 60)"],
  },
  {
    id: "rose",
    name: "سرخابی",
    preview: ["oklch(0.58 0.19 12)", "oklch(0.74 0.14 12)", "oklch(0.96 0.02 12)"],
  },
  {
    id: "teal",
    name: "فیروزه‌ای",
    preview: ["oklch(0.56 0.11 195)", "oklch(0.73 0.1 195)", "oklch(0.95 0.02 195)"],
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
