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
import { CATEGORIES } from '@/data/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const handleEditingChange = (field: keyof Product, value: string) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: field === 'name' || field === 'brand' || field === 'category' ? value : Number(value)
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    onUpdate(editingProduct);
    setEditingProduct(null);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <div className="flex flex-col text-sm">
              <span>Brand: {product.brand}</span>
              <span>Category: {product.category}</span>
              <span>Gross: ${product.grossPrice.toFixed(2)}</span>
              <span>Client: ${product.clientPrice.toFixed(2)}</span>
              <span className="text-muted-foreground mt-1">Available: {product.availableAmount}</span>
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
                  <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                {editingProduct && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-brand">Brand</Label>
                      <Select
                        value={editingProduct.brand}
                        onValueChange={(value) => handleEditingChange('brand', value)}
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
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        value={editingProduct.category}
                        onValueChange={(value) => handleEditingChange('category', value)}
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
                        <Label htmlFor="edit-grossPrice">Gross Price ($)</Label>
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
                        <Label htmlFor="edit-clientPrice">Client Price ($)</Label>
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
                      <Label htmlFor="edit-availableAmount">Available Amount</Label>
                      <Input
                        id="edit-availableAmount"
                        type="number"
                        min="0"
                        value={editingProduct.availableAmount.toString()}
                        onChange={(e) => handleEditingChange('availableAmount', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleUpdateProduct}>Update</Button>
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