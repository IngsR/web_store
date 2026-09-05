import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    TrendingDown,
    MessageCircle,
    Car,
    ShieldCheck,
    Building2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { CreditCalculations } from './credit-constants';

interface CreditSummaryProps {
    calculations: CreditCalculations;
    price: number;
    dpPercent: number;
    selectedTenorYear: number;
    interestRate: number;
    adminFee: number;
    waMessage: string;
}

export default function CreditSummary({
    calculations,
    price,
    dpPercent,
    selectedTenorYear,
    interestRate,
    adminFee,
    waMessage,
}: CreditSummaryProps) {
    return (
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-card to-primary/5 shadow-xl overflow-hidden">
            <div className="bg-primary px-4 py-2.5 text-primary-foreground flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" />
                    Hasil Estimasi Kredit
                </span>
                <Badge className="bg-white/20 text-white border-none text-[10px] font-bold">
                    Tenor {selectedTenorYear} Tahun
                </Badge>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-5">
                {/* Monthly Installment Display */}
                <div className="text-center py-2 border-b border-border/60">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Estimasi Cicilan per Bulan
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary font-headline tracking-tight mt-1">
                        {formatCurrency(calculations.monthlyInstallment)}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        x {calculations.totalMonths} Bulan ({selectedTenorYear} Tahun)
                    </p>
                </div>

                {/* TDP & Core Breakdown details */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40 font-bold">
                        <span className="text-foreground">Total Pembayaran Pertama (TDP):</span>
                        <span className="text-base text-primary font-extrabold">
                            {formatCurrency(calculations.totalDP)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Harga Kendaraan:</span>
                        <span className="font-semibold text-foreground">{formatCurrency(price)}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Uang Muka ({dpPercent}%):</span>
                        <span className="font-semibold text-foreground">{formatCurrency(calculations.dpAmount)}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Pokok Hutang (Plafond):</span>
                        <span className="font-semibold text-foreground">{formatCurrency(calculations.loanPrincipal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Suku Bunga ({interestRate}%/thn):</span>
                        <span className="font-semibold text-foreground">{formatCurrency(calculations.totalInterest)}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Asuransi (Thn 1):</span>
                        <span className="font-semibold text-foreground">
                            {calculations.insuranceFeeYear1 > 0 ? formatCurrency(calculations.insuranceFeeYear1) : 'Termasuk / 0'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Biaya Administrasi:</span>
                        <span className="font-semibold text-foreground">{formatCurrency(adminFee)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <span>Total Pengeluaran Kredit:</span>
                        <span className="font-bold text-foreground">{formatCurrency(calculations.grandTotalPayment)}</span>
                    </div>
                </div>

                {/* WhatsApp Consultation CTA */}
                <div className="space-y-2 pt-2">
                    <Button
                        asChild
                        size="lg"
                        className="w-full font-bold h-11 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2"
                    >
                        <a
                            href={`https://wa.me/6281234567890?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Ajukan Kredit via WhatsApp
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full text-xs font-semibold h-10"
                    >
                        <Link href="/products" className="flex items-center justify-center gap-1.5">
                            <Car className="h-4 w-4" />
                            Pilih Mobil Lain di Showroom
                        </Link>
                    </Button>
                </div>

                {/* Trust badges */}
                <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Mitra Leasing Resmi Terdaftar OJK</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>BCA Finance, Mandiri, Adira</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
