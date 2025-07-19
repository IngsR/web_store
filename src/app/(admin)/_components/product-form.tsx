'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Condition, FuelType } from '@prisma/client';
import { Loader2, Upload, X } from 'lucide-react';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
    productFormSchema,
    type ProductFormValues,
} from '@/lib/schemas/product';
import type { Product } from '@/lib/types';

interface ProductFormProps {
    product?: Product | null;
    onSubmitSuccess: () => void; // Mengganti nama prop agar lebih deskriptif dan sesuai dengan induk
}

export default function ProductForm({
    product,
    onSubmitSuccess,
}: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const isEditMode = !!product;

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),

        defaultValues: {
            name: '',
            description: '',
            longDescription: '',
            price: undefined,
            discountPrice: undefined,
            category: '',
            fuelType: undefined,
            condition: Condition.Baru,
            mileage: undefined,
            isFeatured: false,
            isPromo: false,
            popularity: 80,
            images: [],
        },
    });

    React.useEffect(() => {
        if (isEditMode && product) {
            form.reset({
                ...product,
                price: product.price ?? undefined,
                discountPrice: product.discountPrice ?? undefined,
                mileage: product.mileage ?? undefined,
                fuelType: product.fuelType ?? undefined,
            });
        } else {
            form.reset(form.formState.defaultValues);
        }
    }, [product, isEditMode, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentImages = form.getValues('images') || [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                form.setValue('images', [...currentImages, base64String], {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            };
            reader.readAsDataURL(file);
        });

        if (e.target) e.target.value = '';
    };

    const removeImage = (index: number) => {
        const updatedImages = [...(form.getValues('images') || [])];
        updatedImages.splice(index, 1);
        form.setValue('images', updatedImages, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            const url = isEditMode
                ? `/api/products/${product.id}`
                : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast({
                    title: 'Sukses!',
                    description: `Produk berhasil ${
                        isEditMode ? 'diperbarui' : 'ditambahkan'
                    }.`,
                    variant: 'success',
                });
                onSubmitSuccess(); // Memanggil callback yang benar
            } else {
                const errorData = await res.json();
                toast({
                    title: 'Gagal',
                    description:
                        errorData.message ||
                        'Terjadi kesalahan saat menyimpan produk.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan tak terduga.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const images = form.watch('images');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Kolom Kiri */}
                    <div className="space-y-8 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Utama Produk</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Produk</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: Toyota Avanza G 2023"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Deskripsi Singkat
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Deskripsi singkat yang menarik..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="longDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Deskripsi Lengkap
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={6}
                                                    placeholder="Jelaskan detail lengkap produk di sini..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        multiple
                                                        accept="image/png, image/jpeg, image/webp"
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Unggah Gambar
                                                    </Button>
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                {images?.map((src, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative aspect-square"
                                                    >
                                                        <Image
                                                            src={src}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            fill
                                                            className="rounded-md object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan (Sidebar) */}
                    <div className="space-y-8 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Harga</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Harga Asli (Rp)
                                            </FormLabel>
                                            <FormControl>
                                                <CurrencyInput
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    placeholder="Contoh: 250.000.000"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="discountPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Harga Diskon (Rp) - Opsional
                                            </FormLabel>
                                            <FormControl>
                                                <CurrencyInput
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    placeholder="Contoh: 235.000.000"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Atribut & Kategori</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: MPV"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kondisi</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih kondisi" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(
                                                        Condition,
                                                    ).map((c) => (
                                                        <SelectItem
                                                            key={c}
                                                            value={c}
                                                        >
                                                            {c}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch('condition') ===
                                    Condition.Bekas && (
                                    <FormField
                                        control={form.control}
                                        name="mileage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Jarak Tempuh (km)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Contoh: 50000"
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        } // Perbaikan: Atasi nilai null/undefined
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target
                                                                    .value ===
                                                                    ''
                                                                    ? undefined
                                                                    : +e.target
                                                                          .value,
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="fuelType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jenis Bahan Bakar
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value ?? ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis bahan bakar" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(
                                                        FuelType,
                                                    ).map((ft) => (
                                                        <SelectItem
                                                            key={ft}
                                                            value={ft}
                                                        >
                                                            {ft}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Visibilitas</CardTitle>
                                <CardDescription>
                                    Atur visibilitas produk di halaman utama.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="isFeatured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <FormLabel>Unggulan</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isPromo"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <FormLabel>Promo</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isSubmitting
                            ? 'Menyimpan...'
                            : isEditMode
                            ? 'Simpan Perubahan'
                            : 'Tambahkan Produk'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
