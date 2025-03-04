
import React from 'react';
import { orders } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Wallet, ShoppingBag, UserCheck } from 'lucide-react';
import { generateAnalyticsData } from '@/lib/mock-data';

const MerchantDashboard = () => {
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalSales = orders
    .filter(order => order.status === 'confirmed' || order.status === 'delivered')
    .reduce((total, order) => total + order.totalAmount, 0);
  const totalCustomers = new Set(orders.map(order => order.clientId)).size;
  
  const analytics = generateAnalyticsData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Wallet className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-orange-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <h3 className="text-2xl font-bold">{pendingOrders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Revenue</p>
                <h3 className="text-2xl font-bold">${analytics.weeklyTotal.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5)
                .map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(order.createdAt, 'PPp')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily sales for the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end justify-between gap-2">
              {analytics.dailyRevenue.map((day, index) => {
                // Find the max value for scaling
                const maxValue = Math.max(...analytics.dailyRevenue.map(d => d.amount));
                const percentage = maxValue ? (day.amount / maxValue) * 100 : 0;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-primary/20 rounded-t relative group"
                      style={{ height: `${percentage}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${day.amount.toFixed(2)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t h-[30%]"></div>
                    </div>
                    <span className="text-xs">{day.date.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantDashboard;
