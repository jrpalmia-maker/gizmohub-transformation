import { ChatMessage } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gizmohub-transformation-production.up.railway.app/api';

// =====================
// AUTH SERVICES
// =====================

export const authService = {
    async login(email: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    async adminLogin(username: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Admin login failed');
        return response.json();
    },

    async register(email: string, firstName: string, lastName: string, password: string, phone?: string) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, first_name: firstName, last_name: lastName, password, phone }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
        return response.json();
    },
};

// =====================
// PRODUCTS SERVICES
// =====================

export const productsService = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    },

    async getByCategory(categoryId: string) {
        const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch products by category');
        return response.json();
    },

    async getByBrand(brandId: string) {
        const response = await fetch(`${API_BASE_URL}/products/brand/${brandId}`);
        if (!response.ok) throw new Error('Failed to fetch products by brand');
        return response.json();
    },
};

// =====================
// CATEGORIES SERVICES
// =====================

export const categoriesService = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },
};

// =====================
// BRANDS SERVICES
// =====================

export const brandsService = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        return response.json();
    },
};

// =====================
// CART SERVICES
// =====================

export const cartService = {
    async getCart(customerId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/cart/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        return response.json();
    },

    async addToCart(customerId: string, productId: string, quantity: number, token: string) {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ customerId, productId, quantity }),
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        return response.json();
    },

    async updateCartItem(cartId: string, quantity: number, token: string) {
        const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
        });
        if (!response.ok) throw new Error('Failed to update cart');
        return response.json();
    },

    async removeFromCart(cartId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to remove from cart');
        return response.json();
    },
};

// =====================
// ORDERS SERVICES
// =====================

export const ordersService = {
    async createOrder(customerId: string, cartItems: any[], total: number, token: string) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ customerId, cartItems, total }),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    async getOrders(customerId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/orders/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },
};

// =====================
// ADMIN SERVICES
// =====================

export const adminService = {
    async getStats(token: string) {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    async getLowStockProducts(token: string) {
        const response = await fetch(`${API_BASE_URL}/admin/low-stock`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch low stock products');
        return response.json();
    },
};
