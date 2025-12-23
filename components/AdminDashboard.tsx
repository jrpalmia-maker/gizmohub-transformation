import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconServer, IconDatabase } from './Icons';

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, cartItems } = useAuth();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [inventory, setInventory] = useState([
        { id: '1', name: 'Pro Laptop 15"', stock: 45, sold: 120 },
        { id: '2', name: 'Wireless Headphones', stock: 128, sold: 310 },
        { id: '3', name: 'Gaming Monitor 4K', stock: 22, sold: 89 },
        { id: '4', name: 'USB-C Hub', stock: 156, sold: 401 },
        { id: '5', name: 'Tablet Pro 12"', stock: 34, sold: 156 },
        { id: '6', name: 'Mechanical Keyboard', stock: 89, sold: 234 },
    ]);

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePicture(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const totalRevenue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalProducts = inventory.reduce((sum, p) => sum + p.stock, 0);
    const totalSold = inventory.reduce((sum, p) => sum + p.sold, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        {/* Profile Picture */}
                        <label className="cursor-pointer relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden hover:opacity-80 transition-opacity">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Admin" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase() || 'A'
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />
                            <span className="absolute bottom-0 right-0 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Edit</span>
                        </label>
                        
                        {/* Admin Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Admin'}</h2>
                            <p className="text-sm text-slate-600 mt-1">Admin • Dashboard Manager</p>
                            <p className="text-xs text-slate-500 mt-2">👨‍💻 Developer: John Ron Paul Almia</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Stats */}
                <div className="p-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <IconServer className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">Total Products</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{totalProducts}</p>
                        <p className="text-xs text-blue-600 mt-1">Units in stock</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <IconDatabase className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Total Sold</span>
                        </div>
                        <p className="text-3xl font-bold text-green-900">{totalSold}</p>
                        <p className="text-xs text-green-600 mt-1">All time sales</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">💰</span>
                            <span className="text-sm font-semibold text-purple-700">Cart Revenue</span>
                        </div>
                        <p className="text-3xl font-bold text-purple-900">${totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-purple-600 mt-1">Current session</p>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="p-6 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Inventory Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-300">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Product</th>
                                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Stock</th>
                                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Sold</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-slate-900 font-medium">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-700 font-semibold">
                                            {product.stock}
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-700">
                                            {product.sold}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    product.stock > 50
                                                        ? 'bg-green-100 text-green-700'
                                                        : product.stock > 20
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {product.stock > 50
                                                    ? '✓ In Stock'
                                                    : product.stock > 20
                                                    ? '⚠ Low Stock'
                                                    : '✗ Critical'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Features Info */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                    <h4 className="font-semibold text-slate-900 mb-3">Admin Features Available:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                        <li>✓ Real-time inventory tracking</li>
                        <li>✓ Sales analytics</li>
                        <li>✓ Product management</li>
                        <li>✓ Order monitoring</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
