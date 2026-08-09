import { createFileRoute } from "@tanstack/react-router";
import { SystemsPage } from "@/features/systems/SystemsPage";

export const Route = createFileRoute("/systems")({
  head: () => ({
    meta: [
      { title: "سامانه‌ها — شیفت‌کار" },
      { name: "description", content: "دسترسی سریع به سامانه‌های سازمانی از داخل برنامه شیفت‌کار." },
      { property: "og:title", content: "سامانه‌ها — شیفت‌کار" },
      { property: "og:description", content: "فهرست پیوند سامانه‌های سازمانی." },
    ],
  }),
  component: SystemsPage,
});
