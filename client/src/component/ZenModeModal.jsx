// src/components/ZenModeModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ZenModeModal = () => {
    const { tasks, toggleComplete, isZenModeOpen, setIsZenModeOpen } = useApp();
    const activeTasks = tasks.filter(t => !t.completed);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isZenModeOpen) return null;

    const currentTask = activeTasks[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 text-center relative animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setIsZenModeOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold mb-6">
                    <Sparkles className="w-3.5 h-3.5" /> Zen / Focus Mode
                </div>

                {activeTasks.length === 0 ? (
                    <div className="py-12">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">All tasks completed! 🎉</h3>
                        <p className="text-xs text-slate-400">Take a well-deserved break.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                            "{currentTask.title}"
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {currentTask.description || 'Focus entirely on this single task. Eliminate all other distractions.'}
                        </p>

                        <div className="flex items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => {
                                    toggleComplete(currentTask.id);
                                    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-lg cursor-pointer transition-transform active:scale-95"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Mark Complete & Next
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono pt-4">
                            Task {currentIndex + 1} of {activeTasks.length} active tasks
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZenModeModal;