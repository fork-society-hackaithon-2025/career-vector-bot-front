import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderTotal: number;
  clientName: string;
  onPaymentComplete?: (orderId: number, paymentAmount: number) => void;
}

export const PaymentDialog = ({
  isOpen,
  onClose,
  orderId,
  orderTotal,
  clientName,
  onPaymentComplete,
}: PaymentDialogProps) => {
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleSubmit = () => {
    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount < 0) return;

    if (onPaymentComplete) {
      onPaymentComplete(orderId, amount);
    }
    
    onClose();
    setPaymentAmount('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);
    
    // Allow empty string or valid non-negative numbers
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setPaymentAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оплата заказа</DialogTitle>
          <DialogDescription>
            Введите сумму, которую оплатил клиент {clientName} при получении заказа.
            При подтверждении заказ будет отмечен как доставленный и оплата будет зарегистрирована.
            Общая сумма заказа: {formatPrice(orderTotal)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма оплаты</label>
            <Input
              type="number"
              value={paymentAmount}
              onChange={handleAmountChange}
              placeholder="Введите сумму"
              min="0"
              max={orderTotal}
            />
            {Number(paymentAmount) < orderTotal && (
              <p className="text-sm text-destructive">
                Остаток будет добавлен к долгу клиента: {formatPrice(orderTotal - Number(paymentAmount))}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!paymentAmount}
          >
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
