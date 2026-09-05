import * as React from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
}

export default function ProductImageUploader({
    images,
    onImagesChange,
}: ProductImageUploaderProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const filePromises = Array.from(files).map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises)
            .then((base64Strings) => {
                onImagesChange([...(images || []), ...base64Strings]);
            })
            .catch(console.error);

        if (e.target) e.target.value = '';
    };

    const removeImage = (index: number) => {
        const updatedImages = [...(images || [])];
        updatedImages.splice(index, 1);
        onImagesChange(updatedImages);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Unggah Gambar
                </Button>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images?.map((src, index) => (
                        <div key={index} className="relative aspect-square">
                            <Image
                                src={src}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="rounded-md object-cover"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                onClick={() => removeImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
