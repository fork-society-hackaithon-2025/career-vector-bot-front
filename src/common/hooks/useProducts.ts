import {api} from "@/common/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {CreateProductDto, UpdateProductDto} from "@/types/product";
import {toast} from "sonner";
import {useAuth} from "@/contexts/AuthContext";

export const useProducts = () => {
    const { token } = useAuth();
    
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.products.list();
            return response.data.responseObject || [];
        },
        enabled: !!token,
    });
};

export function useProduct(productId: number) {
    return useQuery({
        queryKey: ["products", productId],
        queryFn: () => api.products.get(productId),
        enabled: !!productId,
    });
}

export function useProductsBatch(productIds: number[]) {
    return useQuery({
        queryKey: ['products', 'batch', productIds],
        queryFn: async () => {
            const response = await api.products.batch(productIds);
            return response.data.responseObject || [];
        },
        enabled: productIds.length > 0,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: CreateProductDto) => api.products.create(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created successfully");
        },
        onError: (error) => {
            toast.error("Failed to create product");
            console.error("Error creating product:", error);
        }
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, product }: { id: number; product: UpdateProductDto }) =>
            api.products.update(id, product),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", id] });
            toast.success("Product updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update product");
            console.error("Error updating product:", error);
        }
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.products.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete product");
            console.error("Error deleting product:", error);
        }
    });
}