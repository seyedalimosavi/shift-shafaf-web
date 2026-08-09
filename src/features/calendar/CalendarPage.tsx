import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TodayShiftCard } from "@/components/TodayShiftCard";
import { GroupFilterChips } from "@/components/GroupFilterChips";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CalendarList } from "@/components/CalendarList";
import { DayDetailSheet } from "@/components/DayDetailSheet";
import { MonthPickerDialog } from "@/components/MonthPickerDialog";
import { AllNotesSheet } from "@/components/AllNotesSheet";
import { Button } from "@/components/ui/button";
import {
  addMonths,
  dateKey,
  PERSIAN_MONTHS,
  todayJalali,
  toPersianDigits,
  type JalaliDate,
} from "@/lib/jalali";
import { baseDateOf, useSettings } from "@/lib/settings";
import { useNotes } from "@/hooks/useNotes";
import { ChevronLeft, ChevronRight, LayoutGrid, List, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalendarPage() {
  const { settings, set } = useSettings();
  const baseDate = baseDateOf(settings);
  const today = useMemo(() => todayJalali(), []);
  const [cursor, setCursor] = useState<{ jy: number; jm: number }>({
    jy: today.jy,
    jm: today.jm,
  });
  const [selected, setSelected] = useState<JalaliDate | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const { notes, save, remove } = useNotes();

  const noteKeys = useMemo(() => new Set(Object.keys(notes)), [notes]);
  const noteList = useMemo(
    () => Object.values(notes).sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
    [notes],
  );

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const shiftMonth = (delta: number) => setCursor((c) => addMonths(c.jy, c.jm, delta));

  return (
    <AppShell>
      <TodayShiftCard today={today} baseDate={baseDate} userGroup={settings.userGroup} />

      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="ماه قبل" onClick={() => shiftMonth(-1)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-full px-3 py-1.5 text-base font-bold hover:bg-accent"
          >
            {PERSIAN_MONTHS[cursor.jm - 1]} {toPersianDigits(cursor.jy)}
          </button>
          <Button variant="ghost" size="icon" aria-label="ماه بعد" onClick={() => shiftMonth(1)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="همه یادداشت‌ها"
            onClick={() => setNotesOpen(true)}
          >
            <NotebookPen className="h-5 w-5" aria-hidden />
          </Button>
          <div className="flex overflow-hidden rounded-full border border-border">
            <button
              type="button"
              aria-label="نمای تقویم"
              aria-pressed={settings.calendarView === "GRID"}
              onClick={() => set({ calendarView: "GRID" })}
              className={cn(
                "px-3 py-1.5",
                settings.calendarView === "GRID" ? "bg-primary text-primary-foreground" : "bg-card",
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="نمای لیستی"
              aria-pressed={settings.calendarView === "LIST"}
              onClick={() => set({ calendarView: "LIST" })}
              className={cn(
                "px-3 py-1.5",
                settings.calendarView === "LIST" ? "bg-primary text-primary-foreground" : "bg-card",
              )}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <GroupFilterChips value={settings.filterGroup} onChange={(g) => set({ filterGroup: g })} />

      <div
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          const t = e.changedTouches[0];
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            // RTL: swipe left -> next month
            shiftMonth(dx < 0 ? 1 : -1);
          }
          touchStart.current = null;
        }}
        className="pb-4"
      >
        {settings.calendarView === "GRID" ? (
          <CalendarGrid
            jy={cursor.jy}
            jm={cursor.jm}
            baseDate={baseDate}
            filterGroup={settings.filterGroup}
            noteKeys={noteKeys}
            today={today}
            onSelect={setSelected}
          />
        ) : (
          <CalendarList
            jy={cursor.jy}
            jm={cursor.jm}
            baseDate={baseDate}
            filterGroup={settings.filterGroup}
            notes={notes}
            today={today}
            onSelect={setSelected}
          />
        )}
      </div>

      <DayDetailSheet
        date={selected}
        baseDate={baseDate}
        noteText={selected ? (notes[dateKey(selected)]?.noteText ?? "") : ""}
        onClose={() => setSelected(null)}
        onSave={save}
        onDelete={remove}
      />

      <MonthPickerDialog
        open={pickerOpen}
        jy={cursor.jy}
        jm={cursor.jm}
        onClose={() => setPickerOpen(false)}
        onConfirm={(jy, jm) => {
          setCursor({ jy, jm });
          setPickerOpen(false);
        }}
      />

      <AllNotesSheet
        open={notesOpen}
        notes={noteList}
        onClose={() => setNotesOpen(false)}
        onOpenDate={(d) => {
          setCursor({ jy: d.jy, jm: d.jm });
          setNotesOpen(false);
          setSelected(d);
        }}
        onDelete={remove}
      />
    </AppShell>
  );
}
