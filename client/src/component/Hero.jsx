// src/components/Hero.jsx
import React from 'react';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';
import TaskModal from './TaskModal';
import PomodoroModal from './PomodoroModal';
import CommandPalette from './CommandPalette';
import AnalyticsModal from './AnalyticsModal';
import ZenModeModal from './ZenModeModal';

const Hero = () => {
    const { progressPercentage, completedTasksCount, totalTasks, toast, activeWorkspace, filter } = useApp();

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {filter === 'trash' ? 'Trash Bin' : `${activeWorkspace} Workspace`}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {filter === 'trash' ? 'Restore deleted tasks or clear them permanently.' : 'Manage tasks with built-in subtasks, focus timers, and natural language parsing.'}
                        </p>
                    </div>

                    {filter !== 'trash' && (
                        <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 sm:w-56">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                                    Progress
                                </span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedTasksCount}/{totalTasks} ({progressPercentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <TaskFilters />
            <TaskList />
            <TaskModal />
            <PomodoroModal />
            <CommandPalette />
            <AnalyticsModal />
            <ZenModeModal />

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
                    <span className="text-sm font-semibold">{toast}</span>
                </div>
            )}
        </div>
    );
};

export default Hero;