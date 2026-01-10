import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckoutModal } from './CheckoutModal';

export const Cart: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateCartQuantity, clearCart } = useAuth();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-slate-900">Shopping Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Cart Items */}
                <div className="p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg mb-4">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.category}</p>
                                        <p className="text-sm font-semibold text-blue-600 mt-1">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(
                                                    item.id,
                                                    Math.max(1, item.quantity - 1)
                                                )
                                            }
                                            className="w-6 h-6 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(item.id, item.quantity + 1)
                                            }
                                            className="w-6 h-6 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {/* Totals */}
                            <div className="mt-6 space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex justify-between text-slate-700">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-700">
                                    <span>Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-300">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2 mt-6">
                                <button 
                                    onClick={() => {
                                        setIsCheckoutOpen(true);
                                        onClose();
                                    }}
                                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                                    💳 Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => clearCart()}
                                    className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg transition-all"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <CheckoutModal 
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    cartItems={cartItems}
                    total={total}
                />
            </div>
        </div>
    );
};
