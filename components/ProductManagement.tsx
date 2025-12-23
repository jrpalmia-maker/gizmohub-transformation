import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Product {
    product_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    category_id: number;
    brand_id: number;
    specifications?: string;
    pros?: string;
    cons?: string;
}

interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

export const ProductManagement: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands'>('products');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form states
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: '',
        category_id: '',
        brand_id: '',
        specifications: '',
        pros: '',
        cons: '',
    });

    const [newCategory, setNewCategory] = useState('');
    const [newBrand, setNewBrand] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Load data
    useEffect(() => {
        loadProducts();
        loadCategories();
        loadBrands();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading products:', err);
            setMessage('Failed to load products');
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadBrands = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/brands`);
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading brands:', err);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                image: newProduct.image,
                category_id: parseInt(newProduct.category_id),
                brand_id: parseInt(newProduct.brand_id),
                specifications: newProduct.specifications,
                pros: newProduct.pros,
                cons: newProduct.cons,
            };

            const url = editingProduct 
                ? `${API_BASE_URL}/products/${editingProduct.product_id}`
                : `${API_BASE_URL}/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage(editingProduct ? '✓ Product updated!' : '✓ Product added!');
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    image: '',
                    category_id: '',
                    brand_id: '',
                    specifications: '',
                    pros: '',
                    cons: '',
                });
                setEditingProduct(null);
                loadProducts();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('✗ Failed to save product');
            }
        } catch (err) {
            console.error('Error saving product:', err);
            setMessage('✗ Error saving product');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Delete this product?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('✓ Product deleted!');
                loadProducts();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            setMessage('✗ Error deleting product');
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const res = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });

            if (res.ok) {
                setMessage('✓ Category added!');
                setNewCategory('');
                loadCategories();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error adding category:', err);
            setMessage('✗ Error adding category');
        }
    };

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrand.trim()) return;

        try {
            const res = await fetch(`${API_BASE_URL}/brands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBrand }),
            });

            if (res.ok) {
                setMessage('✓ Brand added!');
                setNewBrand('');
                loadBrands();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error adding brand:', err);
            setMessage('✗ Error adding brand');
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="text-center text-slate-600">
                You do not have permission to access product management.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded ${message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                        activeTab === 'products'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Products ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                        activeTab === 'categories'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Categories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                        activeTab === 'brands'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Brands ({brands.length})
                </button>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    {/* Add/Edit Product Form */}
                    <form onSubmit={handleAddProduct} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                step="0.01"
                                className="px-3 py-2 border border-slate-300 rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Image filename (e.g., product.jpg)"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded"
                            />
                            <select
                                value={newProduct.category_id}
                                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newProduct.brand_id}
                                onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded"
                                required
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded mt-4"
                            rows={3}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <textarea
                                placeholder="Specifications (JSON)"
                                value={newProduct.specifications}
                                onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded text-sm"
                                rows={2}
                            />
                            <textarea
                                placeholder="Pros"
                                value={newProduct.pros}
                                onChange={(e) => setNewProduct({ ...newProduct, pros: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded text-sm"
                                rows={2}
                            />
                            <textarea
                                placeholder="Cons"
                                value={newProduct.cons}
                                onChange={(e) => setNewProduct({ ...newProduct, cons: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded text-sm"
                                rows={2}
                            />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setNewProduct({
                                            name: '',
                                            description: '',
                                            price: '',
                                            stock: '',
                                            image: '',
                                            category_id: '',
                                            brand_id: '',
                                            specifications: '',
                                            pros: '',
                                            cons: '',
                                        });
                                    }}
                                    className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white font-semibold rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Products List */}
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div key={product.product_id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900">{product.name}</h4>
                                    <p className="text-sm text-slate-600">${product.price} | Stock: {product.stock}</p>
                                    <p className="text-sm text-slate-600 mt-1">{product.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setNewProduct({
                                                name: product.name,
                                                description: product.description,
                                                price: product.price,
                                                stock: String(product.stock),
                                                image: product.image,
                                                category_id: String(product.category_id),
                                                brand_id: String(product.brand_id),
                                                specifications: product.specifications || '',
                                                pros: product.pros || '',
                                                cons: product.cons || '',
                                            });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.product_id)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="space-y-4">
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                        >
                            Add
                        </button>
                    </form>
                    <div className="grid gap-2">
                        {categories.map((cat) => (
                            <div key={cat.category_id} className="bg-slate-50 p-3 rounded border border-slate-200">
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Brands Tab */}
            {activeTab === 'brands' && (
                <div className="space-y-4">
                    <form onSubmit={handleAddBrand} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Brand Name"
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                        >
                            Add
                        </button>
                    </form>
                    <div className="grid gap-2">
                        {brands.map((brand) => (
                            <div key={brand.brand_id} className="bg-slate-50 p-3 rounded border border-slate-200">
                                {brand.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
