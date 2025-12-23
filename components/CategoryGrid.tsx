import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

interface Category {
    category_id: number;
    name: string;
    description: string;
}

interface CategoryGridProps {
    onSelectCategory: (categoryId: number, categoryName: string) => void;
}

// Category icons/emojis
const categoryIcons: { [key: string]: string } = {
    'Smartphones': '📱',
    'Laptops': '💻',
    'Tablets': '📱',
    'Accessories': '🎧',
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                const data = await res.json();
                console.log('Categories loaded:', data);
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error loading categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="py-8 text-center text-slate-600">
                Loading categories...
            </div>
        );
    }

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.category_id}
                            onClick={() => onSelectCategory(category.category_id, category.name)}
                            className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            {/* Category Icon */}
                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {categoryIcons[category.name] || '📦'}
                            </div>

                            {/* Category Name */}
                            <h3 className="text-center font-bold text-slate-900 text-sm md:text-base group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>

                            {/* Hover Effect */}
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 font-semibold">
                                Browse →
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
