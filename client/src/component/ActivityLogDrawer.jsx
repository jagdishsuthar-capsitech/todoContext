import React from 'react';
import { History, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ActivityLogDrawer = ({ isOpen, setIsOpen }) => {
    const { activityLog } = useApp();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Activity History</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {activityLog.length > 0 ? (
                        activityLog.map(log => (
                            <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs border border-slate-100 dark:border-slate-800">
                                <p className="font-medium text-slate-800 dark:text-slate-200">{log.action}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block font-mono">{log.time}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400 text-xs">
                            No activities recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogDrawer;