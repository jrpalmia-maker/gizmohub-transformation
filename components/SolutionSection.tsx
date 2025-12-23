import React from 'react';
import { IconCpu, IconZap, IconDatabase } from './Icons';

export const SolutionSection: React.FC = () => {
    return (
        <div id="solution" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">The Solution</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Headless E-commerce Architecture</h2>
                    <p className="text-lg text-slate-600 max-w-3xl">
                        We propose decoupling the presentation layer from the commerce engine, integrated with a centralized Product Information Management (PIM) system.
                    </p>
                </div>

                <div className="relative">
                    {/* Visual Diagram Representation */}
                    <div className="grid md:grid-cols-12 gap-6 relative z-10">
                        
                        {/* Frontend Layer */}
                        <div className="md:col-span-4 flex flex-col justify-center space-y-4">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform">
                                <h4 className="font-bold text-lg mb-2">Customer Storefront</h4>
                                <p className="text-blue-100 text-sm">PWA/SPA for Web & Mobile</p>
                                <div className="mt-4 inline-flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                                    <IconZap className="w-3 h-3 mr-1" /> Instant Loading
                                </div>
                            </div>
                        </div>

                        {/* Integration Layer (Middle) */}
                        <div className="md:col-span-4 flex items-center justify-center py-8 md:py-0">
                            <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                                {/* Connection Lines */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                                </div>
                                
                                <div className="relative bg-white border-2 border-slate-200 p-4 rounded-full z-10 shadow-sm flex flex-col items-center justify-center text-center w-40 h-40">
                                    <div className="font-bold text-slate-800">API Layer</div>
                                    <div className="text-xs text-slate-500 mt-1">Real-time Sync</div>
                                    <div className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded mt-2 text-slate-600">
                                        &lt;5s Latency
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Backend Layer */}
                        <div className="md:col-span-4 space-y-4">
                             <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">E-commerce Engine</h4>
                                        <p className="text-slate-400 text-sm">Pricing, Promo, Checkout</p>
                                    </div>
                                    <IconCpu className="text-green-500 w-5 h-5" />
                                </div>
                            </div>
                            
                            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">PIM System</h4>
                                        <p className="text-slate-400 text-sm">Centralized Product Data</p>
                                    </div>
                                    <IconDatabase className="text-purple-500 w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-slate-100 text-slate-500 p-4 rounded-xl border border-dashed border-slate-300">
                                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Legacy Systems</h4>
                                <p className="text-xs">ERP & WMS (Connected via API)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};