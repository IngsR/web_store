import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImageFromBase64(
    base64Data: string,
    folder: 'products' | 'avatars',
): Promise<string> {
    const base64 = base64Data.split(';base64,').pop();
    if (!base64) {
        throw new Error('Invalid base64 data');
    }

    const buffer = Buffer.from(base64, 'base64');
    const filename = `${folder}/${uuidv4()}.png`;

    const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/png',
    });

    return blob.url;
}

export async function deleteImage(imageUrl: string): Promise<void> {
    await del(imageUrl);
}
