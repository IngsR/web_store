# Testing — CMS Store Web Store

Direktori ini berisi script manual test untuk **integrated** dan **end-to-end** testing.
Tidak menggunakan framework testing — cukup Node.js native (fetch built-in).

> **Pastikan dev server berjalan terlebih dahulu:** `npm run dev`

---

## Struktur

```
testing/
├── README.md
├── config.js              ← Base URL & kredensial default
├── helpers.js             ← Utility: request, assert, log
├── integration/
│   ├── auth.test.js       ← Login, register, session, logout
│   ├── products.test.js   ← CRUD produk (admin)
│   ├── orders.test.js     ← Buat & kelola order
│   ├── sales.test.js      ← Buat & kelola SPK/sales
│   ├── cart.test.js       ← Cart operations
│   └── settings.test.js   ← Homepage settings (featured/promo)
└── e2e/
    ├── flow-customer.test.js   ← Full flow: register → browse → cart → order
    └── flow-admin.test.js      ← Full flow: login admin → kelola produk → settings
```

---

## Cara Menjalankan

### Semua integration test sekaligus
```bash
node testing/run-all.js
```

### Per-modul integration test
```bash
node testing/integration/auth.test.js
node testing/integration/products.test.js
node testing/integration/orders.test.js
node testing/integration/sales.test.js
node testing/integration/cart.test.js
node testing/integration/settings.test.js
```

### End-to-End flow test
```bash
node testing/e2e/flow-customer.test.js
node testing/e2e/flow-admin.test.js
```

### Dengan base URL custom (misal staging)
```bash
BASE_URL=https://your-staging.vercel.app node testing/run-all.js
```

---

## Kredensial Default (dari config.js)
Ubah di `testing/config.js` sesuai data lokal Anda.
