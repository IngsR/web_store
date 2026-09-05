import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
    TENOR_OPTIONS,
    PRESET_PRICES,
    DP_PERCENTAGE_OPTIONS,
    type InsuranceType,
    type PaymentScheme,
    type CreditCalculations,
} from './credit-constants';

interface CreditFormProps {
    price: number;
    setPrice: (price: number) => void;
    dpPercent: number;
    setDpPercent: (dp: number) => void;
    selectedTenorYear: number;
    onTenorChange: (year: number) => void;
    interestRate: number;
    setInterestRate: (rate: number) => void;
    insuranceType: InsuranceType;
    setInsuranceType: (type: InsuranceType) => void;
    paymentScheme: PaymentScheme;
    setPaymentScheme: (scheme: PaymentScheme) => void;
    calculations: CreditCalculations;
    onReset: () => void;
}

export default function CreditForm({
    price,
    setPrice,
    dpPercent,
    setDpPercent,
    selectedTenorYear,
    onTenorChange,
    interestRate,
    setInterestRate,
    insuranceType,
    setInsuranceType,
    paymentScheme,
    setPaymentScheme,
    calculations,
    onReset,
}: CreditFormProps) {
    return (
        <div className="space-y-5">
            {/* Card 1: Harga Mobil */}
            <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
                            Harga Kendaraan (OTR)
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-xs text-muted-foreground h-7 px-2"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6 pb-5">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-muted-foreground">
                            Rp
                        </span>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                            className="pl-10 font-bold text-sm sm:text-base h-11 text-foreground"
                            step="5000000"
                        />
                    </div>

                    {/* Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {PRESET_PRICES.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPrice(p.value)}
                                className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-md border transition-all ${
                                    price === p.value
                                        ? 'bg-primary text-primary-foreground border-primary font-bold'
                                        : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Uang Muka (DP) */}
            <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
                            Uang Muka (DP)
                        </CardTitle>
                        <span className="text-xs sm:text-sm font-bold text-primary">
                            {dpPercent}% = {formatCurrency(calculations.dpAmount)}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6 pb-5">
                    {/* DP Slider */}
                    <div className="pt-2">
                        <Slider
                            value={[dpPercent]}
                            min={10}
                            max={80}
                            step={5}
                            onValueChange={(val) => setDpPercent(val[0])}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                            <span>Min 10%</span>
                            <span>Rekomendasi 20% - 30%</span>
                            <span>Maks 80%</span>
                        </div>
                    </div>

                    {/* DP Preset Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {DP_PERCENTAGE_OPTIONS.map((pct) => (
                            <button
                                key={pct}
                                type="button"
                                onClick={() => setDpPercent(pct)}
                                className={`text-xs px-3 py-1 rounded-md border font-medium transition-all ${
                                    dpPercent === pct
                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                                        : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Card 3: Jangka Waktu / Tenor (Max 5 Tahun) */}
            <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
                            Jangka Waktu / Tenor (Maksimal 5 Tahun)
                        </CardTitle>
                        <Badge variant="secondary" className="text-[10px] font-bold">
                            Maks. 5 Tahun (60 Bln)
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6 pb-5">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {TENOR_OPTIONS.map((t) => {
                            const isSelected = selectedTenorYear === t.year;
                            return (
                                <button
                                    key={t.year}
                                    type="button"
                                    onClick={() => onTenorChange(t.year)}
                                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                                        isSelected
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]'
                                            : 'bg-card hover:bg-muted/50 border-border text-foreground'
                                    }`}
                                >
                                    <span className="text-xs sm:text-sm font-extrabold">{t.label}</span>
                                    <span className={`text-[10px] ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {t.months} Bulan
                                    </span>
                                    <span className={`text-[9px] font-semibold mt-0.5 ${isSelected ? 'text-amber-300' : 'text-primary'}`}>
                                        Bunga {t.defaultRate}%
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Card 4: Suku Bunga & Opsi Finansial */}
            <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
                    <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">4</span>
                        Suku Bunga & Detail Asuransi
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6 pb-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-foreground">Suku Bunga (% per Tahun)</span>
                            <span className="font-bold text-primary">{interestRate}% Flat / Thn</span>
                        </div>
                        <Slider
                            value={[interestRate]}
                            min={4.0}
                            max={15.0}
                            step={0.1}
                            onValueChange={(val) => setInterestRate(Number(val[0].toFixed(1)))}
                            className="cursor-pointer"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {[
                                { rate: 5.5, label: 'Promo Bunga 5.5%' },
                                { rate: 6.8, label: 'Syariah 6.8%' },
                                { rate: 7.5, label: 'Reguler 7.5%' },
                                { rate: 8.5, label: 'Standar 8.5%' },
                            ].map((item) => (
                                <button
                                    key={item.rate}
                                    type="button"
                                    onClick={() => setInterestRate(item.rate)}
                                    className="text-[10px] px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground hover:bg-muted"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Asuransi Selection */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                        <label className="text-xs sm:text-sm font-semibold block text-foreground">
                            Jenis Asuransi Kendaraan:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {[
                                { id: 'all_risk', label: 'All Risk', desc: 'Perlindungan Penuh' },
                                { id: 'kombinasi', label: 'Kombinasi', desc: 'All Risk + TLO' },
                                { id: 'tlo', label: 'TLO', desc: 'Total Loss Only' },
                                { id: 'none', label: 'Tanpa Asuransi', desc: '0%' },
                            ].map((ins) => (
                                <button
                                    key={ins.id}
                                    type="button"
                                    onClick={() => setInsuranceType(ins.id as InsuranceType)}
                                    className={`p-2 rounded-lg border text-left transition-all ${
                                        insuranceType === ins.id
                                            ? 'bg-primary/10 border-primary text-primary font-bold'
                                            : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    <p className="leading-tight font-bold">{ins.label}</p>
                                    <p className="text-[10px] opacity-75 mt-0.5">{ins.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skema Pembayaran */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                        <label className="text-xs sm:text-sm font-semibold block text-foreground">
                            Skema Angsuran Pertama:
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setPaymentScheme('addb')}
                                className={`p-2.5 rounded-lg border text-left transition-all ${
                                    paymentScheme === 'addb'
                                        ? 'bg-primary/10 border-primary text-primary font-bold'
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <p className="font-bold">ADDB (Di Belakang)</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Cicilan ke-1 dibayar bulan depan. TDP lebih ringan.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentScheme('addm')}
                                className={`p-2.5 rounded-lg border text-left transition-all ${
                                    paymentScheme === 'addm'
                                        ? 'bg-primary/10 border-primary text-primary font-bold'
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <p className="font-bold">ADDM (Di Muka)</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Cicilan ke-1 dibayar saat DP. Sisa cicilan berkurang 1x.
                                </p>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
