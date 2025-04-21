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
import { CATEGORIES } from '@/data/categories';
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
  const [newProduct, setNewProduct] = React.useState<CreateProductDto>({
    name: '',
    brand: BRANDS[0].value,
    category: CATEGORIES[0].value,
    grossPrice: undefined,
    clientPrice: undefined,
    availableAmount: undefined
  });

  const handleNewProductChange = (field: keyof CreateProductDto, value: string) => {
    setNewProduct({
      ...newProduct,
      [field]: field === 'name' || field === 'brand' || field === 'category' ? value : value === '' ? undefined : Number(value)
    });
  };

  const handleAddProduct = () => {
    onSubmit(newProduct);
    setNewProduct({
      name: '',
      brand: BRANDS[0].value,
      category: CATEGORIES[0].value,
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
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => handleNewProductChange('name', e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={newProduct.brand}
              onValueChange={(value) => handleNewProductChange('brand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
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
            <Label htmlFor="category">Category</Label>
            <Select
              value={newProduct.category}
              onValueChange={(value) => handleNewProductChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossPrice">Gross Price ($)</Label>
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
              <Label htmlFor="clientPrice">Client Price ($)</Label>
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
            <Label htmlFor="availableAmount">Available Amount</Label>
            <Input
              id="availableAmount"
              type="number"
              min="0"
              value={newProduct.availableAmount?.toString() || ''}
              onChange={(e) => handleNewProductChange('availableAmount', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 