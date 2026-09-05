'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Calculator, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
}

export default function BottomNav() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    const items: NavItem[] = [
        {
            href: '/',
            label: 'Home',
            icon: Home,
            exact: true,
        },
        {
            href: '/products',
            label: 'Produk',
            icon: Car,
        },
        {
            href: '/simulasi-kredit',
            label: 'Simulasi',
            icon: Calculator,
        },
        {
            href: isAuthenticated ? '/account' : '/login',
            label: isAuthenticated ? 'Akun' : 'Masuk',
            icon: User,
        },
    ];

    const isActive = (item: NavItem) => {
        if (item.exact) {
            return pathname === '/' || pathname === '/home';
        }
        return pathname.startsWith(item.href);
    };

    return (
        <nav
            aria-label="Mobile Navigation"
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
        >
            <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-3">
                {items.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            className={cn(
                                'flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative group select-none active:scale-95',
                                active
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {/* Active indicator bar */}
                            {active && (
                                <span className="absolute top-0 w-10 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-200" />
                            )}

                            <div className="relative flex items-center justify-center w-6 h-6 my-0.5">
                                <Icon
                                    className={cn(
                                        'w-5 h-5 transition-transform duration-200',
                                        active
                                            ? 'scale-110 stroke-[2.4]'
                                            : 'group-hover:scale-105 stroke-[1.8]',
                                    )}
                                />
                            </div>

                            <span
                                className={cn(
                                    'text-[10px] leading-tight tracking-tight mt-0.5 truncate max-w-[64px] text-center',
                                    active ? 'font-bold text-primary' : 'font-medium',
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
