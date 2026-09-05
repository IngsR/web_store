'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    Phone,
    Mail,
    MapPin,
    Calendar,
    Car,
    FileText,
    ExternalLink,
    Trash2,
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    CreditCard,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; className: string; icon: any }
> = {
    BARU: {
        label: 'Pesanan Baru',
        className: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
        icon: AlertCircle,
    },
    DIHUBUNGI: {
        label: 'Sedang Dihubungi',
        className: 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400',
        icon: Phone,
    },
    DEAL: {
        label: 'Deal / SPK Sah',
        className: 'bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400',
        icon: CheckCircle2,
    },
    SELESAI: {
        label: 'Unit Diserahkan',
        className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    BATAL: {
        label: 'Dibatalkan',
        className: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400',
        icon: Clock,
    },
};

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
                    description: 'Terjadi kesalahan saat mengambil data pesanan.',
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
                    title: 'Status SPK Diperbarui',
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

    const handleDelete = async (orderId: string) => {
        if (!confirm(`Hapus pemesanan ${orderId}? Tindakan ini tidak dapat dibatalkan.`)) {
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
                    description: `Pemesanan ${orderId} berhasil dihapus.`,
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

    // Format phone for WhatsApp
    const formatPhoneForWA = (phone: string) => {
        const cleaned = phone.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            return `62${cleaned.slice(1)}`;
        }
        if (cleaned.startsWith('8')) {
            return `62${cleaned}`;
        }
        return cleaned;
    };

    const createWhatsAppGreeting = (order: Order) => {
        const phone = formatPhoneForWA(order.customerPhone);
        const unitNames = order.items.map((it) => it.name).join(', ');
        const message =
            `Halo Bpk/Ibu *${order.customerName}*,\n\n` +
            `Terima kasih telah mengajukan pemesanan unit di *Ing Store* dengan No. Registrasi SPK: *${order.id}*.\n\n` +
            `*Detail Pesanan:*\n` +
            `• Unit: ${unitNames}\n` +
            `• Skema Pembayaran: ${order.paymentMethod}\n` +
            `• Total Nilai OTR: ${formatCurrency(order.totalAmount)}\n` +
            `• Alamat Pengiriman/Kota: ${order.customerCity}\n\n` +
            `Saya dari tim sales showroom Ing Store ingin mengonfirmasi kelengkapan data & jadwal survei/pengantaran unit. Apakah saat ini Bpk/Ibu ada waktu untuk diskusi lebih lanjut? Terima kasih!`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    // Filtered orders
    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            statusFilter === 'ALL' ? true : order.status === statusFilter;

        const query = searchQuery.toLowerCase();
        const matchesQuery =
            order.id.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.customerPhone.toLowerCase().includes(query) ||
            order.customerCity.toLowerCase().includes(query) ||
            order.items.some((item) => item.name.toLowerCase().includes(query));

        return matchesStatus && matchesQuery;
    });

    // Counts for stat bar
    const countNew = orders.filter((o) => o.status === 'BARU').length;
    const countContacted = orders.filter((o) => o.status === 'DIHUBUNGI').length;
    const countDeal = orders.filter((o) => o.status === 'DEAL' || o.status === 'SELESAI').length;

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Pemesanan Unit (SPK Online)
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monitoring data calon pembeli, identitas pemesan, dan integrasi follow-up WhatsApp showroom.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchOrders}
                        disabled={isLoading}
                        className="text-xs h-9"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 mr-1.5 ${
                                isLoading ? 'animate-spin' : ''
                            }`}
                        />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Card className="border-border/70 shadow-xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-muted-foreground mb-1">
                            <span className="text-xs font-semibold">Total Masuk</span>
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-2xl font-extrabold text-foreground">
                            {orders.length}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Semua pemesanan tercatat
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
                            <span className="text-xs font-semibold">Perlu Follow-up</span>
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                            {countNew}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Calon pembeli baru
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/30 bg-blue-500/5 shadow-xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
                            <span className="text-xs font-semibold">Sedang Dihubungi</span>
                            <Phone className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                            {countContacted}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Proses negosiasi via WA
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
                            <span className="text-xs font-semibold">Deal & Selesai</span>
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {countDeal}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Konfirmasi pembelian sah
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter & Search Toolbar */}
            <Card className="border-border/70">
                <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama pembeli, no. SPK, telepon, atau kota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs sm:text-sm h-9"
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        {[
                            { key: 'ALL', label: 'Semua' },
                            { key: 'BARU', label: 'Baru' },
                            { key: 'DIHUBUNGI', label: 'Dihubungi' },
                            { key: 'DEAL', label: 'Deal' },
                            { key: 'SELESAI', label: 'Selesai' },
                            { key: 'BATAL', label: 'Batal' },
                        ].map((tab) => (
                            <Button
                                key={tab.key}
                                variant={statusFilter === tab.key ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter(tab.key)}
                                className="text-xs h-8 whitespace-nowrap px-3"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Orders List / Table */}
            <Card className="border-border/70 overflow-hidden shadow-xs">
                <CardHeader className="py-4 px-4 sm:px-6 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            Daftar Pemesan Kendaraan
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                            Menampilkan {filteredOrders.length} dari {orders.length} pesanan
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                            <p className="text-sm">Memuat data pemesanan...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
                            <p className="text-sm font-semibold text-foreground">
                                Belum ada data pemesanan
                            </p>
                            <p className="text-xs max-w-sm">
                                {searchQuery || statusFilter !== 'ALL'
                                    ? 'Tidak ada pemesanan yang cocok dengan kriteria pencarian.'
                                    : 'Pesanan yang masuk dari formulir online akan otomatis muncul di sini.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 text-[11px] uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="py-3 px-4">No. SPK & Tanggal</th>
                                        <th className="py-3 px-4">Identitas Pembeli</th>
                                        <th className="py-3 px-4">Unit Dipesan</th>
                                        <th className="py-3 px-4">Total OTR & Skema</th>
                                        <th className="py-3 px-4">Status Transaksi</th>
                                        <th className="py-3 px-4 text-right">Aksi Sales</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {filteredOrders.map((order) => {
                                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.BARU;
                                        const StatusIcon = statusCfg.icon;

                                        return (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-muted/20 transition-colors"
                                            >
                                                {/* No SPK & Date */}
                                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                                    <span className="font-mono font-bold text-foreground block text-xs sm:text-sm">
                                                        {order.id}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </td>

                                                {/* Customer Identity */}
                                                <td className="py-3 px-4 align-top">
                                                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                        {order.customerName}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                        <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                                                        <span>{order.customerPhone}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                                        <span className="line-clamp-1">{order.customerCity}</span>
                                                    </div>
                                                </td>

                                                {/* Units */}
                                                <td className="py-3 px-4 align-top">
                                                    <div className="space-y-1 max-w-xs">
                                                        {order.items.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-1.5 text-xs text-foreground font-medium"
                                                            >
                                                                <Car className="h-3.5 w-3.5 text-primary shrink-0" />
                                                                <span className="line-clamp-1">
                                                                    {item.name}
                                                                </span>
                                                                {item.quantity > 1 && (
                                                                    <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded">
                                                                        x{item.quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {order.notes && (
                                                            <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                                                                &ldquo;{order.notes}&rdquo;
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Price & Method */}
                                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                                    <span className="font-extrabold text-foreground text-xs sm:text-sm block">
                                                        {formatCurrency(order.totalAmount)}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] px-1.5 py-0 mt-1 font-semibold ${
                                                            order.paymentMethod === 'KREDIT'
                                                                ? 'border-indigo-400 text-indigo-600 dark:text-indigo-400'
                                                                : 'border-emerald-400 text-emerald-600 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        <CreditCard className="h-2.5 w-2.5 mr-1" />
                                                        Skema {order.paymentMethod}
                                                    </Badge>
                                                </td>

                                                {/* Status Selector */}
                                                <td className="py-3 px-4 align-top">
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(val: OrderStatus) =>
                                                            handleStatusChange(order.id, val)
                                                        }
                                                        disabled={isUpdatingStatus === order.id}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs w-[145px] font-semibold">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="BARU">
                                                                <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                                                                    <AlertCircle className="h-3 w-3" /> Baru
                                                                </span>
                                                            </SelectItem>
                                                            <SelectItem value="DIHUBUNGI">
                                                                <span className="text-blue-600 font-semibold flex items-center gap-1.5">
                                                                    <Phone className="h-3 w-3" /> Dihubungi
                                                                </span>
                                                            </SelectItem>
                                                            <SelectItem value="DEAL">
                                                                <span className="text-purple-600 font-semibold flex items-center gap-1.5">
                                                                    <CheckCircle2 className="h-3 w-3" /> Deal / SPK
                                                                </span>
                                                            </SelectItem>
                                                            <SelectItem value="SELESAI">
                                                                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                                                                    <CheckCircle2 className="h-3 w-3" /> Selesai
                                                                </span>
                                                            </SelectItem>
                                                            <SelectItem value="BATAL">
                                                                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                                                                    <Clock className="h-3 w-3" /> Batal
                                                                </span>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>

                                                {/* Sales Action */}
                                                <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* WhatsApp button */}
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
                                                            title="Follow up pemesanan langsung ke WhatsApp customer"
                                                        >
                                                            <a
                                                                href={createWhatsAppGreeting(order)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Phone className="h-3.5 w-3.5 mr-1" />
                                                                Chat WA
                                                            </a>
                                                        </Button>

                                                        {/* Detail modal button */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2.5 text-xs"
                                                            onClick={() => setSelectedOrder(order)}
                                                            title="Lihat profil lengkap pemesan"
                                                        >
                                                            Detail
                                                        </Button>

                                                        {/* Delete button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDelete(order.id)}
                                                            title="Hapus data pesanan"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Modal */}
            <Dialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            >
                {selectedOrder && (
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <div className="flex items-center justify-between pr-4">
                                <DialogTitle className="text-base sm:text-lg font-bold">
                                    Detail SPK #{selectedOrder.id}
                                </DialogTitle>
                                <Badge
                                    className={
                                        STATUS_CONFIG[selectedOrder.status]?.className ||
                                        ''
                                    }
                                >
                                    {STATUS_CONFIG[selectedOrder.status]?.label}
                                </Badge>
                            </div>
                            <DialogDescription className="text-xs">
                                Terdaftar pada{' '}
                                {new Date(selectedOrder.createdAt).toLocaleDateString(
                                    'id-ID',
                                    {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 text-xs sm:text-sm py-2">
                            {/* Identitas Calon Pembeli */}
                            <div className="bg-muted/40 p-3.5 rounded-lg border border-border/60 space-y-2">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                    Identitas Calon Pembeli
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Nama Lengkap</span>
                                        <span className="font-bold text-foreground">{selectedOrder.customerName}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">No. Telepon / WhatsApp</span>
                                        <span className="font-bold text-foreground">{selectedOrder.customerPhone}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Email</span>
                                        <span className="font-medium text-foreground">{selectedOrder.customerEmail}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Kota Domisili</span>
                                        <span className="font-medium text-foreground">{selectedOrder.customerCity}</span>
                                    </div>
                                </div>
                                <div className="pt-1 border-t border-border/40">
                                    <span className="text-muted-foreground block text-[11px]">Alamat Lengkap</span>
                                    <span className="text-foreground">{selectedOrder.customerAddress}</span>
                                </div>
                            </div>

                            {/* Unit yang Dipesan */}
                            <div className="border border-border/60 rounded-lg p-3.5 space-y-2">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                    Unit Kendaraan
                                </h4>
                                <div className="divide-y divide-border/40">
                                    {selectedOrder.items.map((it, idx) => (
                                        <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                                            <div>
                                                <span className="font-bold text-foreground block">{it.name}</span>
                                                <span className="text-muted-foreground text-[11px]">
                                                    {it.quantity} unit @ {formatCurrency(it.price)}
                                                </span>
                                            </div>
                                            <span className="font-bold text-foreground">
                                                {formatCurrency(it.price * it.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-border/60 flex justify-between items-center text-xs sm:text-sm font-bold">
                                    <span>Total Nilai Transaksi</span>
                                    <span className="text-primary font-extrabold text-sm sm:text-base">
                                        {formatCurrency(selectedOrder.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                                    <span>Preferensi Pembayaran:</span>
                                    <span className="font-semibold text-foreground">
                                        Skema {selectedOrder.paymentMethod}
                                    </span>
                                </div>
                            </div>

                            {/* Catatan Khusus */}
                            {selectedOrder.notes && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs">
                                    <span className="font-semibold text-amber-700 dark:text-amber-300 block mb-0.5">
                                        Catatan / Permintaan Khusus:
                                    </span>
                                    <p className="text-foreground">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* WhatsApp Direct Action inside modal */}
                            <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                <Button
                                    asChild
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs sm:text-sm"
                                >
                                    <a
                                        href={createWhatsAppGreeting(selectedOrder)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Hubungi Konsumen via WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
