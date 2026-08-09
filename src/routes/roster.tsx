import { createFileRoute } from "@tanstack/react-router";
import { RosterPage } from "@/features/roster/RosterPage";

export const Route = createFileRoute("/roster")({
  head: () => ({
    meta: [
      { title: "چارت شیفت ۱۴۰۵ — شیفت‌کار" },
      { name: "description", content: "مشاهده و بزرگ‌نمایی تصویر چارت شیفت سال ۱۴۰۵." },
      { property: "og:title", content: "چارت شیفت ۱۴۰۵ — شیفت‌کار" },
      { property: "og:description", content: "نمایشگر چارت شیفت با امکان جابه‌جایی و بزرگ‌نمایی." },
    ],
  }),
  component: RosterPage,
});
