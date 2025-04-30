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
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useCreateOrder, useAvailableDeliveryDates } from '@/common/hooks/useOrders';
import { PatternFormat } from 'react-number-format';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const { data: availableDates = [], isLoading: isLoadingDates, error: datesError } = useAvailableDeliveryDates();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder.mutateAsync({
        name: formData.name,
        phone: `7${formData.phone}`,
        deliveryDate: new Date(formData.deliveryDate),
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        totalPrice
      });

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error('Не удалось создать заказ');
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Ваша корзина пуста</p>
        <Button onClick={() => navigate('/products')}>
          Смотреть товары
        </Button>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Оформление заказа</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.product.clientPrice.toFixed(2)}₸ × {item.quantity}</p>
                  </div>
                  <p className="font-medium">{(item.product.clientPrice * item.quantity).toFixed(2)}₸</p>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between py-4">
              <p className="font-medium text-lg">Итого</p>
              <p className="font-bold text-lg">{totalPrice.toFixed(2)}₸</p>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация о доставке</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <PatternFormat
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onValueChange={(values) => {
                      const phoneNumber = values.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        phone: phoneNumber.startsWith('7') ? phoneNumber : `7${phoneNumber}`
                      }));
                    }}
                    format="+7 (###) ###-####"
                    mask="_"
                    placeholder="+7 (___) ___-____"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Дата доставки</Label>
                  <Select
                    value={formData.deliveryDate}
                    onValueChange={handleSelectChange}
                    disabled={isLoadingDates}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingDates ? "Загрузка дат..." : "Выберите дату доставки"} />
                    </SelectTrigger>
                    <SelectContent>
                      {datesError ? (
                        <SelectItem value="error" disabled>
                          Ошибка загрузки дат
                        </SelectItem>
                      ) : (
                        availableDates.map((date) => (
                          <SelectItem key={date} value={date}>
                            {format(new Date(date), 'EEEE, MMMM d, yyyy', { locale: ru })}
                          </SelectItem>
                        ))
                      )}
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
                  {isSubmitting ? 'Обработка...' : 'Оформить заказ'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Примечание: У вас будет 5 минут на редактирование заказа после отправки.
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
