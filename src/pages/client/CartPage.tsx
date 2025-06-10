import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { useProductsBatch } from '@/common/hooks/useProducts';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  // Get product details for availability checking
  const productIds = items.map(item => item.product.id);
  const { data: products = [] } = useProductsBatch(productIds);

  const productMap = React.useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, any>);
  }, [products]);

  // Check for availability issues
  const availabilityIssues = React.useMemo(() => {
    const issues: string[] = [];
    
    items.forEach((item) => {
      const product = productMap[item.product.id];
      if (product) {
        if (product.availableAmount === 0) {
          issues.push(`Товар "${product.name}" больше не доступен`);
        } else if (item.quantity > product.availableAmount) {
          issues.push(`Товар "${product.name}": в корзине ${item.quantity}, доступно ${product.availableAmount}`);
        }
      }
    });
    
    return issues;
  }, [items, productMap]);

  // Auto-update quantities if products are out of stock
  useEffect(() => {
    items.forEach((item) => {
      const product = productMap[item.product.id];
      if (product && item.quantity > product.availableAmount) {
        const newQuantity = Math.max(5, Math.round(product.availableAmount / 5) * 5);
        if (newQuantity !== item.quantity) {
          updateQuantity(item.product.id, newQuantity);
          toast.error(`Количество товара "${product.name}" автоматически уменьшено до ${newQuantity}`);
        }
      }
    });
  }, [productMap, items, updateQuantity]);

  const handleIncreaseQuantity = (productId: number, currentQuantity: number) => {
    const product = productMap[productId];
    if (product && currentQuantity >= product.availableAmount) {
      toast.error(`Доступно только ${product.availableAmount} единиц товара "${product.name}"`);
      return;
    }
    updateQuantity(productId, currentQuantity + 5);
  };

  const handleDecreaseQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 5) {
      updateQuantity(productId, currentQuantity - 5);
    } else {
      removeItem(productId);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Ваша корзина пуста');
      return;
    }
    
    if (availabilityIssues.length > 0) {
      toast.error('Пожалуйста, исправьте проблемы с товарами перед оформлением заказа');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Корзина</h1>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ваша корзина пуста</h3>
                <p className="text-muted-foreground">Добавьте товары в корзину, чтобы оформить заказ</p>
              </div>
              <Button onClick={() => navigate('/products')}>
                Перейти к товарам
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Availability Issues */}
          {availabilityIssues.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {availabilityIssues.map((issue, index) => (
                    <div key={index}>{issue}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Товары в корзине</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const product = productMap[item.product.id];
                const isOutOfStock = product?.availableAmount === 0;
                const isOverLimit = product && item.quantity > product.availableAmount;
                
                return (
                  <div key={item.product.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.product.clientPrice)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                          disabled={item.quantity <= 5}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}
                          disabled={product && item.quantity >= product.availableAmount}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      

                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            
            <Separator />
            <CardFooter className="flex justify-between items-center py-4 gap-8">
              <div className="min-w-[120px] max-w-[200px]">
                <p className="font-medium">Итого</p>
                <p className="text-2xl font-bold truncate">{ formatPrice(totalPrice) }</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Очистить корзину
                </Button>
                <Button 
                  onClick={handleCheckout}
                  disabled={availabilityIssues.length > 0}
                >
                  Оформить заказ
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartPage;
