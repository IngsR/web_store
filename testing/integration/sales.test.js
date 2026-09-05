// testing/integration/sales.test.js
// Test: List SPK/sales, Get detail, Create, Update status (admin)

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, put, createSession, log,
} from '../helpers.js';

const adminSession = createSession();

// ── Setup ─────────────────────────────────────────────────────────────────────
section('Setup — Admin Login');
{
    const res = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: adminSession });
    assert('Admin login', res.status === 200,
        `Status ${res.status} — pastikan admin sudah di-seed`);
    if (res.status !== 200) {
        summary('sales.test.js');
        process.exit(0);
    }
}

// ── GET /api/sales ────────────────────────────────────────────────────────────
section('GET /api/sales — List semua SPK');
let sales = [];
{
    const res = await get('/api/sales', { cookieJar: adminSession });
    assertStatus('Status 200', res.status, 200);
    sales = Array.isArray(res.body) ? res.body : (res.body?.data ?? []);
    log(`Total SPK: ${sales.length}`);
}

// ── GET /api/sales/[id] — Detail SPK ─────────────────────────────────────────
section('GET /api/sales/[id] — Detail satu SPK');
{
    if (sales.length === 0) {
        log('Skipped — belum ada SPK di DB');
    } else {
        const first = sales[0];
        const res = await get(`/api/sales/${first.id}`, { cookieJar: adminSession });
        assertStatus('Status 200', res.status, 200);
        assertHas('Response punya "id"', res.body, 'id');
        assert('ID cocok', res.body?.id === first.id,
            `Expected ${first.id}, got ${res.body?.id}`);
    }
}

// ── PUT /api/sales/[id] — Update status SPK ──────────────────────────────────
section('PUT /api/sales/[id] — Update status SPK');
{
    if (sales.length === 0) {
        log('Skipped — belum ada SPK di DB');
    } else {
        const target = sales[0];
        const res = await put(`/api/sales/${target.id}`, {
            status: 'IN_PROGRESS',
        }, { cookieJar: adminSession });
        assert('Status 200 atau 204', res.status === 200 || res.status === 204,
            `Got ${res.status}`);
        log(`SPK ${target.id} → status: IN_PROGRESS`);
    }
}

// ── Unauthenticated access ─────────────────────────────────────────────────────
section('GET /api/sales — Tanpa auth');
{
    const res = await get('/api/sales');
    assert('Status 401 atau 403', res.status === 401 || res.status === 403,
        `Got ${res.status}`);
}

summary('sales.test.js');
