import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useCreateOrder, useAvailableDeliveryDates } from '@/common/hooks/useOrders';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart, setCartEditDeadline } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: availableDates = [], isLoading: isLoadingDates } = useAvailableDeliveryDates();
  const createOrder = useCreateOrder();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryDate: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.deliveryDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        deliveryDate: new Date(formData.deliveryDate),
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        totalPrice,
      });

      // Set cart edit deadline to 5 minutes from now
      const deadline = new Date(Date.now() + 5 * 60 * 1000);
      setCartEditDeadline(deadline);

      // Clear cart and redirect to confirmation page
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (isLoadingDates) {
    return <div>Loading available delivery dates...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">${item.product.clientPrice.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.product.clientPrice * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between py-4">
                <p className="font-medium text-lg">Total</p>
                <p className="font-bold text-lg">${totalPrice.toFixed(2)}</p>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Information</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Select
                        value={formData.deliveryDate}
                        onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((date) => (
                            <SelectItem key={date.toISOString()} value={date.toISOString()}>
                              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Note: You'll have 5 minutes to edit your order after submission.
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;
