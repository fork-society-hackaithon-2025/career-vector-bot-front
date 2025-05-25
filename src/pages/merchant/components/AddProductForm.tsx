import React from 'react';
import { CreateProductDto } from '@/types/product';
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
import { BRANDS } from '@/data/brands';
import { useCategories } from '@/common/hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProductFormProps {
  onSubmit: (product: CreateProductDto) => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit }) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [newProduct, setNewProduct] = React.useState<CreateProductDto>({
    name: '',
    brand: BRANDS[0].value,
    categoryId: categories[0]?.id || 0,
    grossPrice: undefined,
    clientPrice: undefined,
    availableAmount: undefined
  });

  // Update category when categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !newProduct.categoryId) {
      setNewProduct(prev => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories]);

  const handleNewProductChange = (field: keyof CreateProductDto, value: string) => {
    let processedValue = value;
    if (field === 'availableAmount' && value !== '') {
      // Round to nearest multiple of 5
      processedValue = (Math.round(Number(value) / 5) * 5).toString();
    }
    
    setNewProduct({
      ...newProduct,
      [field]: field === 'name' || field === 'brand' ? value : processedValue === '' ? undefined : Number(processedValue)
    });
  };

  const handleAddProduct = () => {
    onSubmit(newProduct);
    setNewProduct({
      name: '',
      brand: BRANDS[0].value,
      categoryId: categories[0]?.id || 0,
      grossPrice: undefined,
      clientPrice: undefined,
      availableAmount: undefined
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить новый товар</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название товара</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => handleNewProductChange('name', e.target.value)}
              placeholder="Введите название товара"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Бренд</Label>
            <Select
              value={newProduct.brand}
              onValueChange={(value) => handleNewProductChange('brand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите бренд" />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select
              value={newProduct.categoryId.toString()}
              onValueChange={(value) => handleNewProductChange('categoryId', value)}
              disabled={isLoadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossPrice">Цена гросс</Label>
              <Input
                id="grossPrice"
                type="number"
                min="0"
                step="0.01"
                value={newProduct.grossPrice?.toString() || ''}
                onChange={(e) => handleNewProductChange('grossPrice', e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPrice">Цена для клиента</Label>
              <Input
                id="clientPrice"
                type="number"
                min="0"
                step="0.01"
                value={newProduct.clientPrice?.toString() || ''}
                onChange={(e) => handleNewProductChange('clientPrice', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availableAmount">Количество товара в наличии</Label>
            <Input
              id="availableAmount"
              type="number"
              min="0"
              step="5"
              value={newProduct.availableAmount?.toString() || ''}
              onChange={(e) => handleNewProductChange('availableAmount', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отменить</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddProduct}>Добавить товар</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 