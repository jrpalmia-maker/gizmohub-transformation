import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX } from './Icons';

export const CustomerProfile: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
    });
    const [saving, setSaving] = useState(false);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement backend endpoint to update customer profile
            // For now, just show success message
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

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

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="p-6 space-y-4">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2 overflow-hidden">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        {isEditing && (
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    className="hidden"
                                />
                                <span className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                                    Change Picture
                                </span>
                            </label>
                        )}
                    </div>

                    {/* User Role Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">Account Type</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                            {user.role}
                        </span>
                    </div>

                    {!isEditing ? (
                        <>
                            {/* View Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    Name
                                </label>
                                <p className="text-slate-900 font-medium">{formData.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    Email
                                </label>
                                <p className="text-slate-900">{formData.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    Phone
                                </label>
                                <p className="text-slate-900">{formData.phone || 'Not provided'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    Address
                                </label>
                                <p className="text-slate-900">{formData.address || 'Not provided'}</p>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Edit Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="555-1234"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St, City, State 12345"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Save/Cancel Buttons */}
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all mt-4"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
