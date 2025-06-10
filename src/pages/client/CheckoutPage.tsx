import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '@/contexts/CartContext';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {AlertCircle, ArrowLeft} from 'lucide-react';
import {useAvailableDeliveryDates, useCreateOrder} from '@/common/hooks/useOrders';
import {useProductsBatch} from '@/common/hooks/useProducts';
import {PatternFormat} from 'react-number-format';
import {formatPrice} from '@/lib/utils';
import {Alert, AlertDescription} from '@/components/ui/alert';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const { data: availableDates = [], isLoading: isLoadingDates, error: datesError } = useAvailableDeliveryDates();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get product details for validation
  const productIds = items.map(item => item.product.id);
  const { data: products = [] } = useProductsBatch(productIds);

  const productMap = React.useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, any>);
  }, [products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryDate: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);

    setIsSubmitting(true);

    try {
      const order = await createOrder.mutateAsync({
        name: formData.name,
        phone: `7${formData.phone}`,
        deliveryAddress: formData.deliveryAddress,
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
      // Error handling is done in the hook
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
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const product = productMap[item.product.id];
                const isOutOfStock = product?.availableAmount === 0;
                const isOverLimit = product && item.quantity > product.availableAmount;
                
                return (
                  <div key={item.product.id} className={`flex justify-between p-2 rounded-md ${isOutOfStock || isOverLimit ? 'bg-red-50 border border-red-200' : ''}`}>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.product.clientPrice)} × {item.quantity}</p>
                      {product && (
                        <p className={`text-xs ${isOutOfStock ? 'text-red-600' : isOverLimit ? 'text-orange-600' : 'text-muted-foreground'}`}>
                          {isOutOfStock ? 'Нет в наличии' : `Доступно`}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">{formatPrice(item.product.clientPrice * item.quantity)}</p>
                  </div>
                );
              })}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between py-4">
              <p className="font-medium text-lg">Итого</p>
              <p className="font-bold text-lg">{formatPrice(totalPrice)}</p>
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Адрес доставки</Label>
                  <Input
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Введите адрес доставки"
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
                      {availableDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {format(new Date(date), 'EEEE, MMMM d, yyyy', { locale: ru })}
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
                  disabled={isSubmitting || validationErrors.length > 0}
                >
                  {isSubmitting ? 'Обработка...' : 'Оформить заказ'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
