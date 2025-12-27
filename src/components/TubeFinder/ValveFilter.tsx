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
                  ? "bg-tube-presta/10 border-tube-presta text-tube-presta shadow-md"
                  : option.key === 'Schrader'
                  ? "bg-tube-schrader/10 border-tube-schrader text-tube-schrader shadow-md"
                  : "bg-primary/10 border-primary text-primary shadow-md"
                : "bg-card border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
            )}
          >
            {option.key === 'Presta' && (
              <img 
                src={prestaValve} 
                alt="" 
                className={cn(
                  "h-14 w-auto transition-all",
                  value === option.key ? "opacity-100" : "opacity-60"
                )} 
              />
            )}
            {option.key === 'Schrader' && (
              <img 
                src={schraderValve} 
                alt="" 
                className={cn(
                  "h-14 w-auto transition-all",
                  value === option.key ? "opacity-100" : "opacity-60"
                )} 
              />
            )}
            {option.key === null && (
              <div className="h-14 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            )}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
