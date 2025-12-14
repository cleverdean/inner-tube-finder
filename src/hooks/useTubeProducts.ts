import { useState, useEffect } from 'react';
import { TubeSpec, fetchTubeProducts } from '@/lib/shopify';

interface UseTubeProductsResult {
  tubes: TubeSpec[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTubeProducts(productType?: string): UseTubeProductsResult {
  const [tubes, setTubes] = useState<TubeSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchTubeProducts(productType);
      setTubes(data);
    } catch (err) {
      console.error('Error fetching tube products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tube products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productType]);

  return {
    tubes,
    isLoading,
    error,
    refetch: fetchData,
  };
}
