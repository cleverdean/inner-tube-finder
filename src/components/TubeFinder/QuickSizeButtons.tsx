import { cn } from "@/lib/utils";

interface QuickSizeButtonsProps {
  onSelect: (size: string) => void;
}

const quickSizes = [
  // Brompton sizes (16" / 349 BSD)
  { label: "Brompton C Line", size: "16x1-3/8" },
  { label: "Brompton P Line", size: "16x1.35" },
  { label: "Brompton T Line", size: "16x1.35" },
  { label: "Brompton G Line", size: "16x2.0" },
  // Tern sizes (20" / 406 BSD)
  { label: "Tern 20\"", size: "20x1.5" },
  { label: "Tern 20\" Wide", size: "20x1.75" },
  { label: "Tern 24\"", size: "24x1.5" },
];

export function QuickSizeButtons({ onSelect }: QuickSizeButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <span className="w-full text-center text-sm text-muted-foreground mb-1">
        Quick select:
      </span>
      {quickSizes.map((item) => (
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
