'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const baseProductSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    description: z.string().min(1),
    longDescription: z.string().min(1),
    price: z.number().min(0),
    discountPrice: z.number().optional().nullable(),
    condition: z.enum(['Baru', 'Bekas']),
    mileage: z.number().optional().nullable(),
    fuelType: z.string().optional(),
    category: z.string().min(1),
    popularity: z.number().default(0),
});

// ✳️ Jika kamu ingin menghapus beberapa field untuk form tertentu (contoh: `popularity`)
const formSchema = baseProductSchema.omit({ popularity: true });

// ✅ Tipe otomatis dari schema
type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm({
    defaultValues,
}: {
    defaultValues?: Partial<ProductFormValues>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? {
            name: '',
            description: '',
            longDescription: '',
            price: 0,
            discountPrice: null,
            condition: 'Baru',
            mileage: null,
            fuelType: '',
            category: '',
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            console.log('Form data:', data);
            // TODO: Submit ke API
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label>Nama Produk</label>
                <Input {...form.register('name')} />
            </div>

            <div>
                <label>Deskripsi Singkat</label>
                <Textarea {...form.register('description')} />
            </div>

            <div>
                <label>Deskripsi Panjang</label>
                <Textarea {...form.register('longDescription')} />
            </div>

            <div>
                <label>Harga</label>
                <Input
                    type="number"
                    {...form.register('price', { valueAsNumber: true })}
                />
            </div>

            <div>
                <label>Diskon (opsional)</label>
                <Input
                    type="number"
                    {...form.register('discountPrice', { valueAsNumber: true })}
                />
            </div>

            <div>
                <label>Kondisi</label>
                <select {...form.register('condition')}>
                    <option value="Baru">Baru</option>
                    <option value="Bekas">Bekas</option>
                </select>
            </div>

            {form.watch('condition') === 'Bekas' && (
                <div>
                    <label>Jarak Tempuh</label>
                    <Input
                        type="number"
                        {...form.register('mileage', { valueAsNumber: true })}
                    />
                </div>
            )}

            <div>
                <label>Bahan Bakar</label>
                <Input {...form.register('fuelType')} />
            </div>

            <div>
                <label>Kategori</label>
                <Input {...form.register('category')} />
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
        </form>
    );
}
