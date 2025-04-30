import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Edit2 } from 'lucide-react';
import { useOrder, useUpdateOrder } from '@/common/hooks/useOrders';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PatternFormat } from 'react-number-format';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderEditDialog } from '@/pages/merchant/components/OrderEditDialog';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderResponse, isLoading, error } = useOrder(Number(orderId));
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Загрузка...</div>;
  }

  if (error || !orderResponse) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <h1 className="text-2xl font-bold text-red-600">Ошибка загрузки заказа</h1>
        <p className="text-muted-foreground">
          Не удалось загрузить информацию о заказе
        </p>
        <Button onClick={() => navigate('/products')}>
          Вернуться к покупкам
        </Button>
      </div>
    );
  }

  const order = orderResponse;
  const canEdit = order.orderStatus === 'PENDING' && new Date(order.editDeadline) > new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Заказ успешно оформлен!</h1>
        <p className="text-muted-foreground">
          Ваш заказ получен и обрабатывается
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Детали заказа</CardTitle>
            {canEdit && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Редактирование заказа #{order.id}</DialogTitle>
                  </DialogHeader>
                  <OrderEditDialog
                    order={order}
                    onClose={() => setIsEditing(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Номер заказа</p>
            <p className="font-medium">#{order.id}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Статус заказа</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              order.orderStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.orderStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
              order.orderStatus === 'DELIVERED' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.orderStatus === 'PENDING' ? 'Ожидает' :
               order.orderStatus === 'CONFIRMED' ? 'Подтвержден' :
               order.orderStatus === 'REJECTED' ? 'Отклонен' :
               order.orderStatus === 'DELIVERED' ? 'Доставлен' : order.orderStatus}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Дата доставки</p>
            <p className="font-medium">
              {format(new Date(order.deliveryDate), 'd MMMM', { locale: ru })}
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Контактная информация</p>
            <p className="font-medium">{order.clientName}</p>
            <PatternFormat
                id="phone"
                name="phone"
                value={order.clientPhone}
                format="+# (###) ###-####"
                mask="_"
                placeholder="+7 (___) ___-____"
                readOnly
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Сумма заказа</p>
            <p className="font-medium">{order.totalPrice} ₸</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/products')}
          >
            Продолжить покупки
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
