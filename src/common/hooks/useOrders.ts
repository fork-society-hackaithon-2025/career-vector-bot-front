import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/api';
import { OrderStatus, CreateOrderDto } from '@/types/order';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.orders.list();
      return response.data.responseObject || [];
    },
    enabled: !!token,
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await api.orders.get(id);
      return response.data.responseObject || null;
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderDto) => {
      const response = await api.orders.create(orderData);
      return response.data.responseObject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Заказ успешно создан');
    },
    onError: (error) => {
      toast.error('Не удалось создать заказ');
      console.error('Error creating order:', error);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api.orders.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      toast.success('Статус заказа успешно обновлен');
    },
    onError: (error) => {
      toast.error('Не получилось обновить статус заказа');
      console.error('Error updating order status:', error);
    },
  });
};

export const useAvailableDeliveryDates = () => {
    return useQuery({
        queryKey: ['availableDeliveryDates'],
        queryFn: async () => {
          const response = await api.orders.getAvailableDeliveryDates();
          console.log(response);
          return response.data.responseObject || [];
        },
    });
};