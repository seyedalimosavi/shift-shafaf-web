import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ShiftInfo, type ShiftStatus } from "@/lib/shift";

const statusClass: Record<ShiftStatus, string> = {
  DAY: "bg-day text-day-foreground",
  NIGHT: "bg-night text-night-foreground",
  REST: "bg-rest text-rest-foreground",
};

export function ShiftBadge({
  shift,
  size = "md",
  showCode = false,
  className,
}: {
  shift: ShiftInfo;
  size?: "xs" | "sm" | "md";
  showCode?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        statusClass[shift.status],
        size === "xs" && "px-1.5 py-0.5 text-[10px]",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        className,
      )}
      title={shift.label}
    >
      {showCode ? shift.label : STATUS_LABELS[shift.status]}
    </span>
  );
}

export function GroupShiftChip({
  group,
  shift,
}: {
  group: string;
  shift: ShiftInfo;
}) {
  return (
    <span
      className={cn(
        "flex h-4 min-w-0 flex-1 items-center justify-center rounded-[4px] text-[9px] font-bold leading-none",
        statusClass[shift.status],
      )}
      title={`شیفت ${group}: ${shift.statusLabel}`}
    >
      {group}
    </span>
  );
}
