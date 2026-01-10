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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
                        <p className="text-xs text-slate-500 mt-1">Complete your order securely</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-5 border border-blue-100">
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Order Summary</h3>
                        <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                            {cartItems.length > 0 ? cartItems.map((item) => (
                                <div key={item.product_id || item.id} className="flex justify-between text-sm items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-slate-900">₱{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-sm text-center py-4">No items in cart</p>
                            )}
                        </div>
                        <div className="border-t-2 border-blue-200 pt-4 flex justify-between items-center">
                            <span className="font-bold text-slate-900 text-lg">Total Amount:</span>
                            <span className="font-bold text-blue-600 text-2xl">₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">💳</span>
                            Payment Method
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { value: 'credit', label: 'Credit Card', icon: '💳' },
                                { value: 'debit', label: 'Debit Card', icon: '💳' },
                                { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                                { value: 'gcash', label: 'GCash', icon: '📱' },
                                { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                            ].map((method) => (
                                <label 
                                    key={method.value} 
                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                        paymentMethod === method.value 
                                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
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
                                    <span className="ml-3 text-lg">{method.icon}</span>
                                    <span className="ml-2 font-semibold text-slate-900">{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Card Details (only show for credit/debit) */}
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                            <h4 className="font-bold text-slate-900">Card Details</h4>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    maxLength={19}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Card Holder Name
                                </label>
                                <input
                                    type="text"
                                    name="cardHolder"
                                    placeholder="John Doe"
                                    value={formData.cardHolder}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        maxLength={5}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        maxLength={4}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg flex items-start gap-3">
                            <span className="text-xl">✕</span>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-lg flex items-start gap-3">
                            <span className="text-xl">✓</span>
                            <span className="font-medium">{success}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                    >
                        {loading ? '⏳ Processing...' : `✓ Complete Purchase - ₱${total.toFixed(2)}`}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                        🔒 Your payment information is secure and encrypted
                    </p>
                </form>
            </div>
        </div>
    );
};
