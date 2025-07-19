'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ListFilter, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductFiltersProps {
    filters: { categories: string[]; priceRange: [number, number] };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            categories: string[];
            priceRange: [number, number];
        }>
    >;
    sortBy: string;
    setSortBy: (value: string) => void;
    categories: string[];
    resultsCount: number;
    maxPrice: number;
}

export default function ProductFilters({
    filters,
    setFilters,
    sortBy,
    setSortBy,
    categories,
    resultsCount,
    maxPrice,
}: ProductFiltersProps) {
    const handleCategoryChange = (category: string, checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            categories: checked
                ? [...prev.categories, category]
                : prev.categories.filter((c) => c !== category),
        }));
    };

    const handlePriceChange = (value: number[]) => {
        setFilters((prev) => ({ ...prev, priceRange: [value[0], value[1]] }));
    };

    const selectedCategoriesCount = filters.categories.length;

    return (
        <div className="p-4 rounded-lg border bg-card text-card-foreground">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ListFilter className="h-4 w-4" />
                                <span>Filters</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>
                                Filter by Category
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={filters.categories.includes(
                                        category,
                                    )}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(
                                            category,
                                            !!checked,
                                        )
                                    }
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Price Range</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <h4 className="font-medium leading-none">
                                    Price Range
                                </h4>
                                <Slider
                                    min={0}
                                    max={maxPrice}
                                    step={100000}
                                    value={filters.priceRange}
                                    onValueChange={handlePriceChange}
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>
                                        {formatCurrency(filters.priceRange[0])}
                                    </span>
                                    <span>
                                        {formatCurrency(filters.priceRange[1])}
                                    </span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {selectedCategoriesCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    categories: [],
                                }))
                            }
                        >
                            Clear ({selectedCategoriesCount})
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <p className="text-sm text-muted-foreground hidden lg:block">
                        {resultsCount} results
                    </p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popularity">
                                Popularity
                            </SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">
                                Price: Low to High
                            </SelectItem>
                            <SelectItem value="price-desc">
                                Price: High to Low
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
