import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, hasCartTimeExpired } = useCart();
  const navigate = useNavigate();

  const handleIncreaseQuantity = (productId: number, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
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
    
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/catalogue')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Ваша корзина</h1>
      </div>

      {hasCartTimeExpired && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700">
            Время редактирования корзины истекло. Вы больше не можете изменять этот заказ.
          </p>
        </div>
      )}
      
      {items.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Ваша корзина пуста</h3>
              <p className="text-muted-foreground">Добавьте товары в корзину</p>
              <Button onClick={() => navigate('/catalogue')}>
                Продолжить покупки
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Товары ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product.clientPrice.toFixed(2)}₸</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                      disabled={hasCartTimeExpired}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}
                      disabled={hasCartTimeExpired}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleRemoveItem(item.product.id)}
                      disabled={hasCartTimeExpired}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between items-center py-4 gap-8">
              <div>
                <p className="font-medium">Total</p>
                <p className="text-2xl font-bold">{totalPrice.toFixed(2)}₸</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  disabled={hasCartTimeExpired}
                >
                  Очистить корзину
                </Button>
                <Button onClick={handleCheckout}>
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
