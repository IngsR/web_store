import * as z from 'zod';
import { Condition, FuelType } from '@prisma/client';

export const productCoreSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name must be at least 3 characters long.' }),
    description: z.string().min(10, {
        message: 'Description must be at least 10 characters long.',
    }),
    longDescription: z.string().min(20, {
        message: 'Long description must be at least 20 characters long.',
    }),
    price: z.coerce
        .number()
        .gt(0, { message: 'Price must be a positive number.' }),
    discountPrice: z.coerce
        .number()
        .gt(0, { message: 'Discount price must be a positive number.' })
        .optional()
        .nullable(),
    category: z.string().min(1, { message: 'Category is required.' }),
    fuelType: z.nativeEnum(FuelType).optional().nullable(),
    condition: z.nativeEnum(Condition, {
        required_error: 'Condition is required.',
    }),
    mileage: z.coerce
        .number()
        .int()
        .gte(0, { message: 'Mileage must be a non-negative number.' })
        .optional()
        .nullable(),
    isFeatured: z.boolean().default(false),
    isPromo: z.boolean().default(false),
    popularity: z.coerce.number().min(0).max(100).default(80),
});

export const productCreateSchema = productCoreSchema
    .extend({
        images: z
            .array(
                z.string().startsWith('data:image', {
                    message: 'Only new image uploads are allowed for creation.',
                }),
            )
            .min(1, { message: 'At least one image is required.' }),
    })
    .superRefine((data, ctx) => {
        // Untuk mobil bekas, jarak tempuh wajib diisi.
        if (data.condition === 'Bekas' && data.mileage == null) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Mileage is required for used cars.',
                path: ['mileage'],
            });
        }
        // Harga diskon harus lebih rendah dari harga asli.
        if (data.discountPrice && data.discountPrice >= data.price) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Discount price must be less than the original price.',
                path: ['discountPrice'],
            });
        }
    });

export const productUpdateSchema = productCoreSchema
    .partial()
    .extend({
        images: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.price !== undefined &&
            data.discountPrice !== undefined &&
            data.discountPrice !== null &&
            data.discountPrice >= data.price
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Discount price must be less than the original price.',
                path: ['discountPrice'],
            });
        }
    });

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
