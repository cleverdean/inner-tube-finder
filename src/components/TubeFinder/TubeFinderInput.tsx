import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSuggestions } from "@/utils/tireSizeParser";
import { cn } from "@/lib/utils";

interface TubeFinderInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function TubeFinderInput({ value, onChange, onSearch }: TubeFinderInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setSelectedIndex(-1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        onChange(suggestions[selectedIndex]);
        setShowSuggestions(false);
        // Auto-search after selecting suggestion
        setTimeout(() => onSearch(), 0);
      } else {
        onSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    // Auto-search after clicking suggestion
    setTimeout(() => onSearch(), 0);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Enter tire size (e.g., 700x25c, 26x2.1, 29x2.25)"
          className="pl-12 pr-24 h-14 text-lg font-mono bg-white border-2 border-border focus:border-accent focus:ring-0 transition-all shadow-sm"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-secondary transition-colors"
            type="button"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        <Button
          onClick={onSearch}
          variant="gold"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 font-semibold"
        >
          Find
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden animate-fade-in"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left font-mono text-sm transition-colors",
                "hover:bg-muted",
                index === selectedIndex && "bg-muted"
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
