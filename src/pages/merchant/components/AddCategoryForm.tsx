import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface AddCategoryFormProps {
  onSubmit: (data: { name: string; description?: string }) => void;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onSubmit }) => {
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    description: ''
  });

  const handleNewCategoryChange = (field: keyof typeof newCategory, value: string) => {
    setNewCategory({
      ...newCategory,
      [field]: value
    });
  };

  const handleAddCategory = () => {
    onSubmit({
      name: newCategory.name,
      description: newCategory.description?.toString() ?? ''
    });
    setNewCategory({
      name: '',
      description: ''
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить категорию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить новую категорию</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название категории</Label>
            <Input
              id="name"
              value={newCategory.name}
              onChange={(e) => handleNewCategoryChange('name', e.target.value)}
              placeholder="Введите название категории"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={newCategory.description}
              onChange={(e) => handleNewCategoryChange('description', e.target.value)}
              placeholder="Введите описание категории (необязательно)"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отменить</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddCategory}>Добавить категорию</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 