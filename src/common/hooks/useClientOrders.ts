import { useQuery } from '@tanstack/react-query';
import {api} from "@/common/api";

interface Order {
  orderId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  deliveryDate: Date;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
}

export const useClientOrders = (clientId: string | undefined) => {
  return useQuery<Order[]>({
    queryKey: ['client-orders', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data } = await api.payments.getClientDebt(Number(clientId));
      return data.responseObject.unpaidOrders;
    },
    enabled: !!clientId,
  });
}; 