export interface TenorOption {
    year: number;
    months: number;
    defaultRate: number;
    label: string;
}

export const TENOR_OPTIONS: TenorOption[] = [
    { year: 1, months: 12, defaultRate: 5.5, label: '1 Tahun' },
    { year: 2, months: 24, defaultRate: 6.2, label: '2 Tahun' },
    { year: 3, months: 36, defaultRate: 6.8, label: '3 Tahun' },
    { year: 4, months: 48, defaultRate: 7.5, label: '4 Tahun' },
    { year: 5, months: 60, defaultRate: 8.2, label: '5 Tahun' },
];

export const PRESET_PRICES = [
    { label: 'Rp 150 Jt', value: 150000000 },
    { label: 'Rp 250 Jt', value: 250000000 },
    { label: 'Rp 350 Jt', value: 350000000 },
    { label: 'Rp 500 Jt', value: 500000000 },
    { label: 'Rp 750 Jt', value: 750000000 },
    { label: 'Rp 1 Milyar', value: 1000000000 },
];

export const DP_PERCENTAGE_OPTIONS = [15, 20, 25, 30, 40, 50];

export type InsuranceType = 'all_risk' | 'kombinasi' | 'tlo' | 'none';
export type PaymentScheme = 'addb' | 'addm';

export interface CreditCalculations {
    dpAmount: number;
    loanPrincipal: number;
    totalMonths: number;
    totalInterest: number;
    totalLoanWithInterest: number;
    monthlyInstallment: number;
    insuranceFeeYear1: number;
    totalDP: number;
    grandTotalPayment: number;
}
