import { useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';
import { ProfitOverview, SalesBreakdown, TopProducts } from '@/types/analytics';
import { ApiResponse } from '@/types/api';

export const useProfitOverview = () => {
  return useQuery<ApiResponse<ProfitOverview>, Error, ProfitOverview>({
    queryKey: ['analytics', 'profit'],
    queryFn: async () => {
      const response = await api.analytics.profit();
      if (!response.success) {
        throw new Error('Не удалось загрузить данные о прибыли');
      }
      return response.data;
    },
  });
};

export const useSalesBreakdown = () => {
  return useQuery<ApiResponse<SalesBreakdown>, Error, SalesBreakdown>({
    queryKey: ['analytics', 'sales'],
    queryFn: async () => {
      const response = await api.analytics.sales();
      if (!response.success) {
        throw new Error('Не удалось загрузить данные о продажах');
      }
      return response.data;
    },
  });
};

export const useTopProducts = () => {
  return useQuery<ApiResponse<TopProducts>, Error, TopProducts>({
    queryKey: ['analytics', 'top-products'],
    queryFn: async () => {
      const response = await api.analytics.topProducts();
      if (!response.success) {
        throw new Error('Не удалось загрузить данные о товарах');
      }
      return response.data;
    },
  });
}; 