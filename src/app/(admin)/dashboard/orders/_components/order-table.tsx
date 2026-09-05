import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Calendar,
    User,
    Phone,
    MapPin,
    Car,
    CreditCard,
    Users,
    AlertCircle,
    CheckCircle2,
    Clock,
    Send,
    RotateCw,
    Trash2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import { STATUS_CONFIG } from './order-constants';

interface OrderTableProps {
    orders: Order[];
    isUpdatingStatus: string | null;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
    onForwardToSalesWA: (order: Order) => void;
    onReassignSales: (orderId: string) => void;
    onSelectOrder: (order: Order) => void;
    onDelete: (orderId: string) => void;
}

export default function OrderTable({
    orders,
    isUpdatingStatus,
    onStatusChange,
    onForwardToSalesWA,
    onReassignSales,
    onSelectOrder,
    onDelete,
}: OrderTableProps) {
    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="py-3 px-4">No. Pesanan & Tanggal</th>
                        <th className="py-3 px-4">Calon Pembeli</th>
                        <th className="py-3 px-4">Unit Dipesan</th>
                        <th className="py-3 px-4">Nilai OTR & Skema</th>
                        <th className="py-3 px-4">Sales & Dispatch</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {orders.map((order) => {
                        const safeItems = Array.isArray(order.items) ? order.items : [];

                        return (
                            <tr
                                key={order.id}
                                className="hover:bg-muted/20 transition-colors"
                            >
                                {/* No Pesanan & Tanggal */}
                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                    <span className="font-mono font-bold text-foreground block text-xs">
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

                                {/* Calon Pembeli */}
                                <td className="py-3 px-4 align-top">
                                    <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        {order.customerName}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span>{order.customerPhone}</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="line-clamp-1">{order.customerCity || '-'}</span>
                                    </div>
                                </td>

                                {/* Unit Dipesan */}
                                <td className="py-3 px-4 align-top">
                                    <div className="space-y-1 max-w-xs">
                                        {safeItems.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-1.5 text-xs text-foreground font-medium"
                                            >
                                                <Car className="h-3.5 w-3.5 text-primary shrink-0" />
                                                <span className="line-clamp-1 truncate">
                                                    {item.name}
                                                </span>
                                                {item.quantity > 1 && (
                                                    <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded font-mono">
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

                                {/* Nilai OTR & Skema */}
                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                    <span className="font-bold text-foreground text-xs block">
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
                                        {order.paymentMethod === 'KREDIT' ? 'Kredit Leasing' : 'Cash'}
                                    </Badge>
                                </td>

                                {/* Sales & Dispatch Status */}
                                <td className="py-3 px-4 align-top">
                                    <div className="text-xs">
                                        <span className="font-semibold text-foreground flex items-center gap-1">
                                            <Users className="h-3 w-3 text-emerald-600" />
                                            {order.assignedSalesName || 'Belum Ada'}
                                        </span>
                                        <div className="mt-1">
                                            {order.forwardedToSalesAt ? (
                                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 font-medium">
                                                    ✓ Terkirim ke WA Sales
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] py-0 font-medium">
                                                    Belum Dikirim
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Status Selector */}
                                <td className="py-3 px-4 align-top">
                                    <Select
                                        value={order.status}
                                        onValueChange={(val: OrderStatus) =>
                                            onStatusChange(order.id, val)
                                        }
                                        disabled={isUpdatingStatus === order.id}
                                    >
                                        <SelectTrigger className="h-8 text-xs w-[135px] font-semibold">
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
                                                    <CheckCircle2 className="h-3 w-3" /> Deal
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

                                {/* Actions */}
                                <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                        {order.assignedSalesPhone ? (
                                            <Button
                                                size="sm"
                                                onClick={() => onForwardToSalesWA(order)}
                                                className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                                                title="Teruskan detail pesanan ke WhatsApp Sales yang bertugas"
                                            >
                                                <Send className="h-3 w-3" />
                                                Kirim ke Sales
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onReassignSales(order.id)}
                                                className="h-8 px-2 text-xs text-amber-600 border-amber-300"
                                                title="Tugaskan sales giliran berikutnya"
                                            >
                                                <RotateCw className="h-3 w-3 mr-1" />
                                                Tugaskan
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 text-xs"
                                            onClick={() => onSelectOrder(order)}
                                        >
                                            Detail
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => onDelete(order.id)}
                                            title="Hapus pemesanan"
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
    );
}
