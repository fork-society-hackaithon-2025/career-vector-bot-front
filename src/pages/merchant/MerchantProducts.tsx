import React, {useState} from 'react';
import {CreateProductDto, Product, UpdateProductDto} from '@/types/product';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Edit, Plus, Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct} from '@/common/hooks/useProducts';

const MerchantProducts = () => {
  const { data: productsData, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<CreateProductDto>({
    name: '',
    brand: '',
    category: '',
    grossPrice: 0,
    clientPrice: 0,
    availableAmount: 0
  });

  console.log(productsData)

  // Ensure products is always an array
  const products = Array.isArray(productsData) ? productsData : [];
  
  const handleAddProduct = () => {
    // Validate product details
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    createProduct.mutate(newProduct);
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      grossPrice: 0,
      clientPrice: 0,
      availableAmount: 0
    });
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    const { id, ...updateData } = editingProduct;
    updateProduct.mutate({ id, product: updateData });
    setEditingProduct(null);
  };
  
  const handleDeleteProduct = (productId: number) => {
    deleteProduct.mutate(productId);
  };
  
  const handleEditingChange = (field: keyof UpdateProductDto, value: string) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: field === 'name' || field === 'brand' || field === 'category' ? value : Number(value)
    });
  };
  
  const handleNewProductChange = (field: keyof CreateProductDto, value: string) => {
    setNewProduct({
      ...newProduct,
      [field]: field === 'name' || field === 'brand' || field === 'category' ? value : Number(value)
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

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

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => handleNewProductChange('brand', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => handleNewProductChange('category', e.target.value)}
                  placeholder="Enter category"
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
                  <Label htmlFor="clientPrice">Client Price ($)</Label>
                  <Input
                    id="clientPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.clientPrice}
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
                  value={newProduct.availableAmount}
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
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
                            <Input
                              id="edit-brand"
                              value={editingProduct.brand}
                              onChange={(e) => handleEditingChange('brand', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Input
                              id="edit-category"
                              value={editingProduct.category}
                              onChange={(e) => handleEditingChange('category', e.target.value)}
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
                              <Label htmlFor="edit-clientPrice">Client Price ($)</Label>
                              <Input
                                id="edit-clientPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingProduct.clientPrice}
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
                              value={editingProduct.availableAmount}
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
