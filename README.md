# Ing Store - Platform E-Commerce Mobil

Ing Store adalah sebuah proyek aplikasi web e-commerce _full-stack_ yang dibangun menggunakan Next.js dan TypeScript. Aplikasi ini dirancang sebagai platform jual beli mobil, lengkap dengan antarmuka modern untuk pelanggan dan dasbor administrasi yang komprehensif untuk manajemen konten.

## Masalah yang Diselesaikan

Di era digital, dealer mobil memerlukan platform online yang kuat untuk menjangkau pelanggan yang lebih luas. Mereka membutuhkan sebuah situs web yang tidak hanya menampilkan produk secara menarik, tetapi juga sistem manajemen yang efisien untuk mengelola inventaris, promo, dan konten situs tanpa memerlukan keahlian teknis yang mendalam.

## Solusi yang Ditawarkan

Ing Store menjawab kebutuhan ini dengan menyediakan dua komponen utama:

1.  **Situs Publik (Storefront)**: Antarmuka yang modern, cepat, dan responsif bagi pelanggan untuk menjelajahi, mencari, dan menemukan mobil impian mereka.
2.  **Dasbor Admin**: Panel kontrol yang aman dan intuitif bagi staf untuk mengelola seluruh aspek toko, mulai dari menambah produk baru, mengatur harga, hingga menentukan produk mana yang akan ditampilkan di halaman utama.

---

## Fitur Utama

### Untuk Pelanggan

-   **Halaman Utama Dinamis**: Menampilkan banner, carousel promo, dan daftar produk unggulan yang dapat dikelola dari dasbor admin.
-   **Katalog Produk**: Halaman untuk melihat semua produk dengan fitur filter (berdasarkan kategori & harga) dan sortir (berdasarkan popularitas, harga, atau terbaru).
-   **Pencarian Produk**: Memudahkan pengguna menemukan mobil berdasarkan nama atau deskripsi.
-   **Halaman Detail Produk**: Tampilan lengkap spesifikasi, galeri gambar, dan deskripsi produk.
-   **Sistem Kondisi Mobil**: Membedakan mobil **Baru** dan **Bekas**, lengkap dengan informasi jarak tempuh (KM) untuk mobil bekas.
-   **Wishlist & Keranjang Belanja**: Fungsionalitas e-commerce standar untuk menyimpan produk yang disukai dan melakukan pembelian.
-   **Desain Responsif**: Tampilan yang optimal di berbagai perangkat, dari desktop hingga mobile.

### Untuk Admin

-   **Otentikasi Aman**: Dasbor dilindungi dan hanya bisa diakses oleh pengguna dengan peran 'ADMIN'.
-   **Manajemen Produk (CRUD)**: Kemampuan untuk menambah, melihat, mengedit, dan menghapus produk mobil.
-   **Formulir Produk Canggih**: Formulir dengan validasi _real-time_ dan layout dua kolom yang efisien.
-   **Unggah Gambar**: Mengunggah gambar produk dengan mudah, yang disimpan di **Vercel Blob Storage**.
-   **Pengaturan Halaman Utama**: Antarmuka untuk memilih produk mana yang akan dijadikan "Promo" atau "Unggulan" di halaman utama.

---

## Teknologi yang Digunakan

-   **Framework**: Next.js 14 (App Router)
-   **Bahasa**: TypeScript
-   **Styling**: Tailwind CSS
-   **Komponen UI**: Shadcn/UI
-   **Database & ORM**: PostgreSQL & Prisma
-   **Validasi Skema**: Zod
-   **Penyimpanan File**: Vercel Blob Storage
-   **Otentikasi**: NextAuth.js
-   **State Management**: React Hooks (useState, useEffect, useMemo)

---

## Instalasi dan Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat

-   Node.js (v18 atau lebih baru)
-   npm, yarn, atau pnpm
-   Database PostgreSQL

### 2. Clone Repositori

```bash
git clone https://github.com/IngsR/Ing_Store.git
cd Ing_Store
```

### 3. Instalasi Dependensi

```bash
npm install
```

### 4. Konfigurasi Environment

Buat file `.env.local` di root proyek dan salin konten dari `.env.example` (jika ada) atau gunakan template di bawah ini. Sesuaikan nilainya dengan konfigurasi lokal Anda.

```env
# Konfigurasi Database Prisma
# Contoh untuk PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Token untuk Vercel Blob Storage
# Dapatkan dari dashboard Vercel proyek Anda
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Kunci rahasia untuk NextAuth.js
# Anda bisa generate kunci ini dengan `openssl rand -base64 32`
AUTH_SECRET="your-super-secret-auth-secret"

# Opsional: Tambahkan kredensial provider jika Anda menggunakan (misal: Google, GitHub)
# GITHUB_ID=...
# GITHUB_SECRET=...
```

### 5. Migrasi Database

Jalankan perintah berikut untuk membuat tabel di database Anda sesuai dengan skema Prisma.

```bash
npx prisma migrate dev
```

### 6. Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.

---

## Penutup

Terima kasih telah melihat proyek Ing Store. Proyek ini adalah contoh implementasi konsep e-commerce modern dengan tumpukan teknologi terkini. Jangan ragu untuk berkontribusi, memberikan masukan, atau menggunakannya sebagai referensi untuk proyek Anda.
