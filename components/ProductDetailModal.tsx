import React, { useState, useEffect } from 'react';
import { IconX } from './Icons';

interface Product {
    product_id: number;
    name: string;
    price: string | number;
    stock: number;
    description: string;
    category_name?: string;
    brand_name?: string;
    image?: string;
    specification?: string;
    reasons_to_buy?: string;
    reasons_to_avoid?: string;
}

interface ProductDetailModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onAddToCart?: (product: Product, quantity: number) => void;
    isAuthenticated?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    isOpen,
    product,
    onClose,
    onAddToCart,
    isAuthenticated = false,
}) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const specifications = product.specification
        ? product.specification.split('|').map(spec => spec.trim())
        : [];

    const reasonsToBuy = product.reasons_to_buy
        ? product.reasons_to_buy.split(',').map(reason => reason.trim())
        : [];

    const reasonsToAvoid = product.reasons_to_avoid
        ? product.reasons_to_avoid.split('-').map(reason => reason.trim()).filter(r => r)
        : [];

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product, quantity);
            setQuantity(1);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <IconX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Category and Brand Badges */}
                    <div className="flex flex-wrap gap-2">
                        {product.category_name && (
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                                {product.category_name}
                            </span>
                        )}
                        {product.brand_name && (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                {product.brand_name}
                            </span>
                        )}
                    </div>

                    {/* Image and Price Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image */}
                        <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                            {product.image ? (
                                <img
                                    src={`/brands image/${product.image}`}
                                    alt={product.name}
                                    className="max-w-full max-h-[300px] object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="text-center text-slate-500">
                                    <p className="text-lg">No image available</p>
                                </div>
                            )}
                        </div>

                        {/* Price and Stock */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="text-slate-600 text-sm mb-1">Price</p>
                                <p className="text-4xl font-bold text-blue-600 mb-6">
                                    ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                                </p>

                                <p className="text-slate-600 text-sm mb-1">Availability</p>
                                <div className="flex items-center gap-2 mb-6">
                                    <span
                                        className={`inline-block w-3 h-3 rounded-full ${
                                            product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    />
                                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {product.stock > 0
                                            ? `${product.stock} in stock`
                                            : 'Out of stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={product.stock === 0}
                                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))
                                            }
                                            disabled={product.stock === 0}
                                            className="w-16 px-2 py-2 border border-slate-300 rounded text-center disabled:opacity-50"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={product.stock === 0 || quantity >= product.stock}
                                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || !isAuthenticated}
                                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:bg-slate-400 transition-colors"
                                >
                                    {!isAuthenticated 
                                        ? 'Login to Add to Cart' 
                                        : product.stock > 0 
                                            ? 'Add to Cart' 
                                            : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-700 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {/* Specifications */}
                    {specifications.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {specifications.map((spec, idx) => (
                                    <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-200">
                                        <p className="text-slate-700 text-sm">{spec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reasons to Buy */}
                    {reasonsToBuy.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-green-700 mb-3">✓ Reasons to Buy</h3>
                            <ul className="space-y-2">
                                {reasonsToBuy.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                                        <span className="text-green-600 font-bold mt-1">✓</span>
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Reasons to Avoid */}
                    {reasonsToAvoid.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-red-700 mb-3">✗ Reasons to Avoid</h3>
                            <ul className="space-y-2">
                                {reasonsToAvoid.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                                        <span className="text-red-600 font-bold mt-1">✗</span>
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 text-slate-900 font-semibold rounded hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || !isAuthenticated}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:bg-slate-400 transition-colors"
                    >
                        {!isAuthenticated ? 'Login to Add' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};
