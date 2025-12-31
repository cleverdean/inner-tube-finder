import { useState, useCallback } from "react";
import { TubeFinderInput } from "./TubeFinderInput";
import { ValveFilter } from "./ValveFilter";
import { TubeCard } from "./TubeCard";
import { QuickSizeButtons } from "./QuickSizeButtons";
import { ParsedSizeDisplay } from "./ParsedSizeDisplay";
import { parseTireSize, ParsedTireSize } from "@/utils/tireSizeParser";
import { findMatchingTubes, TubeMatch } from "@/utils/tubeMatcher";
import { useTubeProducts } from "@/hooks/useTubeProducts";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import tireSizeFormats from "@/assets/tire-size-formats.webp";

export function TubeFinder() {
  const [inputValue, setInputValue] = useState("");
  const [valveFilter, setValveFilter] = useState<'Presta' | 'Schrader' | null>(null);
  const [parsedSize, setParsedSize] = useState<ParsedTireSize | null>(null);
  const [matches, setMatches] = useState<TubeMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  // Fetch tube products from Shopify
  const { tubes, isLoading: isLoadingTubes, error: tubesError } = useTubeProducts();

  const handleSearch = useCallback(() => {
    setError(null);
    setHasSearched(true);

    if (!inputValue.trim()) {
      setParsedSize(null);
      setMatches([]);
      setError("Please enter a tire size");
      return;
    }

    const parsed = parseTireSize(inputValue);
    
    if (!parsed) {
      setParsedSize(null);
      setMatches([]);
      setError("Could not parse tire size. Try formats like: 700x25c, 26x2.1, or 23-622 (ETRTO)");
      return;
    }

    setParsedSize(parsed);
    const foundMatches = findMatchingTubes(parsed, tubes, valveFilter);
    setMatches(foundMatches);
    setIsResultsOpen(true);
  }, [inputValue, valveFilter, tubes]);

  const handleQuickSelect = (size: string) => {
    setInputValue(size);
    // Trigger search after state update
    setTimeout(() => {
      const parsed = parseTireSize(size);
      if (parsed) {
        setParsedSize(parsed);
        const foundMatches = findMatchingTubes(parsed, tubes, valveFilter);
        setMatches(foundMatches);
        setHasSearched(true);
        setError(null);
        setIsResultsOpen(true);
      }
    }, 0);
  };

  const handleValveChange = (valve: 'Presta' | 'Schrader' | null) => {
    setValveFilter(valve);
    if (parsedSize) {
      const foundMatches = findMatchingTubes(parsedSize, tubes, valve);
      setMatches(foundMatches);
    }
  };

  // Show loading state while fetching tubes
  if (isLoadingTubes) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading tube catalog...</p>
        </div>
      </div>
    );
  }

  // Show error if tubes failed to load
  if (tubesError) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Failed to load tube catalog: {tubesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Inner Tube Finder
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter your tire size to find the perfect inner tube. We'll match it with compatible options from our catalog.
        </p>
        {tubes.length > 0 && (
          <p className="text-sm text-muted-foreground font-medium mt-2">
            {tubes.length} tubes in catalog
          </p>
        )}
      </div>

      {/* Tire size format reference image */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative max-w-md w-full rounded-xl overflow-hidden border border-border bg-card shadow-sm">
          <img 
            src={tireSizeFormats} 
            alt="Tire size format examples showing ETRTO, Inch, and French sizing systems on a bike tire sidewall" 
            className="w-full h-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Find these markings on your tire sidewall
        </p>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <TubeFinderInput
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
          tubes={tubes}
        />
      </div>

      {/* Quick size buttons */}
      <div className="mb-4">
        <QuickSizeButtons onSelect={handleQuickSelect} />
      </div>

      {/* Valve filter */}
      <div className="flex justify-center mb-2">
        <ValveFilter value={valveFilter} onChange={handleValveChange} />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* No tubes available message */}
      {tubes.length === 0 && !isLoadingTubes && (
        <div className="text-center py-12 px-4 bg-muted/50 rounded-xl">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Tubes Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No tube products with metafield specifications were found in your Shopify store.
            Make sure your products have the required metafields (specs.width_min, specs.width_max, specs.diameter_min, specs.diameter_max, specs.valve_type).
          </p>
        </div>
      )}

      {/* Results Modal */}
      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {matches.length > 0 
                  ? `${matches.length} Compatible Tube${matches.length !== 1 ? 's' : ''} Found`
                  : 'No Matching Tubes'}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Parsed size in modal */}
          {parsedSize && (
            <div className="mb-4">
              <ParsedSizeDisplay parsed={parsedSize} />
            </div>
          )}

          {/* Valve filter in modal for easy adjustment */}
          <div className="flex justify-center mb-4 pb-4 border-b border-border">
            <ValveFilter value={valveFilter} onChange={handleValveChange} />
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2">
            {matches.length > 0 ? (
              <div className="grid gap-4">
                {matches.map((match, index) => (
                  <TubeCard key={match.tube.handle} match={match} index={index} />
                ))}
              </div>
            ) : parsedSize && (
              <div className="text-center py-8 px-4">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Matching Tubes Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find a tube for {inputValue}. This size might not be in our current catalog. 
                  Try removing the valve filter.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
