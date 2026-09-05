// testing/integration/cart.test.js
// Test: Add to cart, Get cart, Remove item (sebagai customer)

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, del, createSession, log,
} from '../helpers.js';

const session = createSession();

// ── Setup: daftar & login sebagai customer baru ───────────────────────────────
const testUser = {
    name: 'Cart Test User',
    email: `cart_test_${Date.now()}@example.com`,
    password: 'password123',
};

section('Setup — Register & Login customer');
{
    const regRes = await post('/api/auth/register', testUser, { cookieJar: session });
    assert('Register berhasil (201)', regRes.status === 201,
        `Got ${regRes.status}`);

    const loginRes = await post('/api/auth/login', {
        email: testUser.email,
        password: testUser.password,
    }, { cookieJar: session });
    assert('Login berhasil (200)', loginRes.status === 200,
        `Got ${loginRes.status}`);
}

// ── Ambil satu produk untuk ditest ────────────────────────────────────────────
let productId = null;

section('Setup — Ambil produk pertama dari katalog');
{
    const res = await get('/api/products');
    const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    if (list.length > 0) {
        productId = list[0].id;
        log(`Menggunakan produk: ${list[0].name} (${productId})`);
    } else {
        log('⚠ Tidak ada produk di DB — seed produk terlebih dahulu');
    }
}

// ── POST /api/cart — Tambah item ──────────────────────────────────────────────
section('POST /api/cart — Tambah item ke cart');
{
    if (!productId) {
        log('Skipped — tidak ada produk');
    } else {
        const res = await post('/api/cart', { productId, quantity: 1 }, { cookieJar: session });
        assertStatus('Status 200 atau 201', res.status === 200 || res.status === 201 ? 200 : res.status, 200);
        log('Item berhasil ditambahkan ke cart');
    }
}

// ── GET /api/cart — Lihat isi cart ────────────────────────────────────────────
section('GET /api/cart — Ambil isi cart');
let cartItems = [];
{
    const res = await get('/api/cart', { cookieJar: session });
    assertStatus('Status 200', res.status, 200);
    cartItems = Array.isArray(res.body) ? res.body : (res.body?.items ?? res.body?.data ?? []);
    log(`Item di cart: ${cartItems.length}`);
    if (productId) {
        assert('Produk yang ditambahkan ada di cart',
            cartItems.some((i) => i.productId === productId || i.product?.id === productId),
            'Produk tidak ditemukan di cart');
    }
}

// ── DELETE /api/cart — Hapus item dari cart ────────────────────────────────────
section('DELETE /api/cart — Hapus item dari cart');
{
    if (cartItems.length === 0) {
        log('Skipped — cart kosong');
    } else {
        const item = cartItems[0];
        const itemId = item.id;
        const res = await del(`/api/cart?itemId=${itemId}`, { cookieJar: session });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log(`Item ${itemId} dihapus dari cart`);
    }
}

// ── Cart tanpa auth ────────────────────────────────────────────────────────────
section('GET /api/cart — Tanpa auth harus ditolak');
{
    const res = await get('/api/cart');
    assert('Status 401 atau 403', res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

summary('cart.test.js');
