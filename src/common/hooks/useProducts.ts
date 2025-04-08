import {api} from "@/common/api";
import {useQuery} from "@tanstack/react-query";

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => api.products.list(),
    });
}

export function useProduct(productId: string) {
    return useQuery({
        queryKey: ["products", productId],
        queryFn: () => api.products.get(productId),
        enabled: !!productId, // Only run if productId exists
    });
}