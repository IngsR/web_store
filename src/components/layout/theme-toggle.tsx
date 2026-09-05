'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground"
                aria-label="Toggle theme"
            >
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground transition-all duration-200"
            title={isDark ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
            aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
                <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
        </Button>
    );
}
