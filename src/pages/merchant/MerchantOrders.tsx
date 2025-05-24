import React, {useMemo, useState} from 'react';
import {Order, OrderStatus} from '@/types/order';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Check, Edit2, Phone, X} from 'lucide-react';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {toast} from 'sonner';
import {useOrder, useOrders, useUpdateOrderStatus} from '@/common/hooks/useOrders';
import {useProductsBatch} from '@/common/hooks/useProducts';
import { OrderEditDialog } from './components/OrderEditDialog';
import { formatPrice } from '@/lib/utils';

interface OrderItemProps {
  productId: number;
  price: number;
  quantity: number;
  productName?: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ productId, price, quantity, productName }) => {
  return (
    <div className="flex justify-between">
      <div>
        <p className="font-medium">
          {productName || `Product #${productId}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(price)} × {quantity}
        </p>
      </div>
      <p className="font-medium">
        {formatPrice(price * quantity)}
      </p>
    </div>
  );
};

const MerchantOrders = () => {
  const { data: orders = [], isLoading, error } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const { data: selectedOrder, isLoading: isLoadingOrderDetails } = useOrder(selectedOrderId || 0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const productIds = useMemo(() => {
    if (!selectedOrder?.orderItems) {
      return [];
    }
    return selectedOrder.orderItems.map(item => item.productId);
  }, [selectedOrder]);

  const { data: products = [], isLoading: isLoadingProducts } = useProductsBatch(productIds);

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product.name;
      return acc;
    }, {} as Record<number, string>);
  }, [products]);

  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchesSearch = order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.toString().includes(searchQuery);
      
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleConfirmOrder = (orderId: string) => {
    updateOrderStatus.mutate({ id: Number(orderId), status: 'CONFIRMED' });
  };
  
  const handleRejectOrder = (orderId: string) => {
    updateOrderStatus.mutate({ id: Number(orderId), status: 'REJECTED' });
  };

  const handleMarkAsDelivered = (orderId: string) => {
    updateOrderStatus.mutate({ id: Number(orderId), status: 'DELIVERED' });
  };
  
  const handlePrintOrder = (order: Order) => {
    toast.success(`Заказ ${order.id} отправлен на печать`);
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'DELIVERED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Управление заказами</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Управление заказами</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Ошибка загрузки заказов: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Управление заказами</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по имени клиента или ID заказа"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="PENDING">В ожидании</SelectItem>
              <SelectItem value="CONFIRMED">Подтвержденные</SelectItem>
              <SelectItem value="REJECTED">Отклоненные</SelectItem>
              <SelectItem value="DELIVERED">Доставленные</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className={`h-2 ${getStatusColor(order.orderStatus)}`} />
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Заказ #{order.id}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus === 'PENDING' ? 'Ожидает' :
                         order.orderStatus === 'CONFIRMED' ? 'Подтвержден' :
                         order.orderStatus === 'REJECTED' ? 'Отклонен' :
                         order.orderStatus === 'DELIVERED' ? 'Доставлен' : order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{order.clientName}</span>
                      <a 
                        href={`tel:${order.clientPhone}`}
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 active:text-primary/90 px-2 py-1 rounded-md hover:bg-primary/5 active:bg-primary/10 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 mr-1.5" />
                        {order.clientPhone}
                      </a>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Дата доставки:</p>
                      <p>{format(new Date(order.deliveryDate), 'dd.MM.yyyy', { locale: ru })}</p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Адрес доставки:</p>
                      <p>{order.deliveryAddress || 'Не указан'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">Общая сумма:</p>
                      <p className="text-xl font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                    
                    <div className="w-full overflow-scroll flex gap-2 mt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrderId(Number(order.id))}
                          >
                            Детали
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Детали заказа</DialogTitle>
                          </DialogHeader>
                          {isLoadingOrderDetails ? (
                            <div className="flex items-center justify-center h-32">
                              <p className="text-muted-foreground">Загрузка деталей заказа...</p>
                            </div>
                          ) : selectedOrder ? (
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-medium">Информация о клиенте</h3>
                                <p>Имя: {selectedOrder.clientName}</p>
                                <p>Телефон: <a 
                                  href={`tel:${selectedOrder.clientPhone}`}
                                  className="inline-flex items-center text-primary hover:text-primary/80 active:text-primary/90 px-2 py-1 rounded-md hover:bg-primary/5 active:bg-primary/10 transition-colors"
                                >
                                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                                  {selectedOrder.clientPhone}
                                </a></p>
                                <p>Адрес доставки: {selectedOrder.deliveryAddress || 'Не указан'}</p>
                              </div>
                              
                              <div>
                                <h3 className="font-medium">Товары в заказе</h3>
                                <div className="space-y-2 mt-2">
                                  {isLoadingProducts ? (
                                    <p className="text-muted-foreground">Загрузка товаров...</p>
                                  ) : selectedOrder.orderItems?.map((item, index) => (
                                    <OrderItem
                                      key={index}
                                      productId={item.productId}
                                      price={item.price}
                                      quantity={item.quantity}
                                      productName={productMap[item.productId]}
                                    />
                                  )) || (
                                    <p className="text-muted-foreground">Нет товаров в этом заказе</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center pt-2 border-t">
                                <p className="font-medium">Общая сумма</p>
                                <p className="font-bold text-lg">
                                  {formatPrice(selectedOrder.totalPrice)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <p className="text-red-500">Failed to load order details</p>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {order.orderStatus === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleConfirmOrder(order.id.toString())}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Подтвердить
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={order.orderStatus !== 'PENDING'}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
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

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 hover:bg-red-50 text-red-500"
                            onClick={() => handleRejectOrder(order.id.toString())}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Отклонить
                          </Button>
                        </>
                      )}
                      {order.orderStatus === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleMarkAsDelivered(order.id.toString())}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Отметить доставленным
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="py-8">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">Заказов не найдено</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MerchantOrders;
