'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Shield,
    Store,
    ExternalLink,
    LogOut,
    User as UserIcon,
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
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/layout/theme-toggle';

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const getInitials = (name: string) => {
        return (
            name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'AD'
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
        <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between gap-3 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-6 shadow-xs">
            {/* Mobile Branding (Desktop is in Sidebar) */}
            <div className="flex items-center gap-2 md:hidden">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-bold text-sm tracking-tight text-foreground"
                >
                    <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <Store className="h-4 w-4" />
                    </div>
                    <span>Ing Store Admin</span>
                </Link>
            </div>

            {/* Search Input (Desktop & Tablet) */}
            <div className="hidden sm:flex flex-1 max-w-md">
                <form className="w-full" onSubmit={handleSearch}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            type="search"
                            name="search"
                            placeholder="Cari unit mobil di katalog..."
                            className="pl-8 h-9 text-xs rounded-lg w-full bg-muted/30 focus:bg-background"
                        />
                    </div>
                </form>
            </div>

            {/* Right Tools: Theme & Profile */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <ThemeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 ring-offset-background hover:opacity-80"
                        >
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border">
                                <AvatarImage
                                    src={user?.profilePicture || ''}
                                    alt={user?.name || 'Admin'}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {getInitials(user?.name || 'Admin')}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 text-xs">
                        <DropdownMenuLabel className="font-normal p-2.5">
                            <div className="flex flex-col space-y-1">
                                <p className="text-xs font-bold leading-none text-foreground truncate">
                                    {user?.name || 'Administrator'}
                                </p>
                                <p className="text-[11px] leading-none text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account" className="cursor-pointer">
                                <UserIcon className="mr-2 h-3.5 w-3.5" />
                                Pengaturan Akun
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/" target="_blank" className="cursor-pointer">
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                Buka Web Pembeli
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <LogOut className="mr-2 h-3.5 w-3.5" />
                            Keluar (Logout)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
