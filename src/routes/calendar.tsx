import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/features/calendar/CalendarPage";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "تقویم شیفت — شیفت‌کار" },
      {
        name: "description",
        content: "تقویم شمسی شیفت‌های چرخه ۸ روزه برای گروه‌های الف، ب، ج و د با یادداشت روزانه.",
      },
      { property: "og:title", content: "تقویم شیفت — شیفت‌کار" },
      {
        property: "og:description",
        content: "تقویم شمسی شیفت‌های چرخه ۸ روزه با نمای شبکه‌ای و لیستی.",
      },
    ],
  }),
  component: CalendarPage,
});
