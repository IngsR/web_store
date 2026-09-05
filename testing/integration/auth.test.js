// testing/integration/auth.test.js
// Test: Register, Login, Session check, Logout

import { CREDENTIALS } from '../config.js';
import {
    section, summary, assert, assertStatus, assertHas,
    post, get, createSession, log,
} from '../helpers.js';

const session = createSession();
const newUser = { ...CREDENTIALS.newUser };

// ── Register ──────────────────────────────────────────────────────────────────
section('Register');
{
    const res = await post('/api/auth/register', newUser, { cookieJar: session });
    assertStatus('POST /api/auth/register → 201', res.status, 201);
    assertHas('Response has "user" field', res.body, 'user');
    log(`Registered: ${newUser.email}`);
}

// ── Login (invalid credentials) ───────────────────────────────────────────────
section('Login — invalid credentials');
{
    const res = await post('/api/auth/login', {
        email: newUser.email,
        password: 'wrong-password',
    });
    assertStatus('POST /api/auth/login (wrong pass) → 401', res.status, 401);
}

// ── Login (valid credentials) ─────────────────────────────────────────────────
section('Login — valid credentials');
{
    const res = await post('/api/auth/login', {
        email: newUser.email,
        password: newUser.password,
    }, { cookieJar: session });
    assertStatus('POST /api/auth/login → 200', res.status, 200);
    assertHas('Response has "user" field', res.body, 'user');
    assert('Cookie session set', Boolean(session.raw), 'No cookie received');
    log(`Logged in as: ${res.body?.user?.email}`);
}

// ── Session check ─────────────────────────────────────────────────────────────
section('Session check');
{
    const res = await get('/api/auth/session', { cookieJar: session });
    assertStatus('GET /api/auth/session → 200', res.status, 200);
    assertHas('Response has "user" field', res.body, 'user');
    assert('Session email matches', res.body?.user?.email === newUser.email,
        `expected ${newUser.email}, got ${res.body?.user?.email}`);
}

// ── Logout ────────────────────────────────────────────────────────────────────
section('Logout');
{
    const res = await post('/api/auth/logout', {}, { cookieJar: session });
    assertStatus('POST /api/auth/logout → 200', res.status, 200);
}

// ── Session after logout ───────────────────────────────────────────────────────
section('Session after logout');
{
    // After logout, session should be invalid (401 or user null)
    const res = await get('/api/auth/session', { cookieJar: session });
    assert(
        'Session invalid after logout (401 or no user)',
        res.status === 401 || !res.body?.user,
        `Unexpected status ${res.status}`,
    );
}

// ── Admin login ────────────────────────────────────────────────────────────────
section('Admin Login');
{
    const adminSession = createSession();
    const res = await post('/api/auth/login', CREDENTIALS.admin, { cookieJar: adminSession });
    assert(
        'Admin login succeeds (200) or not-yet-seeded (401)',
        res.status === 200 || res.status === 401,
        `Unexpected status ${res.status}`,
    );
    if (res.status === 200) {
        assert('Admin role is "admin"', res.body?.user?.role === 'admin',
            `Got role: ${res.body?.user?.role}`);
        log(`Admin logged in: ${res.body?.user?.email}`);
    } else {
        log('Admin credentials not found in DB — seed admin terlebih dahulu');
    }
}

summary('auth.test.js');
