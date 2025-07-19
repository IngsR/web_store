import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Product as PrismaProduct } from '@prisma/client';
import type { Product } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
        return '';
    }
    return new Intl.NumberFormat('id-ID').format(value);
};

export const parseNumber = (value: string): number | null => {
    const numericString = value.replace(/[^0-9]/g, '');
    if (numericString === '') {
        return null;
    }
    return parseInt(numericString, 10);
};
