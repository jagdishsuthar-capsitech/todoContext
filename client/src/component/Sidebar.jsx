// src/components/Sidebar.jsx
import React, { useRef, useState } from 'react';
import { CheckSquare, Star, CheckCircle2, LayoutDashboard, X, Plus, Pin, Tag, Trash2, Download, Upload, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
    const {
        filter, setFilter, tasks, trash, isSidebarOpen, setIsSidebarOpen,
        activeWorkspace, setActiveWorkspace, workspaces, setWorkspaces,
        deleteWorkspace, categories, exportData, importData
    } = useApp();

    const [newWsName, setNewWsName] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [isViewsOpen, setIsViewsOpen] = useState(true);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isDataOpen, setIsDataOpen] = useState(false);

    const fileInputRef = useRef(null);
    const defaultWorkspaces = ['Personal', 'Work', 'Study'];

    const getCount = (type) => {
        if (type === 'trash') return trash.length;
        const wsTasks = tasks.filter(t => (t.workspace || 'Personal') === activeWorkspace);
        if (type === 'all') return wsTasks.length;
        if (type === 'active') return wsTasks.filter(t => !t.completed).length;
        if (type === 'completed') return wsTasks.filter(t => t.completed).length;
        if (type === 'high') return wsTasks.filter(t => t.priority === 'high' && !t.completed).length;
        if (type === 'pinned') return wsTasks.filter(t => t.isPinned && !t.completed).length;
        return wsTasks.filter(t => t.category === type && !t.completed).length;
    };

    const navItems = [
        { id: 'all', label: 'All Tasks', icon: LayoutDashboard },
        { id: 'pinned', label: 'Pinned', icon: Pin, badgeColor: 'text-amber-500' },
        { id: 'active', label: 'Active', icon: CheckSquare },
        { id: 'high', label: 'High Priority', icon: Star, badgeColor: 'text-rose-500' },
        { id: 'completed', label: 'Completed', icon: CheckCircle2 },
        { id: 'trash', label: 'Trash Bin', icon: Trash2, badgeColor: 'text-rose-600' },
    ];

    const addWorkspace = (e) => {
        e.preventDefault();
        if (!newWsName.trim()) return;
        const formattedWs = newWsName.trim();
        if (!workspaces.includes(formattedWs)) {
            setWorkspaces([...workspaces, formattedWs]);
            setActiveWorkspace(formattedWs);
        }
        setNewWsName('');
        setShowInput(false);
    };

    return (
        <>
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden" />
            )}

            <aside className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                            <CheckSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Task<span className="text-indigo-600">fy</span>
                        </span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

                    <div>
                        <div className="flex items-center justify-between px-3 mb-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspaces</p>
                            <button onClick={() => setShowInput(!showInput)} className="text-indigo-600 hover:text-indigo-700 cursor-pointer">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {showInput && (
                            <form onSubmit={addWorkspace} className="px-3 mb-2">
                                <input
                                    type="text"
                                    value={newWsName}
                                    onChange={(e) => setNewWsName(e.target.value)}
                                    placeholder="New workspace..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
                                />
                            </form>
                        )}

                        <div className="space-y-1 px-2">
                            {workspaces.map(ws => {
                                const isDefault = defaultWorkspaces.includes(ws);
                                return (
                                    <div
                                        key={ws}
                                        onClick={() => setActiveWorkspace(ws)}
                                        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeWorkspace === ws ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="flex-1 truncate">{ws}</span>
                                        {!isDefault && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); deleteWorkspace(ws); }}
                                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsViewsOpen(!isViewsOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <span>Views</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isViewsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isViewsOpen && (
                            <div className="space-y-1 mt-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = filter === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => { setFilter(item.id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-4 h-4 ${item.badgeColor || ''}`} />
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                {getCount(item.id)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsTagsOpen(!isTagsOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <span>Custom Tags</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isTagsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isTagsOpen && (
                            <div className="space-y-1 mt-1">
                                {categories.map((cat) => {
                                    const isActive = filter === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => { setFilter(cat); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                <span>#{cat}</span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                {getCount(cat)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsDataOpen(!isDataOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <span>Data Management</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDataOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDataOpen && (
                            <div className="px-2 space-y-1 mt-1">
                                <button type="button" onClick={exportData} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Export Backup (.json)</span>
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Restore Backup</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />
                            </div>
                        )}
                    </div>

                    <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xs">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Welcome,</span>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">Capsitech</span>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;