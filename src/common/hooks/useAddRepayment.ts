import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/api';

interface AddRepaymentParams {
  clientId: number;
  amount: number;
  date: string;
}

export const useAddRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddRepaymentParams) => {
      const response = await api.payments.recordDebtRepayment(params.clientId, params.amount);
      if (!response.success) {
        throw new Error(response.data?.message || 'Failed to add repayment');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['client-payments', variables.clientId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}; 