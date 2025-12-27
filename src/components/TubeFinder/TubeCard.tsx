import { TubeMatch, formatTubeName } from "@/utils/tubeMatcher";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Weight, Ruler, Gauge, DollarSign } from "lucide-react";
import prestaValve from "@/assets/presta-valve.svg";
import schraderValve from "@/assets/schrader-valve.svg";

interface TubeCardProps {
  match: TubeMatch;
  index: number;
}

export function TubeCard({ match, index }: TubeCardProps) {
  const { tube, matchScore, matchDetails } = match;
  
  const isExactMatch = matchDetails.widthMatch === 'exact' && matchDetails.diameterMatch === 'exact';
  const isEdgeCase = matchDetails.widthMatch === 'edge';

  return (
    <div
      className={cn(
        "relative p-5 bg-card rounded-xl border-2 transition-all duration-300 animate-slide-up hover:shadow-lg",
        isExactMatch && "border-primary/50 shadow-md",
        isEdgeCase && "border-warning/50",
        !isExactMatch && !isEdgeCase && "border-border"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Match indicator */}
      {isExactMatch && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          <Check className="h-3 w-3" />
          Best Match
        </div>
      )}
      {isEdgeCase && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-warning text-warning-foreground text-xs font-medium rounded-full">
          <AlertCircle className="h-3 w-3" />
          Edge Fit
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold leading-tight">
            {tube.itemNumber}
          </h3>
          <Badge
            className={cn(
              "shrink-0 flex items-center gap-1",
              tube.valveType === 'Presta' 
                ? "bg-tube-presta text-white" 
                : "bg-tube-schrader text-white"
            )}
          >
            <img 
              src={tube.valveType === 'Presta' ? prestaValve : schraderValve} 
              alt="" 
              className="h-6 w-auto brightness-0 invert" 
            />
            {tube.valveType}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {formatTubeName(tube)}
        </p>
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">
            {tube.widthMin}-{tube.widthMax}mm
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{tube.valveLength}mm valve</span>
        </div>
        {tube.weight && (
          <div className="flex items-center gap-2 text-sm">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">{tube.weight}g</span>
          </div>
        )}
        {tube.price && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-primary">
              {tube.price.currencyCode} {parseFloat(tube.price.amount).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">BSD:</span>
          <span className="font-mono">
            {tube.diameterMin === tube.diameterMax 
              ? `${tube.diameterMin}mm` 
              : `${tube.diameterMin}-${tube.diameterMax}mm`}
          </span>
        </div>
      </div>

      {/* Material badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {tube.material}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {tube.execution}
        </Badge>
        {tube.wheelSizes.map((size) => (
          <Badge key={size} variant="outline" className="text-xs font-mono">
            {size}"
          </Badge>
        ))}
      </div>
    </div>
  );
}
