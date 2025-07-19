'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tags, Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';

type Category = {
    id: string;
    name: string;
    productCount: number;
    createdAt: string;
};

export default function CategoriesPage() {
    const [categories] = useState<Category[]>([
        {
            id: 'suv-1',
            name: 'SUV',
            productCount: 12,
            createdAt: '2024-01-15',
        },
        {
            id: 'sedan-2',
            name: 'Sedan',
            productCount: 8,
            createdAt: '2024-01-16',
        },
        {
            id: 'mpv-3',
            name: 'MPV',
            productCount: 22,
            createdAt: '2024-02-01',
        },
    ]);

    const columns: {
        header: string;
        accessorKey: keyof Category;
    }[] = [
        {
            header: 'Category Name',
            accessorKey: 'name',
        },
        {
            header: 'Products',
            accessorKey: 'productCount',
        },
        {
            header: 'Created',
            accessorKey: 'createdAt',
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kategori Mobil</h1>
                    <p className="text-muted-foreground">
                        Kelola kategori atau tipe mobil Anda.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tags className="h-5 w-5" />
                        Daftar Kategori Mobil
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
