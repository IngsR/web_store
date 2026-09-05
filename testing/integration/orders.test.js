// testing/integration/orders.test.js
// Test: List orders, Get detail, Update status (admin)

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, put, patch, createSession, log,
} from '../helpers.js';

const adminSession = createSession();
const customerSession = createSession();

// ── Setup ─────────────────────────────────────────────────────────────────────
section('Setup — Login');
{
    const adminRes = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: adminSession });
    assert('Admin login', adminRes.status === 200,
        `Status ${adminRes.status} — pastikan admin sudah di-seed`);

    const custRes = await post('/api/auth/login', CREDENTIALS.customer, { cookieJar: customerSession });
    assert('Customer login (atau 401 jika belum terdaftar)', custRes.status === 200 || custRes.status === 401,
        `Status ${custRes.status}`);
    if (custRes.status === 200) log(`Customer: ${custRes.body?.user?.email}`);
}

// ── GET /api/orders — List orders (admin) ─────────────────────────────────────
section('GET /api/orders — Admin melihat semua order');
let orders = [];
{
    const res = await get('/api/orders', { cookieJar: adminSession });
    assertStatus('Status 200', res.status, 200);
    orders = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Total orders: ${orders.length}`);
}

// ── GET /api/orders/[id] — Detail order ───────────────────────────────────────
section('GET /api/orders/[id] — Detail satu order');
{
    if (orders.length === 0) {
        log('Skipped — belum ada order di DB');
    } else {
        const firstOrder = orders[0];
        const res = await get(`/api/orders/${firstOrder.id}`, { cookieJar: adminSession });
        assertStatus('Status 200', res.status, 200);
        assertHas('Response punya "id"', res.body, 'id');
        assert('ID cocok', res.body?.id === firstOrder.id,
            `Expected ${firstOrder.id}, got ${res.body?.id}`);
    }
}

// ── PUT /api/orders/[id] — Update status order ────────────────────────────────
section('PUT /api/orders/[id] — Update status order (admin)');
{
    if (orders.length === 0) {
        log('Skipped — belum ada order di DB');
    } else {
        const targetOrder = orders[0];
        const newStatus = 'DIHUBUNGI';
        const res = await patch(`/api/orders/${targetOrder.id}`, {
            status: newStatus,
        }, { cookieJar: adminSession });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log(`Order ${targetOrder.id} → status: ${newStatus}`);
    }
}

// ── Unauthorized: customer mencoba list semua order ───────────────────────────
section('GET /api/orders — Customer (non-admin) harus ditolak');
{
    const res = await get('/api/orders', { cookieJar: customerSession });
    assert('Status 401 atau 403 (bukan admin)', res.status === 401 || res.status === 403,
        `Expected 401/403, got ${res.status}`);
}

// ── Unauthenticated access ─────────────────────────────────────────────────────
section('GET /api/orders — Tanpa auth harus ditolak');
{
    const res = await get('/api/orders');
    assert('Status 401 atau 403', res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

summary('orders.test.js');
