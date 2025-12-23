import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProductDetailModal } from './ProductDetailModal';
import { CategoryGrid } from './CategoryGrid';

const API_BASE_URL = 'http://localhost:5000/api';

interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

interface Product {
    product_id: number;
    name: string;
    price: string | number;
    stock: number;
    category_name?: string;
    brand_name?: string;
    description?: string;
    image?: string;
    specification?: string;
    reasons_to_buy?: string;
    reasons_to_avoid?: string;
}

export const ProductBrowser: React.FC = () => {
    const { user, addToCart, cartItems } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    // Load categories and brands on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, brandsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/categories`),
                    fetch(`${API_BASE_URL}/brands`),
                ]);
                
                const cats = await catsRes.json();
                const bnds = await brandsRes.json();
                
                console.log('Categories loaded:', cats);
                console.log('Brands loaded:', bnds);
                
                setCategories(Array.isArray(cats) ? cats : []);
                setBrands(Array.isArray(bnds) ? bnds : []);
            } catch (err) {
                console.error('Error loading categories/brands:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Load products when category or brand changes
    useEffect(() => {
        if (selectedCategoryId) {
            loadProducts('category', selectedCategoryId);
        } else if (selectedBrandId) {
            loadProducts('brand', selectedBrandId);
        } else {
            setProducts([]);
        }
    }, [selectedCategoryId, selectedBrandId]);

    const loadProducts = async (type: 'category' | 'brand', id: number) => {
        setLoadingProducts(true);
        try {
            const url = type === 'category' 
                ? `${API_BASE_URL}/products/category/${id}`
                : `${API_BASE_URL}/products/brand/${id}`;
            
            const res = await fetch(url);
            const data = await res.json();
            console.log(`Products loaded (${type}):`, data);
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading products:', err);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    if (loading) {
        return (
            <div id="categories-brands" className="py-16 bg-slate-50 min-h-screen">
                <div className="container mx-auto px-4 text-center text-slate-600">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div id="categories-brands">
            {/* Category Grid Section */}
            <CategoryGrid 
                onSelectCategory={(categoryId, categoryName) => {
                    setSelectedCategoryId(categoryId);
                    setSelectedBrandId(null);
                    // Scroll to products section
                    setTimeout(() => {
                        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }}
            />

            {/* Main Product Browser Section */}
            <div className="py-16 bg-slate-50 min-h-screen">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Product Catalog</h2>

                    {/* Cart Message */}
                    {cartMessage && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {cartMessage}
                        </div>
                    )}

                    {/* Login Prompt */}
                    {!user && (
                        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                            <strong>Note:</strong> You need to login to add items to cart. Please login or register first.
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                        {/* Categories */}
                        <div className="bg-white rounded shadow-lg p-6 border-l-4 border-blue-600">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Categories ({categories.length})
                            </h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.category_id}
                                        onClick={() => {
                                            setSelectedCategoryId(selectedCategoryId === cat.category_id ? null : cat.category_id);
                                            setSelectedBrandId(null);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded font-medium transition-all ${
                                            selectedCategoryId === cat.category_id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-900 hover:bg-blue-100'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="bg-white rounded shadow-lg p-6 border-l-4 border-green-600">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Brands ({brands.length})
                            </h3>
                            <div className="space-y-2">
                                {brands.map((brand) => (
                                    <button
                                        key={brand.brand_id}
                                        onClick={() => {
                                            setSelectedBrandId(selectedBrandId === brand.brand_id ? null : brand.brand_id);
                                            setSelectedCategoryId(null);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded font-medium transition-all ${
                                            selectedBrandId === brand.brand_id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-100 text-slate-900 hover:bg-green-100'
                                        }`}
                                    >
                                        {brand.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="lg:col-span-3">
                        {loadingProducts && (
                            <div className="text-center py-12 text-slate-600">
                                Loading products...
                            </div>
                        )}

                        {!loadingProducts && !selectedCategoryId && !selectedBrandId && (
                            <div className="bg-white rounded shadow-lg p-12 text-center">
                                <p className="text-xl text-slate-600">👈 Select a category or brand</p>
                            </div>
                        )}

                        {!loadingProducts && (selectedCategoryId || selectedBrandId) && products.length === 0 && (
                            <div className="bg-white rounded shadow-lg p-12 text-center">
                                <p className="text-lg text-slate-600">No products found</p>
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {products.map((product) => (
                                    <div key={product.product_id} className="bg-white rounded shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                                            {product.category_name && (
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                    {product.category_name}
                                                </span>
                                            )}
                                            {product.brand_name && (
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                    {product.brand_name}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h4>

                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-sm text-slate-600">Price</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600">Stock</p>
                                                <p className={`text-xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.stock}
                                                </p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowDetailModal(true);
                                            }}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                <ProductDetailModal 
                    isOpen={showDetailModal}
                    product={selectedProduct}
                    isAuthenticated={!!user}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedProduct(null);
                    }}
                    onAddToCart={async (product, quantity) => {
                        try {
                            if (!user) {
                                setCartMessage('Please login to add items to cart');
                                setTimeout(() => setCartMessage(''), 3000);
                                return;
                            }

                            // Add to cart using AuthContext
                            for (let i = 0; i < quantity; i++) {
                                await addToCart({
                                    id: String(product.product_id),
                                    name: product.name,
                                    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                                    category: product.category_name || 'Products',
                                    product_id: String(product.product_id),
                                });
                            }

                            setCartMessage(`Added ${quantity}x ${product.name} to cart!`);
                            setTimeout(() => setCartMessage(''), 3000);
                            setShowDetailModal(false);
                            setSelectedProduct(null);
                        } catch (err) {
                            console.error('Error adding to cart:', err);
                            setCartMessage('Failed to add to cart');
                            setTimeout(() => setCartMessage(''), 3000);
                        }
                    }}
                />
            </div>
        </div>
    );
};


