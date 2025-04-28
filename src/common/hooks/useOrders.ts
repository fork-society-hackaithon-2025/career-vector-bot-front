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
    mutationFn: (orderData: CreateOrderDto) => api.orders.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create order');
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
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    },
  });
};

export const useAvailableDeliveryDates = () => {
    return useQuery({
        queryKey: ['availableDeliveryDates'],
        queryFn: () => api.orders.getAvailableDeliveryDates(),
    });
};