'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Calculator,
    ShieldCheck,
    CheckCircle2,
    MessageCircle,
    Car,
    RotateCcw,
    ChevronRight,
    TrendingDown,
    Building2,
    Calendar,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Tenor options up to maximum 5 years (60 months)
const TENOR_OPTIONS = [
    { year: 1, months: 12, defaultRate: 5.5, label: '1 Tahun' },
    { year: 2, months: 24, defaultRate: 6.2, label: '2 Tahun' },
    { year: 3, months: 36, defaultRate: 6.8, label: '3 Tahun' },
    { year: 4, months: 48, defaultRate: 7.5, label: '4 Tahun' },
    { year: 5, months: 60, defaultRate: 8.2, label: '5 Tahun' },
];

const PRESET_PRICES = [
    { label: 'Rp 150 Jt', value: 150000000 },
    { label: 'Rp 250 Jt', value: 250000000 },
    { label: 'Rp 350 Jt', value: 350000000 },
    { label: 'Rp 500 Jt', value: 500000000 },
    { label: 'Rp 750 Jt', value: 750000000 },
    { label: 'Rp 1 Milyar', value: 1000000000 },
];

const DP_PERCENTAGE_OPTIONS = [15, 20, 25, 30, 40, 50];

function CreditSimulatorContent() {
    const searchParams = useSearchParams();

    // Initial values from query params if coming from a product detail page
    const initialPriceParam = Number(searchParams.get('price')) || 350000000;
    const initialCarNameParam = searchParams.get('name') || '';

    const [carName, setCarName] = useState(initialCarNameParam);
    const [price, setPrice] = useState(initialPriceParam);
    const [dpPercent, setDpPercent] = useState(20);
    const [selectedTenorYear, setSelectedTenorYear] = useState(5); // Default max 5 tahun
    const [interestRate, setInterestRate] = useState(7.5); // % per tahun
    const [insuranceType, setInsuranceType] = useState<'all_risk' | 'kombinasi' | 'tlo' | 'none'>('all_risk');
    const [paymentScheme, setPaymentScheme] = useState<'addb' | 'addm'>('addb');
    const [adminFee, setAdminFee] = useState(2500000);

    // Sync if query param changes
    useEffect(() => {
        const p = Number(searchParams.get('price'));
        const n = searchParams.get('name');
        if (p && p > 0) setPrice(p);
        if (n) setCarName(n);
    }, [searchParams]);

    // Update default interest rate when tenor changes if user hasn't overridden strongly
    const handleTenorChange = (tenorYear: number) => {
        setSelectedTenorYear(tenorYear);
        const tenorConfig = TENOR_OPTIONS.find((t) => t.year === tenorYear);
        if (tenorConfig) {
            setInterestRate(tenorConfig.defaultRate);
        }
    };

    // Calculate core figures
    const calculations = useMemo(() => {
        const dpAmount = Math.round(price * (dpPercent / 100));
        const loanPrincipal = Math.max(0, price - dpAmount);

        // Tenor config
        const totalMonths = selectedTenorYear * 12;

        // Interest calculation (Flat rate formula commonly used by Indonesian car leasings)
        const totalInterest = Math.round(loanPrincipal * (interestRate / 100) * selectedTenorYear);
        const totalLoanWithInterest = loanPrincipal + totalInterest;
        const monthlyInstallment = totalMonths > 0 ? Math.round(totalLoanWithInterest / totalMonths) : 0;

        // Insurance rate estimation based on type
        let insuranceRate = 0;
        if (insuranceType === 'all_risk') insuranceRate = 0.025; // 2.5% per tahun
        else if (insuranceType === 'kombinasi') insuranceRate = 0.018; // 1.8%
        else if (insuranceType === 'tlo') insuranceRate = 0.01; // 1.0%

        const insuranceFeeYear1 = Math.round(price * insuranceRate);

        // Total Down Payment (TDP)
        // ADDM = DP + Admin Fee + Insurance 1st Year + 1st Monthly Installment
        // ADDB = DP + Admin Fee + Insurance 1st Year
        const totalDP =
            paymentScheme === 'addm'
                ? dpAmount + adminFee + insuranceFeeYear1 + monthlyInstallment
                : dpAmount + adminFee + insuranceFeeYear1;

        const grandTotalPayment = totalDP + (paymentScheme === 'addm' ? monthlyInstallment * (totalMonths - 1) : monthlyInstallment * totalMonths);

        return {
            dpAmount,
            loanPrincipal,
            totalMonths,
            totalInterest,
            totalLoanWithInterest,
            monthlyInstallment,
            insuranceFeeYear1,
            totalDP,
            grandTotalPayment,
        };
    }, [price, dpPercent, selectedTenorYear, interestRate, insuranceType, paymentScheme, adminFee]);

    // List simulation for all tenors (1 to 5 years) for the comparison table
    const allTenorBreakdown = useMemo(() => {
        const dpAmount = Math.round(price * (dpPercent / 100));
        const loanPrincipal = Math.max(0, price - dpAmount);

        let insuranceRate = 0;
        if (insuranceType === 'all_risk') insuranceRate = 0.025;
        else if (insuranceType === 'kombinasi') insuranceRate = 0.018;
        else if (insuranceType === 'tlo') insuranceRate = 0.01;
        const insuranceFeeYear1 = Math.round(price * insuranceRate);

        return TENOR_OPTIONS.map((tenor) => {
            const totalMonths = tenor.months;
            const rate = tenor.defaultRate;
            const totalInterest = Math.round(loanPrincipal * (rate / 100) * tenor.year);
            const totalLoan = loanPrincipal + totalInterest;
            const installment = Math.round(totalLoan / totalMonths);

            const tdp =
                paymentScheme === 'addm'
                    ? dpAmount + adminFee + insuranceFeeYear1 + installment
                    : dpAmount + adminFee + insuranceFeeYear1;

            return {
                ...tenor,
                rate,
                installment,
                totalInterest,
                tdp,
                isSelected: tenor.year === selectedTenorYear,
            };
        });
    }, [price, dpPercent, selectedTenorYear, insuranceType, paymentScheme, adminFee]);

    // Yearly amortization breakdown
    const yearlyBreakdown = useMemo(() => {
        const principalPerMonth = calculations.loanPrincipal / calculations.totalMonths;
        const interestPerMonth = calculations.totalInterest / calculations.totalMonths;

        let remainingPrincipal = calculations.loanPrincipal;
        const years = [];

        for (let y = 1; y <= selectedTenorYear; y++) {
            const monthsInYear = 12;
            const principalPaid = Math.round(principalPerMonth * monthsInYear);
            const interestPaid = Math.round(interestPerMonth * monthsInYear);
            remainingPrincipal = Math.max(0, remainingPrincipal - principalPaid);

            years.push({
                year: y,
                principalPaid,
                interestPaid,
                totalYearly: principalPaid + interestPaid,
                remainingPrincipal,
            });
        }
        return years;
    }, [calculations, selectedTenorYear]);

    // Pre-fill WhatsApp consultation message
    const waMessage = useMemo(() => {
        const text = `Halo Sales Ing Store, saya ingin konsultasi simulasi kredit:\n\n` +
            `*Unit:* ${carName || 'Mobil Impian'}\n` +
            `*Harga OTR:* ${formatCurrency(price)}\n` +
            `*DP (${dpPercent}%):* ${formatCurrency(calculations.dpAmount)}\n` +
            `*Tenor:* ${selectedTenorYear} Tahun (${calculations.totalMonths} Bulan)\n` +
            `*Bunga:* ${interestRate}% Flat\n` +
            `*Estimasi Cicilan:* ${formatCurrency(calculations.monthlyInstallment)}/bulan\n` +
            `*Estimasi Total DP (TDP):* ${formatCurrency(calculations.totalDP)}\n\n` +
            `Mohon info promo leasing terbaik dan persyaratan pengajuannya. Terima kasih!`;
        return encodeURIComponent(text);
    }, [carName, price, dpPercent, selectedTenorYear, calculations, interestRate]);

    const handlePricePreset = (val: number) => {
        setPrice(val);
    };

    const handleReset = () => {
        setPrice(350000000);
        setCarName('');
        setDpPercent(20);
        setSelectedTenorYear(5);
        setInterestRate(8.2);
        setInsuranceType('all_risk');
        setPaymentScheme('addb');
        setAdminFee(2500000);
    };

    return (
        <div className="container mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10 max-w-7xl">
            {/* Header Title & Subtitle */}
            <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                    <Calculator className="h-3.5 w-3.5" />
                    Kalkulator Kredit Max 5 Tahun
                </div>
                <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    Simulasi Cicilan & Kredit Mobil
                </h1>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
                    Hitung estimasi DP, rincian angsuran per bulan hingga tenor 5 tahun (60 bulan), persentase bunga, dan total pembayaran secara transparan.
                </p>

                {carName && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-card border px-3 py-1.5 text-xs text-foreground font-semibold shadow-sm">
                        <Car className="h-4 w-4 text-primary" />
                        <span>Unit Dipilih: {carName}</span>
                    </div>
                )}
            </div>

            {/* Main Grid: Form Inputs (Left) & Result Highlight (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* LEFT: Calculation Form Inputs */}
                <div className="lg:col-span-7 space-y-5">
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
                                    onClick={handleReset}
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
                                        onClick={() => handlePricePreset(p.value)}
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
                                            onClick={() => handleTenorChange(t.year)}
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
                            {/* Interest rate input + slider */}
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
                                    <button
                                        type="button"
                                        onClick={() => setInterestRate(5.5)}
                                        className="text-[10px] px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground hover:bg-muted"
                                    >
                                        Promo Bunga 5.5%
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInterestRate(6.8)}
                                        className="text-[10px] px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground hover:bg-muted"
                                    >
                                        Syariah 6.8%
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInterestRate(7.5)}
                                        className="text-[10px] px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground hover:bg-muted"
                                    >
                                        Reguler 7.5%
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInterestRate(8.5)}
                                        className="text-[10px] px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground hover:bg-muted"
                                    >
                                        Standar 8.5%
                                    </button>
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
                                            onClick={() => setInsuranceType(ins.id as any)}
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

                            {/* Skema Pembayaran: ADDB vs ADDM */}
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

                {/* RIGHT: Results Summary & Action */}
                <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
                    {/* Highlight Card: Estimasi Cicilan */}
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
                            {/* Big Monthly Installment Number */}
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

                            {/* Direct WhatsApp Consultation CTA */}
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
                </div>
            </div>

            {/* FULL COMPARISON TABLE: Tenor 1 to 5 Years */}
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

                {/* Mobile & Desktop Comparison Cards / Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {allTenorBreakdown.map((item) => (
                        <div
                            key={item.year}
                            onClick={() => handleTenorChange(item.year)}
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

            {/* Disclaimer Alert */}
            <div className="mt-8 p-4 rounded-xl bg-muted/40 border text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">Catatan & Ketentuan Simulasi:</p>
                <p>
                    1. Hasil perhitungan ini merupakan estimasi simulasi kredit dan belum mengikat. Besaran bunga, DP, dan angsuran final dapat disesuaikan berdasarkan ketentuan lembaga pembiayaan/bank mitra (seperti BCA Finance, Mandiri Tunas Finance, Adira Finance, dll).
                </p>
                <p>
                    2. Estimasi suku bunga dapat berubah sewaktu-waktu sesuai dengan kebijakan moneter dan program promo khusus yang sedang berlaku di Ing Store.
                </p>
                <p>
                    3. Untuk pengajuan kredit resmi, silakan hubungi tim sales consultant kami melalui WhatsApp atau kunjungi showroom kami langsung.
                </p>
            </div>
        </div>
    );
}

export default function CreditSimulationPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Calculator className="h-8 w-8 animate-pulse text-primary" />
                    <p className="text-sm font-semibold text-muted-foreground">Memuat Kalkulator Kredit...</p>
                </div>
            </div>
        }>
            <CreditSimulatorContent />
        </Suspense>
    );
}
