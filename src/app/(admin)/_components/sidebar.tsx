'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Car,
    Settings,
    Shield,
    Store,
    ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/orders', label: 'Pesanan Mobil', icon: ShoppingCart, exact: false },
    { href: '/dashboard/sales', label: 'Tim Sales', icon: Users, exact: false },
    { href: '/dashboard/products', label: 'Katalog Unit', icon: Car, exact: false },
    { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings, exact: false },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="hidden md:flex w-60 lg:w-64 flex-col border-r border-border bg-card shrink-0 min-h-screen sticky top-0 h-screen">
            {/* Showroom Brand */}
            <div className="flex h-16 items-center justify-between border-b px-5">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 font-headline text-lg font-bold text-foreground hover:opacity-90 transition-opacity"
                >
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold shadow-sm">
                        <Store className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-sm tracking-tight">Ing Store</span>
                        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Admin Showroom</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Menu Utama
                </div>
                <nav className="space-y-1">
                    {navLinks.map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150',
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                )}
                            >
                                <Icon className={cn('h-4 w-4', active ? 'text-primary-foreground' : 'text-muted-foreground')} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Portal Link */}
            <div className="p-3 border-t bg-muted/20">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-emerald-600" />
                        Buka Web Pembeli
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                </Link>
            </div>
        </aside>
    );
}
