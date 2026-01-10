import React, { useState, useEffect } from 'react';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ProductsSection } from './components/ProductsSection';
import { ProductBrowser } from './components/ProductBrowser';
import { ComparisonTable } from './components/ComparisonTable';
import { Timeline } from './components/Timeline';
import { ChatAssistant } from './components/ChatAssistant';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { ProfileModal } from './components/ProfileModal';
import { Cart } from './components/Cart';
import { InsertDetailsPage } from './components/InsertDetailsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NAV_LINKS } from './constants';

const AppContent: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInsertDetailsOpen, setIsInsertDetailsOpen] = useState(false);
    const [insertDetailsType, setInsertDetailsType] = useState<'product' | 'order' | 'shipping'>('product');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, cartItems } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen text-slate-800">
            {/* Modern Menubar */}
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200">
                <div className="container mx-auto px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-shadow">G</div>
                            <div>
                                <span className="font-bold text-xl text-slate-900 block">Gizmohub</span>
                                <span className="text-xs text-slate-500">Digital Store</span>
                            </div>
                        </div>

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Toggle Menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Navigation Menu - Desktop */}
                        <div className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map(link => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Right Side - User & Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="text-right pr-4 border-r border-slate-200">
                                        <div className="text-xs font-semibold text-blue-600">{user.role === 'admin' ? '👑 ADMIN' : '👤 CUSTOMER'}</div>
                                        <div className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{user.name || user.email || user.username}</div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    {user.role === 'user' && (
                                        <button
                                            onClick={() => setIsCartOpen(true)}
                                            className="relative p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                            title="Shopping Cart"
                                        >
                                            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
                                            {cartItems.length > 0 && (
                                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    {user.role === 'admin' && (
                                        <button
                                            onClick={() => setIsProfileOpen(true)}
                                            className="px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors text-sm font-semibold text-slate-700 hover:text-purple-600"
                                            title="Admin Dashboard"
                                        >
                                            📊 Dashboard
                                        </button>
                                    )}

                                    {user.role === 'admin' && (
                                        <div className="flex gap-2 border-l border-slate-200 pl-3">
                                            <button
                                                onClick={() => {
                                                    setInsertDetailsType('product');
                                                    setIsInsertDetailsOpen(true);
                                                }}
                                                className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                                                title="Add Product"
                                            >
                                                + Product
                                            </button>
                                        <button
                                            onClick={() => {
                                                setInsertDetailsType('order');
                                                setIsInsertDetailsOpen(true);
                                            }}
                                            className="px-3 py-2 text-xs font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all"
                                            title="Add Order"
                                        >
                                            + Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                setInsertDetailsType('shipping');
                                                setIsInsertDetailsOpen(true);
                                            }}
                                            className="px-3 py-2 text-xs font-semibold rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
                                            title="Add Shipping"
                                        >
                                            + Shipping
                                        </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        title="My Profile"
                                    >
                                        👤 Profile
                                    </button>

                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-semibold"
                                        title="Logout"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                                    >
                                        Login
                                    </button>
                                    <a href="#comparison" className="px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-all">
                                        Analysis
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mt-2 pt-4 border-t border-slate-200 space-y-2 pb-4">
                            {NAV_LINKS.map(link => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold text-slate-700 hover:text-blue-600"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="border-t border-slate-200 pt-3 space-y-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs font-semibold text-blue-600">{user.role === 'admin' ? '👑 ADMIN' : '👤 CUSTOMER'}</div>
                                            <div className="font-bold text-slate-900">{user.name || user.email || user.username}</div>
                                        </div>
                                        <button
                                            onClick={() => setIsProfileOpen(true)}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700"
                                        >
                                            👤 Profile
                                        </button>
                                        {user.role === 'user' && (
                                            <button
                                                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700"
                                            >
                                                🛒 Cart ({cartItems.length})
                                            </button>
                                        )}
                                        {user.role === 'admin' && (
                                            <button
                                                onClick={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-700"
                                            >
                                                📊 Dashboard
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
                                        >
                                            Login
                                        </button>
                                        <a 
                                            href="#comparison" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg text-center"
                                        >
                                            View Analysis
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header id="overview" className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden text-white mt-14" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #3b82f6 50%, #1e3a8a 75%, #0f172a 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite'
            }}>
                <style>{`
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-blue-900/30 opacity-60"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
                            Project Proposal
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            The Gizmohub <span className="gradient-text">Digital Transformation</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                            Developing a Headless E-commerce and Integrated Inventory Management System to bridge the digital maturity gap.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#solution" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-center">
                                Explore Solution
                            </a>
                            <a href="#problem" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold rounded-lg transition-all text-center">
                                Why This Project?
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Sections */}
            <main>
                <ProblemSection />
                <SolutionSection />
                <ProductsSection />
                <ProductBrowser />
                <Timeline />
                <ComparisonTable />
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <span className="text-white font-bold text-lg">Gizmohub</span>
                            <p className="text-sm mt-1">Digital Transformation Initiative</p>
                        </div>
                        <div className="text-sm">
                            &copy; {new Date().getFullYear()} Project Proposal. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* AI Assistant */}
            <ChatAssistant />

            {/* Modals */}
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)}
                onSignUpClick={() => setIsRegisterOpen(true)}
            />
            <RegisterModal 
                isOpen={isRegisterOpen} 
                onClose={() => setIsRegisterOpen(false)}
                onRegisterSuccess={() => setIsLoginOpen(false)}
            />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <InsertDetailsPage 
                isOpen={isInsertDetailsOpen} 
                onClose={() => setIsInsertDetailsOpen(false)}
                type={insertDetailsType}
            />
        </div>
    );
};

export default function AppWithProvider() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}