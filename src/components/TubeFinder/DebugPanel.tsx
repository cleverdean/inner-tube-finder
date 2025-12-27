import { useState } from "react";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";
import { debugState } from "@/lib/shopify";
import { matchDebugState } from "@/utils/tubeMatcher";
import { ParsedTireSize } from "@/utils/tireSizeParser";

interface DebugPanelProps {
  parsedSize: ParsedTireSize | null;
  tubesCount: number;
  matchesCount: number;
}

export function DebugPanel({ parsedSize, tubesCount, matchesCount }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'skipped' | 'converted' | 'rejections'>('skipped');

  return (
    <div className="mt-8 border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Debug Panel</span>
          <span className="text-xs text-muted-foreground">
            ({tubesCount} converted, {debugState.skippedProducts.length} skipped, {matchDebugState.rejections.length} rejected)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Search info */}
          {parsedSize && (
            <div className="p-4 bg-muted/30 border-b border-border">
              <h4 className="text-sm font-medium mb-2">Parsed Search:</h4>
              <div className="text-xs font-mono bg-background p-2 rounded">
                Width: {parsedSize.width}mm | Diameter: {parsedSize.diameter}mm | Format: {parsedSize.format}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('skipped')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'skipped' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted/50'
              }`}
            >
              Skipped ({debugState.skippedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('converted')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'converted' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted/50'
              }`}
            >
              Converted ({tubesCount})
            </button>
            <button
              onClick={() => setActiveTab('rejections')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'rejections' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted/50'
              }`}
            >
              Rejections ({matchDebugState.rejections.length})
            </button>
          </div>

          {/* Tab content */}
          <div className="p-4 max-h-96 overflow-auto">
            {activeTab === 'skipped' && (
              <div className="space-y-2">
                {debugState.skippedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products were skipped.</p>
                ) : (
                  debugState.skippedProducts.map((product, i) => (
                    <div key={i} className="text-xs bg-destructive/10 border border-destructive/20 rounded p-3">
                      <div className="font-medium text-destructive mb-1">{product.title}</div>
                      <div className="text-muted-foreground mb-2">Handle: {product.handle}</div>
                      <div className="text-destructive mb-2">Reason: {product.reason}</div>
                      <div className="font-mono bg-background p-2 rounded">
                        <div>widthMin: {product.rawMetafields.widthMin ?? 'null'}</div>
                        <div>widthMax: {product.rawMetafields.widthMax ?? 'null'}</div>
                        <div>diameterMin: {product.rawMetafields.diameterMin ?? 'null'}</div>
                        <div>diameterMax: {product.rawMetafields.diameterMax ?? 'null'}</div>
                        <div>valveType: {product.rawMetafields.valveType ?? 'null'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'converted' && (
              <div className="space-y-2">
                {debugState.convertedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products were converted.</p>
                ) : (
                  debugState.convertedProducts.map((tube, i) => (
                    <div key={i} className="text-xs bg-primary/10 border border-primary/20 rounded p-3">
                      <div className="font-medium text-primary mb-1">{tube.title}</div>
                      <div className="text-muted-foreground mb-2">{tube.itemNumber}</div>
                      <div className="font-mono bg-background p-2 rounded">
                        <div>Width: {tube.widthMin}-{tube.widthMax}mm</div>
                        <div>Diameter: {tube.diameterMin}-{tube.diameterMax}mm</div>
                        <div>Valve: {tube.valveType}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'rejections' && (
              <div className="space-y-2">
                {matchDebugState.rejections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {parsedSize ? 'No tubes were rejected for this search.' : 'Perform a search to see rejections.'}
                  </p>
                ) : (
                  matchDebugState.rejections.map((rejection, i) => (
                    <div key={i} className="text-xs bg-amber-500/10 border border-amber-500/20 rounded p-3">
                      <div className="font-medium text-amber-600 mb-1">{rejection.tube.title}</div>
                      <div className="text-destructive mb-2">{rejection.reason}</div>
                      <div className="font-mono bg-background p-2 rounded text-muted-foreground">
                        <div>Input: {rejection.details.inputWidth}mm × {rejection.details.inputDiameter}mm BSD</div>
                        <div>Tube width: {rejection.details.tubeWidthRange}</div>
                        <div>Tube diameter: {rejection.details.tubeDiameterRange}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
