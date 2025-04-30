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
  const { addItem } = useCart();
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
          [product.id]: 1
        }), {})
      );
    }
  }, [products]);

  const handleDecreaseQuantity = (productId: number) => {
    if (quantities[productId] > 1) {
      setQuantities(prev => ({
        ...prev,
        [productId]: prev[productId] - 1
      }));
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product && quantities[productId] < product.availableAmount) {
      setQuantities(prev => ({
        ...prev,
        [productId]: prev[productId] + 1
      }));
    }
  };

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product, quantities[productId]);
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
                                    {product.clientPrice.toFixed(2)}₸
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  В наличии: {product.availableAmount}
                                </p>
                              </CardContent>
                              <CardFooter className="p-4 pt-0">
                                <div className="flex items-center gap-2 w-full">
                                  <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDecreaseQuantity(product.id)}
                                        disabled={quantities[product.id] <= 1}
                                        className="h-8 w-8"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">
                                      {quantities[product.id]}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleIncreaseQuantity(product.id)}
                                        disabled={quantities[product.id] >= product.availableAmount}
                                        className="h-8 w-8"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Button
                                      className="flex-1"
                                      onClick={() => handleAddToCart(product.id)}
                                  >
                                    Добавить в корзину
                                  </Button>
                                </div>
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
