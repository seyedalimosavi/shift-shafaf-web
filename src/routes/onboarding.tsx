import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/features/onboarding/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "راه‌اندازی اولیه — شیفت‌کار" },
      { name: "description", content: "انتخاب گروه کاری و پوستهٔ برنامه در شروع کار با شیفت‌کار." },
      { property: "og:title", content: "راه‌اندازی اولیه — شیفت‌کار" },
      { property: "og:description", content: "چند گام کوتاه تا شروع استفاده از تقویم شیفت." },
    ],
  }),
  component: OnboardingPage,
});
