'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Heart,
    ShoppingCart,
    User,
    Shield,
    Calculator,
    LogIn,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import SearchInput from '../search-input';
import ThemeToggle from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Semua Produk' },
    { href: '/simulasi-kredit', label: 'Simulasi Kredit', icon: Calculator },
];

export default function Header() {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const pathname = usePathname();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const isLinkActive = (href: string) => {
        if (href === '/') {
            return pathname === '/' || pathname === '/home';
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-shadow">
            <div className="container flex h-16 md:h-20 items-center justify-between px-3 sm:px-4 md:px-8 gap-2">
                {/* 1. Brand Logo with /uploads/products/logo.jpg */}
                <div className="flex items-center gap-3 md:gap-8 shrink-0">
                    <Link
                        href="/"
                        prefetch={true}
                        className="flex items-center gap-2.5 group focus:outline-none"
                    >
                        <div className="relative h-8 w-8 md:h-9 md:w-9 rounded-lg overflow-hidden border border-border/70 shadow-sm shrink-0 bg-black">
                            <Image
                                src="/uploads/products/logo.jpg"
                                alt="Ing Store Logo"
                                fill
                                priority
                                className="object-cover"
                                sizes="36px"
                            />
                        </div>
                        <span className="font-bold font-headline text-base sm:text-lg md:text-xl tracking-tight text-foreground whitespace-nowrap">
                            Ing Store
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-4">
                        {navLinks.map((link) => {
                            const active = isLinkActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    prefetch={true}
                                    className={cn(
                                        'group relative py-2 font-semibold transition-colors duration-150',
                                        active
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    <span>{link.label}</span>
                                    <span
                                        className={cn(
                                            'absolute bottom-0 left-0 block h-0.5 w-full origin-left transform bg-primary transition-transform duration-200',
                                            active
                                                ? 'scale-x-100'
                                                : 'scale-x-0 group-hover:scale-x-100',
                                        )}
                                    />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Right Side: Search + Favorit + Keranjang + Akun (desktop) + Theme Toggle */}
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end max-w-xl">
                    {/* Search Input - responsive and clean on both mobile and desktop */}
                    <div className="flex-1 min-w-[110px] max-w-[240px] md:max-w-xs">
                        <SearchInput />
                    </div>

                    {/* Favorit / Wishlist Button (Beside Keranjang) */}
                    <Button variant="ghost" size="icon" asChild className="rounded-full relative h-9 w-9 shrink-0">
                        <Link href="/wishlist" aria-label="Favorit" prefetch={true}>
                            <div className="relative flex items-center justify-center">
                                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </Button>

                    {/* Keranjang / Cart Button */}
                    <Button variant="ghost" size="icon" asChild className="rounded-full relative h-9 w-9 shrink-0">
                        <Link href="/cart" aria-label="Keranjang Belanja" prefetch={true}>
                            <div className="relative flex items-center justify-center">
                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </Button>

                    {/* Desktop Akun / Profile Menu */}
                    <div className="hidden md:block">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full p-0 ring-1 ring-primary/30 hover:ring-primary focus:outline-none transition-all"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user.profilePicture || ''}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <DropdownMenuLabel>
                                        <p className="font-semibold text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground font-normal truncate">
                                            {user.email}
                                        </p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" prefetch={true}>
                                                <Shield className="mr-2 h-4 w-4 text-primary" />
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" prefetch={true}>
                                            <User className="mr-2 h-4 w-4" />
                                            Profil & Pengaturan
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive font-medium cursor-pointer">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 px-3 rounded-full text-xs font-semibold border-border hover:border-primary/50 text-foreground"
                            >
                                <Link href="/login" prefetch={true} className="flex items-center gap-1.5">
                                    <LogIn className="h-3.5 w-3.5 text-primary" />
                                    <span>Masuk</span>
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Theme Toggle - at the far right on both mobile & desktop */}
                    <div className="shrink-0 pl-0.5">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
