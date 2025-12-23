import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconSmartphone, IconServer, IconDatabase } from './Icons';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    inventory: number;
    rating: number;
    icon: React.ReactNode;
}

const products: Product[] = [
    {
        id: '1',
        name: 'Pro Laptop 15"',
        category: 'Computers',
        price: 1299.99,
        inventory: 45,
        rating: 4.8,
        icon: <IconServer className="w-8 h-8" />,
    },
    {
        id: '2',
        name: 'Wireless Headphones',
        category: 'Audio',
        price: 199.99,
        inventory: 128,
        rating: 4.6,
        icon: <IconSmartphone className="w-8 h-8" />,
    },
    {
        id: '3',
        name: 'Gaming Monitor 4K',
        category: 'Displays',
        price: 599.99,
        inventory: 22,
        rating: 4.9,
        icon: <IconDatabase className="w-8 h-8" />,
    },
    {
        id: '4',
        name: 'USB-C Hub',
        category: 'Accessories',
        price: 79.99,
        inventory: 156,
        rating: 4.5,
        icon: <IconSmartphone className="w-8 h-8" />,
    },
    {
        id: '5',
        name: 'Tablet Pro 12"',
        category: 'Tablets',
        price: 899.99,
        inventory: 34,
        rating: 4.7,
        icon: <IconDatabase className="w-8 h-8" />,
    },
    {
        id: '6',
        name: 'Mechanical Keyboard',
        category: 'Peripherals',
        price: 249.99,
        inventory: 89,
        rating: 4.8,
        icon: <IconServer className="w-8 h-8" />,
    },
];

export const ProductsSection: React.FC = () => {
    const { addToCart, isAuthenticated } = useAuth();
    const [addedProduct, setAddedProduct] = useState<string | null>(null);

    const handleAddToCart = (product: Product) => {
        if (!isAuthenticated) {
            alert('Please login first to add items to cart');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
        });
        setAddedProduct(product.id);
        setTimeout(() => setAddedProduct(null), 1500);
    };
    return (
        <div id="products" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Product Catalog</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Gizmohub Product Range</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Premium electronics and accessories with real-time inventory management powered by our new headless e-commerce platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div 
                            key={product.id}
                            className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all group"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 text-blue-600 transition-colors">
                                {product.icon}
                            </div>

                            {/* Category Badge */}
                            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                                {product.category}
                            </div>

                            {/* Product Name */}
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-400 text-sm">★</span>
                                <span className="ml-1 text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-slate-400 text-sm ml-1">(verified)</span>
                            </div>

                            {/* Price & Inventory */}
                            <div className="bg-white p-3 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600 text-sm">Price</span>
                                    <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 text-sm">In Stock</span>
                                    <span className={`font-semibold ${product.inventory > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {product.inventory} units
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(product)}
                                className={`w-full px-4 py-2 font-semibold rounded-lg transition-all ${
                                    addedProduct === product.id
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {addedProduct === product.id ? '✓ Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Real-time Sync Info */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">✓</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Real-Time Inventory Sync</h4>
                            <p className="text-slate-600">
                                All product data is synchronized in <span className="font-semibold text-green-600">&lt;5 seconds</span> across all channels. 
                                No more overselling or out-of-stock surprises. Customers see accurate availability instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
