import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import { useProductsBatch } from '@/common/hooks/useProducts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
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
  React.useEffect(() => {
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

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const product = productMap[productId];
    if (product && newQuantity > product.availableAmount) {
      toast.error(`Доступно только ${product.availableAmount} единиц товара "${product.name}"`);
      return;
    }
    
    const value = Math.max(5, parseInt(newQuantity.toString()) || 5);
    // Round to nearest multiple of 5
    const roundedValue = Math.round(value / 5) * 5;
    updateQuantity(productId, roundedValue);
  };

  const handleIncreaseQuantity = (productId: number, currentQuantity: number) => {
    const product = productMap[productId];
    if (product && currentQuantity >= product.availableAmount) {
      toast.error(`Доступно только ${product.availableAmount} единиц товара "${product.name}"`);
      return;
    }
    updateQuantity(productId, currentQuantity + 5);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Availability Issues */}
        {availabilityIssues.length > 0 && (
          <Alert variant="destructive" className="mb-4">
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

        <div className="space-y-4">
          {items.map((item) => {
            const product = productMap[item.product.id];
            const isOutOfStock = product?.availableAmount === 0;
            const isOverLimit = product && item.quantity > product.availableAmount;
            
            return (
              <div key={item.product.id} className={`flex items-center justify-between p-3 rounded-md ${isOutOfStock || isOverLimit ? 'bg-red-50 border border-red-200' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.clientPrice)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, Math.max(5, item.quantity - 5))}
                      disabled={item.quantity <= 5}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="5"
                      step="5"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 5)}
                      className="w-16 text-center"
                    />
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
                    className="text-destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium">Total</p>
              <p className="text-lg font-bold">{formatPrice(totalPrice)}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
              >
                Clear Cart
              </Button>
              <Button
                onClick={() => navigate('/checkout')}
                className="flex-1"
                disabled={availabilityIssues.length > 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 