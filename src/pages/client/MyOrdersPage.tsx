import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { useOrders } from '@/common/hooks/useOrders';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrderEditDialog } from '@/pages/merchant/components/OrderEditDialog';
import {formatPrice} from "@/lib/utils.ts";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: orders = [], isLoading, error } = useOrders();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <h1 className="text-2xl font-bold text-red-600">Ошибка загрузки заказов</h1>
        <p className="text-muted-foreground">
          Не удалось загрузить информацию о заказах
        </p>
        <Button onClick={() => navigate('/products')}>
          Вернуться к покупкам
        </Button>
      </div>
    );
  }

  const userOrders = orders
    .filter(order => order.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <h1 className="text-2xl font-bold">Мои заказы</h1>
      </div>

      <div className="space-y-4">
        {userOrders.length > 0 ? (
          userOrders.map((order) => {
            const canEdit = order.orderStatus === 'PENDING' && new Date(order.editDeadline) > new Date();
            
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
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
                            onClose={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Сумма заказа</p>
                    <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                  </div>

                  {canEdit && (
                    <p className="text-sm text-yellow-600">
                      Возможность редактирования до: {format(new Date(order.editDeadline), 'd MMMM HH:mm', { locale: ru })}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="py-8">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4">У вас пока нет заказов</p>
              <Button onClick={() => navigate('/products')}>
                Смотреть товары
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage; 