# شیفت‌کار: My Shifts

Build a complete production-ready Persian RTL PWA/web app named «شیفت‌کار» by migrating the attached Android Kotlin project specification into a web implementation. The Android source file is available in this conversation; use the source-derived requirements in this prompt as authoritative. DO NOT migrate or include Android-only features: notifications, Android home-screen widgets, APK downloading/installing, in-app APK updater, auto-update/update checking, or Android dynamic color. Remove those concepts entirely. Replace dynamic color with a built-in default theme plus a Settings theme picker containing multiple attractive color themes; persist the selected theme locally.

Rebuild all remaining functionality faithfully: splash flow, onboarding flow and persistence, four main tabs (Calendar, Systems, Roster, Settings), Persian/Jalali calendar, month/year picker, previous/next month, swipe month navigation, grid and list calendar modes with persistence, group filters ALL/A/B/C/D, 8-day shift cycle and group offsets exactly as source, today shift card, holiday display, day detail bottom sheet/dialog, notes CRUD and all-notes view, roster image viewer with touch/pinch/zoom behavior, systems links, settings, help/about/contact/reset onboarding, persistent settings and last selected tab. Preserve source terminology and logic. Use real UTF-8 Persian text, not mojibake.

Source-derived exact shift engine: 8-day cycle [M1, M2, N1, N2, R1, R2, R3, R4], default base date 1405/05/04, group offsets A=7, B=1, C=5, D=3. Preserve floor-mod behavior for dates before base date. Groups are A/B/C/D plus ALL. Shift status meanings are DAY/NIGHT/REST. Preserve Persian month names and Persian weekday names, Persian digit conversion, holiday logic, all-group and filtered views.

Source-derived main UI: Splash -> if onboarding incomplete then Onboarding, otherwise Main. Main has bottom navigation tabs Calendar, Systems, Roster, Settings and remembers last selected tab. Calendar begins with a Today Shift card, then month header with previous/next arrows, month/year picker, all-notes button, and grid/list view toggle. Calendar has group filter chips. Grid is 7 columns with day cells, today/holiday styling, note indicator, and either all four group chips or selected group's shift badge. Horizontal swipe changes month. List view is a rounded card/table with seasonal header gradients: months 1-3 green/teal, 4-6 lime/yellow, 7-9 orange/yellow, 10-12 blue/cyan; columns for day, weekday, shift(s), holiday/note. Tapping a day opens Day Detail sheet with Persian/Gregorian date, holiday, all group statuses, and note editor/delete/save. Month Picker selects Persian year/month. All Notes sheet lists notes and lets user edit/delete/jump to date.

Source-derived notes: Android uses Room entity day_notes with dateKey, noteText, updatedAt. Web equivalent should be IndexedDB with one record per dateKey; saving trimmed empty text deletes the note. Show note indicators on calendar. Persist settings with localStorage (theme, selected filter group, user group, onboarding completed, base date, last screen route, calendar view type). User group selection should also update selected filter group as in source.

Source-derived roster: there is a Roster screen that displays the 1405 roster image (img_roster_1405) and supports opening a zoom viewer with pan/pinch/zoom, including touch gestures. If the exact image asset is not available in the source bundle, create a clearly marked asset slot and wire the viewer to it; do not invent roster content.

Source-derived systems: a Systems screen containing the external system links from the Android source, opened externally. Preserve the labels and URLs from source where available.

Source-derived settings: work group selection A/B/C/D; filter group behavior; calendar view type grid/list; theme selection; help, about, contact, restart onboarding. Remove all update-related controls. Add multiple fixed color themes (for example Default Blue, Emerald, Purple, Orange, Rose, Teal) with light/dark variants or a consistent theme system, and show a live theme preview in settings.

Technical requirements: modern responsive mobile-first UI, RTL, UTF-8 Persian, Material-3-inspired rounded cards/sheets/badges, accessible controls, desktop adaptation. Use TypeScript/React with Tailwind/shadcn as appropriate. Make it a PWA with manifest and service worker for offline app shell/cache. Offline must cover calendar calculations, settings and notes. No backend/authentication required. No notification permission/API, no widgets, no APK/update code. No placeholder buttons; all interactions must work. Test main flows and fix build/runtime errors before finishing. This is a real migration, not a mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80179452-22af-4b0d-8096-27827596264c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
