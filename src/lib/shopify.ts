import { z } from 'zod';

// Shopify Storefront API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = '1baqf8-w1.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '61fc3e63a937ea2fbf59f025ea6ceeb0';

// Zod schemas for metafield validation
const wheelSizesSchema = z.array(z.string().max(20)).max(50);
const numericMetafieldSchema = z.number().min(0).max(10000);

// GraphQL query to fetch tube products with metafields
const TUBES_QUERY = `
  query GetTubes($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          wheelSizes: metafield(namespace: "specs", key: "wheel_sizes") {
            value
          }
          widthMin: metafield(namespace: "specs", key: "width_min") {
            value
          }
          widthMax: metafield(namespace: "specs", key: "width_max") {
            value
          }
          diameterMin: metafield(namespace: "specs", key: "diameter_min") {
            value
          }
          diameterMax: metafield(namespace: "specs", key: "diameter_max") {
            value
          }
          valveType: metafield(namespace: "specs", key: "valve_type") {
            value
          }
          valveLength: metafield(namespace: "specs", key: "valve_length") {
            value
          }
          itemNumber: metafield(namespace: "specs", key: "item_number") {
            value
          }
          execution: metafield(namespace: "specs", key: "execution") {
            value
          }
          material: metafield(namespace: "specs", key: "material") {
            value
          }
          weight: metafield(namespace: "specs", key: "weight") {
            value
          }
        }
      }
    }
  }
`;

export interface ShopifyTubeProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  wheelSizes: { value: string } | null;
  widthMin: { value: string } | null;
  widthMax: { value: string } | null;
  diameterMin: { value: string } | null;
  diameterMax: { value: string } | null;
  valveType: { value: string } | null;
  valveLength: { value: string } | null;
  itemNumber: { value: string } | null;
  execution: { value: string } | null;
  material: { value: string } | null;
  weight: { value: string } | null;
}

export interface TubeSpec {
  id: string;
  handle: string;
  title: string;
  description: string;
  weight: number | null;
  weightUnit: string;
  wheelSizes: string[];
  valveType: 'Presta' | 'Schrader';
  valveLength: number;
  widthMin: number;
  widthMax: number;
  diameterMin: number;
  diameterMax: number;
  itemNumber: string;
  execution: string;
  material: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  imageUrl: string | null;
  variantId: string;
  availableForSale: boolean;
}

// Storefront API helper function
async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Shopify API error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// Parse wheel sizes from metafield with validation (can be JSON array or comma-separated string)
function parseWheelSizes(value: string | null): string[] {
  if (!value) return [];
  
  try {
    // Try parsing as JSON array first
    const parsed = JSON.parse(value);
    const validated = wheelSizesSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    // If validation fails, fall through to comma-separated parsing
  } catch {
    // Not JSON, try comma-separated
  }
  
  // Handle comma-separated or single value with limits
  const values = value.split(',').map(s => s.trim()).filter(Boolean);
  return values.slice(0, 50).map(v => v.substring(0, 20));
}

// Parse numeric metafield with validation
function parseNumericMetafield(value: string | null): number | null {
  if (!value) return null;
  
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return null;
  
  const validated = numericMetafieldSchema.safeParse(parsed);
  return validated.success ? validated.data : null;
}

// Track skipped products for debugging
export interface SkippedProduct {
  handle: string;
  title: string;
  reason: string;
  rawMetafields: {
    widthMin: string | null;
    widthMax: string | null;
    diameterMin: string | null;
    diameterMax: string | null;
    valveType: string | null;
  };
}

export const debugState = {
  skippedProducts: [] as SkippedProduct[],
  convertedProducts: [] as TubeSpec[],
  rawApiResponse: null as unknown,
};

// Convert Shopify product to TubeSpec
function convertToTubeSpec(product: ShopifyTubeProduct): TubeSpec | null {
  const rawMetafields = {
    widthMin: product.widthMin?.value ?? null,
    widthMax: product.widthMax?.value ?? null,
    diameterMin: product.diameterMin?.value ?? null,
    diameterMax: product.diameterMax?.value ?? null,
    valveType: product.valveType?.value ?? null,
  };

  // Parse numeric metafields with validation
  const widthMin = parseNumericMetafield(rawMetafields.widthMin);
  const widthMax = parseNumericMetafield(rawMetafields.widthMax);
  const diameterMin = parseNumericMetafield(rawMetafields.diameterMin);
  const diameterMax = parseNumericMetafield(rawMetafields.diameterMax);
  
  // Skip products without required tube specifications
  if (widthMin === null || widthMax === null || diameterMin === null || diameterMax === null) {
    const reason = `Missing: ${[
      widthMin === null ? 'widthMin' : null,
      widthMax === null ? 'widthMax' : null,
      diameterMin === null ? 'diameterMin' : null,
      diameterMax === null ? 'diameterMax' : null,
    ].filter(Boolean).join(', ')}`;
    
    debugState.skippedProducts.push({
      handle: product.handle,
      title: product.title,
      reason,
      rawMetafields,
    });
    return null;
  }
  
  const rawValveType = product.valveType?.value;
  const valveType = rawValveType === 'Presta' || rawValveType === 'Schrader' 
    ? rawValveType 
    : rawValveType?.toLowerCase().includes('presta') 
      ? 'Presta' 
      : rawValveType?.toLowerCase().includes('schrader') 
        ? 'Schrader' 
        : null;
        
  if (!valveType) {
    console.log(`Skipping product ${product.handle}: invalid valve type "${rawValveType}"`);
    return null;
  }

  const firstVariant = product.variants.edges[0]?.node;
  const availableForSale = product.variants.edges.some(v => v.node.availableForSale);
  
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    weight: product.weight?.value ? parseFloat(product.weight.value) : null,
    weightUnit: 'g',
    wheelSizes: parseWheelSizes(product.wheelSizes?.value || null),
    valveType,
    valveLength: product.valveLength?.value ? parseInt(product.valveLength.value) : 40,
    widthMin,
    widthMax,
    diameterMin,
    diameterMax,
    itemNumber: product.itemNumber?.value || '',
    execution: product.execution?.value || 'Standard',
    material: product.material?.value || 'Butyl',
    price: product.priceRange.minVariantPrice,
    imageUrl: product.images.edges[0]?.node.url || null,
    variantId: firstVariant?.id || '',
    availableForSale,
  };
}

// Fetch all tube products from Shopify
export async function fetchTubeProducts(productType?: string): Promise<TubeSpec[]> {
  // Reset debug state
  debugState.skippedProducts = [];
  debugState.convertedProducts = [];
  
  // Filter by exact product type for tubes
  const query = productType || 'product_type:"Parts & Accessories - Components - Tubes"';
  
  const response = await storefrontApiRequest<{
    data: {
      products: {
        edges: Array<{ node: ShopifyTubeProduct }>;
      };
    };
  }>(TUBES_QUERY, { first: 100, query });

  // Store raw response for debugging
  debugState.rawApiResponse = response;

  const products = response.data.products.edges;
  const tubes: TubeSpec[] = [];
  
  console.log(`Fetched ${products.length} products from Shopify`);

  for (const { node } of products) {
    const tubeSpec = convertToTubeSpec(node);
    if (tubeSpec) {
      tubes.push(tubeSpec);
      debugState.convertedProducts.push(tubeSpec);
    }
  }

  console.log(`Converted ${tubes.length} tubes, skipped ${debugState.skippedProducts.length} products`);

  return tubes;
}

export { SHOPIFY_STORE_PERMANENT_DOMAIN, SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_TOKEN };
