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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
                        <p className="text-xs text-slate-500 mt-1">Complete your order</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Order Summary */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-2">Order Summary</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="flex justify-between text-sm">
                                    <span className="text-slate-700">{item.name} x {item.quantity}</span>
                                    <span className="font-semibold text-slate-900">₱{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-300 mt-3 pt-3 flex justify-between">
                            <span className="font-bold text-slate-900">Total:</span>
                            <span className="font-bold text-blue-600 text-lg">₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Payment Method *
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: 'credit', label: '💳 Credit Card' },
                                { value: 'debit', label: '💳 Debit Card' },
                                { value: 'paypal', label: '🅿️ PayPal' },
                                { value: 'gcash', label: '📱 GCash' },
                                { value: 'bank', label: '🏦 Bank Transfer' },
                            ].map((method) => (
                                <label key={method.value} className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.value}
                                        checked={paymentMethod === method.value}
                                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-3 text-slate-700">{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Card Details (only show for credit/debit) */}
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    maxLength={19}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Card Holder Name *
                                </label>
                                <input
                                    type="text"
                                    name="cardHolder"
                                    placeholder="John Doe"
                                    value={formData.cardHolder}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        maxLength={4}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                            <span>✕</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                            <span>✓</span>
                            <span className="ml-2">{success}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {loading ? 'Processing...' : `Complete Purchase - ₱${total.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};
