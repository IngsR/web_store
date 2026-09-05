'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ShoppingCart,
    Search,
    FileText,
    FileSpreadsheet,
    Download,
    RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatWhatsAppNumber } from '@/lib/utils';
import { exportOrdersToCSV, exportOrdersToExcel } from '@/lib/export-orders';
import type { Order, OrderStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

import { STATUS_CONFIG } from './_components/order-constants';
import OrderStats from './_components/order-stats';
import OrderCardList from './_components/order-card-list';
import OrderTable from './_components/order-table';
import OrderDetailDialog from './_components/order-detail-dialog';

export default function AdminOrdersPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data: Order[] = await res.json();
                setOrders(data);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Gagal memuat pesanan',
                    description: 'Terjadi kesalahan saat mengambil data pesanan dari database.',
                });
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast({
                variant: 'destructive',
                title: 'Koneksi error',
                description: 'Tidak dapat terhubung ke server pesanan.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setIsUpdatingStatus(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const updated: Order = await res.json();
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? updated : o)),
                );
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updated);
                }
                toast({
                    title: 'Status Pesanan Diperbarui',
                    description: `Pesanan ${orderId} diubah menjadi ${STATUS_CONFIG[newStatus].label}.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Gagal update status',
                    description: 'Server menolak perubahan status.',
                });
            }
        } catch (err) {
            console.error('Error updating status:', err);
            toast({
                variant: 'destructive',
                title: 'Error sistem',
                description: 'Terjadi kesalahan teknis.',
            });
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    const handleForwardToSalesWA = async (order: Order) => {
        if (!order.assignedSalesPhone) {
            toast({
                variant: 'destructive',
                title: 'Sales Belum Ditugaskan',
                description: 'Pesanan ini belum memiliki sales konsultan. Silakan klik "Tugaskan Sales" terlebih dahulu.',
            });
            return;
        }

        const targetPhone = formatWhatsAppNumber(order.assignedSalesPhone);
        const unitNames = Array.isArray(order.items)
            ? order.items.map((it) => `${it.name} (${it.quantity}x)`).join(', ')
            : 'Unit Mobil';

        const message =
            `Halo *${order.assignedSalesName || 'Sales Consultant'}*,\n\n` +
            `Terdapat prospek pemesanan unit mobil baru dari website yang ditugaskan kepada Anda:\n\n` +
            `*No. Pemesanan:* ${order.id}\n` +
            `*Nama Calon Pembeli:* ${order.customerName}\n` +
            `*No. WhatsApp Pembeli:* ${order.customerPhone}\n` +
            `*Kota Domisili:* ${order.customerCity || '-'}\n` +
            `*Alamat:* ${order.customerAddress || '-'}\n` +
            `*Metode Pembayaran:* ${order.paymentMethod === 'KREDIT' ? 'Kredit Leasing' : 'Tunai / Cash'}\n` +
            `*Unit Diminati:* ${unitNames}\n` +
            `*Estimasi Nilai OTR:* ${formatCurrency(order.totalAmount)}\n` +
            `*Catatan Pembeli:* ${order.notes || '-'}\n\n` +
            `*(Catatan Privasi: Data NIK/KTP disimpan aman di arsip sistem showroom).* \n\n` +
            `Mohon kesediaannya untuk segera mengambil inisiatif menyapa dan menghubungi calon pembeli dengan ramah dan profesional guna konfirmasi ketersediaan unit dan jadwal test drive/konsultasi. Terima kasih.`;

        const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'markForwarded' }),
            });

            if (res.ok) {
                const updated: Order = await res.json();
                setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
                if (selectedOrder?.id === order.id) {
                    setSelectedOrder(updated);
                }
                toast({
                    title: 'Diteruskan ke WhatsApp Sales',
                    description: `Pemesanan ${order.id} berhasil diteruskan ke ${order.assignedSalesName}.`,
                });
            }
        } catch (e) {
            console.error('Failed to mark forwarded:', e);
        }

        if (typeof window !== 'undefined') {
            window.open(waUrl, '_blank');
        }
    };

    const handleReassignSales = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'assignNextSales' }),
            });

            if (res.ok) {
                const updated: Order = await res.json();
                setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updated);
                }
                toast({
                    title: 'Sales Ditugaskan',
                    description: `Pesanan ${orderId} dialihkan ke ${updated.assignedSalesName} (${updated.assignedSalesPhone}).`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Gagal Menugaskan',
                    description: 'Tidak ada sales aktif yang tersedia dalam rotasi.',
                });
            }
        } catch (e) {
            console.error('Failed to reassign sales:', e);
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm(`Hapus data pemesanan ${orderId}? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setOrders((prev) => prev.filter((o) => o.id !== orderId));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(null);
                }
                toast({
                    title: 'Pesanan Dihapus',
                    description: `Pemesanan ${orderId} berhasil dihapus dari sistem.`,
                });
            }
        } catch (err) {
            console.error('Error deleting order:', err);
            toast({
                variant: 'destructive',
                title: 'Gagal menghapus',
                description: 'Tidak dapat menghapus pesanan saat ini.',
            });
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            statusFilter === 'ALL' ? true : order.status === statusFilter;

        const query = searchQuery.toLowerCase();
        const safeItems = Array.isArray(order.items) ? order.items : [];
        const matchesQuery =
            order.id.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.customerPhone.toLowerCase().includes(query) ||
            (order.customerCity && order.customerCity.toLowerCase().includes(query)) ||
            (order.assignedSalesName && order.assignedSalesName.toLowerCase().includes(query)) ||
            safeItems.some((item) => item.name.toLowerCase().includes(query));

        return matchesStatus && matchesQuery;
    });

    const countNew = orders.filter((o) => o.status === 'BARU').length;
    const countContacted = orders.filter((o) => o.status === 'DIHUBUNGI').length;
    const countDeal = orders.filter((o) => o.status === 'DEAL' || o.status === 'SELESAI').length;

    return (
        <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Pemesanan Unit Mobil
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Monitoring data prospek pemesanan mobil, alokasi penanganan sales konsultan, dan pembukuan transaksi.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchOrders}
                        disabled={isLoading}
                        className="text-xs h-9"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-9 font-semibold gap-1.5 border-border/80"
                            >
                                <Download className="h-3.5 w-3.5 text-primary" />
                                Download Pembukuan
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs w-48">
                            <DropdownMenuItem
                                onClick={() => exportOrdersToExcel(filteredOrders)}
                                className="cursor-pointer"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
                                Format Excel (.xls)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => exportOrdersToCSV(filteredOrders)}
                                className="cursor-pointer"
                            >
                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                Format CSV (.csv)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* KPI Cards Component */}
            <OrderStats
                totalOrders={orders.length}
                countNew={countNew}
                countContacted={countContacted}
                countDeal={countDeal}
            />

            {/* Filter & Search Bar */}
            <Card className="bg-card border border-border shadow-xs">
                <CardHeader className="p-3 sm:p-4 pb-3 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama pemesan, no. pesanan, telepon..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-9 text-xs rounded-md"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                                Status:
                            </span>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 text-xs w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Semua ({orders.length})
                                    </SelectItem>
                                    <SelectItem value="BARU">
                                        Baru ({countNew})
                                    </SelectItem>
                                    <SelectItem value="DIHUBUNGI">
                                        Dihubungi ({countContacted})
                                    </SelectItem>
                                    <SelectItem value="DEAL">
                                        Deal ({countDeal})
                                    </SelectItem>
                                    <SelectItem value="SELESAI">
                                        Selesai
                                    </SelectItem>
                                    <SelectItem value="BATAL">
                                        Batal
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-12 text-center text-xs text-muted-foreground">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                            Memuat data pemesanan...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
                            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p className="font-semibold text-foreground">Belum ada pemesanan yang cocok</p>
                            <p className="text-[11px]">
                                {searchQuery || statusFilter !== 'ALL'
                                    ? 'Coba sesuaikan kata kunci atau filter status.'
                                    : 'Pesanan yang masuk dari website akan muncul otomatis di sini.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View: Cards */}
                            <OrderCardList
                                orders={filteredOrders}
                                isUpdatingStatus={isUpdatingStatus}
                                onStatusChange={handleStatusChange}
                                onForwardToSalesWA={handleForwardToSalesWA}
                                onSelectOrder={setSelectedOrder}
                            />

                            {/* Desktop View: Table */}
                            <OrderTable
                                orders={filteredOrders}
                                isUpdatingStatus={isUpdatingStatus}
                                onStatusChange={handleStatusChange}
                                onForwardToSalesWA={handleForwardToSalesWA}
                                onReassignSales={handleReassignSales}
                                onSelectOrder={setSelectedOrder}
                                onDelete={handleDelete}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Modal */}
            <OrderDetailDialog
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onReassignSales={handleReassignSales}
                onForwardToSalesWA={handleForwardToSalesWA}
            />
        </div>
    );
}
