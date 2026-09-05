// testing/integration/settings.test.js
// Test: Homepage settings — featured & promo products (admin only)

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus,
    post, get, put, createSession, log,
} from '../helpers.js';

const adminSession = createSession();
const publicSession = createSession(); // unauthenticated

// ── Setup ─────────────────────────────────────────────────────────────────────
section('Setup — Admin Login');
{
    const res = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: adminSession });
    assert('Admin login', res.status === 200,
        `Status ${res.status} — pastikan admin sudah di-seed`);
    if (res.status !== 200) {
        summary('settings.test.js');
        process.exit(0);
    }
}

// ── Ambil daftar produk untuk digunakan sebagai payload ───────────────────────
let sampleProductIds = [];

section('Setup — Ambil sample produk');
{
    const res = await get('/api/products', { cookieJar: adminSession });
    const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    sampleProductIds = list.slice(0, 2).map((p) => p.id);
    log(`Sample product IDs: ${sampleProductIds.join(', ') || '(kosong)'}`);
}

// ── GET /api/products/featured — Public endpoint ──────────────────────────────
section('GET /api/products/featured — Public endpoint');
{
    const res = await get('/api/products/featured');
    assertStatus('Status 200', res.status, 200);
    const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Featured products: ${list.length}`);
}

// ── GET /api/products/promo — Public endpoint ─────────────────────────────────
section('GET /api/products/promo — Public endpoint');
{
    const res = await get('/api/products/promo');
    assertStatus('Status 200', res.status, 200);
    const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Promo products: ${list.length}`);
}

// ── PUT /api/settings/homepage — Admin update settings ────────────────────────
section('PUT /api/settings/homepage — Admin update featured & promo');
{
    if (sampleProductIds.length === 0) {
        log('Skipped — tidak ada produk di DB');
    } else {
        const payload = {
            featuredProductIds: [sampleProductIds[0]],
            promoProductIds: sampleProductIds.length > 1 ? [sampleProductIds[1]] : [sampleProductIds[0]],
        };
        const res = await put('/api/settings/homepage', payload, { cookieJar: adminSession });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log('Settings homepage berhasil diupdate');
    }
}

// ── Verifikasi perubahan tercermin di public endpoint ─────────────────────────
section('Verifikasi — Featured product setelah update');
{
    if (sampleProductIds.length === 0) {
        log('Skipped');
    } else {
        const res = await get('/api/products/featured');
        assertStatus('Status 200', res.status, 200);
        const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
        assert(
            'Produk yang di-set featured muncul di public endpoint',
            list.some((p) => p.id === sampleProductIds[0]),
            `ID ${sampleProductIds[0]} tidak ditemukan di featured list`,
        );
    }
}

// ── PUT settings tanpa auth ────────────────────────────────────────────────────
section('PUT /api/settings/homepage — Tanpa auth harus ditolak');
{
    const res = await put('/api/settings/homepage', {
        featuredProductIds: [],
        promoProductIds: [],
    }, { cookieJar: publicSession });
    assert('Status 401 atau 403', res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

summary('settings.test.js');
