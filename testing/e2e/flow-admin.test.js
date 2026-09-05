// testing/e2e/flow-admin.test.js
// E2E Flow: Login admin → Buat produk → Update settings → Kelola order → Logout

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, put, patch, del, createSession, log,
} from '../helpers.js';

const session = createSession();
let newProductId = null;

// ── Step 1: Login sebagai admin ───────────────────────────────────────────────
section('Step 1 — Login admin');
{
    const res = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: session });
    assertStatus('Admin login berhasil', res.status, 200);
    assert('Role adalah admin', res.body?.user?.role === 'admin',
        `Got role: ${res.body?.user?.role}`);
    log(`Logged in: ${res.body?.user?.email}`);

    if (res.status !== 200) {
        log('⚠ Admin tidak dapat login — seed admin dulu lalu ulangi test ini');
        summary('e2e/flow-admin.test.js');
        process.exit(0);
    }
}

// ── Step 2: Verifikasi session ────────────────────────────────────────────────
section('Step 2 — Verifikasi session aktif');
{
    const res = await get('/api/auth/session', { cookieJar: session });
    assertStatus('Session valid', res.status, 200);
    assert('User ada di session', Boolean(res.body?.user), 'User null');
}

// ── Step 3: Lihat semua produk ────────────────────────────────────────────────
section('Step 3 — Lihat daftar produk');
let existingProducts = [];
{
    const res = await get('/api/products', { cookieJar: session });
    assertStatus('Status 200', res.status, 200);
    existingProducts = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Total produk di DB: ${existingProducts.length}`);
}

// ── Step 4: Buat produk baru ──────────────────────────────────────────────────
section('Step 4 — Buat produk baru');
{
    // Minimal 1×1 PNG as data URL (valid base64 image for upload)
    const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const payload = {
        name: `E2E Admin Product ${Date.now()}`,
        description: 'Dibuat oleh E2E admin flow test',
        longDescription: 'Deskripsi panjang untuk produk yang dibuat melalui E2E admin flow test.',
        price: 500000000,
        category: 'Sedan',
        condition: 'Baru',
        images: [TINY_PNG],
    };
    const res = await post('/api/products', payload, { cookieJar: session });
    assertStatus('Produk berhasil dibuat (201)', res.status, 201);
    assertHas('Response punya "id"', res.body, 'id');
    newProductId = res.body?.id;
    log(`Produk baru: ${payload.name} (${newProductId})`);
}

// ── Step 5: Update settings homepage ─────────────────────────────────────────
section('Step 5 — Update homepage settings (featured)');
{
    if (!newProductId) {
        log('Skipped — produk baru tidak dibuat');
    } else {
        const res = await put('/api/settings/homepage', {
            featuredProductIds: [newProductId],
            promoProductIds: [],
        }, { cookieJar: session });
        assert('Settings berhasil diupdate (200/204)',
            res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log('Produk baru di-set sebagai featured');
    }
}

// ── Step 6: Verifikasi featured product muncul di public endpoint ─────────────
section('Step 6 — Verifikasi featured product (public)');
{
    if (!newProductId) {
        log('Skipped');
    } else {
        const res = await get('/api/products/featured');
        assertStatus('Public featured endpoint OK', res.status, 200);
        const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
        assert(
            'Produk baru muncul di featured list',
            list.some((p) => p.id === newProductId),
            `ID ${newProductId} tidak ada di featured`,
        );
        log(`Featured products sekarang: ${list.length}`);
    }
}

// ── Step 7: Kelola orders yang ada ────────────────────────────────────────────
section('Step 7 — Lihat & update order (jika ada)');
{
    const res = await get('/api/orders', { cookieJar: session });
    assertStatus('Admin bisa lihat semua order', res.status, 200);
    const orders = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Total orders: ${orders.length}`);

    if (orders.length > 0) {
        const target = orders[0];
        const updateRes = await patch(`/api/orders/${target.id}`, {
            status: 'DEAL',
        }, { cookieJar: session });
        assert('Status order berhasil diupdate',
            updateRes.status === 200 || updateRes.status === 204,
            `Got ${updateRes.status}`);
        log(`Order ${target.id} → DEAL`);
    }
}

// ── Step 8: Hapus produk yang dibuat ─────────────────────────────────────────
section('Step 8 — Cleanup: hapus produk E2E');
{
    if (!newProductId) {
        log('Skipped');
    } else {
        // Reset featured dulu sebelum hapus
        await put('/api/settings/homepage', {
            featuredProductIds: [],
            promoProductIds: [],
        }, { cookieJar: session });

        const res = await del(`/api/products/${newProductId}`, { cookieJar: session });
        assert('Produk berhasil dihapus (200/204)',
            res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log(`Produk ${newProductId} dihapus`);
    }
}

// ── Step 9: Logout ────────────────────────────────────────────────────────────
section('Step 9 — Logout');
{
    const res = await post('/api/auth/logout', {}, { cookieJar: session });
    assertStatus('Logout berhasil', res.status, 200);
}

// ── Step 10: Akses protected route setelah logout ─────────────────────────────
section('Step 10 — Protected route setelah logout (harus 401/403)');
{
    const res = await get('/api/orders', { cookieJar: session });
    assert('Orders tidak bisa diakses setelah logout',
        res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

summary('e2e/flow-admin.test.js');
