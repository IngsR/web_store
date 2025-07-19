import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            // Vercel Blob Storage
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
        ],
        domains: ['localhost'],
    },
};

export default nextConfig;
