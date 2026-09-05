// testing/integration/products.test.js
// Test: List, Get, Create, Update, Delete produk (sebagai admin)

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, put, del, createSession, log,
} from '../helpers.js';

// ── Setup: login sebagai admin ─────────────────────────────────────────────────
const session = createSession();

section('Setup — Admin Login');
{
    const res = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: session });
    assert(
        'Admin login berhasil',
        res.status === 200,
        `Status: ${res.status}. Pastikan admin sudah di-seed di DB.`,
    );
    if (res.status !== 200) {
        console.log('  ⚠ Skipping product tests — admin tidak dapat login.\n');
        summary('products.test.js');
        process.exit(0);
    }
}

// ── GET /api/products ─────────────────────────────────────────────────────────
section('GET /api/products — List semua produk');
let products = [];
{
    const res = await get('/api/products', { cookieJar: session });
    assertStatus('Status 200', res.status, 200);
    assert('Response berupa array atau object dengan data', Array.isArray(res.body) || typeof res.body === 'object',
        'Expected array or object');
    products = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Total produk: ${products.length}`);
}

// ── POST /api/products — Create produk baru ────────────────────────────────────
section('POST /api/products — Buat produk baru');
let createdProductId = null;
{
    // Minimal 1×1 PNG as data URL (valid base64 image for upload)
    const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const payload = {
        name: `Test Product ${Date.now()}`,
        description: 'Produk test dari integration test suite',
        longDescription: 'Deskripsi panjang untuk produk test dari integration test suite ini.',
        price: 350000000,
        category: 'SUV',
        condition: 'Baru',
        images: [TINY_PNG],
    };
    const res = await post('/api/products', payload, { cookieJar: session });
    assertStatus('Status 201', res.status, 201);
    assertHas('Response punya "id"', res.body, 'id');
    createdProductId = res.body?.id;
    log(`Produk dibuat dengan ID: ${createdProductId}`);
}

// ── GET /api/products/[id] — Get satu produk ──────────────────────────────────
section('GET /api/products/[id] — Ambil detail produk');
{
    if (!createdProductId) {
        log('Skipped — tidak ada produk yang dibuat');
    } else {
        const res = await get(`/api/products/${createdProductId}`, { cookieJar: session });
        assertStatus('Status 200', res.status, 200);
        assertHas('Response punya "name"', res.body, 'name');
        assert('ID cocok', res.body?.id === createdProductId,
            `Expected ${createdProductId}, got ${res.body?.id}`);
    }
}

// ── PUT /api/products/[id] — Update produk ────────────────────────────────────
section('PUT /api/products/[id] — Update produk');
{
    if (!createdProductId) {
        log('Skipped — tidak ada produk yang dibuat');
    } else {
        const res = await put(`/api/products/${createdProductId}`, {
            name: 'Updated Product Name',
            price: 400000000,
        }, { cookieJar: session });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log('Produk berhasil diupdate');
    }
}

// ── DELETE /api/products/[id] — Hapus produk ──────────────────────────────────
section('DELETE /api/products/[id] — Hapus produk');
{
    if (!createdProductId) {
        log('Skipped — tidak ada produk yang dibuat');
    } else {
        const res = await del(`/api/products/${createdProductId}`, { cookieJar: session });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log(`Produk ${createdProductId} dihapus`);
    }
}

// ── GET produk yang sudah dihapus ─────────────────────────────────────────────
section('GET /api/products/[id] — Verifikasi produk sudah terhapus');
{
    if (!createdProductId) {
        log('Skipped');
    } else {
        const res = await get(`/api/products/${createdProductId}`, { cookieJar: session });
        assert('Status 404 (sudah terhapus)', res.status === 404,
            `Expected 404, got ${res.status}`);
    }
}

// ── Unauthorized access ────────────────────────────────────────────────────────
section('POST /api/products — Tanpa auth (harus ditolak)');
{
    const res = await post('/api/products', { name: 'Unauthorized' });
    assert('Status 401 atau 403', res.status === 401 || res.status === 403,
        `Expected 401/403, got ${res.status}`);
}

summary('products.test.js');
