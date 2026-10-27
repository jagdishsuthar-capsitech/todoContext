// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Sun, Moon, Plus, Bell, History, Flame, MoreVertical, X, BarChart3, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
    const { 
        setIsSidebarOpen, searchQuery, setSearchQuery, 
        toggleTheme, theme, openCreateModal, 
        streakData, activityLog, tasks, setFilter, activeWorkspace,
        setIsCommandPaletteOpen, setIsAnalyticsOpen, setIsZenModeOpen 
    } = useApp();

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [activePanel, setActivePanel] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(t => {
        const ws = t.workspace || 'Personal';
        return ws === activeWorkspace && !t.completed && t.dueDate && t.dueDate < todayStr;
    });

    const panelRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setActivePanel(null);
                setShowMobileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenPanel = (type) => {
        setActivePanel(activePanel === type ? null : type);
        setShowMobileMenu(false);
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800" ref={panelRef}>
            
            <div className="flex items-center gap-2 flex-1">
                <button 
                    type="button" 
                    onClick={() => setIsSidebarOpen(prev => !prev)} 
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="hidden md:flex items-center justify-between flex-1 max-w-sm px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700/80 cursor-pointer hover:border-indigo-500 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">Search tasks or commands...</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">Ctrl + K</kbd>
                </div>

                {showMobileSearch && (
                    <div className="absolute inset-x-4 top-2 z-40 md:hidden bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400 ml-2" />
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full py-1 text-xs bg-transparent text-slate-900 dark:text-slate-100 outline-none"
                        />
                        <button 
                            onClick={() => { setShowMobileSearch(false); setSearchQuery(''); }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 relative">
                
                <button
                    type="button"
                    onClick={() => setShowMobileSearch(true)}
                    className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                    <Search className="w-4 h-4" />
                </button>

                {/* Zen Mode Button */}
                <button
                    type="button"
                    onClick={() => setIsZenModeOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors"
                    title="Zen Mode"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Zen</span>
                </button>

                {/* Analytics Button */}
                <button
                    type="button"
                    onClick={() => setIsAnalyticsOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 transition-colors"
                    title="Productivity Analytics"
                >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Analytics</span>
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => handleOpenPanel('streak')}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-100 transition-colors"
                    >
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{streakData?.currentStreak || 0}d</span>
                    </button>
                </div>

                <div className="relative">
                    <button 
                        type="button" 
                        onClick={() => handleOpenPanel('notifications')}
                        className="hidden md:flex p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
                    </button>
                </div>

                <div className="relative">
                    <button 
                        type="button" 
                        onClick={() => handleOpenPanel('history')}
                        className="hidden md:flex p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Activity History"
                    >
                        <History className="w-4 h-4" />
                    </button>
                </div>

                <button 
                    type="button" 
                    onClick={toggleTheme} 
                    className="hidden md:flex p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Task</span>
                </button>

                <button
                    type="button"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {showMobileMenu && (
                    <div className="absolute right-0 top-12 w-52 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 space-y-1 md:hidden">
                        <button
                            type="button"
                            onClick={() => { setIsZenModeOpen(true); setShowMobileMenu(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600" /> Zen Mode
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsAnalyticsOpen(true); setShowMobileMenu(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                        >
                            <BarChart3 className="w-4 h-4 text-indigo-600" /> Analytics
                        </button>
                        <button
                            type="button"
                            onClick={() => { toggleTheme(); setShowMobileMenu(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                            <span>Switch Theme</span>
                        </button>
                    </div>
                )}
            </div>

            {activePanel && (
                <div className="absolute top-16 inset-x-4 sm:inset-x-auto sm:right-4 z-50 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            {activePanel === 'notifications' && <><Bell className="w-3.5 h-3.5 text-indigo-600" /> Notifications</>}
                            {activePanel === 'history' && <><History className="w-3.5 h-3.5 text-emerald-600" /> Activity History</>}
                            {activePanel === 'streak' && <><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Streak Status</>}
                        </h4>
                        <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto space-y-3">
                        {activePanel === 'notifications' && (
                            <div className="space-y-3">
                                {overdueTasks.length > 0 ? (
                                    <div 
                                        onClick={() => { setFilter('overdue'); setActivePanel(null); }}
                                        className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl cursor-pointer hover:bg-rose-100 transition-all"
                                    >
                                        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">⚠️ Pending from Yesterday!</p>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-300">You have {overdueTasks.length} uncompleted past tasks.</p>
                                    </div>
                                ) : (
                                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-center">
                                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">🎉 All caught up!</p>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">No pending tasks from yesterday.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activePanel === 'history' && (
                            <div className="space-y-2">
                                {activityLog.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-4">No recent activity recorded today.</p>
                                ) : (
                                    activityLog.map(log => (
                                        <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{log.action}</p>
                                            <span className="text-[10px] text-slate-400">{log.time}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activePanel === 'streak' && (
                            <div className="text-center py-4 space-y-3">
                                <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-full flex items-center justify-center shadow-md">
                                    <Flame className="w-6 h-6 fill-amber-500" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{streakData?.currentStreak || 0} Day Streak! 🔥</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Complete tasks daily to maintain your streak.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;