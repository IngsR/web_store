'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Loader2, MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import ProductForm from '../../_components/product-form';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPageClient({
    initialProducts,
}: {
    initialProducts: Product[];
}) {
    const [products, setProducts] = React.useState<Product[]>(initialProducts);
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] =
        React.useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [productToDelete, setProductToDelete] = React.useState<string | null>(
        null,
    );
    const { toast } = useToast();

    React.useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products/${productToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Product deleted successfully.',
                    variant: 'success',
                });
                router.refresh();
            } else {
                const errorData = await res.json();
                toast({
                    title: 'Error',
                    description:
                        errorData.message || 'Failed to delete product.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const confirmDelete = (productId: string) => {
        setProductToDelete(productId);
        setIsDeleteDialogOpen(true);
    };

    const onFormSubmitSuccess = () => {
        router.refresh();
        setIsFormOpen(false);
        setSelectedProduct(null);
    };

    return (
        <>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" onClick={handleAddNew}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Catalog</CardTitle>
                    <CardDescription>
                        Manage your products here. Add, edit, or delete
                        products.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Fuel Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Popularity</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-16 h-16 relative rounded overflow-hidden">
                                            <Image
                                                src={
                                                    product.images?.[0] ||
                                                    '/home/placeholder.jpg'
                                                }
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.condition === 'Baru'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {product.condition}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {product.fuelType ? (
                                            <Badge variant="outline">
                                                {product.fuelType}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell>{product.popularity}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Toggle menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onSelect={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() =>
                                                        confirmDelete(
                                                            product.id,
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent
                    className="sm:max-w-4xl h-[90vh] flex flex-col"
                    aria-labelledby="product-form-title"
                    aria-describedby="product-form-description"
                >
                    <DialogHeader>
                        <DialogTitle id="product-form-title">
                            {selectedProduct
                                ? 'Edit Product'
                                : 'Add New Product'}
                        </DialogTitle>
                        <DialogDescription id="product-form-description">
                            {selectedProduct
                                ? 'Update the details of this product.'
                                : 'Fill in the details for the new product.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                        product={selectedProduct}
                        onSubmitSuccess={onFormSubmitSuccess}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isDeleting ? 'Deleting...' : 'Continue'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
