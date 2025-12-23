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
            {/* Menubar */}
            <nav className="fixed w-full z-50 bg-slate-900 text-white shadow-lg border-b-2 border-blue-600">
                <div className="container mx-auto px-6 py-2">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">G</div>
                            <span className="font-bold text-xl tracking-tight">Gizmohub</span>
                        </div>

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-slate-700 rounded transition-colors"
                            title="Toggle Menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Navigation Menu - Desktop */}
                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    className="text-sm font-medium hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Right Side - User & Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            {user ? (
                                <>
                                    <div className="text-sm hidden sm:block">
                                        <div className="text-blue-400">{user.role === 'admin' ? '👑 Admin' : '👤 Customer'}</div>
                                        <div className="font-semibold">{user.name || user.email || user.username}</div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    {user.role === 'user' && (
                                        <button
                                            onClick={() => setIsCartOpen(true)}
                                            className="relative px-3 py-2 hover:bg-slate-700 rounded transition-colors"
                                            title="Shopping Cart"
                                        >
                                            <span className="text-xl">🛒</span>
                                            {cartItems.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    {user.role === 'admin' && (
                                        <button
                                            onClick={() => setIsProfileOpen(true)}
                                            className="px-3 py-2 hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                                            title="Admin Dashboard"
                                        >
                                            📊 Dashboard
                                        </button>
                                    )}

                                    {user.role === 'admin' && (
                                        <div className="flex gap-1 border-l border-slate-600 pl-4">
                                            <button
                                                onClick={() => {
                                                    setInsertDetailsType('product');
                                                    setIsInsertDetailsOpen(true);
                                                }}
                                                className="px-2 py-1 text-xs font-medium rounded hover:bg-blue-600 transition-colors"
                                                title="Add Product"
                                            >
                                                + Product
                                            </button>
                                        <button
                                            onClick={() => {
                                                setInsertDetailsType('order');
                                                setIsInsertDetailsOpen(true);
                                            }}
                                            className="px-2 py-1 text-xs font-medium rounded hover:bg-green-600 transition-colors"
                                            title="Add Order"
                                        >
                                            + Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                setInsertDetailsType('shipping');
                                                setIsInsertDetailsOpen(true);
                                            }}
                                            className="px-2 py-1 text-xs font-medium rounded hover:bg-purple-600 transition-colors"
                                            title="Add Shipping"
                                        >
                                            + Shipping
                                        </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="px-3 py-2 hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                                        title="My Profile"
                                    >
                                        👤 Profile
                                    </button>

                                    <button
                                        onClick={logout}
                                        className="px-3 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded transition-colors text-sm font-medium"
                                        title="Logout"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-all"
                                    >
                                        Login
                                    </button>
                                    <a href="#comparison" className="px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 text-sm font-medium rounded transition-all">
                                        View Analysis
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-slate-700 space-y-3">
                            {NAV_LINKS.map(link => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 hover:bg-slate-800 rounded transition-colors text-sm font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="border-t border-slate-700 pt-3 space-y-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm">
                                            <div className="text-blue-400">{user.role === 'admin' ? '👑 Admin' : '👤 Customer'}</div>
                                            <div className="font-semibold">{user.name || user.email || user.username}</div>
                                        </div>
                                        <button
                                            onClick={() => setIsProfileOpen(true)}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded text-sm font-medium"
                                        >
                                            👤 Profile
                                        </button>
                                        {user.role === 'user' && (
                                            <button
                                                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded text-sm font-medium"
                                            >
                                                🛒 Cart ({cartItems.length})
                                            </button>
                                        )}
                                        {user.role === 'admin' && (
                                            <button
                                                onClick={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded text-sm font-medium"
                                            >
                                                📊 Dashboard
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 rounded text-sm font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-all"
                                        >
                                            Login
                                        </button>
                                        <a 
                                            href="#comparison" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 text-sm font-medium rounded text-center"
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