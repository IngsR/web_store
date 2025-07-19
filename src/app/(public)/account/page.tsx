'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const accountFormSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters.' }),
        email: z.string().email(),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters.')
            .optional()
            .or(z.literal('')),
        confirmPassword: z.string().optional(),
        profilePicture: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountPage() {
    const { user, login, isLoading } = useAuth();
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            profilePicture: '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                profilePicture: user.profilePicture || '',
            });
            if (user.profilePicture) {
                setPreview(user.profilePicture);
            }
        }
    }, [user, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setPreview(dataUri);
                form.setValue('profilePicture', dataUri, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string) => {
        return (
            name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || ''
        );
    };

    const onSubmit = async (values: AccountFormValues) => {
        try {
            const res = await fetch('/api/user/account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                const { user: updatedUser } = await res.json();
                login(updatedUser, false); // Update user in context without redirecting
                toast({
                    title: 'Account Updated',
                    description: 'Your profile information has been saved.',
                    variant: 'success',
                });
                form.reset({
                    ...form.getValues(),
                    password: '',
                    confirmPassword: '',
                });
            } else {
                const errorData = await res.json();
                toast({
                    title: 'Update Failed',
                    description:
                        errorData.message ||
                        'An error occurred. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6 max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-8 w-2/3" />
                    <Card>
                        <CardContent className="pt-6 space-y-8">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-10 w-64" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    {/* ⬅️ Tombol Kembali */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </button>
                    </div>

                    <h1 className="text-3xl font-headline font-bold md:text-4xl">
                        Account Settings
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Manage your account details and password.
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your photo and personal details here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="profilePicture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Profile Picture
                                            </FormLabel>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-24 h-24">
                                                    <AvatarImage
                                                        src={preview || ''}
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(
                                                            user?.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        className="max-w-xs"
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Changing your email will require
                                                you to log in again.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Leave blank to keep your current password.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                    autoComplete="new-password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                    autoComplete="new-password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting ||
                                    !form.formState.isDirty
                                }
                            >
                                {form.formState.isSubmitting ? (
                                    <JumpingDotsLoader />
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
