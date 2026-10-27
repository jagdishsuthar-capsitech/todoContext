// src/components/CommandPalette.jsx
import React from 'react';
import { Search, Plus, CheckSquare, Trash2, Calendar, X, BarChart3, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CommandPalette = () => {
    const { isCommandPaletteOpen, setIsCommandPaletteOpen, openCreateModal, setFilter, setIsAnalyticsOpen, setIsZenModeOpen } = useApp();

    if (!isCommandPaletteOpen) return null;

    const actions = [
        { label: 'Create New Task', icon: Plus, run: () => { openCreateModal(); setIsCommandPaletteOpen(false); } },
        { label: 'View All Tasks', icon: CheckSquare, run: () => { setFilter('all'); setIsCommandPaletteOpen(false); } },
        { label: 'View Overdue Tasks', icon: Calendar, run: () => { setFilter('overdue'); setIsCommandPaletteOpen(false); } },
        { label: 'Open Productivity Analytics', icon: BarChart3, run: () => { setIsAnalyticsOpen(true); setIsCommandPaletteOpen(false); } },
        { label: 'Open Zen / Focus Mode', icon: Sparkles, run: () => { setIsZenModeOpen(true); setIsCommandPaletteOpen(false); } },
        { label: 'View Trash Bin', icon: Trash2, run: () => { setFilter('trash'); setIsCommandPaletteOpen(false); } },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <Search className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                        autoFocus
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <button onClick={() => setIsCommandPaletteOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-2 space-y-1">
                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Actions</p>
                    {actions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={idx}
                                onClick={action.run}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                            >
                                <Icon className="w-4 h-4 text-indigo-500" />
                                <span>{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;