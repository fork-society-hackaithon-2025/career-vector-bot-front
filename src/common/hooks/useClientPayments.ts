import { useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';
import {DebtPayment} from "@/common/api/services/payment.service.ts";

export const useClientPayments = (clientId: string | undefined) => {
  return useQuery<DebtPayment[]>({
    queryKey: ['client-payments', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data } = await api.payments.getClientDebt(Number(clientId));
      console.log('Client debt response:', data);
      
      if (!data?.responseObject?.debtPayments) {
        console.log('No repayment history found in response:', data);
        return [];
      }

      return data.responseObject.debtPayments;
    },
    enabled: !!clientId,
  });
}; 