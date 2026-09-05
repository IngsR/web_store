// testing/config.js
// Ubah nilai ini sesuai environment lokal Anda

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const CREDENTIALS = {
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
    },
    customer: {
        email: process.env.CUSTOMER_EMAIL || 'customer@example.com',
        password: process.env.CUSTOMER_PASSWORD || 'customer123',
    },
    newUser: {
        name: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
        password: 'password123',
    },
};
