import { LOCAL_PRODUCTS } from "@/data/catalog";
import { trpc } from "@/lib/trpc";
import type { CatalogProduct } from "@shared/catalog";

export function useCatalogProducts() {
  const isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === "true";
  const query = trpc.catalog.list.useQuery(undefined, {
    enabled: !isGitHubPages,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    products: (query.data ?? LOCAL_PRODUCTS) as CatalogProduct[],
    isLoading: query.isLoading,
    isUsingFallback: isGitHubPages || Boolean(query.error),
    refetch: query.refetch,
  };
}
