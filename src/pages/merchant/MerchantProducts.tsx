import React, {useMemo, useState} from 'react';
import {Product} from '@/types/product';
import {useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct} from '@/common/hooks/useProducts';
import {ProductCard} from './components/ProductCard';
import {AddProductForm} from './components/AddProductForm';
import {ProductSearch} from './components/ProductSearch';
import {EmptyState} from './components/EmptyState';

const MerchantProducts = () => {
  const { data: productsData, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure products is always an array
  const products = Array.isArray(productsData) ? productsData : [];

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleAddProduct = (product: Product) => {
    createProduct.mutate(product);
  };

  const handleUpdateProduct = (product: Product) => {
    const { id, ...updateData } = product;
    updateProduct.mutate({ id, product: updateData });
  };

  const handleDeleteProduct = (productId: number) => {
    deleteProduct.mutate(productId);
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
        <AddProductForm onSubmit={handleAddProduct} />
      </div>

      <ProductSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <EmptyState
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onAddProduct={<AddProductForm onSubmit={handleAddProduct} />}
        />
      )}
    </div>
  );
};

export default MerchantProducts;
