import React, {useMemo, useState} from 'react';
import {Product} from '@/types/product';
import {useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct} from '@/common/hooks/useProducts';
import {ProductCard} from './components/ProductCard';
import {AddProductForm} from './components/AddProductForm';
import {ProductSearch} from './components/ProductSearch';
import {EmptyState} from './components/EmptyState';
import {useCategories} from '@/common/hooks/useCategories';

const MerchantProducts = () => {
  const { data: productsData, isLoading: isLoadingProducts, error: productsError } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure products is always an array
  const products = Array.isArray(productsData) ? productsData : [];

  // Filter and sort products based on search query and organize by category and brand
  const organizedProducts = useMemo(() => {
    // First filter products based on search query
    const filtered = !searchQuery.trim() ? products : products.filter(product => {
      const query = searchQuery.toLowerCase();
      const categoryName = categories.find(c => c.id === product.categoryId)?.name || '';
      return product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query);
    });

    // Group products by category
    const groupedByCategory = filtered.reduce((acc, product) => {
      const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Неизвестная категория';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    // Sort categories alphabetically and sort products within each category by brand
    return Object.entries(groupedByCategory)
      .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
      .map(([category, products]) => ({
        category,
        products: products.sort((a, b) => a.brand.localeCompare(b.brand))
      }));
  }, [products, searchQuery, categories]);

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

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Загрузка...</div>;
  }

  if (productsError) {
    return <div>Ошибка загрузки товаров: {productsError.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <AddProductForm onSubmit={handleAddProduct} />
      </div>

      <ProductSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      {organizedProducts.length > 0 ? (
        <div className="space-y-8">
          {organizedProducts.map(({ category, products }) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
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
