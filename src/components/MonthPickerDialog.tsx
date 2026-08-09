import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PERSIAN_MONTHS, toPersianDigits } from "@/lib/jalali";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MonthPickerDialog({
  open,
  jy,
  jm,
  onClose,
  onConfirm,
}: {
  open: boolean;
  jy: number;
  jm: number;
  onClose: () => void;
  onConfirm: (jy: number, jm: number) => void;
}) {
  const [year, setYear] = useState(jy);
  const [month, setMonth] = useState(jm);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
        else {
          setYear(jy);
          setMonth(jm);
        }
      }}
    >
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader className="text-right">
          <DialogTitle>انتخاب ماه و سال</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-2xl bg-muted px-3 py-2">
          <Button variant="ghost" size="icon" aria-label="سال قبل" onClick={() => setYear((y) => y - 1)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
          <span className="text-lg font-bold">{toPersianDigits(year)}</span>
          <Button variant="ghost" size="icon" aria-label="سال بعد" onClick={() => setYear((y) => y + 1)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PERSIAN_MONTHS.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => setMonth(i + 1)}
              className={cn(
                "rounded-xl border px-2 py-2 text-sm font-medium transition-colors",
                month === i + 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <Button onClick={() => onConfirm(year, month)}>تأیید</Button>
      </DialogContent>
    </Dialog>
  );
}
