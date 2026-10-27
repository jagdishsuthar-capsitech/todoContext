// src/components/AnalyticsModal.jsx
import React from 'react';
import { BarChart3, X, CheckCircle2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AnalyticsModal = () => {
    const { allTasks, streakData, activeWorkspace, isAnalyticsOpen, setIsAnalyticsOpen } = useApp();

    if (!isAnalyticsOpen) return null;

    const wsTasks = allTasks.filter(t => (t.workspace || 'Personal') === activeWorkspace);
    const total = wsTasks.length;
    const completed = wsTasks.filter(t => t.completed).length;
    const highPriority = wsTasks.filter(t => t.priority === 'high' && !t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        <BarChart3 className="w-4 h-4" /> Analytics ({activeWorkspace})
                    </div>
                    <button onClick={() => setIsAnalyticsOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completion Rate
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{percentage}%</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" /> Active Streak
                        </div>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{streakData?.currentStreak || 0} Days</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <span>Total Workspace Tasks</span>
                        <span>{completed} / {total} Finished</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-2 text-center">
                        🔥 You have <strong className="text-rose-500">{highPriority} high priority</strong> tasks pending.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsModal;