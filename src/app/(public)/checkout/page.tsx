'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import {
    Car,
    ShieldCheck,
    MessageCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    FileText,
    Wallet,
    CreditCard,
    PhoneCall,
} from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    // Form data pemesan
    const [customerName, setCustomerName] = useState(user?.name || '');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState(user?.email || '');
    const [customerCity, setCustomerCity] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'KREDIT'>('CASH');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<any | null>(null);

    const effectiveTotal = useMemo(() => {
        return cartTotal;
    }, [cartTotal]);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Keranjang pesanan Anda masih kosong.');
            return;
        }

        if (!customerName || !customerPhone || !customerEmail || !customerCity || !customerAddress) {
            alert('Mohon lengkapi seluruh formulir data pemesan.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                customerName,
                customerPhone,
                customerEmail,
                customerCity,
                customerAddress,
                paymentMethod,
                notes,
                items: cartItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price,
                    quantity: item.quantity,
                    images: item.images,
                    category: item.category,
                    condition: item.condition,
                })),
                totalAmount: effectiveTotal,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const order = await res.json();
                setCompletedOrder(order);
                clearCart();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Gagal mengirim pesanan. Silakan periksa kembali data Anda.');
            }
        } catch (error) {
            console.error('Submit order error:', error);
            alert('Terjadi kesalahan teknis saat memproses pesanan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tampilan Sukses Setelah Pemesanan Terkirim
    if (completedOrder) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
                <Card className="border-2 border-emerald-500/40 shadow-xl overflow-hidden">
                    <div className="bg-emerald-600 p-6 text-white text-center">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-headline font-bold">
                            Pemesanan Unit Berhasil Diterima!
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                            Terima kasih telah memilih Ing Store. Formulir pemesanan mobil Anda telah tercatat aman di sistem kami.
                        </p>
                    </div>

                    <CardContent className="p-6 space-y-5 text-left text-xs sm:text-sm">
                        <div className="p-4 rounded-xl bg-muted/50 border border-border/80 space-y-2">
                            <div className="flex justify-between items-center pb-2 border-b border-border/60">
                                <span className="text-muted-foreground font-medium">Nomor Pemesanan:</span>
                                <span className="font-mono font-bold text-primary text-sm sm:text-base">
                                    {completedOrder.id}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Atas Nama:</span>
                                <span className="font-bold text-foreground">{completedOrder.customerName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Nomor WhatsApp:</span>
                                <span className="font-bold text-foreground">{completedOrder.customerPhone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Kota Domisili:</span>
                                <span className="font-bold text-foreground">{completedOrder.customerCity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Skema Pembelian:</span>
                                <Badge variant={completedOrder.paymentMethod === 'CASH' ? 'default' : 'secondary'}>
                                    {completedOrder.paymentMethod === 'CASH' ? 'Tunai (Cash Keras)' : 'Kredit Leasing'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-border/60">
                                <span className="font-bold text-foreground">Total Estimasi OTR:</span>
                                <span className="font-extrabold text-primary text-sm sm:text-base">
                                    {formatCurrency(completedOrder.totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                            <p className="font-bold flex items-center gap-1.5 text-sm">
                                <PhoneCall className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Sales Kami Akan Segera Menghubungi Anda
                            </p>
                            <p className="text-muted-foreground dark:text-blue-300 leading-relaxed pt-0.5">
                                Konsultan sales representatif kami yang bertugas akan segera menghubungi nomor WhatsApp Anda (<strong>{completedOrder.customerPhone}</strong>) untuk mengonfirmasi ketersediaan unit, rincian warna, simulasi hitungan cicilan (bila kredit), atau mengatur jadwal test drive langsung di showroom.
                            </p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Button asChild className="w-full font-bold h-11 text-xs sm:text-sm">
                                <Link href="/">
                                    Kembali ke Beranda
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full text-xs h-10">
                                <Link href="/products">
                                    Jelajahi Mobil Lainnya
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10 max-w-6xl">
            {/* Top Back Link */}
            <div className="mb-4">
                <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto">
                    <Link href="/cart">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Kembali ke Keranjang</span>
                    </Link>
                </Button>
            </div>

            {/* Title */}
            <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                    <FileText className="h-3.5 w-3.5" />
                    Formulir Pemesanan Unit Mobil
                </div>
                <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Konfirmasi Pemesanan Mobil
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Lengkapi identitas pemesan di bawah ini. Tim konsultan resmi kami akan memverifikasi unit dan memandu proses serah terima via WhatsApp.
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed rounded-2xl bg-card max-w-md mx-auto space-y-3">
                    <Car className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="font-bold text-base text-foreground">Tidak Ada Unit yang Dipilih</h3>
                    <p className="text-xs text-muted-foreground">
                        Silakan pilih mobil yang ingin Anda pesan terlebih dahulu di showroom kami.
                    </p>
                    <Button asChild size="sm" className="text-xs mt-2">
                        <Link href="/products">Pilih Mobil di Showroom</Link>
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmitOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* LEFT COLUMN: Data Pemesan Form */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Card: Identitas Pemesan */}
                            <Card className="border-border/80 shadow-sm">
                                <CardHeader className="pb-3 pt-4 px-4 sm:px-6 bg-muted/20 border-b">
                                    <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
                                        Identitas Pembeli / Pemesan
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Data ini digunakan untuk pencatatan resmi pemesanan unit mobil di dealer kami.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 px-4 sm:px-6 pt-5 pb-6">
                                    <div>
                                        <label className="text-xs font-semibold text-foreground block mb-1">
                                            Nama Lengkap (Sesuai KTP) <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: Budi Santoso"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="h-10 text-xs sm:text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-foreground block mb-1">
                                                Nomor WhatsApp / Telepon <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                type="tel"
                                                placeholder="Contoh: 081234567890"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                required
                                                className="h-10 text-xs sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-foreground block mb-1">
                                                Alamat Email Aktif <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="Contoh: budi@gmail.com"
                                                value={customerEmail}
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                                required
                                                className="h-10 text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-foreground block mb-1">
                                            Kota / Kabupaten Domisili <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: Jakarta Selatan, Surabaya, Bandung"
                                            value={customerCity}
                                            onChange={(e) => setCustomerCity(e.target.value)}
                                            required
                                            className="h-10 text-xs sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-foreground block mb-1">
                                            Alamat Lengkap (Untuk STNK / Pengiriman Unit) <span className="text-destructive">*</span>
                                        </label>
                                        <Textarea
                                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                            value={customerAddress}
                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                            required
                                            rows={2}
                                            className="text-xs sm:text-sm resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card: Rencana Pembayaran */}
                            <Card className="border-border/80 shadow-sm">
                                <CardHeader className="pb-3 pt-4 px-4 sm:px-6 bg-muted/20 border-b">
                                    <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
                                        Rencana Metode Pembayaran
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Tidak ada transaksi kartu kredit di web. Pembayaran ditangani langsung secara aman bersama dealer.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 px-4 sm:px-6 pt-5 pb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('CASH')}
                                            className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                                paymentMethod === 'CASH'
                                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                                                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                                            }`}
                                        >
                                            <Wallet className={`h-5 w-5 shrink-0 mt-0.5 ${paymentMethod === 'CASH' ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div>
                                                <p className={`font-bold text-xs sm:text-sm ${paymentMethod === 'CASH' ? 'text-primary' : 'text-foreground'}`}>
                                                    Tunai / Cash Keras
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    Pelunasan via transfer rekening resmi dealer atau saat serah terima unit.
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('KREDIT')}
                                            className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                                paymentMethod === 'KREDIT'
                                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
                                                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                                            }`}
                                        >
                                            <CreditCard className={`h-5 w-5 shrink-0 mt-0.5 ${paymentMethod === 'KREDIT' ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div>
                                                <p className={`font-bold text-xs sm:text-sm ${paymentMethod === 'KREDIT' ? 'text-primary' : 'text-foreground'}`}>
                                                    Kredit / Leasing Mobil
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    Pengajuan pembiayaan melalui leasing resmi mitra (BCA, Mandiri, Adira, dll).
                                                </p>
                                            </div>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-foreground block mb-1">
                                            Catatan Tambahan (Opsional)
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: Preferensi warna unit, rencana test drive, atau request DP tertentu"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="h-10 text-xs sm:text-sm"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Ringkasan Unit Dipesan & Tombol Submit */}
                        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
                            <Card className="border-border/80 shadow-md">
                                <CardHeader className="py-3 px-4 sm:px-6 bg-muted/30 border-b">
                                    <CardTitle className="text-sm font-bold text-foreground">
                                        Ringkasan Unit Dipesan ({cartItems.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 space-y-4">
                                    {/* Item List Preview */}
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {cartItems.map((item) => {
                                            const itemPrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
                                            return (
                                                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-b-0">
                                                    <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted/20 border shrink-0">
                                                        <Image
                                                            src={item.images?.[0] || '/home/placeholder.jpg'}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain p-1"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-xs truncate text-foreground">{item.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{item.quantity} unit • {item.condition}</p>
                                                        <p className="text-xs font-extrabold text-primary">{formatCurrency(itemPrice * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Metode Pembayaran:</span>
                                            <span className="font-bold text-foreground">
                                                {paymentMethod === 'CASH' ? 'Tunai (Cash Keras)' : 'Kredit Leasing'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Biaya Booking Fee:</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gratis Booking Online</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-sm sm:text-base pt-1 border-t border-border/60">
                                            <span className="text-foreground">Total Estimasi OTR:</span>
                                            <span className="text-primary text-base sm:text-lg font-extrabold">
                                                {formatCurrency(effectiveTotal)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={isSubmitting}
                                            className="w-full font-bold h-12 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Memproses Pemesanan...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>Kirim Formulir Pemesanan</span>
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-muted-foreground text-center mt-2 leading-tight">
                                            Pesanan Anda akan langsung tercatat di sistem dealer. Tim konsultan sales kami yang akan berinisiatif menghubungi nomor WhatsApp Anda untuk konfirmasi unit dan jadwal test drive.
                                        </p>
                                    </div>

                                    {/* Dealer Trust Badge */}
                                    <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Showroom Resmi • Transaksi Aman & Terverifikasi</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
