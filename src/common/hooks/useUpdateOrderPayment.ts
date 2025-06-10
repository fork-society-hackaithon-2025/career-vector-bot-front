import { useMutation, useQueryClient } from '@tanstack/react-query';
import {api} from "@/common/api";

interface UpdateOrderPaymentParams {
  orderId: number;
  amount: number;
}

export const useUpdateOrderPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateOrderPaymentParams) => {
      const { data } = await api.payments.recordDeliveryPayment(params.orderId, params.amount);
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // We'll need to invalidate client queries as well since the payment affects their debt
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}; 