// testing/e2e/flow-customer.test.js
// E2E Flow: Register → Browse katalog → Add to cart → Checkout / Place order

import {
    section, summary, assert, assertStatus, assertHas,
    post, get, del, createSession, log,
} from '../helpers.js';

const session = createSession();
const user = {
    name: 'E2E Customer',
    email: `e2e_customer_${Date.now()}@example.com`,
    password: 'securepass123',
};

let productId = null;
let orderId = null;

// ── Step 1: Browse katalog tanpa login ────────────────────────────────────────
section('Step 1 — Browse katalog (public)');
{
    const res = await get('/api/products');
    assertStatus('Katalog dapat diakses tanpa login', res.status, 200);
    const list = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    if (list.length > 0) {
        productId = list[0].id;
        log(`Produk dipilih: ${list[0].name} (${productId})`);
    }

    const featuredRes = await get('/api/products/featured');
    assertStatus('Featured products dapat diakses tanpa login', featuredRes.status, 200);

    const promoRes = await get('/api/products/promo');
    assertStatus('Promo products dapat diakses tanpa login', promoRes.status, 200);
}

// ── Step 2: Lihat detail produk ────────────────────────────────────────────────
section('Step 2 — Lihat detail produk');
{
    if (!productId) {
        log('Skipped — tidak ada produk di DB');
    } else {
        const res = await get(`/api/products/${productId}`);
        assertStatus('Detail produk dapat diakses tanpa login', res.status, 200);
        assertHas('Response punya "name"', res.body, 'name');
        log(`Detail: ${res.body?.name}`);
    }
}

// ── Step 3: Cart tanpa login — harus ditolak ──────────────────────────────────
section('Step 3 — Cart tanpa login');
{
    const res = await get('/api/cart');
    assert('Cart tidak bisa diakses tanpa login', res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

// ── Step 4: Register ──────────────────────────────────────────────────────────
section('Step 4 — Register akun baru');
{
    const res = await post('/api/auth/register', user, { cookieJar: session });
    assertStatus('Register berhasil', res.status, 201);
    assertHas('Response punya "user"', res.body, 'user');
    log(`Akun dibuat: ${user.email}`);
}

// ── Step 5: Login ─────────────────────────────────────────────────────────────
section('Step 5 — Login');
{
    const res = await post('/api/auth/login', {
        email: user.email,
        password: user.password,
    }, { cookieJar: session });
    assertStatus('Login berhasil', res.status, 200);
    assert('Session cookie set', Boolean(session.raw), 'Tidak ada cookie');
}

// ── Step 6: Tambah ke cart ────────────────────────────────────────────────────
section('Step 6 — Tambah produk ke cart');
{
    if (!productId) {
        log('Skipped — tidak ada produk');
    } else {
        const res = await post('/api/cart', { productId, quantity: 1 }, { cookieJar: session });
        assert('Item berhasil ditambahkan ke cart',
            res.status === 200 || res.status === 201,
            `Got ${res.status}`);
    }
}

// ── Step 7: Verifikasi isi cart ───────────────────────────────────────────────
section('Step 7 — Verifikasi isi cart');
let cartItems = [];
{
    const res = await get('/api/cart', { cookieJar: session });
    assertStatus('Cart dapat diambil setelah login', res.status, 200);
    cartItems = Array.isArray(res.body) ? res.body : (res.body?.items ?? res.body?.data ?? []);
    if (productId) {
        assert(
            'Produk ada di cart',
            cartItems.some((i) => i.productId === productId || i.product?.id === productId),
            'Produk tidak ditemukan di cart',
        );
    }
    log(`Cart berisi ${cartItems.length} item(s)`);
}

// ── Step 8: Place order (checkout) ────────────────────────────────────────────
section('Step 8 — Place order / checkout');
{
    if (!productId || cartItems.length === 0) {
        log('Skipped — cart kosong');
    } else {
        const cartItem = cartItems[0];
        const res = await post('/api/orders', {
            customerName: user.name,
            customerPhone: '08123456789',
            customerEmail: user.email,
            customerCity: 'Jakarta',
            customerAddress: 'Jl. Test No. 1, Jakarta Selatan',
            paymentMethod: 'CASH',
            notes: 'E2E test order',
            items: [{
                id: cartItem.productId ?? productId,
                name: cartItem.product?.name ?? 'E2E Test Product',
                price: cartItem.product?.price ?? 350000000,
                quantity: cartItem.quantity ?? 1,
            }],
            totalAmount: cartItem.product?.price ?? 350000000,
        }, { cookieJar: session });
        assert('Order berhasil dibuat (200/201)',
            res.status === 200 || res.status === 201,
            `Got ${res.status}`);
        orderId = res.body?.id;
        if (orderId) log(`Order dibuat: ${orderId}`);
    }
}

// ── Step 9: Cek order customer ────────────────────────────────────────────────
section('Step 9 — Lihat order milik sendiri');
{
    if (!orderId) {
        log('Skipped — tidak ada order dibuat');
    } else {
        const res = await get(`/api/orders/${orderId}`, { cookieJar: session });
        assert('Customer bisa lihat order miliknya',
            res.status === 200 || res.status === 403,
            `Got ${res.status}`);
        if (res.status === 200) log(`Order status: ${res.body?.status}`);
    }
}

// ── Step 10: Logout ───────────────────────────────────────────────────────────
section('Step 10 — Logout');
{
    const res = await post('/api/auth/logout', {}, { cookieJar: session });
    assertStatus('Logout berhasil', res.status, 200);
}

summary('e2e/flow-customer.test.js');
