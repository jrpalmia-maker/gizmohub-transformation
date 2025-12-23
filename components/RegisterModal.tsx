import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX } from './Icons';

export const RegisterModal: React.FC<{ isOpen: boolean; onClose: () => void; onRegisterSuccess: () => void }> = ({ isOpen, onClose, onRegisterSuccess }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            
            // Check password strength when password field changes
            if (name === 'password') {
                checkPasswordStrength(value);
            }
        }
    };

    const checkPasswordStrength = (password: string) => {
        if (password.length < 6) setPasswordStrength('weak');
        else if (password.length < 8) setPasswordStrength('fair');
        else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) setPasswordStrength('strong');
        else setPasswordStrength('good');
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return 'text-red-600 bg-red-50';
            case 'fair': return 'text-orange-600 bg-orange-50';
            case 'good': return 'text-blue-600 bg-blue-50';
            case 'strong': return 'text-green-600 bg-green-50';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
            setError('Please fill in all required fields (marked with *)');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to the Terms & Conditions');
            return;
        }

        // Validate phone number if provided
        // Accept formats: +63 9XX XXX XXXX, +639XXXXXXXX, 09XX XXX XXXX, 09XXXXXXXX, or any 10-13 digits
        if (formData.phone && !/^(\+63|0)?9\d{9,10}$|^(\+63\s9|09)\d{8,9}$/.test(formData.phone.replace(/\s|-/g, ''))) {
            setError('Please enter a valid Philippine cellphone number (e.g., +63 9XX XXX XXXX or 09XX XXX XXXX)');
            return;
        }

        setLoading(true);
        try {
            await register(
                formData.email,
                formData.firstName,
                formData.lastName,
                formData.password,
                formData.phone
            );
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                setFormData({ 
                    email: '', 
                    firstName: '', 
                    lastName: '', 
                    phone: '', 
                    address: '',
                    password: '', 
                    confirmPassword: '', 
                    agreeToTerms: false 
                });
                onRegisterSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-xs text-slate-500 mt-1">Join Gizmohub today</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-3">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                    </div>

                    {/* Cellphone Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Cellphone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+63 9XX XXX XXXX or 09XX XXX XXXX"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                        <p className="text-xs text-slate-500 mt-1">🇵🇭 Format: +63 (country code) or local format. Will be used as login option</p>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Address (Optional)
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main St, City, State 12345"
                            rows={2}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm resize-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-500">Min. 6 characters</p>
                            {formData.password && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPasswordStrengthColor()}`}>
                                    Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            ✅ {success}
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-2 pt-2">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="w-4 h-4 mt-1 cursor-pointer"
                        />
                        <label className="text-xs text-slate-600 cursor-pointer">
                            I agree to the <span className="text-blue-600 font-semibold">Terms & Conditions</span> and <span className="text-blue-600 font-semibold">Privacy Policy</span> *
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all mt-4"
                    >
                        {loading ? '🔄 Creating Account...' : '✨ Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};
