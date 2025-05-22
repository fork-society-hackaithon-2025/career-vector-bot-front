import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '@/common/api';
import {CreateCategoryDto} from '@/types/category';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.categories.list();
        if (!response.success || !response.data.success) {
          console.error('Categories API error:', response.data.message);
          return [];
        }
        return Array.isArray(response.data.responseObject) ? response.data.responseObject : [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });

  // Ensure categories is always an array
  const categories = Array.isArray(data) ? data : [];

  const createCategory = useMutation({
    mutationFn: async (categoryData: CreateCategoryDto) => {
      const response = await api.categories.create(categoryData);
      if (!response.success || !response.data.success) {
        throw new Error(response.data.message || 'Failed to create category');
      }
      return response.data.responseObject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateCategoryDto> }) => {
      const response = await api.categories.update(id, data);
      if (!response.success || !response.data.success) {
        throw new Error(response.data.message || 'Failed to update category');
      }
      return response.data.responseObject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.categories.delete(id);
      if (!response.success || !response.data.success) {
        throw new Error(response.data.message || 'Failed to delete category');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory
  };
}; 