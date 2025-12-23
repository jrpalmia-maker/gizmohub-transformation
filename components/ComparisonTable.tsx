import React from 'react';

export const ComparisonTable: React.FC = () => {
    const data = [
        { feature: 'Architecture', current: 'Monolithic (Tightly Coupled)', proposed: 'Headless (Decoupled)', benefit: 'Rapid feature deployment' },
        { feature: 'Mobile Perf', current: 'High Latency, Slow', proposed: 'PWA/SPA (Instant)', benefit: 'Reduced abandonment' },
        { feature: 'Data Source', current: 'Siloed Databases', proposed: 'Centralized PIM via APIs', benefit: 'Inventory accuracy' },
        { feature: 'Personalization', current: 'Static Recommendations', proposed: 'AI-driven, Real-time', benefit: 'Higher engagement' },
    ];

    return (
        <div id="comparison" className="py-20 bg-slate-50">
             <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Technology Gap Analysis</h2>
                    <p className="text-slate-600 mt-2">Bridging the divide between legacy infrastructure and modern demands.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm rounded-xl overflow-hidden">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left font-semibold">Feature</th>
                                <th className="py-4 px-6 text-left font-semibold text-red-200">Current System</th>
                                <th className="py-4 px-6 text-left font-semibold text-green-200">Proposed System</th>
                                <th className="py-4 px-6 text-left font-semibold text-blue-200">Gap Addressed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-slate-800">{row.feature}</td>
                                    <td className="py-4 px-6 text-slate-600">{row.current}</td>
                                    <td className="py-4 px-6 font-semibold text-green-700 bg-green-50/50">{row.proposed}</td>
                                    <td className="py-4 px-6 text-blue-600">{row.benefit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};