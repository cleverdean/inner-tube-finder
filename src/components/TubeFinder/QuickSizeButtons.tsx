import { cn } from "@/lib/utils";

interface QuickSizeButtonsProps {
  onSelect: (size: string) => void;
  compact?: boolean;
}

const quickSizes = [
  // Brompton sizes
  { label: "Brompton C Line", size: "35-349" },
  { label: "Brompton P Line", size: "35-349" },
  { label: "Brompton T Line", size: "35-349" },
  { label: "Brompton G Line", size: "54-406" },
  // Tern sizes (20" / 406 BSD)
  { label: "Tern 20\" (Wide/Cargo)", size: "60-406" },
  // Urban Arrow sizes
  { label: "Urban Arrow Front", size: "55-406" },
  { label: "Urban Arrow Rear", size: "52-559" },
];

export function QuickSizeButtons({ onSelect, compact = false }: QuickSizeButtonsProps) {
  const displaySizes = compact ? quickSizes.slice(0, 4) : quickSizes;
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <span className="w-full text-center text-sm text-muted-foreground mb-1">
        Quick select:
      </span>
      {displaySizes.map((item) => (
        <button
          key={item.size}
          onClick={() => onSelect(item.size)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full",
            "bg-secondary text-secondary-foreground",
            "hover:bg-primary hover:text-primary-foreground",
            "transition-all duration-200",
            "border border-transparent hover:border-primary"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
