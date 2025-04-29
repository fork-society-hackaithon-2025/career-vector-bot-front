import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Wallet, ShoppingBag, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useOrders } from '@/common/hooks/useOrders';
import { ru } from 'date-fns/locale';

const MerchantDashboard = () => {
  const { data: orders = [], isLoading, error } = useOrders();

  if (isLoading) {
    return <div>Загрузка панели управления...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки панели управления: {error.message}</div>;
  }

  const pendingOrders = orders.filter(order => order.orderStatus === 'PENDING');
  const totalSales = orders
    .filter(order => order.orderStatus === 'CONFIRMED' || order.orderStatus === 'DELIVERED')
    .reduce((total, order) => total + order.totalPrice, 0);
  const totalCustomers = new Set(orders.map(order => order.userId)).size;

  // Calculate weekly revenue
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const weeklyRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= weekStart &&
             orderDate <= today &&
             (order.orderStatus === 'CONFIRMED' || order.orderStatus === 'DELIVERED');
    })
    .reduce((total, order) => total + order.totalPrice, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Панель управления</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Wallet className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Общие продажи</p>
                <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-orange-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Заказы в ожидании</p>
                <h3 className="text-2xl font-bold">{pendingOrders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего клиентов</p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Доход за неделю</p>
                <h3 className="text-2xl font-bold">${weeklyRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Недавно полученные заказы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'PPp', { locale: ru })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus === 'PENDING' ? 'Ожидает' :
                            order.orderStatus === 'CONFIRMED' ? 'Подтвержден' :
                                order.orderStatus === 'REJECTED' ? 'Отклонен' :
                                    order.orderStatus === 'DELIVERED' ? 'Доставлен' : order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantDashboard;
