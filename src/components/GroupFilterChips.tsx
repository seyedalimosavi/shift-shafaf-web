import { FILTER_GROUPS, FILTER_GROUP_LABELS, type FilterGroup } from "@/lib/shift";
import { cn } from "@/lib/utils";

export function GroupFilterChips({
  value,
  onChange,
}: {
  value: FilterGroup;
  onChange: (g: FilterGroup) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2" role="tablist" aria-label="فیلتر گروه">
      {FILTER_GROUPS.map((g) => {
        const active = g === value;
        return (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(g)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {g === "ALL" ? FILTER_GROUP_LABELS.ALL : `گروه ${FILTER_GROUP_LABELS[g]}`}
          </button>
        );
      })}
    </div>
  );
}
