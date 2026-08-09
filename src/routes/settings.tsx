import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "تنظیمات — شیفت‌کار" },
      { name: "description", content: "انتخاب گروه کاری، نمای تقویم و پوستهٔ رنگی برنامه شیفت‌کار." },
      { property: "og:title", content: "تنظیمات — شیفت‌کار" },
      { property: "og:description", content: "شخصی‌سازی گروه کاری، نمای تقویم و پوسته." },
    ],
  }),
  component: SettingsPage,
});
