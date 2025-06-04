import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { useClient } from '@/common/hooks/useClient';
import { useAddRepayment } from '@/common/hooks/useAddRepayment';
import { useClientOrders } from '@/common/hooks/useClientOrders';
import { useClientPayments } from '@/common/hooks/useClientPayments';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return 'Не указана';
  const parsedDate = new Date(date);
  return isValid(parsedDate) ? format(parsedDate, "PPP", { locale: ru }) : 'Неверная дата';
};

const MerchantClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading: isLoadingClient } = useClient(clientId);
  const { data: orders = [], isLoading: isLoadingOrders } = useClientOrders(clientId);
  const { data: payments = [], isLoading: isLoadingPayments } = useClientPayments(clientId);
  const { mutate: addRepayment, isLoading: isAddingRepayment } = useAddRepayment();

  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(new Date());

  if (isLoadingClient || isLoadingOrders || isLoadingPayments) {
    return <div>Загрузка...</div>;
  }

  if (!client) {
    return <div>Клиент не найден</div>;
  }

  const handleAddRepayment = () => {
    if (!repaymentAmount || !repaymentDate) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    const amount = Number(repaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Пожалуйста, введите корректную сумму');
      return;
    }

    addRepayment({
      clientId: client.userId,
      amount: amount,
      date: repaymentDate.toISOString(),
    }, {
      onSuccess: () => {
        setRepaymentAmount('');
        setRepaymentDate(new Date());
        toast.success('Платеж успешно добавлен');
      },
      onError: (error) => {
        console.error('Error adding repayment:', error);
        toast.error('Не удалось добавить платеж. Пожалуйста, попробуйте снова.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">{client.phone || 'Не указан'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Текущий долг</p>
          <Badge
            variant={client.totalDebt > 0 ? "destructive" : "outline"}
            className="text-lg"
          >
            {formatPrice(client.totalDebt)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Добавить платеж</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Сумма</label>
              <Input
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                placeholder="Введите сумму"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Дата</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {repaymentDate ? (
                      formatDate(repaymentDate)
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={repaymentDate}
                    onSelect={setRepaymentDate}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              className="w-full"
              onClick={handleAddRepayment}
              disabled={!repaymentAmount || !repaymentDate || isAddingRepayment}
            >
              Добавить платеж
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>История платежей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{formatPrice(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <Badge variant="outline">Платеж</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Заказ #{order.orderId}</p>
                    <Badge variant={
                      order.orderStatus === 'DELIVERED' ? 'default' :
                      order.orderStatus === 'PENDING' ? 'secondary' :
                      'destructive'
                    }>
                      {order.orderStatus === 'DELIVERED' ? 'Доставлен' :
                       order.orderStatus === 'PENDING' ? 'В ожидании' :
                       'Отменен'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.deliveryDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                  <p className="text-sm text-muted-foreground">
                    Оплачено: {formatPrice(order.paidAmount)}
                  </p>
                  {order.orderStatus === 'DELIVERED' && order.remainingAmount > 0 && (
                    <Badge variant="destructive" className="mt-1">
                      Долг: {formatPrice(order.remainingAmount)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantClientDetail; 