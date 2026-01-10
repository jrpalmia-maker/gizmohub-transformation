import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX } from './Icons';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: any[];
    total: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, total }) => {
    const { user } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'paypal' | 'gcash' | 'bank'>('credit');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            setError('Please login to proceed with checkout');
            return;
        }

        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        // Validation
        if (paymentMethod === 'credit' || paymentMethod === 'debit') {
            if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
                setError('Please fill in all card details');
                return;
            }
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
                setError('Card number must be 16 digits');
                return;
            }
        }

        setLoading(true);
        try {
            // Create order
            const orderResponse = await fetch('https://gizmohub-transformation.up.railway.app/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: user.id,
                    items: cartItems,
                    total: total,
                    status: 'Pending',
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();
            const orderId = orderData.order_id;

            // Process payment
            const paymentResponse = await fetch('https://gizmohub-transformation.up.railway.app/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId,
                    payment_method: paymentMethod,
                    amount: total,
                    payment_status: 'Completed',
                    card_details: paymentMethod === 'credit' || paymentMethod === 'debit' ? {
                        cardNumber: formData.cardNumber.slice(-4),
                        cardHolder: formData.cardHolder,
                    } : null,
                }),
            });

            if (!paymentResponse.ok) {
                throw new Error('Payment processing failed');
            }

            setSuccess('Order placed successfully! Thank you for your purchase.');
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-24 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl my-8 max-h-[calc(100vh-150px)] animate-in zoom-in-95 slide-in-from-top-4 duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b-2 border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Checkout</h2>
                        <p className="text-sm text-slate-600 mt-1">Secure payment process</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <IconX className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                {/* Landscape Layout: Two Columns */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* LEFT COLUMN: Payment Methods */}
                        <div className="p-8 border-r border-slate-200 space-y-6 bg-slate-50">
                            <div>
                                <label className="block text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <span>💳</span>
                                    Payment Method
                                </label>
                                <div className="space-y-3">
                                {[
                                    { value: 'credit', label: 'Credit Card', icon: '💳' },
                                    { value: 'debit', label: 'Debit Card', icon: '🏦' },
                                    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                                    { value: 'gcash', label: 'GCash', icon: '📱' },
                                    { value: 'bank', label: 'Bank Transfer', icon: '🏛️' },
                                ].map((method) => (
                                    <label 
                                        key={method.value} 
                                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            paymentMethod === method.value 
                                                ? 'border-blue-500 bg-blue-100 shadow-md' 
                                                : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.value}
                                            checked={paymentMethod === method.value}
                                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                        <span className="ml-3 text-xl">{method.icon}</span>
                                        <span className="ml-2 font-semibold text-slate-900 text-sm">{method.label}</span>
                                    </label>
                                ))}
                            </div>
                            
                            {/* Info Box */}
                            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                <p className="text-xs text-blue-800 font-semibold">💡 Secure Payment</p>
                                <p className="text-xs text-blue-700 mt-1">All transactions are encrypted and secure</p>
                            </div>
                        </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary & Card Details */}
                        <div className="p-8 space-y-6 bg-white">
                            {/* Order Summary */}
                            <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-5 text-xl flex items-center gap-2">
                                    <span>📦</span> Order Summary
                                </h3>
                                <div className="space-y-3 mb-6 pb-6 border-b-2 border-blue-200 max-h-48 overflow-y-auto">
                                    {cartItems.length > 0 ? cartItems.map((item) => (
                                        <div key={item.product_id || item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-600">Qty: <span className="font-semibold">{item.quantity}</span></p>
                                            </div>
                                            <span className="font-bold text-slate-900">₱{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    )) : (
                                        <p className="text-slate-500 text-center py-4">No items in cart</p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center bg-white rounded-lg p-4">
                                    <span className="font-bold text-slate-900">Total:</span>
                                    <span className="font-bold text-blue-600 text-2xl">₱{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Card Details (only show for credit/debit) */}
                            {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                                <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 space-y-4">
                                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <span>🔐</span> Card Details
                                    </h4>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-900 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            maxLength={19}
                                            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-900 mb-1">
                                            Card Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            placeholder="John Doe"
                                            value={formData.cardHolder}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-900 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                maxLength={5}
                                                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono bg-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-900 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                placeholder="123"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                maxLength={4}
                                                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono bg-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                                    <span className="text-lg">⚠️</span>
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-600 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                                    <span className="text-lg">✅</span>
                                    <span className="font-semibold">{success}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all duration-200 text-base shadow-lg hover:shadow-xl disabled:shadow-none"
                            >
                                {loading ? '⏳ Processing...' : `✓ Complete Purchase - ₱${total.toFixed(2)}`}
                            </button>

                            <p className="text-center text-xs text-slate-600 flex items-center justify-center gap-1">
                                🔒 100% Secure & Encrypted
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
