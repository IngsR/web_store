'use client';

import Link from 'next/link';
import {
    Heart,
    Menu,
    ShoppingCart,
    User,
    Shield,
    CircleDollarSign,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import SearchInput from '../search-input';
import ThemeToggle from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/products', label: 'Products' },
];

export default function Header() {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const pathname = usePathname();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-20 items-center">
                    <div className="mr-4 hidden items-center md:flex">
                        <div className="mr-24 flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <CircleDollarSign className="h-6 w-6 text-primary" />
                                <span className="font-bold font-headline text-lg">
                                    Ing Store
                                </span>
                            </Link>
                            <ThemeToggle />
                        </div>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'group relative py-2 uppercase transition-colors hover:text-primary',
                                        pathname === link.href
                                            ? 'text-primary'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {link.label}
                                    <span
                                        className={cn(
                                            'absolute bottom-0 left-0 block h-0.5 w-full origin-center transform bg-primary transition-transform duration-300',
                                            pathname === link.href
                                                ? 'scale-x-100'
                                                : 'scale-x-0 group-hover:scale-x-100',
                                        )}
                                    />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <Sheet
                        open={isMobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="pt-12">
                            <nav className="flex flex-col items-center gap-6">
                                <Link
                                    href="/"
                                    className="mb-6 flex items-center space-x-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <CircleDollarSign className="h-7 w-7 text-primary" />
                                    <span className="font-bold font-headline text-xl text-primary">
                                        Ing Store
                                    </span>
                                </Link>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'text-lg font-medium transition-colors hover:text-primary',
                                            pathname === link.href
                                                ? 'text-primary'
                                                : 'text-muted-foreground',
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label.toUpperCase()}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <div className="w-full max-w-[150px] sm:max-w-xs">
                            <SearchInput />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/wishlist" aria-label="Wishlist">
                                    <div className="relative">
                                        <Heart className="h-5 w-5" />
                                        {wishlistCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/cart" aria-label="Shopping Cart">
                                    <div className="relative">
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </Button>

                            {isAuthenticated && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-10 w-10 rounded-full"
                                        >
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        user.profilePicture ||
                                                        ''
                                                    }
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            <p>{user.name}</p>
                                            <p className="text-xs text-muted-foreground font-normal">
                                                {user.email}
                                            </p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {isAdmin && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard">
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/account">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative h-10 w-10 rounded-full"
                                        >
                                            <User className="h-5 w-5" />
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/login">Login</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/register">Daftar</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
