import {
    AlertCircle,
    Phone,
    CheckCircle2,
    Clock,
    type LucideIcon,
} from 'lucide-react';
import type { OrderStatus } from '@/types';

export interface StatusConfigItem {
    label: string;
    className: string;
    icon: LucideIcon;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfigItem> = {
    BARU: {
        label: 'Pesanan Baru',
        className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold',
        icon: AlertCircle,
    },
    DIHUBUNGI: {
        label: 'Sedang Dihubungi',
        className: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 font-semibold',
        icon: Phone,
    },
    DEAL: {
        label: 'Deal / Sepakat',
        className: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold',
        icon: CheckCircle2,
    },
    SELESAI: {
        label: 'Unit Diserahkan',
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold',
        icon: CheckCircle2,
    },
    BATAL: {
        label: 'Dibatalkan',
        className: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-semibold',
        icon: Clock,
    },
};
