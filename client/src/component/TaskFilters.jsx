// src/components/TaskFilters.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpDown, Trash2 } from 'lucide-react';

const TaskFilters = () => {
    const { sortOrder, setSortOrder, handleClearCompleted, filter } = useApp();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort by:</span>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none cursor-pointer text-slate-700 dark:text-slate-300 shadow-xs"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="asc">Title (A-Z)</option>
                    <option value="desc">Title (Z-A)</option>
                </select>
            </div>

            {filter !== 'trash' && (
                <button
                    type="button"
                    onClick={handleClearCompleted}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/40"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Completed Tasks</span>
                </button>
            )}
        </div>
    );
};

export default TaskFilters;