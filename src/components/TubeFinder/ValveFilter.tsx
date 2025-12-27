import { cn } from "@/lib/utils";
import prestaValve from "@/assets/presta-valve.svg";
import schraderValve from "@/assets/schrader-valve.svg";
import allValves from "@/assets/all-valves.svg";

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
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">Valve Type:</span>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.key ?? 'all'}
            onClick={() => onChange(option.key)}
            className={cn(
              "flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-w-[80px]",
              value === option.key
                ? option.key === 'Presta'
                  ? "bg-tube-presta/10 border-tube-presta text-tube-presta"
                  : option.key === 'Schrader'
                  ? "bg-tube-schrader/10 border-tube-schrader text-tube-schrader"
                  : "bg-primary/10 border-primary text-primary"
                : "bg-card border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
            )}
          >
            {option.key === 'Presta' && (
              <div className="h-14 flex items-center justify-center">
                <img 
                  src={prestaValve} 
                  alt="" 
                  className={cn(
                    "h-full w-auto transition-all",
                    value === option.key ? "opacity-100" : "opacity-60"
                  )} 
                />
              </div>
            )}
            {option.key === 'Schrader' && (
              <div className="h-14 flex items-center justify-center">
                <img 
                  src={schraderValve} 
                  alt="" 
                  className={cn(
                    "h-full w-auto transition-all",
                    value === option.key ? "opacity-100" : "opacity-60"
                  )} 
                />
              </div>
            )}
            {option.key === null && (
              <div className="h-14 flex items-center justify-center">
                <img 
                  src={allValves} 
                  alt="" 
                  className={cn(
                    "h-full w-auto transition-all",
                    value === option.key ? "opacity-100" : "opacity-60"
                  )} 
                />
              </div>
            )}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
