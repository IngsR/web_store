'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    Menu,
    Package,
    Search,
    Settings,
    Shield,
    User,
    CircleDollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mainNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitials = (name: string) => {
        return (
            name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || ''
        );
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get('search') as string;
        if (searchQuery.trim()) {
            router.push(
                `/dashboard/products?q=${encodeURIComponent(
                    searchQuery.trim(),
                )}`,
            );
        }
    };

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <CircleDollarSign className="h-6 w-6 text-primary" />
                    <span className="sr-only">Ing Store Admin</span>
                </Link>
                {mainNavLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'group relative py-2 transition-colors hover:text-foreground',
                            pathname === href ||
                                (href !== '/dashboard' &&
                                    pathname.startsWith(href))
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                        )}
                    >
                        {label}
                        <span
                            className={cn(
                                'absolute bottom-0 left-0 block h-0.5 w-full origin-center transform bg-primary transition-transform duration-300',
                                pathname === href ||
                                    (href !== '/dashboard' &&
                                        pathname.startsWith(href))
                                    ? 'scale-x-100'
                                    : 'scale-x-0 group-hover:scale-x-100',
                            )}
                        />
                    </Link>
                ))}
            </nav>

            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-12">
                    <nav className="flex flex-col items-center gap-6 text-lg font-medium">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 font-headline text-xl font-bold text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <CircleDollarSign className="h-6 w-6" />
                            <span>Ing Store</span>
                        </Link>
                        {mainNavLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'transition-colors hover:text-foreground',
                                    pathname === href ||
                                        (href !== '/dashboard' &&
                                            pathname.startsWith(href))
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form
                    className="ml-auto flex-1 sm:flex-initial"
                    onSubmit={handleSearch}
                >
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search admin products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.profilePicture || ''}
                                    alt={user?.name}
                                />
                                <AvatarFallback>
                                    {getInitials(user?.name || '')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account">Profile Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/">
                                <Shield className="mr-2 h-4 w-4" />
                                Home
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
