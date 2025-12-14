// Shopify Storefront API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = '1baqf8-w1.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '61fc3e63a937ea2fbf59f025ea6ceeb0';

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
          wheelSizes: metafield(namespace: "custom", key: "wheel_sizes") {
            value
          }
          widthMin: metafield(namespace: "custom", key: "width_min") {
            value
          }
          widthMax: metafield(namespace: "custom", key: "width_max") {
            value
          }
          diameterMin: metafield(namespace: "custom", key: "diameter_min") {
            value
          }
          diameterMax: metafield(namespace: "custom", key: "diameter_max") {
            value
          }
          valveType: metafield(namespace: "custom", key: "valve_type") {
            value
          }
          valveLength: metafield(namespace: "custom", key: "valve_length") {
            value
          }
          itemNumber: metafield(namespace: "custom", key: "item_number") {
            value
          }
          execution: metafield(namespace: "custom", key: "execution") {
            value
          }
          material: metafield(namespace: "custom", key: "material") {
            value
          }
          weight: metafield(namespace: "custom", key: "weight") {
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

// Parse wheel sizes from metafield (can be JSON array or comma-separated string)
function parseWheelSizes(value: string | null): string[] {
  if (!value) return [];
  
  try {
    // Try parsing as JSON array first
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // Not JSON, try comma-separated
  }
  
  // Handle comma-separated or single value
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

// Convert Shopify product to TubeSpec
function convertToTubeSpec(product: ShopifyTubeProduct): TubeSpec | null {
  const widthMin = product.widthMin?.value ? parseFloat(product.widthMin.value) : null;
  const widthMax = product.widthMax?.value ? parseFloat(product.widthMax.value) : null;
  const diameterMin = product.diameterMin?.value ? parseFloat(product.diameterMin.value) : null;
  const diameterMax = product.diameterMax?.value ? parseFloat(product.diameterMax.value) : null;
  
  // Log metafield values for debugging
  console.log(`Product ${product.handle} metafields:`, {
    widthMin: product.widthMin?.value,
    widthMax: product.widthMax?.value,
    diameterMin: product.diameterMin?.value,
    diameterMax: product.diameterMax?.value,
    valveType: product.valveType?.value,
  });
  
  // Skip products without required tube specifications
  if (widthMin === null || widthMax === null || diameterMin === null || diameterMax === null) {
    console.log(`Skipping product ${product.handle}: missing dimension metafields`);
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
  };
}

// Fetch all tube products from Shopify
export async function fetchTubeProducts(productType?: string): Promise<TubeSpec[]> {
  // Default to searching for tubes by product type containing "Tubes"
  const query = productType || 'product_type:*Tubes*';
  
  const response = await storefrontApiRequest<{
    data: {
      products: {
        edges: Array<{ node: ShopifyTubeProduct }>;
      };
    };
  }>(TUBES_QUERY, { first: 100, query });

  const products = response.data.products.edges;
  const tubes: TubeSpec[] = [];
  
  console.log(`Fetched ${products.length} products from Shopify`);

  for (const { node } of products) {
    const tubeSpec = convertToTubeSpec(node);
    if (tubeSpec) {
      tubes.push(tubeSpec);
    }
  }

  return tubes;
}

export { SHOPIFY_STORE_PERMANENT_DOMAIN, SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_TOKEN };
