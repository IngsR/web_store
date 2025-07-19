'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Home, Settings, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-card md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-headline text-xl font-bold text-primary"
                    >
                        <CircleDollarSign className="h-6 w-6" />
                        <span className="">Ing Store</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50',
                                    pathname.startsWith(href) &&
                                        href !== '/dashboard' &&
                                        'bg-muted text-primary',
                                    pathname === '/dashboard' &&
                                        href === '/dashboard' &&
                                        'bg-muted text-primary',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
