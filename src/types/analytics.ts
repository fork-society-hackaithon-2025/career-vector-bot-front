export interface ProfitOverview {
  today: {
    profit: number;
    comparison: number;
  };
  week: {
    profit: number;
    comparison: number;
  };
  month: {
    profit: number;
    comparison: number;
  };
}

export interface SalesStats {
  orders: number;
  revenue: number;
  cost: number;
}

export interface SalesBreakdown {
  today: SalesStats;
  week: SalesStats;
  month: SalesStats;
}

export interface ProductStats {
  id: number;
  name: string;
  totalSales: number;
  profit: number;
  margin: number;
}

export interface TopProducts {
  byProfit: ProductStats[];
  bySales: ProductStats[];
  byMargin: ProductStats[];
} 