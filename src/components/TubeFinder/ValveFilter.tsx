import { cn } from "@/lib/utils";
import prestaValve from "@/assets/presta-valve.svg";
import schraderValve from "@/assets/schrader-valve.svg";

interface ValveFilterProps {
  value: 'Presta' | 'Schrader' | null;
  onChange: (value: 'Presta' | 'Schrader' | null) => void;
}

export function ValveFilter({ value, onChange }: ValveFilterProps) {
  const options: Array<{ key: 'Presta' | 'Schrader' | null; label: string }> = [
    { key: null, label: 'All Valves' },
    { key: 'Presta', label: 'Presta' },
    { key: 'Schrader', label: 'Schrader' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Valve Type:</span>
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {options.map((option) => (
          <button
            key={option.key ?? 'all'}
            onClick={() => onChange(option.key)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5",
              value === option.key
                ? option.key === 'Presta'
                  ? "bg-tube-presta text-white shadow-sm"
                  : option.key === 'Schrader'
                  ? "bg-tube-schrader text-white shadow-sm"
                  : "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.key === 'Presta' && (
              <img src={prestaValve} alt="" className="h-4 w-4" />
            )}
            {option.key === 'Schrader' && (
              <img src={schraderValve} alt="" className="h-4 w-4" />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
