import React from 'react';
import { IconServer, IconSmartphone, IconDatabase } from './Icons';

export const ProblemSection: React.FC = () => {
    return (
        <div id="problem" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Current Challenges</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Gizmohub's digital growth is stifled by a fragmented legacy architecture, leading to missed revenue opportunities.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                            <IconServer className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Inventory Lag</h3>
                        <p className="text-slate-600 mb-4">
                            Updates occur in batches every <span className="font-semibold text-red-600">2 hours</span>, frequently resulting in customers ordering out-of-stock items.
                        </p>
                        <div className="text-sm font-semibold text-slate-400">Impact: Fulfillment Errors</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                            <IconSmartphone className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile Friction</h3>
                        <p className="text-slate-600 mb-4">
                            Checkout times average <span className="font-semibold text-orange-600">15 seconds</span>. Mobile conversion is 40% lower than desktop.
                        </p>
                        <div className="text-sm font-semibold text-slate-400">Impact: High Abandonment</div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <IconDatabase className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Siloed Data</h3>
                        <p className="text-slate-600 mb-4">
                            Marketing, sales, and fulfillment data reside in separate databases, preventing personalized campaigns.
                        </p>
                        <div className="text-sm font-semibold text-slate-400">Impact: Low Engagement</div>
                    </div>
                </div>
            </div>
        </div>
    );
};