import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/api';
import { OrderStatus, CreateOrderDto, UpdateOrderDto } from '@/types/order';
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
      
      if (!response.success || !response.data.success) {
        const error = new Error(response.data.message || 'Failed to create order');
        error.response = { data: response.data };
        throw error;
      }
      
      return response.data.responseObject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Заказ успешно создан');
    },
    onError: (error: any) => {
      toast.error("Ошибка при создании заказа");
      console.error('Error creating order:', error);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, paymentAmount }: { id: number; status: OrderStatus, paymentAmount?: number }) => {
      const response = await api.orders.updateStatus(id, status, paymentAmount);
      
      // Check if the API response indicates success
      if (!response.success || !response.data.success) {
        // Create an error object that preserves the original response structure
        const error = new Error(response.data.message || 'Failed to update order status');
        // @ts-ignore - Add the response data to the error for formatOrderError to use
        error.response = { data: response.data };
        throw error;
      }
      
      return response.data.responseObject;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      toast.success('Статус заказа обновлен');
    },
    onError: (error) => {
      toast.error('Не удалось обновить статус заказа');
      console.error('Error updating order status:', error);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UpdateOrderDto> }) => {
      const response = await api.orders.update(id, data);
      
      // Check if the API response indicates success
      if (!response.success || !response.data.success) {
        // Create an error object that preserves the original response structure
        const error = new Error(response.data.message || 'Failed to update order');
        // @ts-ignore - Add the response data to the error for formatOrderError to use
        error.response = { data: response.data };
        throw error;
      }
      
      return response.data.responseObject;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      toast.success('Заказ успешно обновлен');
    },
    onError: (error: any) => {
      toast.error("Ошибка при обновлении заказа");
      console.error('Error updating order:', error);
    },
  });
};

export const useAvailableDeliveryDates = () => {
    return useQuery({
        queryKey: ['availableDeliveryDates'],
        queryFn: async () => {
          const response = await api.orders.getAvailableDeliveryDates();
          return response.data.responseObject || [];
        },
    });
};