'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator, Car } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

import {
    TENOR_OPTIONS,
    type InsuranceType,
    type PaymentScheme,
    type CreditCalculations,
} from './_components/credit-constants';
import CreditForm from './_components/credit-form';
import CreditSummary from './_components/credit-summary';
import CreditTenorTable, {
    type TenorBreakdownItem,
    type YearlyBreakdownItem,
} from './_components/credit-tenor-table';

function CreditSimulatorContent() {
    const searchParams = useSearchParams();

    // Initial values from query params
    const initialPriceParam = Number(searchParams.get('price')) || 350000000;
    const initialCarNameParam = searchParams.get('name') || '';

    const [carName, setCarName] = useState(initialCarNameParam);
    const [price, setPrice] = useState(initialPriceParam);
    const [dpPercent, setDpPercent] = useState(20);
    const [selectedTenorYear, setSelectedTenorYear] = useState(5);
    const [interestRate, setInterestRate] = useState(7.5);
    const [insuranceType, setInsuranceType] = useState<InsuranceType>('all_risk');
    const [paymentScheme, setPaymentScheme] = useState<PaymentScheme>('addb');
    const [adminFee] = useState(2500000);

    // Sync if query param changes
    useEffect(() => {
        const p = Number(searchParams.get('price'));
        const n = searchParams.get('name');
        if (p && p > 0) setPrice(p);
        if (n) setCarName(n);
    }, [searchParams]);

    const handleTenorChange = (tenorYear: number) => {
        setSelectedTenorYear(tenorYear);
        const tenorConfig = TENOR_OPTIONS.find((t) => t.year === tenorYear);
        if (tenorConfig) {
            setInterestRate(tenorConfig.defaultRate);
        }
    };

    // Calculate core figures
    const calculations: CreditCalculations = useMemo(() => {
        const dpAmount = Math.round(price * (dpPercent / 100));
        const loanPrincipal = Math.max(0, price - dpAmount);

        const totalMonths = selectedTenorYear * 12;
        const totalInterest = Math.round(loanPrincipal * (interestRate / 100) * selectedTenorYear);
        const totalLoanWithInterest = loanPrincipal + totalInterest;
        const monthlyInstallment = totalMonths > 0 ? Math.round(totalLoanWithInterest / totalMonths) : 0;

        let insuranceRate = 0;
        if (insuranceType === 'all_risk') insuranceRate = 0.025;
        else if (insuranceType === 'kombinasi') insuranceRate = 0.018;
        else if (insuranceType === 'tlo') insuranceRate = 0.01;

        const insuranceFeeYear1 = Math.round(price * insuranceRate);

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

    // List simulation for all tenors
    const allTenorBreakdown: TenorBreakdownItem[] = useMemo(() => {
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
    const yearlyBreakdown: YearlyBreakdownItem[] = useMemo(() => {
        const principalPerMonth = calculations.loanPrincipal / calculations.totalMonths;
        const interestPerMonth = calculations.totalInterest / calculations.totalMonths;

        let remainingPrincipal = calculations.loanPrincipal;
        const years: YearlyBreakdownItem[] = [];

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

    const handleReset = () => {
        setPrice(350000000);
        setCarName('');
        setDpPercent(20);
        setSelectedTenorYear(5);
        setInterestRate(8.2);
        setInsuranceType('all_risk');
        setPaymentScheme('addb');
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
                <div className="lg:col-span-7">
                    <CreditForm
                        price={price}
                        setPrice={setPrice}
                        dpPercent={dpPercent}
                        setDpPercent={setDpPercent}
                        selectedTenorYear={selectedTenorYear}
                        onTenorChange={handleTenorChange}
                        interestRate={interestRate}
                        setInterestRate={setInterestRate}
                        insuranceType={insuranceType}
                        setInsuranceType={setInsuranceType}
                        paymentScheme={paymentScheme}
                        setPaymentScheme={setPaymentScheme}
                        calculations={calculations}
                        onReset={handleReset}
                    />
                </div>

                <div className="lg:col-span-5 lg:sticky lg:top-24">
                    <CreditSummary
                        calculations={calculations}
                        price={price}
                        dpPercent={dpPercent}
                        selectedTenorYear={selectedTenorYear}
                        interestRate={interestRate}
                        adminFee={adminFee}
                        waMessage={waMessage}
                    />
                </div>
            </div>

            {/* FULL COMPARISON TABLE: Tenor 1 to 5 Years & Amortization */}
            <CreditTenorTable
                allTenorBreakdown={allTenorBreakdown}
                yearlyBreakdown={yearlyBreakdown}
                selectedTenorYear={selectedTenorYear}
                onTenorChange={handleTenorChange}
            />

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
