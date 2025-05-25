import React from 'react';
import { Product } from '@/types/product';
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
import { BRANDS } from '@/data/brands';
import { useCategories } from '@/common/hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [availableAmountInput, setAvailableAmountInput] = React.useState<string>('');

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
  };

  // Update availableAmountInput when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setAvailableAmountInput(editingProduct.availableAmount.toString());
    }
  }, [editingProduct]);

  const handleEditingChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    
    if (field === 'availableAmount') {
      setAvailableAmountInput(value.toString());
    } else {
      setEditingProduct({
        ...editingProduct,
        [field]: field === 'name' || field === 'brand' ? value : Number(value)
      });
    }
  };

  const handleAvailableAmountBlur = () => {
    if (!editingProduct) return;
    const roundedValue = Math.round(Number(availableAmountInput) / 5) * 5;
    setAvailableAmountInput(roundedValue.toString());
    setEditingProduct({
      ...editingProduct,
      availableAmount: roundedValue
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    // Ensure the final value is rounded before update
    const roundedValue = Math.round(Number(availableAmountInput) / 5) * 5;
    onUpdate({
      ...editingProduct,
      availableAmount: roundedValue
    });
    setEditingProduct(null);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <div className="flex flex-col text-sm">
              <span>Бренд: {product.brand}</span>
              <span>Категория: {getCategoryName(product.categoryId)}</span>
              <span>Цена гросс: {formatPrice(product.grossPrice)}</span>
              <span>Цена для клиента: {formatPrice(product.clientPrice)}</span>
              <span className="text-muted-foreground mt-1">В наличии: {product.availableAmount} блоков</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Изменить товар</DialogTitle>
                </DialogHeader>
                {editingProduct && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Название товара</Label>
                      <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-brand">Бренд</Label>
                      <Select
                        value={editingProduct.brand}
                        onValueChange={(value) => handleEditingChange('brand', value)}
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
                      <Label htmlFor="edit-category">Категория</Label>
                      <Select
                        value={editingProduct.categoryId?.toString() ?? ''}
                        onValueChange={(value) => handleEditingChange('categoryId', parseInt(value))}
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
                        <Label htmlFor="edit-grossPrice">Цена гросс</Label>
                        <Input
                          id="edit-grossPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingProduct.grossPrice.toString()}
                          onChange={(e) => handleEditingChange('grossPrice', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-clientPrice">Цена для клиента</Label>
                        <Input
                          id="edit-clientPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingProduct.clientPrice.toString()}
                          onChange={(e) => handleEditingChange('clientPrice', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-availableAmount">Количество товара в наличии</Label>
                      <Input
                        id="edit-availableAmount"
                        type="number"
                        min="0"
                        step="5"
                        value={availableAmountInput}
                        onChange={(e) => handleEditingChange('availableAmount', e.target.value)}
                        onBlur={handleAvailableAmountBlur}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Отменить</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleUpdateProduct}>Изменить товар</Button>
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
                  <DialogTitle>Delete Product</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Are you sure you want to delete "{product.name}"?</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button 
                      variant="destructive"
                      onClick={() => onDelete(product.id)}
                    >
                      Delete
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