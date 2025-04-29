import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { orders } from '@/lib/mock-data';
import { generateAnalyticsData } from '@/lib/mock-data';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  Bar,
  BarChart as RechartBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ru } from 'date-fns/locale';

const MerchantAnalytics = () => {
  const today = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  const analytics = generateAnalyticsData();
  
  // Get date range based on selected period
  const getDateRange = () => {
    switch (selectedPeriod) {
      case 'day':
        return {
          start: startOfDay(today),
          end: endOfDay(today),
          label: format(today, 'MMMM d, yyyy', { locale: ru })
        };
      case 'week':
        return {
          start: startOfWeek(today),
          end: endOfWeek(today),
          label: `${format(startOfWeek(today), 'MMM d', { locale: ru })} - ${format(endOfWeek(today), 'MMM d, yyyy', { locale: ru })}`
        };
      case 'month':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
          label: format(today, 'MMMM yyyy', { locale: ru })
        };
    }
  };
  
  const dateRange = getDateRange();
  
  // Calculate revenues
  const confirmedOrders = orders.filter(order => 
    order.orderStatus === 'CONFIRMED' || order.orderStatus === 'DELIVERED'
  );
  
  const calculateRevenue = (start: Date, end: Date) => {
    return confirmedOrders
      .filter(order => order.createdAt >= start && order.createdAt <= end)
      .reduce((total, order) => total + order.totalPrice, 0);
  };
  
  const currentRevenue = calculateRevenue(dateRange.start, dateRange.end);
  
  // Calculate previous period revenue for comparison
  const getPreviousPeriodRange = () => {
    switch (selectedPeriod) {
      case 'day':
        return {
          start: startOfDay(subDays(today, 1)),
          end: endOfDay(subDays(today, 1))
        };
      case 'week':
        return {
          start: startOfWeek(subDays(today, 7)),
          end: endOfWeek(subDays(today, 7))
        };
      case 'month':
        return {
          start: startOfMonth(subDays(today, 30)),
          end: endOfMonth(subDays(today, 30))
        };
    }
  };
  
  const previousRange = getPreviousPeriodRange();
  const previousRevenue = calculateRevenue(previousRange.start, previousRange.end);
  
  // Calculate revenue change percentage
  const revenueChange = previousRevenue === 0 
    ? 100 
    : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  
  // Generate some more advanced mock data for the charts
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const sales = Math.floor(Math.random() * 5000) + 1000;
    const profit = Math.floor(sales * 0.3);
    
    return {
      date: format(date, 'MMM d', { locale: ru }),
      sales,
      profit
    };
  });
  
  const productPerformance = orders
    .flatMap(order => order.orderItems)
    .reduce((acc, item) => {
      const productName = item.product.name;
      if (!acc[productName]) {
        acc[productName] = {
          name: productName,
          quantity: 0,
          revenue: 0
        };
      }
      acc[productName].quantity += item.quantity;
      acc[productName].revenue += item.price * item.quantity;
      return acc;
    }, {} as Record<string, { name: string; quantity: number; revenue: number }>);
    
  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Аналитика</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="products">Товары</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Обзор доходов</h2>
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 ${selectedPeriod === 'day' ? 'bg-primary text-white' : 'bg-white'}`}
                onClick={() => setSelectedPeriod('day')}
              >
                День
              </button>
              <button 
                className={`px-3 py-1 ${selectedPeriod === 'week' ? 'bg-primary text-white' : 'bg-white'}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Неделя
              </button>
              <button 
                className={`px-3 py-1 ${selectedPeriod === 'month' ? 'bg-primary text-white' : 'bg-white'}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Месяц
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Доход</p>
                    <h3 className="text-2xl font-bold">{currentRevenue.toFixed(2)}₸</h3>
                    <div className={`flex items-center text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {revenueChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(revenueChange).toFixed(1)}% от прошлого периода
                    </div>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BarChart className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Заказы</p>
                    <h3 className="text-2xl font-bold">{confirmedOrders.length}</h3>
                    <p className="text-sm text-muted-foreground">За {dateRange.label}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <LineChart className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Средний заказ</p>
                    <h3 className="text-2xl font-bold">
                      {confirmedOrders.length > 0 
                        ? (currentRevenue / confirmedOrders.length).toFixed(2) 
                        : '0.00'}₸
                    </h3>
                    <p className="text-sm text-muted-foreground">За транзакцию</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BarChart className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Прогноз на месяц</p>
                    <h3 className="text-2xl font-bold">{analytics.monthlyTotal.toFixed(2)}₸</h3>
                    <p className="text-sm text-muted-foreground">На основе текущих трендов</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Calendar className="h-6 w-6 text-yellow-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Тренды доходов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={analytics.dailyRevenue.map(day => ({
                      date: day.date.split('-')[2], // Extract day
                      revenue: day.amount
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}₸`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData.slice(-7)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={topProducts}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`${value}₸`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Sales Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      data={topProducts}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#8884d8" name="Units Sold" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{product.name}</p>
                        <span className="text-sm">{product.quantity} sold</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min(product.quantity * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantAnalytics;
