import { useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';

interface Payment {
  id: number;
  amount: number;
  paymentDate: Date;
}

export const useClientPayments = (clientId: string | undefined) => {
  return useQuery<Payment[]>({
    queryKey: ['client-payments', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data } = await api.payments.getClientDebt(Number(clientId));
      console.log('Client debt response:', data);
      
      if (!data?.responseObject?.repaymentHistory) {
        console.log('No repayment history found in response:', data);
        return [];
      }

      // The API returns Date objects, so we don't need to convert them
      return data.responseObject.repaymentHistory;
    },
    enabled: !!clientId,
  });
}; 