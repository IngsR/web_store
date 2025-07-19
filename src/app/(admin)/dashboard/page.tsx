'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    Users,
    PackageOpen,
    ArrowRight,
    ShoppingCart,
    Heart,
    BarChart3,
    Settings,
    Package,
    Tags,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        productCount: 0,
        userCount: 0,
        orderCount: 0,
        cartItemsCount: 0,
        wishlistCount: 0,
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const productsRes = await fetch('/api/products');
                const products = productsRes.ok ? await productsRes.json() : [];

                setStats({
                    productCount: products.length,
                    userCount: 150,
                    orderCount: 75,
                    cartItemsCount: 45,
                    wishlistCount: 30,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };
        fetchDashboardStats();
    }, []);

    const quickLinks = [
        {
            title: 'Products',
            icon: Package,
            href: '/dashboard/products',
            description: 'Manage your product catalog',
            color: 'text-blue-600',
        },
        {
            title: 'Categories',
            icon: Tags,
            href: '/dashboard/categories',
            description: 'Organize your products',
            color: 'text-green-600',
        },
        {
            title: 'Orders',
            icon: ShoppingCart,
            href: '/dashboard/orders',
            description: 'View and manage orders',
            color: 'text-purple-600',
        },
        {
            title: 'Settings',
            icon: Settings,
            href: '/dashboard/settings',
            description: 'Configure your store',
            color: 'text-gray-600',
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to your store management dashboard.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/products">
                        Add New Product <PackageOpen className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Products
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.productCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total products in your catalog
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.userCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Registered customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.orderCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total orders processed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Carts
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.cartItemsCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Items in customer carts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Wishlisted
                        </CardTitle>
                        <Heart className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.wishlistCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Items in wishlists
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Analytics
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/analytics">
                                View Reports
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => (
                    <Card key={link.title}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <link.icon
                                    className={`h-5 w-5 ${link.color}`}
                                />
                                <CardTitle className="text-sm font-medium">
                                    {link.title}
                                </CardTitle>
                            </div>
                            <CardDescription className="pt-1.5">
                                {link.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link href={link.href}>
                                    Manage{' '}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
