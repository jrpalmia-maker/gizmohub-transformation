import React, { useState } from 'react';
import { authService, cartService } from '../services/api';

export interface CartItem {
    id: string;
    cart_id?: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    product_id?: string;
}

export interface User {
    id: string;
    email?: string;
    username?: string;
    name: string;
    role: 'admin' | 'user';
    token?: string;
}

export interface AuthContextType {
    user: User | null;
    cartItems: CartItem[];
    isAuthenticated: boolean;
    login: (email: string, password: string, role: 'admin' | 'user') => Promise<void>;
    register: (email: string, firstName: string, lastName: string, password: string, phone?: string) => Promise<void>;
    logout: () => void;
    addToCart: (product: { id: string; name: string; price: number; category: string }) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('gizmohub_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('gizmohub_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const login = async (email: string, password: string, role: 'admin' | 'user') => {
        try {
            let response;
            if (role === 'admin') {
                response = await authService.adminLogin(email, password);
            } else {
                response = await authService.login(email, password);
            }

            const newUser: User = {
                id: response.user.id,
                email: response.user.email || response.user.username,
                username: response.user.username,
                name: response.user.name,
                role,
                token: response.token,
            };

            setUser(newUser);
            localStorage.setItem('gizmohub_user', JSON.stringify(newUser));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, firstName: string, lastName: string, password: string, phone?: string) => {
        try {
            const response = await authService.register(email, firstName, lastName, password, phone);
            
            // After successful registration, automatically log the user in
            const newUser: User = {
                id: Math.random().toString(),
                email: email,
                name: `${firstName} ${lastName}`,
                role: 'user',
            };

            setUser(newUser);
            localStorage.setItem('gizmohub_user', JSON.stringify(newUser));
            
            console.log('Registration successful:', response);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setCartItems([]);
        localStorage.removeItem('gizmohub_user');
        localStorage.removeItem('gizmohub_cart');
    };

    const addToCart = async (product: { id: string; name: string; price: number; category: string }) => {
        if (!user) return;

        try {
            // Try to add to backend cart if token exists
            if (user.token) {
                await cartService.addToCart(user.id, product.id, 1, user.token);
            }
            
            // Always update local state for immediate UI feedback
            setCartItems(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, quantity: 1, id: product.id }];
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Still update local state even if backend call fails
            setCartItems(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, quantity: 1, id: product.id }];
            });
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user) return;

        try {
            const cartItem = cartItems.find(item => item.id === productId);
            if (cartItem?.cart_id) {
                await cartService.removeFromCart(cartItem.cart_id, user.token || '');
            }
            
            setCartItems(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateCartQuantity = async (productId: string, quantity: number) => {
        if (!user) return;

        try {
            const cartItem = cartItems.find(item => item.id === productId);
            if (!cartItem?.cart_id) return;

            if (quantity <= 0) {
                await removeFromCart(productId);
            } else {
                await cartService.updateCartItem(cartItem.cart_id, quantity, user.token || '');
                
                setCartItems(prev =>
                    prev.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const clearCart = async () => {
        if (!user) return;

        try {
            for (const item of cartItems) {
                if (item.cart_id) {
                    await cartService.removeFromCart(item.cart_id, user.token || '');
                }
            }
            setCartItems([]);
            localStorage.removeItem('gizmohub_cart');
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Save cart to localStorage whenever it changes
    React.useEffect(() => {
        localStorage.setItem('gizmohub_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <AuthContext.Provider
            value={{
                user,
                cartItems,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
