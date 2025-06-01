import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';

interface CustomerFinancialSummary {
  totalDebt: number;
  totalPaid: number;
  recentPayments: {
    id: number;
    amount: number;
    paymentDate: string;
    description?: string;
  }[];
  activeDebts: {
    id: number;
    orderId: number;
    amount: number;
    isPaid: boolean;
    createdAt: string;
  }[];
}

interface CreatePaymentParams {
  telegramId: string;
  amount: number;
  paymentDate: Date;
  description?: string;
}

export const useCustomerFinancialSummary = (telegramId: string) => {
  return useQuery<CustomerFinancialSummary>({
    queryKey: ['customerFinancialSummary', telegramId],
    queryFn: async () => {
      const response = await api.customers.getFinancialSummary(telegramId);
      return response.data;
    },
    enabled: !!telegramId
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (params: CreatePaymentParams) => {
      const response = await api.customers.createPayment(params.telegramId, {
        amount: params.amount,
        paymentDate: params.paymentDate.toISOString(),
        description: params.description
      });
      return response.data;
    }
  });
}; 