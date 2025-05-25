import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ArrowDown, ArrowUp, BarChart, Calendar, LineChart} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    Area,
    AreaChart,
    Bar,
    BarChart as RechartBarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {useProfitOverview, useSalesBreakdown, useTopProducts} from '@/hooks/useAnalytics';
import {DateRange} from 'react-day-picker';
import {formatPrice} from "@/lib/utils.ts";

const MerchantAnalytics = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const {data: profitData, isLoading: isProfitLoading} = useProfitOverview();
    const {data: salesData, isLoading: isSalesLoading} = useSalesBreakdown();
    const {data: topProductsData, isLoading: isTopProductsLoading} = useTopProducts();

    const isLoading = isProfitLoading || isSalesLoading || isTopProductsLoading;

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!profitData || !salesData || !topProductsData) {
        return <div>Ошибка загрузки данных</div>;
    }

    const getCurrentPeriodData = () => {
        switch (selectedPeriod) {
            case 'day':
                return {
                    profit: profitData.today.profit,
                    comparison: profitData.today.comparison,
                    stats: salesData.today
                };
            case 'week':
                return {
                    profit: profitData.week.profit,
                    comparison: profitData.week.comparison,
                    stats: salesData.week
                };
            case 'month':
                return {
                    profit: profitData.month.profit,
                    comparison: profitData.month.comparison,
                    stats: salesData.month
                };
        }
    };

    const currentPeriodData = getCurrentPeriodData();

    // Prepare chart data
    const chartData = [
        {date: 'Сегодня', sales: salesData.today.revenue, profit: salesData.today.revenue - salesData.today.cost},
        {date: 'Неделя', sales: salesData.week.revenue, profit: salesData.week.revenue - salesData.week.cost},
        {date: 'Месяц', sales: salesData.month.revenue, profit: salesData.month.revenue - salesData.month.cost},
    ];

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
                                        <h3 className="text-2xl font-bold">{formatPrice(currentPeriodData.stats.revenue)}</h3>
                                        <div
                                            className={`flex items-center text-sm ${currentPeriodData.comparison >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {currentPeriodData.comparison >= 0 ? (
                                                <ArrowUp className="h-4 w-4 mr-1"/>
                                            ) : (
                                                <ArrowDown className="h-4 w-4 mr-1"/>
                                            )}
                                            {Math.abs(currentPeriodData.comparison).toFixed(1)}% от прошлого периода
                                        </div>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <BarChart className="h-6 w-6 text-blue-700"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Заказы</p>
                                        <h3 className="text-2xl font-bold">{currentPeriodData.stats.orders}</h3>
                                        <p className="text-sm text-muted-foreground">За период</p>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <LineChart className="h-6 w-6 text-green-700"/>
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
                                            {currentPeriodData.stats.orders > 0
                                                ? formatPrice((currentPeriodData.stats.revenue / currentPeriodData.stats.orders))
                                                : '0.00₸'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">За транзакцию</p>
                                    </div>
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <BarChart className="h-6 w-6 text-purple-700"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Прибыль</p>
                                        <h3 className="text-2xl font-bold">{formatPrice(currentPeriodData.profit)}</h3>
                                        <p className="text-sm text-muted-foreground">Чистая прибыль</p>
                                    </div>
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                        <Calendar className="h-6 w-6 text-yellow-700"/>
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
                                        data={chartData}
                                        margin={{top: 40, right: 30, left: 60, bottom: 0}}
                                    >
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date"/>
                                        <YAxis tickFormatter={(value) => formatPrice(value)} width={70}/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip formatter={(value, name) => [
                                            formatPrice(value as number),
                                            name
                                        ]
                                        }/>
                                        <Legend/>
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            name="Продажи"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="profit"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorProfit)"
                                            name="Прибыль"
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
                            <CardTitle>Продажи по периодам</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartBarChart
                                        data={chartData}
                                        margin={{top: 20, right: 30, left: 40, bottom: 5}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis tickFormatter={(value) => formatPrice(value)}/>
                                        <Tooltip formatter={(value) => [formatPrice(value as number), 'Доход']}/>
                                        <Legend/>
                                        <Bar dataKey="sales" fill="#3b82f6" name="Доход"/>
                                    </RechartBarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Топ товаров по прибыли</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartBarChart
                                        data={topProductsData.byProfit}
                                        margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis type="number" tickFormatter={(value) => formatPrice(value)} width={80}/>
                                        <YAxis type="category" dataKey="name"/>
                                        <Tooltip formatter={(value) => [formatPrice(value as number), 'Прибыль']}/>
                                        <Legend/>
                                        <Bar dataKey="profit" fill="#3b82f6" name="Прибыль"/>
                                    </RechartBarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Топ товаров по продажам</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartBarChart
                                            data={topProductsData.bySales}
                                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis tickFormatter={(value) => formatPrice(value)}/>
                                            <Tooltip formatter={(value) => [formatPrice(value as number), 'Продажи']}/>
                                            <Legend/>
                                            <Bar dataKey="totalSales" fill="#8884d8" name="Продажи"/>
                                        </RechartBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Топ товаров по марже</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartBarChart
                                            data={topProductsData.byMargin}
                                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis tickFormatter={(value) => `${value}%`}/>
                                            <Tooltip formatter={(value) => [`${value}%`, 'Маржа']}/>
                                            <Legend/>
                                            <Bar dataKey="margin" fill="#10b981" name="Маржа"/>
                                        </RechartBarChart>
                                    </ResponsiveContainer>
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
