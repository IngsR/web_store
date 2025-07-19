'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Download } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';

type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

type Order = {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: number;
};

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
    const [orders] = useState<Order[]>([
        {
            id: 'ORD001',
            customer: 'John Doe',
            date: '2025-07-17',
            total: 299.99,
            status: 'processing',
            items: 3,
        },
        {
            id: 'ORD002',
            customer: 'Jane Smith',
            date: '2025-07-16',
            total: 149.5,
            status: 'shipped',
            items: 2,
        },
        // Add more sample orders as needed
    ]);

    const columns = [
        {
            header: 'Order ID',
            accessorKey: 'id' as const,
        },
        {
            header: 'Customer',
            accessorKey: 'customer' as const,
        },
        {
            header: 'Date',
            accessorKey: 'date' as const,
        },
        {
            header: 'Items',
            accessorKey: 'items' as const,
        },
        {
            header: 'Total',
            accessorKey: 'total' as const,
            cell: (order: Order) => <span>${order.total.toFixed(2)}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status' as const,
            cell: (order: Order) => (
                <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                </Badge>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        View and manage customer orders.
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Orders
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={orders} />
                </CardContent>
            </Card>
        </div>
    );
}
