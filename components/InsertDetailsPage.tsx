import React, { useState } from 'react';

interface InsertDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    type?: 'product' | 'order' | 'shipping';
}

interface ProductDetails {
    name: string;
    category: string;
    price: string;
    quantity: string;
    sku: string;
    description: string;
}

interface OrderDetails {
    orderId: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface ShippingDetails {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    currentStatus: string;
    notes: string;
}

export const InsertDetailsPage: React.FC<InsertDetailsProps> = ({ isOpen, onClose, type = 'product' }) => {
    const [productDetails, setProductDetails] = useState<ProductDetails>({
        name: '',
        category: '',
        price: '',
        quantity: '',
        sku: '',
        description: '',
    });

    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        orderId: '',
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        trackingNumber: '',
        carrier: '',
        estimatedDelivery: '',
        currentStatus: 'Pending',
        notes: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderDetails(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateProductDetails = () => {
        if (!productDetails.name.trim()) {
            setError('Product name is required');
            return false;
        }
        if (!productDetails.category.trim()) {
            setError('Category is required');
            return false;
        }
        if (!productDetails.price || isNaN(parseFloat(productDetails.price))) {
            setError('Valid price is required');
            return false;
        }
        if (!productDetails.quantity || isNaN(parseInt(productDetails.quantity))) {
            setError('Valid quantity is required');
            return false;
        }
        return true;
    };

    const validateOrderDetails = () => {
        if (!orderDetails.orderId.trim()) {
            setError('Order ID is required');
            return false;
        }
        if (!orderDetails.customerName.trim()) {
            setError('Customer name is required');
            return false;
        }
        if (!orderDetails.email.trim() || !orderDetails.email.includes('@')) {
            setError('Valid email is required');
            return false;
        }
        if (!orderDetails.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!orderDetails.address.trim()) {
            setError('Address is required');
            return false;
        }
        return true;
    };

    const validateShippingDetails = () => {
        if (!shippingDetails.trackingNumber.trim()) {
            setError('Tracking number is required');
            return false;
        }
        if (!shippingDetails.carrier.trim()) {
            setError('Carrier is required');
            return false;
        }
        if (!shippingDetails.estimatedDelivery) {
            setError('Estimated delivery date is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        let isValid = false;
        let dataToSubmit = {};

        switch (type) {
            case 'product':
                isValid = validateProductDetails();
                dataToSubmit = productDetails;
                break;
            case 'order':
                isValid = validateOrderDetails();
                dataToSubmit = orderDetails;
                break;
            case 'shipping':
                isValid = validateShippingDetails();
                dataToSubmit = shippingDetails;
                break;
        }

        if (!isValid) return;

        try {
            // Here you would typically send the data to your backend
            console.log(`Submitting ${type} details:`, dataToSubmit);

            // Simulate API call
            // const response = await fetch(`/api/${type}s`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dataToSubmit),
            // });

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
                // Reset forms
                setProductDetails({
                    name: '',
                    category: '',
                    price: '',
                    quantity: '',
                    sku: '',
                    description: '',
                });
                setOrderDetails({
                    orderId: '',
                    customerName: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    country: '',
                });
                setShippingDetails({
                    trackingNumber: '',
                    carrier: '',
                    estimatedDelivery: '',
                    currentStatus: 'Pending',
                    notes: '',
                });
            }, 2000);
        } catch (err) {
            setError('Failed to submit details. Please try again.');
            console.error('Submission error:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-slate-900 capitalize">
                        Insert {type} Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Success Message */}
                    {submitted && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold text-center">
                            ✓ {type.charAt(0).toUpperCase() + type.slice(1)} details submitted successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold">
                            ⚠ {error}
                        </div>
                    )}

                    {/* Product Form */}
                    {type === 'product' && (
                        <div className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productDetails.name}
                                    onChange={handleProductChange}
                                    placeholder="e.g., Pro Laptop 15"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={productDetails.category}
                                        onChange={handleProductChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Computers">Computers</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Displays">Displays</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Tablets">Tablets</option>
                                        <option value="Peripherals">Peripherals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productDetails.price}
                                        onChange={handleProductChange}
                                        placeholder="e.g., 1299.99"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Quantity & SKU */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Quantity in Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={productDetails.quantity}
                                        onChange={handleProductChange}
                                        placeholder="e.g., 50"
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        SKU (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={productDetails.sku}
                                        onChange={handleProductChange}
                                        placeholder="e.g., PLT-15-001"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={productDetails.description}
                                    onChange={handleProductChange}
                                    placeholder="Enter product description..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Order Form */}
                    {type === 'order' && (
                        <div className="space-y-4">
                            {/* Order ID & Customer Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Order ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="orderId"
                                        value={orderDetails.orderId}
                                        onChange={handleOrderChange}
                                        placeholder="e.g., ORD-2025-001"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={orderDetails.customerName}
                                        onChange={handleOrderChange}
                                        placeholder="e.g., John Doe"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={orderDetails.email}
                                        onChange={handleOrderChange}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={orderDetails.phone}
                                        onChange={handleOrderChange}
                                        placeholder="+63 9XX XXX XXXX"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={orderDetails.address}
                                    onChange={handleOrderChange}
                                    placeholder="e.g., 123 Main Street"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* City, Postal Code, Country */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={orderDetails.city}
                                        onChange={handleOrderChange}
                                        placeholder="e.g., Manila"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={orderDetails.postalCode}
                                        onChange={handleOrderChange}
                                        placeholder="e.g., 1000"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={orderDetails.country}
                                        onChange={handleOrderChange}
                                        placeholder="e.g., Philippines"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Form */}
                    {type === 'shipping' && (
                        <div className="space-y-4">
                            {/* Tracking Number & Carrier */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Tracking Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        value={shippingDetails.trackingNumber}
                                        onChange={handleShippingChange}
                                        placeholder="e.g., 1Z999AA10123456784"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Carrier *
                                    </label>
                                    <select
                                        name="carrier"
                                        value={shippingDetails.carrier}
                                        onChange={handleShippingChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Carrier</option>
                                        <option value="FedEx">FedEx</option>
                                        <option value="UPS">UPS</option>
                                        <option value="DHL">DHL</option>
                                        <option value="GCash">GCash</option>
                                        <option value="Lalamove">Lalamove</option>
                                        <option value="JRS Express">JRS Express</option>
                                    </select>
                                </div>
                            </div>

                            {/* Estimated Delivery & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Estimated Delivery *
                                    </label>
                                    <input
                                        type="date"
                                        name="estimatedDelivery"
                                        value={shippingDetails.estimatedDelivery}
                                        onChange={handleShippingChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Current Status
                                    </label>
                                    <select
                                        name="currentStatus"
                                        value={shippingDetails.currentStatus}
                                        onChange={handleShippingChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="In Transit">In Transit</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Delayed">Delayed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Shipping Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={shippingDetails.notes}
                                    onChange={handleShippingChange}
                                    placeholder="Enter any additional notes..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitted}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {submitted ? '✓ Submitted' : `Submit ${type.charAt(0).toUpperCase() + type.slice(1)} Details`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
