'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface FilterState {
    categories: string[];
    conditions: string[];
    fuelTypes: string[];
    isPromo: boolean;
    priceMin: number;
    priceMax: number;
}

interface ProductFiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    categories: string[];
    maxPrice: number;
    resultsCount: number;
    onReset: () => void;
    mode?: 'sidebar' | 'mobile-button' | 'both';
}

const CONDITION_OPTIONS = ['Baru', 'Bekas'];
const FUEL_OPTIONS = ['Bensin', 'Diesel', 'Hybrid', 'Listrik'];

export default function ProductFilters({
    filters,
    setFilters,
    categories,
    maxPrice,
    resultsCount,
    onReset,
    mode = 'both',
}: ProductFiltersProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin);
    const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax);

    const toggleCategory = (cat: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter((c) => c !== cat)
                : [...prev.categories, cat],
        }));
    };

    const toggleCondition = (cond: string) => {
        setFilters((prev) => ({
            ...prev,
            conditions: prev.conditions.includes(cond)
                ? prev.conditions.filter((c) => c !== cond)
                : [...prev.conditions, cond],
        }));
    };

    const toggleFuelType = (fuel: string) => {
        setFilters((prev) => ({
            ...prev,
            fuelTypes: prev.fuelTypes.includes(fuel)
                ? prev.fuelTypes.filter((f) => f !== fuel)
                : [...prev.fuelTypes, fuel],
        }));
    };

    const togglePromo = (checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            isPromo: checked,
        }));
    };

    const applyPriceFilter = () => {
        setFilters((prev) => ({
            ...prev,
            priceMin: Math.max(0, localPriceMin),
            priceMax: Math.min(maxPrice, localPriceMax),
        }));
    };

    const activeFilterCount =
        filters.categories.length +
        filters.conditions.length +
        filters.fuelTypes.length +
        (filters.isPromo ? 1 : 0) +
        (filters.priceMin > 0 || filters.priceMax < maxPrice ? 1 : 0);

    const FilterPanelContent = () => (
        <div className="space-y-5 text-sm">
            {/* 1. Kondisi Produk (Baru / Bekas) */}
            <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Kondisi Produk
                </h4>
                <div className="space-y-2">
                    {CONDITION_OPTIONS.map((cond) => (
                        <label
                            key={cond}
                            className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground hover:text-primary transition-colors select-none"
                        >
                            <Checkbox
                                checked={filters.conditions.includes(cond)}
                                onCheckedChange={() => toggleCondition(cond)}
                                className="h-4 w-4 rounded"
                            />
                            <span>{cond}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* 2. Kategori Produk */}
            <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Kategori Produk
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {categories.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Memuat kategori...</p>
                    ) : (
                        categories.map((cat) => (
                            <label
                                key={cat}
                                className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground hover:text-primary transition-colors select-none"
                            >
                                <Checkbox
                                    checked={filters.categories.includes(cat)}
                                    onCheckedChange={() => toggleCategory(cat)}
                                    className="h-4 w-4 rounded"
                                />
                                <span>{cat}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <Separator />

            {/* 3. Promo & Diskon */}
            <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Penawaran
                </h4>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground hover:text-primary transition-colors select-none">
                    <Checkbox
                        checked={filters.isPromo}
                        onCheckedChange={(checked) => togglePromo(!!checked)}
                        className="h-4 w-4 rounded"
                    />
                    <span className="font-semibold text-destructive">Hanya Promo / Diskon</span>
                </label>
            </div>

            <Separator />

            {/* 4. Jenis Bahan Bakar */}
            <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Tipe Bahan Bakar
                </h4>
                <div className="space-y-2">
                    {FUEL_OPTIONS.map((fuel) => (
                        <label
                            key={fuel}
                            className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground hover:text-primary transition-colors select-none"
                        >
                            <Checkbox
                                checked={filters.fuelTypes.includes(fuel)}
                                onCheckedChange={() => toggleFuelType(fuel)}
                                className="h-4 w-4 rounded"
                            />
                            <span>{fuel}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* 5. Rentang Harga (Rp) */}
            <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Rentang Harga (Rp)
                </h4>
                <div className="space-y-2">
                    <div>
                        <span className="text-[10px] text-muted-foreground block mb-0.5">Minimum</span>
                        <Input
                            type="number"
                            placeholder="Rp 0"
                            value={localPriceMin || ''}
                            onChange={(e) => setLocalPriceMin(Number(e.target.value))}
                            className="h-8 text-xs"
                            step="10000000"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-muted-foreground block mb-0.5">Maksimum</span>
                        <Input
                            type="number"
                            placeholder={formatCurrency(maxPrice)}
                            value={localPriceMax || ''}
                            onChange={(e) => setLocalPriceMax(Number(e.target.value))}
                            className="h-8 text-xs"
                            step="10000000"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={applyPriceFilter}
                        className="w-full text-xs h-8 font-semibold mt-1"
                    >
                        Terapkan
                    </Button>
                </div>
            </div>
        </div>
    );

    // If only desktop sidebar is requested
    if (mode === 'sidebar') {
        return (
            <aside aria-label="Filter Produk" className="hidden md:block w-64 lg:w-72 shrink-0">
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            <h3 className="font-headline font-bold text-sm text-foreground">
                                Filter Produk
                            </h3>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="text-xs font-medium text-destructive hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <FilterPanelContent />
                </div>
            </aside>
        );
    }

    // If only mobile button trigger is requested
    if (mode === 'mobile-button') {
        return (
            <div className="md:hidden">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border rounded-full shadow-sm shrink-0"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-base font-bold flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-primary" />
                                    Filter Produk
                                </SheetTitle>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={onReset}
                                        className="text-xs font-medium text-destructive mr-4"
                                    >
                                        Hapus Semua
                                    </button>
                                )}
                            </div>
                        </SheetHeader>

                        <div className="p-4 overflow-y-auto flex-1">
                            <FilterPanelContent />
                        </div>

                        <SheetFooter className="p-4 border-t bg-card">
                            <Button
                                className="w-full text-xs font-bold h-10"
                                onClick={() => {
                                    applyPriceFilter();
                                    setIsMobileOpen(false);
                                }}
                            >
                                Tampilkan Produk ({resultsCount})
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        );
    }

    // Default 'both'
    return (
        <>
            <aside aria-label="Filter Produk" className="hidden md:block w-64 lg:w-72 shrink-0">
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            <h3 className="font-headline font-bold text-sm text-foreground">
                                Filter Produk
                            </h3>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="text-xs font-medium text-destructive hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <FilterPanelContent />
                </div>
            </aside>

            <div className="md:hidden">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border rounded-full shadow-sm shrink-0"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-base font-bold flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-primary" />
                                    Filter Produk
                                </SheetTitle>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={onReset}
                                        className="text-xs font-medium text-destructive mr-4"
                                    >
                                        Hapus Semua
                                    </button>
                                )}
                            </div>
                        </SheetHeader>

                        <div className="p-4 overflow-y-auto flex-1">
                            <FilterPanelContent />
                        </div>

                        <SheetFooter className="p-4 border-t bg-card">
                            <Button
                                className="w-full text-xs font-bold h-10"
                                onClick={() => {
                                    applyPriceFilter();
                                    setIsMobileOpen(false);
                                }}
                            >
                                Tampilkan Produk ({resultsCount})
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
