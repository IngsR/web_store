import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Car, Users, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import { STATUS_CONFIG } from './order-constants';

interface OrderCardListProps {
    orders: Order[];
    isUpdatingStatus: string | null;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
    onForwardToSalesWA: (order: Order) => void;
    onSelectOrder: (order: Order) => void;
}

export default function OrderCardList({
    orders,
    isUpdatingStatus,
    onStatusChange,
    onForwardToSalesWA,
    onSelectOrder,
}: OrderCardListProps) {
    return (
        <div className="block md:hidden divide-y divide-border/60">
            {orders.map((order) => {
                const safeItems = Array.isArray(order.items) ? order.items : [];
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.BARU;

                return (
                    <div key={order.id} className="p-3.5 space-y-3">
                        {/* Top: ID & Status */}
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <span className="font-mono font-bold text-xs text-foreground block">
                                    {order.id}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <Badge className={`${statusCfg.className} text-[10px] font-semibold py-0.5`}>
                                {statusCfg.label}
                            </Badge>
                        </div>

                        {/* Pemesan & Unit */}
                        <div className="bg-muted/30 p-2.5 rounded-lg text-xs space-y-1.5 border border-border/40">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground">
                                    {order.customerName}
                                </span>
                                <span className="text-[11px] font-mono text-muted-foreground">
                                    {order.customerPhone}
                                </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                                Domisili: {order.customerCity || '-'}
                            </div>

                            <div className="pt-1 border-t border-border/40">
                                {safeItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-foreground flex items-center gap-1 truncate max-w-[180px]">
                                            <Car className="h-3 w-3 text-primary shrink-0" />
                                            {item.name}
                                        </span>
                                        <span className="font-bold text-primary">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Sales Assigned info */}
                            <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3 text-emerald-600" />
                                    Sales: <strong>{order.assignedSalesName || 'Belum Ada'}</strong>
                                </span>
                                {order.forwardedToSalesAt ? (
                                    <span className="text-emerald-600 font-medium text-[10px]">
                                        ✓ Sudah ke WA Sales
                                    </span>
                                ) : (
                                    <span className="text-amber-600 font-medium text-[10px]">
                                        Belum Diforward
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons for Mobile */}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                            <div className="w-[120px]">
                                <Select
                                    value={order.status}
                                    onValueChange={(val: OrderStatus) =>
                                        onStatusChange(order.id, val)
                                    }
                                    disabled={isUpdatingStatus === order.id}
                                >
                                    <SelectTrigger className="h-8 text-[11px] font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BARU">Baru</SelectItem>
                                        <SelectItem value="DIHUBUNGI">Dihubungi</SelectItem>
                                        <SelectItem value="DEAL">Deal</SelectItem>
                                        <SelectItem value="SELESAI">Selesai</SelectItem>
                                        <SelectItem value="BATAL">Batal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {order.assignedSalesPhone && (
                                    <Button
                                        size="sm"
                                        onClick={() => onForwardToSalesWA(order)}
                                        className="h-8 text-[11px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                                    >
                                        <Send className="h-3 w-3" />
                                        Kirim ke Sales
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-[11px] px-2"
                                    onClick={() => onSelectOrder(order)}
                                >
                                    Detail
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
