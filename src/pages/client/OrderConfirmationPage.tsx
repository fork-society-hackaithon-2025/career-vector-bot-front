import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-medium">#12345</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
            <p className="font-medium">Tomorrow, 2:00 PM - 4:00 PM</p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Delivery Address</p>
            <p className="font-medium">123 Main Street</p>
            <p className="font-medium">City, State 12345</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/orders')}
          >
            View Order Status
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
