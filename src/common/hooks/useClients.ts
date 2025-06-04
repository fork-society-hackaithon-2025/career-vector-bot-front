import { useQuery } from '@tanstack/react-query';
import {api} from "@/common/api";

interface Client {
  userId: number;
  name: string;
  phone: string | null;
  totalDebt: number;
  lastPaymentDate: Date | null;
  orderCount: number;
}

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await api.payments.getAllClientsDebt();
      // Ensure we return an array, even if empty
      return Array.isArray(response.data.responseObject) ? response.data.responseObject : [];
    },
  });
}; 