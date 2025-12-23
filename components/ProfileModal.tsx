import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconServer, IconDatabase, IconX } from './Icons';
import { ProductManagement } from './ProductManagement';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'profile' | 'security' | 'preferences' | 'activity' | 'pim';

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, logout, cartItems } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        bio: '',
        company: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        twoFactorAuth: false,
    });

    if (!isOpen || !user) return null;

    const isAdmin = user.role === 'admin';

    // Admin stats
    const adminStats = {
        totalProducts: 874,
        totalSold: 2410,
        cartRevenue: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement backend endpoint to update profile
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }
        setSaving(true);
        try {
            // TODO: Implement backend endpoint to change password
            setSuccessMessage('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePreferences = async () => {
        setSaving(true);
        try {
            // TODO: Implement backend endpoint to save preferences
            setSuccessMessage('Preferences saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to save preferences');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        {/* Profile Picture */}
                        <label className="cursor-pointer relative">
                            <div className={`${isAdmin ? 'w-16 h-16' : 'w-14 h-14'} bg-gradient-to-br ${isAdmin ? 'from-purple-400 to-purple-600' : 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center text-white ${isAdmin ? 'text-2xl' : 'text-xl'} font-bold overflow-hidden hover:opacity-80 transition-opacity`}>
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || (isAdmin ? 'A' : 'U')
                                )}
                            </div>
                            {isEditing && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />
                                    <span className="absolute bottom-0 right-0 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Edit</span>
                                </>
                            )}
                        </label>

                        {/* User Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.name || 'User'}</h2>
                            <p className="text-sm text-slate-600 mt-1">
                                {isAdmin ? '👨‍💼 Administrator' : '👤 Customer'} • {user.email}
                            </p>
                            {isAdmin && (
                                <p className="text-xs text-slate-500 mt-2">👨‍💻 Developer: John Ron Paul Almia</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <IconX className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 border-b border-slate-200 bg-slate-50">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-3 font-semibold text-sm transition-colors ${
                            activeTab === 'profile'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        👤 Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-3 font-semibold text-sm transition-colors ${
                            activeTab === 'security'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        🔒 Security
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`px-4 py-3 font-semibold text-sm transition-colors ${
                            activeTab === 'preferences'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        ⚙️ Preferences
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-4 py-3 font-semibold text-sm transition-colors ${
                                    activeTab === 'activity'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                📊 Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('pim')}
                                className={`px-4 py-3 font-semibold text-sm transition-colors ${
                                    activeTab === 'pim'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                📦 Products
                            </button>
                        </>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                        ✓ {successMessage}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Admin Stats */}
                            {isAdmin && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <IconServer className="w-6 h-6 text-blue-600" />
                                            <span className="text-sm font-semibold text-blue-700">Total Products</span>
                                        </div>
                                        <p className="text-3xl font-bold text-blue-900">{adminStats.totalProducts}</p>
                                        <p className="text-xs text-blue-600 mt-1">Units in stock</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <IconDatabase className="w-6 h-6 text-green-600" />
                                            <span className="text-sm font-semibold text-green-700">Total Sold</span>
                                        </div>
                                        <p className="text-3xl font-bold text-green-900">{adminStats.totalSold}</p>
                                        <p className="text-xs text-green-600 mt-1">All time sales</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xl">💰</span>
                                            <span className="text-sm font-semibold text-purple-700">Revenue</span>
                                        </div>
                                        <p className="text-3xl font-bold text-purple-900">${adminStats.cartRevenue.toFixed(2)}</p>
                                        <p className="text-xs text-purple-600 mt-1">Current session</p>
                                    </div>
                                </div>
                            )}

                            {/* Account Type */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <span className="text-sm font-semibold text-slate-600">Account Type</span>
                                <span className={`px-4 py-2 text-xs font-semibold rounded-full capitalize ${
                                    isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {user.role}
                                </span>
                            </div>

                            {/* Profile Info */}
                            {!isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide">Name</p>
                                            <p className="text-slate-900 font-medium mt-1">{formData.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                                            <p className="text-slate-900 font-medium mt-1">{formData.email}</p>
                                        </div>
                                    </div>

                                    {!isAdmin && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                                                    <p className="text-slate-900 mt-1">{formData.phone || 'Not set'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Company</p>
                                                    <p className="text-slate-900 mt-1">{formData.company || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Bio</p>
                                                <p className="text-slate-900 mt-1">{formData.bio || 'No bio added'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Address</p>
                                                <p className="text-slate-900 mt-1 whitespace-pre-wrap">{formData.address || 'Not provided'}</p>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        ✏️ Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-2">Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {!isAdmin && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Company</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        placeholder="Your company"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-600 mb-2">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    placeholder="Tell us about yourself"
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-600 mb-2">Address</label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Street, City, State, ZIP"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            {saving ? 'Saving...' : '💾 Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="At least 6 characters"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors mt-4"
                                >
                                    {saving ? 'Updating...' : '🔑 Change Password'}
                                </button>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="font-semibold text-slate-900 mb-3">Active Sessions</h4>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-slate-700">💻 Current Session</p>
                                    <p className="text-xs text-slate-500 mt-1">Last active: Just now</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Notification & Privacy Settings</h3>
                            
                            <div className="space-y-4">
                                {Object.entries(preferences).map(([key, value]) => (
                                    <label key={key} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={() => handlePreferenceChange(key as keyof typeof preferences)}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {key === 'emailNotifications' && '📧 Email Notifications'}
                                                {key === 'smsNotifications' && '📱 SMS Notifications'}
                                                {key === 'marketingEmails' && '📢 Marketing Emails'}
                                                {key === 'twoFactorAuth' && '🔐 Two-Factor Authentication'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {key === 'emailNotifications' && 'Get notified about orders and updates'}
                                                {key === 'smsNotifications' && 'Receive text messages for important alerts'}
                                                {key === 'marketingEmails' && 'Receive promotions and special offers'}
                                                {key === 'twoFactorAuth' && 'Add extra security to your account'}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={handleSavePreferences}
                                disabled={saving}
                                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors mt-6"
                            >
                                {saving ? 'Saving...' : '💾 Save Preferences'}
                            </button>
                        </div>
                    )}

                    {/* ACTIVITY TAB - Admin Only */}
                    {activeTab === 'activity' && isAdmin && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                            
                            <div className="space-y-3">
                                {[
                                    { time: '2 hours ago', action: 'Logged in', type: 'login' },
                                    { time: '5 hours ago', action: 'Updated inventory', type: 'update' },
                                    { time: '1 day ago', action: 'New order from customer', type: 'order' },
                                    { time: '2 days ago', action: 'Product price changed', type: 'update' },
                                ].map((activity, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            {activity.type === 'login' && '🔓'}
                                            {activity.type === 'update' && '✏️'}
                                            {activity.type === 'order' && '🛒'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{activity.action}</p>
                                            <p className="text-xs text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-slate-700">📊 Total Admin Actions: 1,247</p>
                                <p className="text-xs text-slate-500 mt-1">Since account creation</p>
                            </div>
                        </div>
                    )}

                    {/* PRODUCT MANAGEMENT TAB - Admin Only */}
                    {activeTab === 'pim' && isAdmin && (
                        <ProductManagement />
                    )}
                </div>

                {/* Footer - Logout Button */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl sticky bottom-0">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
