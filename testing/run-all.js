// testing/run-all.js
// Runner: Jalankan semua test suite secara berurutan

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
};

const suites = [
    { label: 'Auth', file: 'integration/auth.test.js' },
    { label: 'Products', file: 'integration/products.test.js' },
    { label: 'Orders', file: 'integration/orders.test.js' },
    { label: 'Sales', file: 'integration/sales.test.js' },
    { label: 'Cart', file: 'integration/cart.test.js' },
    { label: 'Settings', file: 'integration/settings.test.js' },
    { label: 'E2E: Customer Flow', file: 'e2e/flow-customer.test.js' },
    { label: 'E2E: Admin Flow', file: 'e2e/flow-admin.test.js' },
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

console.log(`\n${c.cyan}${c.bold}╔══════════════════════════════════════╗`);
console.log(`║   CMS Store — Manual Test Runner     ║`);
console.log(`╚══════════════════════════════════════╝${c.reset}`);
console.log(`${c.dim}  Target: ${BASE_URL}${c.reset}`);
console.log(`${c.dim}  Running ${suites.length} test suite(s)...${c.reset}\n`);

let totalPassed = 0;
let totalFailed = 0;
const results = [];

for (const suite of suites) {
    const filePath = path.join(__dirname, suite.file);
    console.log(`\n${c.yellow}${c.bold}══ ${suite.label} ══${c.reset}`);

    try {
        const output = execSync(
            `node "${filePath}"`,
            {
                encoding: 'utf-8',
                env: { ...process.env, BASE_URL },
                stdio: ['pipe', 'pipe', 'pipe'],
            },
        );
        console.log(output);

        // Parse passed/failed dari output summary line
        const match = output.match(/(\d+)\/(\d+) passed/);
        if (match) {
            const passed = parseInt(match[1]);
            const total = parseInt(match[2]);
            const failed = total - passed;
            totalPassed += passed;
            totalFailed += failed;
            results.push({ label: suite.label, passed, total, failed, ok: failed === 0 });
        }
    } catch (err) {
        const output = (err.stdout || '') + (err.stderr || '');
        console.log(output);

        const match = output.match(/(\d+)\/(\d+) passed/);
        if (match) {
            const passed = parseInt(match[1]);
            const total = parseInt(match[2]);
            const failed = total - passed;
            totalPassed += passed;
            totalFailed += failed;
            results.push({ label: suite.label, passed, total, failed, ok: false });
        } else {
            totalFailed++;
            results.push({ label: suite.label, passed: 0, total: 1, failed: 1, ok: false });
        }
    }
}

// ── Final Summary ─────────────────────────────────────────────────────────────
console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════╗`);
console.log(`║           FINAL SUMMARY              ║`);
console.log(`╚══════════════════════════════════════╝${c.reset}`);

for (const r of results) {
    const icon = r.ok ? `${c.green}✓` : `${c.red}✗`;
    const label = r.label.padEnd(28);
    console.log(`  ${icon} ${label}${c.reset} ${r.passed}/${r.total}`);
}

const total = totalPassed + totalFailed;
const allPassed = totalFailed === 0;
const color = allPassed ? c.green : c.red;
console.log(`\n${color}${c.bold}  Total: ${totalPassed}/${total} assertions passed${c.reset}`);

if (allPassed) {
    console.log(`${c.green}  ✅ Semua test lulus!${c.reset}\n`);
} else {
    console.log(`${c.red}  ❌ ${totalFailed} assertion(s) gagal.${c.reset}\n`);
    process.exit(1);
}
