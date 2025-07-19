'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    BarChart3,
    Download,
    TrendingUp,
    DollarSign,
    Users,
    ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';

interface SalesData {
    period: string;
    revenue: number;
    orders: number;
    customers: number;
}

export default function AnalyticsPage() {
    const [salesData] = useState<SalesData[]>([
        {
            period: 'July 2025',
            revenue: 25999.99,
            orders: 145,
            customers: 98,
        },
        {
            period: 'June 2025',
            revenue: 23450.5,
            orders: 132,
            customers: 85,
        },
    ]);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Analytics & Reports</h1>
                    <p className="text-muted-foreground">
                        View your store's performance metrics.
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$49,450.49</div>
                        <p className="text-xs text-muted-foreground">
                            +4.3% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">277</div>
                        <p className="text-xs text-muted-foreground">
                            +12 orders today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">183</div>
                        <p className="text-xs text-muted-foreground">
                            +15.3% this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Growth
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12.5%</div>
                        <p className="text-xs text-muted-foreground">
                            Month over month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Sales Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={[
                            { header: 'Period', accessorKey: 'period' },
                            {
                                header: 'Revenue',
                                accessorKey: 'revenue',
                                cell: (data) => `$${data.revenue.toFixed(2)}`,
                            },
                            { header: 'Orders', accessorKey: 'orders' },
                            { header: 'Customers', accessorKey: 'customers' },
                        ]}
                        data={salesData}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
