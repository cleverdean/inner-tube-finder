import { TubeSpec } from "@/lib/shopify";
import { ParsedTireSize } from "./tireSizeParser";

export interface TubeMatch {
  tube: TubeSpec;
  matchScore: number;
  matchDetails: {
    widthMatch: 'exact' | 'compatible' | 'edge';
    diameterMatch: 'exact' | 'compatible';
  };
}

/**
 * Find tubes that match the given tire size from provided tube list
 */
export function findMatchingTubes(
  parsedSize: ParsedTireSize,
  tubes: TubeSpec[],
  valveFilter?: 'Presta' | 'Schrader' | null
): TubeMatch[] {
  const matches: TubeMatch[] = [];

  for (const tube of tubes) {
    // Check diameter compatibility
    const diameterMatch = checkDiameterMatch(parsedSize.diameter, tube);
    if (!diameterMatch) continue;

    // Check valve filter
    if (valveFilter && tube.valveType !== valveFilter) continue;

    // Check width compatibility (if width is specified)
    let widthMatch: 'exact' | 'compatible' | 'edge' | null = null;
    
    if (parsedSize.width > 0) {
      widthMatch = checkWidthMatch(parsedSize.width, tube);
      if (!widthMatch) continue;
    } else {
      // If no width specified, consider all diameter-matching tubes
      widthMatch = 'compatible';
    }

    // Calculate match score
    const matchScore = calculateMatchScore(parsedSize, tube, widthMatch, diameterMatch);

    matches.push({
      tube,
      matchScore,
      matchDetails: {
        widthMatch,
        diameterMatch
      }
    });
  }

  // Sort by match score (higher is better)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function checkDiameterMatch(diameter: number, tube: TubeSpec): 'exact' | 'compatible' | null {
  // Exact match
  if (diameter >= tube.diameterMin && diameter <= tube.diameterMax) {
    if (tube.diameterMin === tube.diameterMax && diameter === tube.diameterMin) {
      return 'exact';
    }
    return 'compatible';
  }
  
  // Allow small tolerance (±3mm) for edge cases
  const tolerance = 3;
  if (
    diameter >= tube.diameterMin - tolerance && 
    diameter <= tube.diameterMax + tolerance
  ) {
    return 'compatible';
  }

  return null;
}

function checkWidthMatch(width: number, tube: TubeSpec): 'exact' | 'compatible' | 'edge' | null {
  // Exact fit (width in middle 50% of range)
  const rangeMiddleStart = tube.widthMin + (tube.widthMax - tube.widthMin) * 0.25;
  const rangeMiddleEnd = tube.widthMax - (tube.widthMax - tube.widthMin) * 0.25;
  
  if (width >= rangeMiddleStart && width <= rangeMiddleEnd) {
    return 'exact';
  }
  
  // Compatible (within the full range)
  if (width >= tube.widthMin && width <= tube.widthMax) {
    return 'compatible';
  }
  
  // Edge case (within 5mm tolerance on either side)
  const tolerance = 5;
  if (
    width >= tube.widthMin - tolerance && 
    width <= tube.widthMax + tolerance
  ) {
    return 'edge';
  }

  return null;
}

function calculateMatchScore(
  parsedSize: ParsedTireSize,
  tube: TubeSpec,
  widthMatch: 'exact' | 'compatible' | 'edge',
  diameterMatch: 'exact' | 'compatible'
): number {
  let score = 0;

  // Diameter match scoring
  if (diameterMatch === 'exact') score += 50;
  else if (diameterMatch === 'compatible') score += 40;

  // Width match scoring
  if (widthMatch === 'exact') score += 50;
  else if (widthMatch === 'compatible') score += 35;
  else if (widthMatch === 'edge') score += 15;

  // Bonus for premium materials
  if (tube.material === 'TPU') score += 5;
  if (tube.execution === 'Aerothan') score += 3;

  // Slight preference for lighter tubes
  if (tube.weight && tube.weight < 100) score += 2;

  return score;
}

/**
 * Get all unique wheel sizes from tube data
 */
export function getAvailableWheelSizes(tubes: TubeSpec[]): string[] {
  const sizes = new Set<string>();
  for (const tube of tubes) {
    for (const size of tube.wheelSizes) {
      sizes.add(size);
    }
  }
  return Array.from(sizes).sort((a, b) => {
    const numA = parseFloat(a.replace(/[^\d.]/g, ''));
    const numB = parseFloat(b.replace(/[^\d.]/g, ''));
    return numB - numA;
  });
}

/**
 * Format tube name from handle
 */
export function formatTubeName(tube: TubeSpec): string {
  return tube.title;
}

/**
 * Get tube size range string
 */
export function getTubeSizeRange(tube: TubeSpec): string {
  return `${tube.widthMin}-${tube.widthMax}mm width, ${tube.diameterMin}mm BSD`;
}
