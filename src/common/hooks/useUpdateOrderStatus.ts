import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface UpdateOrderStatusParams {
  orderId: number;
  status: string;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateOrderStatusParams) => {
      const { data } = await api.post(`/orders/${params.orderId}/status`, {
        status: params.status,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}; 