import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
                {item.product.image && (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.product.clientPrice.toFixed(2)}₸ each
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
              <p className="text-lg font-bold">{totalPrice.toFixed(2)}₸</p>
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