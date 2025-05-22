import React from 'react';
import { Category } from '@/types/category';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CategoryCardProps {
  category: Category;
  onUpdate: (id: number, data: { name: string; description?: string }) => void;
  onDelete: (id: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onUpdate, onDelete }) => {
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const handleEditingChange = (field: keyof Category, value: string) => {
    if (!editingCategory) return;
    
    setEditingCategory({
      ...editingCategory,
      [field]: value
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    onUpdate(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description?.toString() ?? ''
    });
    setEditingCategory(null);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{category.name}</h3>
            {category.description && category.description.toString().trim() !== '' && (
              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Создано: {new Date(category.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Изменить категорию</DialogTitle>
                </DialogHeader>
                {editingCategory && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Название категории</Label>
                      <Input
                        id="edit-name"
                        value={editingCategory.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Описание</Label>
                      <Textarea
                        id="edit-description"
                        value={editingCategory.description || ''}
                        onChange={(e) => handleEditingChange('description', e.target.value)}
                        placeholder="Введите описание категории (необязательно)"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Отменить</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleUpdateCategory}>Изменить категорию</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Удалить категорию</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Вы уверены, что хотите удалить категорию "{category.name}"?</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Это действие нельзя отменить.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Отменить</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button 
                      variant="destructive"
                      onClick={() => onDelete(category.id)}
                    >
                      Удалить
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 