import { ParsedTireSize, formatParsedSize } from "@/utils/tireSizeParser";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
interface ParsedSizeDisplayProps {
  parsed: ParsedTireSize;
}
export function ParsedSizeDisplay({
  parsed
}: ParsedSizeDisplayProps) {
  const isLowConfidence = parsed.confidence === 'low';
  const isPartialSize = parsed.width === 0;
  return <div className="">
      {isLowConfidence ? <AlertTriangle className="h-5 w-5 text-warning shrink-0" /> : <Check className="h-5 w-5 text-success shrink-0" />}
      
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium">Detected:</span>
          <code className="font-mono text-sm bg-background px-2 py-0.5 rounded">
            {formatParsedSize(parsed)}
          </code>
        </div>
        {isPartialSize && <p className="text-xs text-muted-foreground mt-1">
            Width not specified. Showing all tubes for this wheel size.
          </p>}
        {parsed.format && <p className="text-xs text-muted-foreground mt-1">
            Format: {parsed.format}
          </p>}
      </div>
    </div>;
}