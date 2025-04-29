import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '@/contexts/CartContext';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ChevronDown, ChevronUp, Minus, Plus, ShoppingCart} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {motion} from 'framer-motion';
import {BRANDS} from '@/data/brands';
import {useProducts} from '@/common/hooks/useProducts';

const CataloguePage = () => {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Initialize quantities when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      setQuantities(
          products.reduce((acc, product) => ({
            ...acc,
            [product.id]: items.find(item => item.product.id === product.id)?.quantity || 0
          }), {})
      );
    }
  }, [products, items]);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product, 1);
      setQuantities(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    if (quantities[productId] > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: prev[productId] - 1
      }));
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleAddToCartWithQuantity = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product && quantities[productId] > 0) {
      addItem(product, quantities[productId]);
      setQuantities(prev => ({
        ...prev,
        [productId]: 0
      }));
    }
  };

  // Group products by brand
  const productsByBrand = useMemo(() => {
    if (!products.length) return [];

    return BRANDS.map(brand => ({
      brand: brand.value,
      label: brand.label,
      products: products.filter(product => product.brand === brand.value)
    })).filter(group => group.products.length > 0);
  }, [products]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Товары</h1>
          <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Корзина
          </Button>
        </div>

        <div className="space-y-4">
          {productsByBrand.map((brandGroup) => (
              <Card key={brandGroup.brand} className="overflow-hidden">
                <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center p-4"
                    onClick={() => setExpandedBrands(prev => ({
                      ...prev,
                      [brandGroup.brand]: !prev[brandGroup.brand]
                    }))}
                >
                  <span className="font-semibold">{brandGroup.label}</span>
                  {expandedBrands[brandGroup.brand] ? (
                      <ChevronUp className="h-4 w-4" />
                  ) : (
                      <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {expandedBrands[brandGroup.brand] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {brandGroup.products.map((product) => (
                          <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                          >
                            <Card className="h-full flex flex-col overflow-hidden">
                              <div
                                  className="h-48 bg-cover bg-center"
                                  style={{ backgroundImage: `url('/placeholder.svg')` }}
                              />
                              <CardContent className="flex-grow p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <Badge variant="outline" className="ml-2">
                                    ${product.clientPrice.toFixed(2)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  В наличии: {product.availableAmount}
                                </p>
                              </CardContent>
                              <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
                                {quantities[product.id] > 0 ? (
                                    <>
                                      <div className="flex items-center justify-between w-full">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDecreaseQuantity(product.id)}
                                            disabled={quantities[product.id] <= 0}
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="mx-2 w-8 text-center">
                                {quantities[product.id]}
                              </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleIncreaseQuantity(product.id)}
                                            disabled={quantities[product.id] >= product.availableAmount}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <Button
                                          className="w-full"
                                          onClick={() => handleAddToCartWithQuantity(product.id)}
                                      >
                                        Добавить в корзину
                                      </Button>
                                    </>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleAddToCart(product.id)}
                                    >
                                      Добавить в корзину
                                    </Button>
                                )}
                              </CardFooter>
                            </Card>
                          </motion.div>
                      ))}
                    </div>
                )}
              </Card>
          ))}
        </div>
      </div>
  );
};

export default CataloguePage;
