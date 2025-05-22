import React from 'react';
import { useCategories } from '@/common/hooks/useCategories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryCard } from './components/CategoryCard';
import { AddCategoryForm } from './components/AddCategoryForm';
import { toast } from 'sonner';

export const CategoriesPage = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();

  const handleCreateCategory = async (data: { name: string; description?: string }) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success('Категория успешно создана');
    } catch (error) {
      toast.error('Ошибка при создании категории');
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (id: number, data: { name: string; description?: string }) => {
    try {
      await updateCategory.mutateAsync({ id, data });
      toast.success('Категория успешно обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении категории');
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Категория успешно удалена');
    } catch (error) {
      toast.error('Ошибка при удалении категории');
      console.error('Error deleting category:', error);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Категории</h1>
        <AddCategoryForm onSubmit={handleCreateCategory} />
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>
    </div>
  );
}; 