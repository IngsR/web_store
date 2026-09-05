'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Car,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminMobileNavLinks = [
    {
        href: '/dashboard',
        label: 'Beranda',
        icon: LayoutDashboard,
        exact: true,
    },
    {
        href: '/dashboard/orders',
        label: 'Pesanan',
        icon: ShoppingCart,
        exact: false,
    },
    {
        href: '/dashboard/sales',
        label: 'Sales',
        icon: Users,
        exact: false,
    },
    {
        href: '/dashboard/products',
        label: 'Katalog',
        icon: Car,
        exact: false,
    },
    {
        href: '/dashboard/settings',
        label: 'Pengaturan',
        icon: Settings,
        exact: false,
    },
];

export default function AdminBottomNav() {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <nav
            aria-label="Navigasi Admin Mobile"
            className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-md px-1 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
            {adminMobileNavLinks.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-150 select-none touch-manipulation',
                            active
                                ? 'text-primary font-bold'
                                : 'text-muted-foreground hover:text-foreground font-medium',
                        )}
                    >
                        {/* Active pill background effect */}
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-full px-3 py-1 transition-all duration-200',
                                active
                                    ? 'bg-primary/15 text-primary scale-105'
                                    : 'bg-transparent text-muted-foreground',
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <span
                            className={cn(
                                'text-[10px] tracking-tight mt-0.5',
                                active ? 'font-bold text-primary' : 'font-medium',
                            )}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
