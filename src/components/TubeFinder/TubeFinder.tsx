import { useState, useCallback } from "react";
import { TubeFinderInput } from "./TubeFinderInput";
import { ValveFilter } from "./ValveFilter";
import { TubeCard } from "./TubeCard";
import { QuickSizeButtons } from "./QuickSizeButtons";
import { ParsedSizeDisplay } from "./ParsedSizeDisplay";
import { DebugPanel } from "./DebugPanel";
import { parseTireSize, ParsedTireSize } from "@/utils/tireSizeParser";
import { findMatchingTubes, TubeMatch } from "@/utils/tubeMatcher";
import { useTubeProducts } from "@/hooks/useTubeProducts";
import { AlertCircle, Bike, Loader2 } from "lucide-react";
import tireSizeFormats from "@/assets/tire-size-formats.webp";

export function TubeFinder() {
  const [inputValue, setInputValue] = useState("");
  const [valveFilter, setValveFilter] = useState<'Presta' | 'Schrader' | null>(null);
  const [parsedSize, setParsedSize] = useState<ParsedTireSize | null>(null);
  const [matches, setMatches] = useState<TubeMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [inputValue, valveFilter, tubes]);

  const handleQuickSelect = (size: string) => {
    setInputValue(size);
    // Trigger search after state update
    setTimeout(() => {
      const parsed = parseTireSize(size);
      if (parsed) {
        setParsedSize(parsed);
        setMatches(findMatchingTubes(parsed, tubes, valveFilter));
        setHasSearched(true);
        setError(null);
      }
    }, 0);
  };

  const handleValveChange = (valve: 'Presta' | 'Schrader' | null) => {
    setValveFilter(valve);
    if (parsedSize) {
      setMatches(findMatchingTubes(parsedSize, tubes, valve));
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
      <div className="mb-6">
        <TubeFinderInput
          value={inputValue}
          onChange={setInputValue}
          onSearch={handleSearch}
        />
      </div>

      {/* Quick size buttons */}
      <div className="mb-6">
        <QuickSizeButtons onSelect={handleQuickSelect} />
      </div>

      {/* Valve filter */}
      <div className="flex justify-center mb-6">
        <ValveFilter value={valveFilter} onChange={handleValveChange} />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Parsed size display */}
      {parsedSize && !error && (
        <div className="mb-6">
          <ParsedSizeDisplay parsed={parsedSize} />
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

      {/* Results */}
      {hasSearched && !error && tubes.length > 0 && (
        <div>
          {matches.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {matches.length} Compatible Tube{matches.length !== 1 ? 's' : ''} Found
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {matches.map((match, index) => (
                  <TubeCard key={match.tube.handle} match={match} index={index} />
                ))}
              </div>
            </>
          ) : parsedSize && (
            <div className="text-center py-12 px-4 bg-muted/50 rounded-xl">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Matching Tubes Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find a tube for {inputValue}. This size might not be in our current catalog. 
                Try adjusting your search or removing the valve filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && tubes.length > 0 && (
        <div className="text-center py-12 px-4 bg-muted/30 rounded-xl border-2 border-dashed border-border">
          <div className="max-w-sm mx-auto">
            <h3 className="font-medium mb-2">How to Find Your Tire Size</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Look on the sidewall of your tire. You'll see markings like:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-background rounded-lg">
                <span className="text-muted-foreground">Road bike:</span>
                <code className="font-mono">700x25c</code>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-background rounded-lg">
                <span className="text-muted-foreground">Mountain bike:</span>
                <code className="font-mono">29x2.25</code>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-background rounded-lg">
                <span className="text-muted-foreground">ETRTO format:</span>
                <code className="font-mono">25-622</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <DebugPanel 
        parsedSize={parsedSize} 
        tubesCount={tubes.length} 
        matchesCount={matches.length}
      />
    </div>
  );
}
