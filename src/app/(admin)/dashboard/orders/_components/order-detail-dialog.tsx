import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, RotateCw, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';
import { STATUS_CONFIG } from './order-constants';

interface OrderDetailDialogProps {
    order: Order | null;
    onClose: () => void;
    onReassignSales: (orderId: string) => void;
    onForwardToSalesWA: (order: Order) => void;
}

export default function OrderDetailDialog({
    order,
    onClose,
    onReassignSales,
    onForwardToSalesWA,
}: OrderDetailDialogProps) {
    if (!order) return null;

    const safeItems = Array.isArray(order.items) ? order.items : [];
    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.BARU;

    return (
        <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg text-xs sm:text-sm">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-4">
                        <DialogTitle className="text-base font-bold">
                            Detail Pemesanan #{order.id}
                        </DialogTitle>
                        <Badge className={statusCfg.className}>
                            {statusCfg.label}
                        </Badge>
                    </div>
                    <DialogDescription className="text-xs">
                        Tanggal Masuk:{' '}
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3.5 py-2">
                    {/* Identitas Calon Pembeli */}
                    <div className="bg-muted/40 p-3 rounded-lg border border-border/60 space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                            Identitas Calon Pembeli
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Nama Lengkap</span>
                                <span className="font-bold text-foreground">{order.customerName}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">WhatsApp / Telepon</span>
                                <span className="font-mono font-bold text-foreground">{order.customerPhone}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Kota Domisili</span>
                                <span className="font-medium text-foreground">{order.customerCity || '-'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Email</span>
                                <span className="font-medium text-foreground truncate block">{order.customerEmail || '-'}</span>
                            </div>
                            {order.customerAddress && (
                                <div className="col-span-2 pt-1 border-t border-border/40">
                                    <span className="text-muted-foreground block text-[11px]">Alamat Lengkap</span>
                                    <span className="text-foreground">{order.customerAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Staf Sales Bertanggung Jawab */}
                    <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                Sales Penanggung Jawab
                            </h4>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] px-2 border-emerald-300"
                                onClick={() => onReassignSales(order.id)}
                            >
                                <RotateCw className="h-3 w-3 mr-1" />
                                Gilir Sales
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Nama Sales</span>
                                <span className="font-bold text-foreground">{order.assignedSalesName || 'Belum Ditugaskan'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">No. WhatsApp Sales</span>
                                <span className="font-mono font-bold text-foreground">{order.assignedSalesPhone || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Unit yang Dipesan */}
                    <div className="bg-muted/40 p-3 rounded-lg border border-border/60 space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                            Rincian Unit Dipesan
                        </h4>
                        <div className="divide-y divide-border/40">
                            {safeItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between py-1.5 text-xs">
                                    <div>
                                        <span className="font-semibold text-foreground">{item.name}</span>
                                        <span className="text-muted-foreground text-[11px] block">
                                            {item.quantity} unit • {item.condition}
                                        </span>
                                    </div>
                                    <span className="font-bold text-foreground">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/60 font-bold text-xs">
                            <span>Total Estimasi OTR:</span>
                            <span className="text-sm font-extrabold text-primary">
                                {formatCurrency(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="text-xs h-9"
                    >
                        Tutup
                    </Button>

                    {order.assignedSalesPhone && (
                        <Button
                            size="sm"
                            onClick={() => onForwardToSalesWA(order)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 gap-1.5"
                        >
                            <Send className="h-3.5 w-3.5" />
                            Kirim ke WhatsApp Sales
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
