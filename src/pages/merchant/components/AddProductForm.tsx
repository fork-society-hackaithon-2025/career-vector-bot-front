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
  const [availableAmountInput, setAvailableAmountInput] = React.useState<string>('');

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
    if (field === 'availableAmount') {
      setAvailableAmountInput(value);
    } else {
      setNewProduct({
        ...newProduct,
        [field]: field === 'name' || field === 'brand' ? value : value === '' ? undefined : Number(value)
      });
    }
  };

  const handleAvailableAmountBlur = () => {
    if (availableAmountInput === '') {
      setNewProduct(prev => ({ ...prev, availableAmount: undefined }));
      return;
    }
    const roundedValue = Math.round(Number(availableAmountInput) / 5) * 5;
    setAvailableAmountInput(roundedValue.toString());
    setNewProduct(prev => ({ ...prev, availableAmount: roundedValue }));
  };

  const handleAddProduct = () => {
    // Ensure the final value is rounded before submit
    const roundedValue = availableAmountInput === '' ? undefined : Math.round(Number(availableAmountInput) / 5) * 5;
    onSubmit({
      ...newProduct,
      availableAmount: roundedValue
    });
    setNewProduct({
      name: '',
      brand: BRANDS[0].value,
      categoryId: categories[0]?.id || 0,
      grossPrice: undefined,
      clientPrice: undefined,
      availableAmount: undefined
    });
    setAvailableAmountInput('');
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
              value={availableAmountInput}
              onChange={(e) => handleNewProductChange('availableAmount', e.target.value)}
              onBlur={handleAvailableAmountBlur}
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