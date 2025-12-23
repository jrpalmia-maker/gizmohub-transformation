import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Timeline: React.FC = () => {
    const data = [
        { name: 'Req. Gathering', weeks: 4, color: '#94a3b8' }, // Slate 400
        { name: 'System Design', weeks: 6, color: '#60a5fa' }, // Blue 400
        { name: 'Development', weeks: 12, color: '#3b82f6' }, // Blue 500
        { name: 'Test & Deploy', weeks: 4, color: '#1d4ed8' }, // Blue 700
    ];

    return (
        <div id="timeline" className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Project Roadmap</h2>
                        <p className="text-slate-600 mt-2">26-week execution plan divided into four phases.</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <div className="text-4xl font-bold text-blue-600">26</div>
                        <div className="text-sm text-slate-500 uppercase tracking-wide">Total Weeks</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* List View */}
                    <div className="space-y-6">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center group">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }}>
                                    {index + 1}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                                    <p className="text-sm text-slate-500">Duration: {item.weeks} weeks</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart View */}
                    <div className="h-64 md:h-80 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="weeks" radius={[0, 4, 4, 0]} barSize={32}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};