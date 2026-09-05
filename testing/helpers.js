// testing/helpers.js
// Utility functions: HTTP requests, assertions, logging

import { BASE_URL } from './config.js';

// ─── Colors ──────────────────────────────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
};

// ─── State ────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

// ─── Logger ───────────────────────────────────────────────────────────────────
export function log(msg) {
    console.log(`  ${c.dim}${msg}${c.reset}`);
}

export function section(name) {
    console.log(`\n${c.cyan}${c.bold}▸ ${name}${c.reset}`);
}

export function ok(label) {
    passed++;
    console.log(`  ${c.green}✓${c.reset} ${label}`);
}

export function fail(label, reason = '') {
    failed++;
    console.log(`  ${c.red}✗${c.reset} ${label}`);
    if (reason) console.log(`    ${c.red}→ ${reason}${c.reset}`);
}

export function summary(suiteName) {
    const total = passed + failed;
    const color = failed === 0 ? c.green : c.red;
    console.log(`\n${color}${c.bold}━━━ ${suiteName}: ${passed}/${total} passed ━━━${c.reset}\n`);
    return { passed, failed };
}

// ─── HTTP Client ──────────────────────────────────────────────────────────────

/**
 * Perform an HTTP request. Returns { status, body, cookies }.
 * Automatically carries cookies when `cookieJar` is provided.
 */
export async function request(method, path, { body, cookieJar } = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json' };

    if (cookieJar && cookieJar.raw) {
        headers['Cookie'] = cookieJar.raw;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        redirect: 'manual',
    });

    // Capture Set-Cookie for session persistence
    const setCookie = res.headers.get('set-cookie');
    if (setCookie && cookieJar) {
        // Merge new cookies into the jar
        const newPairs = setCookie.split(',').map((c) => c.split(';')[0].trim());
        const existing = cookieJar.raw ? cookieJar.raw.split('; ') : [];
        for (const pair of newPairs) {
            const key = pair.split('=')[0];
            const idx = existing.findIndex((e) => e.startsWith(key + '='));
            if (idx >= 0) existing[idx] = pair;
            else existing.push(pair);
        }
        cookieJar.raw = existing.join('; ');
    }

    let parsedBody = null;
    const ct = res.headers.get('content-type') || '';
    try {
        parsedBody = ct.includes('application/json') ? await res.json() : await res.text();
    } catch {
        parsedBody = null;
    }

    return { status: res.status, body: parsedBody, cookies: setCookie };
}

// Shorthand helpers
export const get = (path, opts) => request('GET', path, opts);
export const post = (path, body, opts) => request('POST', path, { body, ...opts });
export const put = (path, body, opts) => request('PUT', path, { body, ...opts });
export const patch = (path, body, opts) => request('PATCH', path, { body, ...opts });
export const del = (path, opts) => request('DELETE', path, opts);

// ─── Assertions ───────────────────────────────────────────────────────────────
export function assert(label, condition, failMsg = '') {
    if (condition) {
        ok(label);
    } else {
        fail(label, failMsg);
    }
}

export function assertStatus(label, actual, expected) {
    assert(label, actual === expected, `expected status ${expected}, got ${actual}`);
}

export function assertHas(label, obj, key) {
    assert(label, obj && key in obj, `key "${key}" not found in response`);
}

// ─── Session Factory ──────────────────────────────────────────────────────────
export function createSession() {
    return { raw: '' };
}
