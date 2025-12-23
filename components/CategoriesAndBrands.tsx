import React, { useState, useEffect } from 'react';
import { categoriesService, brandsService, productsService } from '../services/api';

interface Category {
    category_id: number | string;
    name: string;
}

interface Brand {
    brand_id: number | string;
    name: string;
}

interface Product {
    product_id: string;
    name: string;
    price: number;
    category_name: string;
    brand_name: string;
    stock: number;
}

export const CategoriesAndBrands: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories and brands on mount
    useEffect(() => {
        fetchCategoriesAndBrands();
    }, []);

    const fetchCategoriesAndBrands = async () => {
        try {
            setError('');
            console.log('Fetching categories and brands...');
            const [categoriesData, brandsData] = await Promise.all([
                categoriesService.getAll(),
                brandsService.getAll(),
            ]);
            console.log('Categories fetched:', categoriesData);
            console.log('Brands fetched:', brandsData);
            setCategories(categoriesData);
            setBrands(brandsData);
        } catch (err) {
            const errorMsg = 'Failed to load categories and brands';
            setError(errorMsg);
            console.error('Error fetching categories/brands:', err);
        } finally {
            setLoadingCategories(false);
            setLoadingBrands(false);
        }
    };

    // Fetch products when category or brand changes
    useEffect(() => {
        if (selectedCategory || selectedBrand) {
            fetchProductsByFilter();
        } else {
            setProducts([]);
        }
    }, [selectedCategory, selectedBrand]);

    const fetchProductsByFilter = async () => {
        try {
            setLoadingProducts(true);
            setError('');
            let productsData: Product[];
            
            console.log('Fetching products... selectedCategory:', selectedCategory, 'selectedBrand:', selectedBrand);

            if (selectedCategory) {
                console.log('Fetching by category:', selectedCategory);
                productsData = await productsService.getByCategory(selectedCategory);
            } else if (selectedBrand) {
                console.log('Fetching by brand:', selectedBrand);
                productsData = await productsService.getByBrand(selectedBrand);
            } else {
                productsData = [];
            }

            console.log('Products fetched:', productsData);
            setProducts(productsData);
        } catch (err) {
            const errorMsg = 'Failed to load products';
            setError(errorMsg);
            console.error('Error fetching products:', err);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleCategoryClick = (categoryId: number | string) => {
        const idStr = String(categoryId);
        console.log('Category clicked:', categoryId, 'String version:', idStr);
        setSelectedCategory(selectedCategory === idStr ? null : idStr);
        setSelectedBrand(null); // Clear brand filter
    };

    const handleBrandClick = (brandId: number | string) => {
        const idStr = String(brandId);
        console.log('Brand clicked:', brandId, 'String version:', idStr);
        setSelectedBrand(selectedBrand === idStr ? null : idStr);
        setSelectedCategory(null); // Clear category filter
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setProducts([]);
    };

    return (
        <div id="categories-brands" className="py-20 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">
                {/* Debug Info */}
                <div className="bg-yellow-50 p-4 rounded mb-6 text-xs font-mono border border-yellow-200">
                    <div className="font-bold mb-2">DEBUG INFO:</div>
                    <div>selectedCategory: {selectedCategory || 'null'}</div>
                    <div>selectedBrand: {selectedBrand || 'null'}</div>
                    <div>loadingProducts: {loadingProducts ? 'true' : 'false'}</div>
                    <div>products.length: {products.length}</div>
                    <div>error: {error || 'none'}</div>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Browse by Category & Brand
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Filter our product catalog by category or brand to find exactly what you're looking for.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Categories Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Categories</h3>

                            {loadingCategories ? (
                                <div className="text-slate-500 text-sm">Loading categories...</div>
                            ) : categories.length === 0 ? (
                                <div className="text-slate-500 text-sm">No categories available</div>
                            ) : (
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.category_id}
                                            onClick={() => handleCategoryClick(category.category_id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                                                selectedCategory === category.category_id
                                                    ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                                                    : 'hover:bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="border-t border-slate-200 my-4 pt-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Brands</h3>

                                {loadingBrands ? (
                                    <div className="text-slate-500 text-sm">Loading brands...</div>
                                ) : brands.length === 0 ? (
                                    <div className="text-slate-500 text-sm">No brands available</div>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {brands.map((brand) => (
                                            <button
                                                key={brand.brand_id}
                                                onClick={() => handleBrandClick(brand.brand_id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                                                    selectedBrand === brand.brand_id
                                                        ? 'bg-green-100 text-green-700 font-semibold border-l-4 border-green-600'
                                                        : 'hover:bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {brand.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(selectedCategory || selectedBrand) && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full mt-4 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="md:col-span-3">
                        {selectedCategory || selectedBrand ? (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        {selectedCategory
                                            ? `Products in ${categories.find((c) => c.category_id === selectedCategory)?.name}`
                                            : `Products by ${brands.find((b) => b.brand_id === selectedBrand)?.name}`}
                                    </h3>
                                    <p className="text-slate-600">
                                        {loadingProducts ? 'Loading products...' : `${products.length} product(s) found`}
                                    </p>
                                </div>

                                {loadingProducts ? (
                                    <div className="text-center py-12">
                                        <div className="text-slate-500">Loading products...</div>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-slate-500 text-lg">No products found</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <div
                                                key={product.product_id}
                                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                            >
                                                <div className="p-4">
                                                    {/* Product Header */}
                                                    <div className="mb-3">
                                                        <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
                                                            {product.category_name}
                                                        </div>
                                                        {product.brand_name && (
                                                            <div className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                                                                {product.brand_name}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Name */}
                                                    <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                                                        {product.name}
                                                    </h4>

                                                    {/* Price & Stock */}
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        <span className={`text-sm font-semibold ${
                                                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                        </span>
                                                    </div>

                                                    {/* View Details Button */}
                                                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-slate-500 text-lg">
                                    👈 Select a category or brand to view products
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
