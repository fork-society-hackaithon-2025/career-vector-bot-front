
import React, { useState } from 'react';
import { products as initialProducts } from '@/lib/mock-data';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const MerchantProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    grossPrice: 0,
    price: 0,
    inventory: 0,
    image: ''
  });
  
  const handleAddProduct = () => {
    // Validate product details
    if (!newProduct.name || newProduct.price === undefined || newProduct.grossPrice === undefined) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const id = `product${Date.now()}`;
    const product: Product = {
      id,
      name: newProduct.name,
      grossPrice: Number(newProduct.grossPrice),
      price: Number(newProduct.price),
      inventory: Number(newProduct.inventory) || 0,
      image: newProduct.image
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      grossPrice: 0,
      price: 0,
      inventory: 0,
      image: ''
    });
    
    toast.success('Product added successfully');
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    
    setEditingProduct(null);
    toast.success('Product updated successfully');
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Product deleted successfully');
  };
  
  const handleEditingChange = (field: keyof Product, value: string) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: field === 'name' || field === 'image' ? value : Number(value)
    });
  };
  
  const handleNewProductChange = (field: keyof Product, value: string) => {
    setNewProduct({
      ...newProduct,
      [field]: field === 'name' || field === 'image' ? value : Number(value)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products Management</h1>
        
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossPrice">Gross Price ($)</Label>
                  <Input
                    id="grossPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.grossPrice}
                    onChange={(e) => handleNewProductChange('grossPrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Client Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => handleNewProductChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={newProduct.inventory}
                  onChange={(e) => handleNewProductChange('inventory', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => handleNewProductChange('image', e.target.value)}
                  placeholder="Enter image URL"
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ backgroundImage: `url(${product.image || '/placeholder.svg'})` }}
            />
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="flex flex-col text-sm">
                    <span>Gross: ${product.grossPrice.toFixed(2)}</span>
                    <span>Retail: ${product.price.toFixed(2)}</span>
                    <span className="text-muted-foreground mt-1">Stock: {product.inventory}</span>
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
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-grossPrice">Gross Price ($)</Label>
                              <Input
                                id="edit-grossPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingProduct.grossPrice}
                                onChange={(e) => handleEditingChange('grossPrice', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-price">Client Price ($)</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingProduct.price}
                                onChange={(e) => handleEditingChange('price', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-inventory">Inventory</Label>
                            <Input
                              id="edit-inventory"
                              type="number"
                              min="0"
                              value={editingProduct.inventory}
                              onChange={(e) => handleEditingChange('inventory', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-image">Image URL</Label>
                            <Input
                              id="edit-image"
                              value={editingProduct.image || ''}
                              onChange={(e) => handleEditingChange('image', e.target.value)}
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
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {products.length === 0 && (
        <Card className="py-8">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">No products available</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </DialogTrigger>
              {/* Dialog content is the same as above */}
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MerchantProducts;
