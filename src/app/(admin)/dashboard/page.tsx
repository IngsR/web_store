'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    ArrowRight,
    ShoppingCart,
    Car,
    Settings,
    Clock,
    CheckCircle2,
    RefreshCw,
    TrendingUp,
    PhoneCall,
    AlertCircle,
    PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        newOrders: 0,
        dealOrders: 0,
        totalTurnover: 0,
        activeSales: 0,
        totalSales: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardStats = async () => {
        setIsLoading(true);
        try {
            const [productsRes, ordersRes, salesRes] = await Promise.all([
                fetch('/api/products').catch(() => null),
                fetch('/api/orders').catch(() => null),
                fetch('/api/sales').catch(() => null),
            ]);

            const productsData = productsRes && productsRes.ok ? await productsRes.json() : null;
            const ordersData: Order[] = ordersRes && ordersRes.ok ? await ordersRes.json() : [];
            const salesData = salesRes && salesRes.ok ? await salesRes.json() : null;

            const productsList = Array.isArray(productsData?.products)
                ? productsData.products
                : Array.isArray(productsData)
                ? productsData
                : [];

            const ordersList = Array.isArray(ordersData) ? ordersData : [];
            const newCount = ordersList.filter((o) => o.status === 'BARU').length;
            const dealCount = ordersList.filter((o) => o.status === 'DEAL' || o.status === 'SELESAI').length;
            const turnover = ordersList
                .filter((o) => o.status !== 'BATAL')
                .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

            const salesList = Array.isArray(salesData?.sales) ? salesData.sales : [];
            const activeSalesCount = salesList.filter((s: any) => s.status === 'ACTIVE').length;

            setStats({
                totalProducts: productsList.length,
                totalOrders: ordersList.length,
                newOrders: newCount,
                dealOrders: dealCount,
                totalTurnover: turnover,
                activeSales: activeSalesCount,
                totalSales: salesList.length,
            });

            setRecentOrders(ordersList.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const quickLinks = [
        {
            title: 'Pesanan Unit',
            icon: ShoppingCart,
            href: '/dashboard/orders',
            badge: stats.newOrders > 0 ? `${stats.newOrders} Baru` : undefined,
            badgeVariant: 'warning',
            description: 'Kelola pemesanan, atur status, & teruskan ke WhatsApp sales',
            color: 'text-amber-500',
        },
        {
            title: 'Tim Sales Showroom',
            icon: Users,
            href: '/dashboard/sales',
            badge: `${stats.activeSales} Aktif`,
            badgeVariant: 'success',
            description: 'Kelola staf sales konsultan & pantau rotasi giliran otomatis',
            color: 'text-emerald-500',
        },
        {
            title: 'Katalog Unit Mobil',
            icon: Car,
            href: '/dashboard/products',
            badge: `${stats.totalProducts} Unit`,
            badgeVariant: 'default',
            description: 'Input mobil baru/bekas, harga OTR, foto unit, dan spesifikasi',
            color: 'text-blue-500',
        },
        {
            title: 'Pengaturan Promosi',
            icon: Settings,
            href: '/dashboard/settings',
            badge: undefined,
            badgeVariant: 'default',
            description: 'Atur banner homepage dan tandai unit unggulan / promo diskon',
            color: 'text-purple-500',
        },
    ];

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Ringkasan Operasional Showroom
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Pantau aktivitas pemesanan unit mobil, ketersediaan sales, dan status katalog hari ini.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchDashboardStats}
                        disabled={isLoading}
                        className="h-9 text-xs"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                        Segarkan
                    </Button>
                    <Button asChild size="sm" className="h-9 text-xs font-semibold">
                        <Link href="/dashboard/products">
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Tambah Unit
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Real Automotive Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Pesanan Baru Butuh Tindak Lanjut */}
                <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                    <CardContent className="p-3.5 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground">Pesanan Baru</span>
                            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                            {stats.newOrders}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Menunggu dihubungi sales
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Sales Aktif Siap Terima Prospek */}
                <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                    <CardContent className="p-3.5 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground">Sales Aktif</span>
                            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                            {stats.activeSales} <span className="text-xs font-normal text-muted-foreground">/ {stats.totalSales}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Staf dalam rotasi otomatis
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Unit Ready di Katalog */}
                <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                    <CardContent className="p-3.5 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground">Katalog Unit</span>
                            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                                <Car className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            {stats.totalProducts} <span className="text-xs font-normal text-muted-foreground">Unit</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Mobil tayang di website
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Total Nilai Booking OTR */}
                <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                    <CardContent className="p-3.5 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground">Estimasi Nilai OTR</span>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-lg sm:text-xl font-extrabold text-foreground truncate tracking-tight">
                            {formatCurrency(stats.totalTurnover)}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Dari {stats.totalOrders} total pemesanan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Navigation Panels */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => (
                    <Card key={link.title} className="bg-card border border-border shadow-xs hover:shadow-md flex flex-col justify-between hover:border-primary/60 transition-all duration-200">
                        <CardHeader className="p-3.5 sm:p-4 pb-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-muted/60">
                                        <link.icon className={`h-4 w-4 ${link.color}`} />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        {link.title}
                                    </CardTitle>
                                </div>
                                {link.badge && (
                                    <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-1.5 py-0.5 font-semibold ${
                                            link.badgeVariant === 'warning'
                                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                                : link.badgeVariant === 'success'
                                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}
                                    >
                                        {link.badge}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs pt-1.5 line-clamp-2">
                                {link.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3.5 sm:p-4 pt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8 font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                asChild
                            >
                                <Link href={link.href}>
                                    Buka Halaman <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Section */}
            <Card className="bg-card border border-border shadow-xs">
                <CardHeader className="p-3.5 sm:p-4 pb-3 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold">
                            Pemesanan Unit Terbaru
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Daftar prospek dan pemesanan mobil yang baru masuk ke sistem
                        </CardDescription>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-xs h-8">
                        <Link href="/dashboard/orders">
                            Lihat Semua ({stats.totalOrders}) <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-8 text-center text-xs text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-primary" />
                            Memuat pesanan terbaru...
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground">
                            <ShoppingCart className="h-6 w-6 mx-auto mb-2 opacity-40" />
                            Belum ada pesanan unit masuk.
                        </div>
                    ) : (
                        <div className="divide-y divide-border/60">
                            {recentOrders.map((order) => {
                                const items = Array.isArray(order.items) ? order.items : [];
                                const carTitle = items.map((i) => i.name).join(', ') || 'Unit Mobil';

                                return (
                                    <div
                                        key={order.id}
                                        className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs text-foreground">
                                                    {order.customerName}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground font-mono">
                                                    • {order.id}
                                                </span>
                                                {order.status === 'BARU' && (
                                                    <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[10px] font-medium py-0">
                                                        Baru
                                                    </Badge>
                                                )}
                                                {order.status === 'DEAL' && (
                                                    <Badge className="bg-purple-500/15 text-purple-600 border border-purple-500/30 text-[10px] font-medium py-0">
                                                        Deal
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {carTitle} • {order.customerCity || 'Jabodetabek'} • Skema: {order.paymentMethod === 'KREDIT' ? 'Kredit Leasing' : 'Cash'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                                            <span className="text-xs font-bold text-foreground">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                            <Button asChild size="sm" variant="outline" className="h-7 text-xs px-2.5">
                                                <Link href="/dashboard/orders">
                                                    Detail
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
