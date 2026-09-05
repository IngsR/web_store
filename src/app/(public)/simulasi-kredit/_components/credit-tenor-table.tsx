import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { TenorOption } from './credit-constants';

export interface TenorBreakdownItem extends TenorOption {
    rate: number;
    installment: number;
    totalInterest: number;
    tdp: number;
    isSelected: boolean;
}

export interface YearlyBreakdownItem {
    year: number;
    principalPaid: number;
    interestPaid: number;
    totalYearly: number;
    remainingPrincipal: number;
}

interface CreditTenorTableProps {
    allTenorBreakdown: TenorBreakdownItem[];
    yearlyBreakdown: YearlyBreakdownItem[];
    selectedTenorYear: number;
    onTenorChange: (year: number) => void;
}

export default function CreditTenorTable({
    allTenorBreakdown,
    yearlyBreakdown,
    selectedTenorYear,
    onTenorChange,
}: CreditTenorTableProps) {
    return (
        <>
            {/* FULL COMPARISON: Tenor 1 to 5 Years */}
            <div className="mt-10 sm:mt-16 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Perbandingan Lengkap
                        </span>
                        <h2 className="font-headline text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                            Tabel Simulasi Cicilan Semua Tenor (1 s/d 5 Tahun)
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Bandingkan besaran cicilan dan estimasi Total DP (TDP) untuk setiap jangka waktu kredit.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {allTenorBreakdown.map((item) => (
                        <div
                            key={item.year}
                            onClick={() => onTenorChange(item.year)}
                            className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                                item.isSelected
                                    ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20 scale-[1.01]'
                                    : 'border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30'
                            }`}
                        >
                            {item.isSelected && (
                                <span className="absolute top-2 right-2 text-[10px] font-bold text-primary flex items-center gap-0.5">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Aktif
                                </span>
                            )}

                            <div>
                                <p className="font-extrabold text-sm sm:text-base font-headline text-foreground">
                                    {item.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {item.months} Kali Angsuran
                                </p>

                                <div className="mt-3 pt-2 border-t border-border/60">
                                    <p className="text-[10px] text-muted-foreground">Cicilan per Bulan</p>
                                    <p className="font-extrabold text-sm sm:text-base text-primary leading-tight mt-0.5">
                                        {formatCurrency(item.installment)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-dashed border-border/60 space-y-1 text-[11px]">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Estimasi Bunga:</span>
                                    <span className="font-semibold text-foreground">{item.rate}%</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Est. Total DP:</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(item.tdp)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total Bunga:</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(item.totalInterest)}</span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant={item.isSelected ? 'default' : 'outline'}
                                className="w-full text-xs font-semibold mt-3 h-8"
                            >
                                {item.isSelected ? 'Pilihan Anda' : 'Pilih Tenor Ini'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amortization Table: Yearly Breakdown */}
            <div className="mt-10 sm:mt-14 space-y-4">
                <div>
                    <h3 className="font-headline text-base sm:text-xl font-bold tracking-tight text-foreground">
                        Rincian Pokok & Bunga per Tahun ({selectedTenorYear} Tahun)
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Transparansi alokasi pembayaran pokok hutang dan bunga setiap tahunnya.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-muted/50 border-b text-foreground font-semibold">
                            <tr>
                                <th className="p-3">Tahun ke-</th>
                                <th className="p-3">Pokok Terbayar</th>
                                <th className="p-3">Bunga Terbayar</th>
                                <th className="p-3">Total Angsuran 1 Tahun</th>
                                <th className="p-3">Sisa Pokok Hutang</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {yearlyBreakdown.map((row) => (
                                <tr key={row.year} className="hover:bg-muted/20">
                                    <td className="p-3 font-bold text-foreground">Tahun {row.year}</td>
                                    <td className="p-3 text-muted-foreground">{formatCurrency(row.principalPaid)}</td>
                                    <td className="p-3 text-muted-foreground">{formatCurrency(row.interestPaid)}</td>
                                    <td className="p-3 font-semibold text-foreground">{formatCurrency(row.totalYearly)}</td>
                                    <td className="p-3 font-bold text-primary">{formatCurrency(row.remainingPrincipal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
