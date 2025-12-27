import { TubeMatch, formatTubeName } from "@/utils/tubeMatcher";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";
import prestaValve from "@/assets/presta-valve.svg";
import schraderValve from "@/assets/schrader-valve.svg";

interface TubeCardProps {
  match: TubeMatch;
  index: number;
}

export function TubeCard({ match, index }: TubeCardProps) {
  const { tube, matchDetails } = match;
  
  const isExactMatch = matchDetails.widthMatch === 'exact' && matchDetails.diameterMatch === 'exact';
  const isEdgeCase = matchDetails.widthMatch === 'edge';

  return (
    <div
      className={cn(
        "relative bg-card rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
        isExactMatch && "border-primary ring-1 ring-primary/20",
        isEdgeCase && "border-muted-foreground/50",
        !isExactMatch && !isEdgeCase && "border-border hover:border-muted-foreground/30"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Match indicator badge */}
      {isExactMatch && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          <Check className="h-3 w-3" />
          Best Match
        </div>
      )}
      {isEdgeCase && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full border">
          <AlertCircle className="h-3 w-3" />
          Edge Fit
        </div>
      )}

      {/* Card content */}
      <div className="flex gap-4">
        {/* Valve icon */}
        <div className={cn(
          "flex flex-col items-center justify-center flex-shrink-0 w-16 py-2 rounded-md",
          tube.valveType === 'Presta' ? "bg-primary/5" : "bg-secondary"
        )}>
          <img 
            src={tube.valveType === 'Presta' ? prestaValve : schraderValve} 
            alt={`${tube.valveType} valve`} 
            className="h-12 w-auto mb-1" 
          />
          <span className={cn(
            "text-xs font-medium",
            tube.valveType === 'Presta' ? "text-primary" : "text-muted-foreground"
          )}>
            {tube.valveType}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2">
            <h3 className="text-sm font-semibold truncate">
              {formatTubeName(tube)}
            </h3>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
            <span>
              <span className="font-medium text-foreground">{tube.widthMin}-{tube.widthMax}</span>mm width
            </span>
            <span>
              <span className="font-medium text-foreground">{tube.valveLength}</span>mm valve
            </span>
            {tube.weight && (
              <span>
                <span className="font-medium text-foreground">{tube.weight}</span>g
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {tube.material}
            </Badge>
            {tube.wheelSizes.map((size) => (
              <Badge key={size} variant="outline" className="text-xs px-2 py-0 font-mono">
                {size}"
              </Badge>
            ))}
            {tube.price && (
              <Badge variant="default" className="text-xs px-2 py-0">
                {tube.price.currencyCode} {parseFloat(tube.price.amount).toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
