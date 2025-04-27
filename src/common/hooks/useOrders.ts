import { useMutation, useQuery } from '@tanstack/react-query';
import {CreateOrderDto} from '@/types/order';
import { toast } from 'sonner';
import {api} from "@/common/api";

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (orderData: CreateOrderDto) => api.orders.create(orderData),
        onSuccess: () => {
            toast.success('Order created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create order');
            console.error('Error creating order:', error);
        },
    });
};

export const useAvailableDeliveryDates = () => {
    return useQuery({
        queryKey: ['availableDeliveryDates'],
        queryFn: () => api.orders.getAvailableDeliveryDates(),
    });
};