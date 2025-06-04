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

export const useClient = (clientId: string | undefined) => {
  return useQuery<Client>({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const response = await api.payments.getAllClientsDebt();
      const clients = Array.isArray(response.data.responseObject) ? response.data.responseObject : [];
      const client = clients.find(c => c.userId.toString() === clientId);
      if (!client) {
        throw new Error('Client not found');
      }
      return client;
    },
    enabled: !!clientId,
  });
}; 