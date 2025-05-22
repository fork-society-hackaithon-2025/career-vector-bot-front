import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

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
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.product.clientPrice)} each
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, Math.max(5, item.quantity - 5))}
                    disabled={item.quantity <= 5}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="5"
                    step="5"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Math.max(5, parseInt(e.target.value) || 5);
                      // Round to nearest multiple of 5
                      const roundedValue = Math.round(value / 5) * 5;
                      updateQuantity(item.product.id, roundedValue);
                    }}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 5)}
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
          ))}
          
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