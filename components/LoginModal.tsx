import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX } from './Icons';

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onSignUpClick?: () => void }> = ({ isOpen, onClose, onSignUpClick }) => {
    const { login } = useAuth();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [credentialType, setCredentialType] = useState<'email' | 'username' | 'phone'>('email');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!credential || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            // Pass credential as email to backend (backend handles phone/username lookup)
            await login(credential, password, role);
            setCredential('');
            setPassword('');
            onClose();
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">Login</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Login As
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="user"
                                    checked={role === 'user'}
                                    onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                                    className="w-4 h-4"
                                />
                                <span className="text-slate-700">Customer</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                                    className="w-4 h-4"
                                />
                                <span className="text-slate-700">Admin</span>
                            </label>
                        </div>
                    </div>

                    {/* Credential Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Login With
                        </label>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                                <input
                                    type="radio"
                                    value="email"
                                    checked={credentialType === 'email'}
                                    onChange={(e) => setCredentialType(e.target.value as 'email' | 'username' | 'phone')}
                                    className="w-4 h-4"
                                />
                                <span className="text-slate-700 text-sm">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                                <input
                                    type="radio"
                                    value="username"
                                    checked={credentialType === 'username'}
                                    onChange={(e) => setCredentialType(e.target.value as 'email' | 'username' | 'phone')}
                                    className="w-4 h-4"
                                />
                                <span className="text-slate-700 text-sm">Username</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                                <input
                                    type="radio"
                                    value="phone"
                                    checked={credentialType === 'phone'}
                                    onChange={(e) => setCredentialType(e.target.value as 'email' | 'username' | 'phone')}
                                    className="w-4 h-4"
                                />
                                <span className="text-slate-700 text-sm">Cellphone</span>
                            </label>
                        </div>
                    </div>

                    {/* Credential Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">
                            {credentialType === 'email' && 'Email'}
                            {credentialType === 'username' && 'Username'}
                            {credentialType === 'phone' && 'Cellphone Number'}
                        </label>
                        <input
                            type={credentialType === 'email' ? 'email' : 'text'}
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            placeholder={
                                credentialType === 'email' ? 'your@email.com' :
                                credentialType === 'username' ? 'your_username' :
                                '+63 9XX XXX XXXX or 09XX XXX XXXX'
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Min. 6 characters</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Demo Credentials */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                        <p className="font-semibold mb-2">Demo Credentials:</p>
                        <p className="mb-1">📧 Email: demo@gizmohub.com</p>
                        <p className="mb-1">🔐 Password: demo123</p>
                        <p className="text-blue-600 mt-2 italic">💡 Tip: You can also login using your username or phone number!</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    >
                        Sign In
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    onSignUpClick?.();
                                    onClose();
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
