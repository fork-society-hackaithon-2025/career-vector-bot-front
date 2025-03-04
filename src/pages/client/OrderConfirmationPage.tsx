
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Check, ShoppingBag, Clock } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { items, totalPrice, clearCart, cartEditDeadline, hasCartTimeExpired } = useCart();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (!items.length) {
      navigate('/catalogue');
    }
  }, [items, navigate]);
  
  useEffect(() => {
    if (!cartEditDeadline) return;
    
    const updateTimeLeft = () => {
      const now = new Date();
      const diffMs = cartEditDeadline.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [cartEditDeadline]);
  
  const handleContinueShopping = () => {
    clearCart();
    navigate('/catalogue');
  };
  
  const handleEditOrder = () => {
    navigate('/cart');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Your order has been received and is being processed
        </p>
      </div>
      
      {!hasCartTimeExpired && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Edit Time Remaining</p>
                <p className="text-sm text-yellow-700">
                  You can edit your order for the next {timeLeft}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between py-4">
          <p className="font-medium text-lg">Total</p>
          <p className="font-bold text-lg">${totalPrice.toFixed(2)}</p>
        </CardFooter>
      </Card>
      
      <div className="flex justify-between space-x-4">
        {!hasCartTimeExpired && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleEditOrder}
          >
            Edit Order
          </Button>
        )}
        <Button 
          className="flex-1" 
          onClick={handleContinueShopping}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
