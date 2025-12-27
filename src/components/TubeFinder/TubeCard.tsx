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
        "relative bg-card rounded-xl border-2 transition-all duration-300 animate-slide-up hover:shadow-xl overflow-hidden",
        isExactMatch && "border-accent glow-gold shadow-lg",
        isEdgeCase && "border-accent/50",
        !isExactMatch && !isEdgeCase && "border-primary/20 hover:border-primary/40"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Match indicator */}
      {isExactMatch && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 bg-gradient-gold text-primary-foreground text-xs font-semibold rounded-full z-10 shadow-md">
          <Check className="h-3 w-3" />
          Best Match
        </div>
      )}
      {isEdgeCase && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 bg-gradient-aubergine text-primary-foreground text-xs font-semibold rounded-full z-10 shadow-md">
          <AlertCircle className="h-3 w-3" />
          Edge Fit
        </div>
      )}

      <div className="flex items-stretch">
        {/* Left column - Large valve icon */}
        <div 
          className={cn(
            "flex flex-col items-center justify-center p-4 min-w-[100px]",
            tube.valveType === 'Presta' 
              ? "bg-tube-presta/15" 
              : "bg-tube-schrader/15"
          )}
        >
          <img 
            src={tube.valveType === 'Presta' ? prestaValve : schraderValve} 
            alt={`${tube.valveType} valve`} 
            className="h-20 w-auto mb-2" 
          />
          <span 
            className={cn(
              "text-xs font-semibold",
              tube.valveType === 'Presta' 
                ? "text-tube-presta" 
                : "text-tube-schrader"
            )}
          >
            {tube.valveType}
          </span>
        </div>

        {/* Right column - Content */}
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold leading-tight mb-1">
              {tube.itemNumber}
            </h3>
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
      </div>
    </div>
  );
}
