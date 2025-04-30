import React from 'react';
import { Order, OrderItem } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateOrder, useAvailableDeliveryDates } from '@/common/hooks/useOrders';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useProducts, useProductsBatch } from '@/common/hooks/useProducts';
import { Minus, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatternFormat } from 'react-number-format';
import { DialogClose } from '@/components/ui/dialog';

interface OrderEditDialogProps {
  order: Order;
  onClose: () => void;
  onSave?: () => void;
}

export const OrderEditDialog: React.FC<OrderEditDialogProps> = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    clientName: order.clientName,
    clientPhone: order.clientPhone,
    deliveryDate: format(new Date(order.deliveryDate), 'yyyy-MM-dd'),
    items: order.orderItems.map(item => ({
      ...item,
      quantity: item.quantity,
      price: item.price
    }))
  });

  const updateOrder = useUpdateOrder();
  const { data: products = [] } = useProducts();
  const { data: orderProducts = [] } = useProductsBatch(formData.items.map(item => item.productId));
  const { data: availableDates = [], isLoading: isLoadingDates } = useAvailableDeliveryDates();

  const allAvailableDates = React.useMemo(() => {
    const currentDate = format(new Date(order.deliveryDate), 'yyyy-MM-dd');
    return [...new Set([...availableDates, currentDate])].sort();
  }, [availableDates, order.deliveryDate]);

  const productMap = React.useMemo(() => {
    return orderProducts.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, any>);
  }, [orderProducts]);

  const availableProducts = React.useMemo(() => {
    const existingProductIds = new Set(formData.items.map(item => item.productId));
    return products.filter(product => !existingProductIds.has(product.id));
  }, [products, formData.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder.mutate(
        {
          id: Number(order.id),
          data: {
            clientName: formData.clientName,
            clientPhone: formData.clientPhone,
            deliveryDate: new Date(formData.deliveryDate),
            items: formData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            })),
            totalPrice: formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          },
        },
        {
          onSuccess: () => {
            onSave?.();
            onClose();
          },
        }
    );
  };

  const addNewItem = (productId: string) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          productId: product.id,
          quantity: 1,
          price: product.clientPrice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }));
  };

  const removeItem = (itemId: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const isEditDisabled = order.orderStatus !== 'PENDING' || new Date(order.editDeadline) <= new Date();

  return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full overflow-hidden">
        <div className="space-y-2 w-full px-1">
          <Label htmlFor="edit-clientName">Имя клиента</Label>
          <Input
              id="edit-clientName"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              disabled={isEditDisabled}
              className="w-full"
          />
        </div>

        <div className="space-y-2 w-full px-1">
          <Label htmlFor="edit-clientPhone">Телефон клиента</Label>
          <PatternFormat
              id="edit-clientPhone"
              value={formData.clientPhone}
              onValueChange={(values) => {
                const phoneNumber = values.value;
                setFormData(prev => ({
                  ...prev,
                  clientPhone: phoneNumber.startsWith('7') ? phoneNumber : `7${phoneNumber}`
                }));
              }}
              format="+# (###) ###-####"
              mask="_"
              placeholder="+7 (___) ___-____"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isEditDisabled}
          />
        </div>

        <div className="space-y-2 w-full px-1">
          <Label htmlFor="edit-deliveryDate">Дата доставки</Label>
          <Select
              value={formData.deliveryDate}
              onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryDate: value }))}
              disabled={isLoadingDates || isEditDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingDates ? "Загрузка дат..." : "Выберите дату доставки"} />
            </SelectTrigger>
            <SelectContent>
              {allAvailableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy', { locale: ru })}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full px-1">
          <Label>Товары в заказе</Label>
          <div className="space-y-2">
            {formData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{productMap[item.productId]?.name || 'Загрузка...'}</p>
                    <p className="text-sm text-muted-foreground">{item.price}₸ × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={isEditDisabled}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        disabled={isEditDisabled}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={isEditDisabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {availableProducts.length > 0 && (
            <div className="space-y-2 w-full px-1">
              <Label>Добавить товар</Label>
              <Select
                  onValueChange={addNewItem}
                  disabled={isEditDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите товар" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - {product.clientPrice}₸
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Итого:</p>
            <p className="text-xl font-bold">
              {formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}₸
            </p>
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Отмена
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={isEditDisabled} className="flex-1">
                Сохранить изменения
              </Button>
            </DialogClose>
          </div>
        </div>
      </form>
  );
};