import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, AlertCircle, Phone, CheckCircle2 } from 'lucide-react';

interface OrderStatsProps {
    totalOrders: number;
    countNew: number;
    countContacted: number;
    countDeal: number;
}

export default function OrderStats({
    totalOrders,
    countNew,
    countContacted,
    countDeal,
}: OrderStatsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {/* 1. Total Pemesanan */}
            <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Total Pemesanan</span>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        {totalOrders}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        Semua prospek masuk showroom
                    </p>
                </CardContent>
            </Card>

            {/* 2. Pesanan Baru */}
            <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Pesanan Baru</span>
                        <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                        {countNew}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        Menunggu dihubungi sales
                    </p>
                </CardContent>
            </Card>

            {/* 3. Sedang Dihubungi */}
            <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Sedang Dihubungi</span>
                        <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                            <Phone className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                        {countContacted}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        Dalam proses follow-up sales
                    </p>
                </CardContent>
            </Card>

            {/* 4. Deal / Terkonfirmasi */}
            <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Deal Terkonfirmasi</span>
                        <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                        {countDeal}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        Kesepakatan tercapai
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
