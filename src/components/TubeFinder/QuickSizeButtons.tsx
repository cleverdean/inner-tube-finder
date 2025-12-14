import { cn } from "@/lib/utils";

interface QuickSizeButtonsProps {
  onSelect: (size: string) => void;
}

const quickSizes = [
  { label: "700c Road", size: "700x25c" },
  { label: "29er MTB", size: "29x2.25" },
  { label: "27.5 MTB", size: "27.5x2.1" },
  { label: "26\" MTB", size: "26x2.0" },
  { label: "Gravel", size: "700x40c" },
  { label: "24\" Kids", size: "24x1.75" },
  { label: "20\" BMX", size: "20x1.75" },
  { label: "16\" Kids", size: "16x1.75" },
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
