import { bsdMapping } from "@/data/tubeData";

export interface ParsedTireSize {
  width: number;
  diameter: number; // BSD in mm
  originalInput: string;
  format: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Parses various tire size formats and returns standardized width and BSD
 * 
 * Supported formats:
 * - ISO/ETRTO: 23-622, 50-559
 * - Metric road: 700x23c, 700x25
 * - Imperial MTB: 26x2.1, 29x2.25
 * - Decimal MTB: 27.5x2.0
 * - Fractional: 26x1-3/8
 */
export function parseTireSize(input: string): ParsedTireSize | null {
  const cleaned = input.trim().toLowerCase().replace(/\s+/g, '');
  
  if (!cleaned) return null;

  // Try ISO/ETRTO format first: width-diameter (e.g., "23-622", "50-559")
  const isoMatch = cleaned.match(/^(\d+)[x\-](\d{3})$/);
  if (isoMatch) {
    const width = parseInt(isoMatch[1], 10);
    const diameter = parseInt(isoMatch[2], 10);
    
    if (width > 0 && width < 150 && diameter >= 200 && diameter <= 700) {
      return {
        width,
        diameter,
        originalInput: input,
        format: 'ISO/ETRTO',
        confidence: 'high'
      };
    }
  }

  // Road format: 700x23c, 700x25, 700c-23, 650bx47, 650cx23
  const roadMatch = cleaned.match(/^(700|650)([abc])?[cx]?[x\-]?(\d+)?c?$/);
  if (roadMatch) {
    const wheelBase = roadMatch[1];
    const letter = roadMatch[2];
    const widthStr = roadMatch[3];
    const width = widthStr ? parseInt(widthStr, 10) : 0;
    
    let diameter: number;
    if (wheelBase === '700') {
      diameter = 622;
    } else {
      // 650 - use letter to determine BSD
      const lookupKey = letter ? `650${letter}` : '650b';
      diameter = bsdMapping[lookupKey] || 584;
    }
    
    return {
      width,
      diameter,
      originalInput: input,
      format: 'Road Metric',
      confidence: width > 0 ? 'high' : 'low'
    };
  }

  // MTB/BMX decimal format: 26x2.1, 29x2.25, 27.5x2.0
  const mtbDecimalMatch = cleaned.match(/^(\d+\.?\d*)[x\-](\d+\.?\d*)$/);
  if (mtbDecimalMatch) {
    const wheelSize = mtbDecimalMatch[1];
    const widthValue = parseFloat(mtbDecimalMatch[2]);
    
    // Convert inches to mm if it looks like an inch measurement
    let width: number;
    if (widthValue < 10) {
      // Likely inches, convert to mm (approximate)
      width = Math.round(widthValue * 25.4);
    } else {
      width = Math.round(widthValue);
    }
    
    const diameter = bsdMapping[wheelSize] || bsdMapping[wheelSize.split('.')[0]];
    
    if (diameter) {
      return {
        width,
        diameter,
        originalInput: input,
        format: 'MTB Decimal',
        confidence: 'high'
      };
    }
  }

  // Fractional format: 26x1-3/8, 26x1 3/8
  const fractionalMatch = cleaned.match(/^(\d+)[x\-](\d+)[\-\s]?(\d+)\/(\d+)$/);
  if (fractionalMatch) {
    const wheelSize = fractionalMatch[1];
    const whole = parseInt(fractionalMatch[2], 10);
    const numerator = parseInt(fractionalMatch[3], 10);
    const denominator = parseInt(fractionalMatch[4], 10);
    const inchWidth = whole + (numerator / denominator);
    const width = Math.round(inchWidth * 25.4);
    const diameter = bsdMapping[wheelSize];
    
    if (diameter) {
      return {
        width,
        diameter,
        originalInput: input,
        format: 'Fractional',
        confidence: 'medium'
      };
    }
  }

  // Simple wheel size only: 26, 27.5, 700c, 29, 650a, 650b, 650c
  const wheelOnlyMatch = cleaned.match(/^(700c?|650[abc]?|\d+\.?\d*)$/);
  if (wheelOnlyMatch) {
    let wheelSize = wheelOnlyMatch[1];
    // For 650 with letter, keep full key; otherwise strip trailing c
    if (!wheelSize.startsWith('650')) {
      wheelSize = wheelSize.replace(/c$/, '');
    }
    const diameter = bsdMapping[wheelSize] || bsdMapping[wheelSize.toLowerCase()];
    
    if (diameter) {
      return {
        width: 0, // Unknown width
        diameter,
        originalInput: input,
        format: 'Wheel Size Only',
        confidence: 'low'
      };
    }
  }

  // Just a diameter in mm (for direct ETRTO input)
  const diameterOnlyMatch = cleaned.match(/^(\d{3})$/);
  if (diameterOnlyMatch) {
    const diameter = parseInt(diameterOnlyMatch[1], 10);
    if (diameter >= 200 && diameter <= 700) {
      return {
        width: 0,
        diameter,
        originalInput: input,
        format: 'BSD Only',
        confidence: 'low'
      };
    }
  }

  return null;
}

/**
 * Get suggestions based on partial input
 */
export function getSuggestions(input: string): string[] {
  const cleaned = input.trim().toLowerCase();
  if (!cleaned || cleaned.length < 2) return [];

  const suggestions: string[] = [];

  // Common size suggestions
  const commonSizes = [
    "700x23c", "700x25c", "700x28c", "700x32c", "700x35c",
    "650bx47", "650bx42", "650cx23", "650cx25",
    "29x2.0", "29x2.1", "29x2.25", "29x2.3",
    "27.5x2.0", "27.5x2.1", "27.5x2.25", "27.5x2.3",
    "26x1.5", "26x1.75", "26x2.0", "26x2.1", "26x2.25",
    "24x1.75", "24x2.0", "24x2.1",
    "20x1.5", "20x1.75", "20x2.0",
    "16x1.75", "16x2.0"
  ];

  for (const size of commonSizes) {
    if (size.toLowerCase().includes(cleaned)) {
      suggestions.push(size);
    }
  }

  return suggestions.slice(0, 6);
}

/**
 * Format a parsed size back to a human-readable string
 */
export function formatParsedSize(parsed: ParsedTireSize): string {
  if (parsed.width === 0) {
    return `BSD: ${parsed.diameter}mm`;
  }
  return `${parsed.width}-${parsed.diameter} (ETRTO)`;
}
