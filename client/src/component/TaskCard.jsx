// src/components/TaskCard.jsx
import React, { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, Calendar, Tag, AlertTriangle, Pin, Play, CheckSquare, RefreshCw, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TaskCard = ({ task }) => {
    const { toggleComplete, handleEditClick, handleDelete, restoreFromTrash, permanentDelete, togglePin, toggleSubtask, setPomodoroTask, setIsPomodoroActive, filter } = useApp();
    const [isDeleting, setIsDeleting] = useState(false);

    const isTrashView = filter === 'trash';

    const priorityBadges = {
        high: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
        medium: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
        low: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate && task.dueDate < todayStr && !task.completed;
    const isDueToday = task.dueDate === todayStr && !task.completed;

    return (
        <div className={`relative overflow-hidden flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border transition-all shadow-sm hover:shadow-md ${task.isPinned ? 'border-indigo-400 dark:border-indigo-600 shadow-indigo-50/50' : 'border-slate-200 dark:border-slate-800'} ${task.completed ? 'bg-emerald-50/10 dark:bg-emerald-950/10' : ''}`}>

            {isDeleting && (
                <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl mb-1.5 shadow-xs">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{isTrashView ? 'Delete permanently?' : 'Move to trash?'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 truncate max-w-[90%]">
                        "{task.title || 'Untitled'}"
                    </p>
                    <div className="flex items-center gap-1.5 w-full">
                        <button type="button" onClick={() => setIsDeleting(false)} className="flex-1 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer">Cancel</button>
                        <button type="button" onClick={() => isTrashView ? permanentDelete(task.id) : handleDelete(task.id)} className="flex-1 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer">{isTrashView ? 'Delete' : 'Move'}</button>
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 min-w-0">
                        {!isTrashView && (
                            <button type="button" onClick={() => toggleComplete(task.id)} className="mt-0.5 transition-transform active:scale-90 shrink-0 cursor-pointer">
                                {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" /> : <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-500" />}
                            </button>
                        )}
                        <h3 className={`text-sm font-bold tracking-tight line-clamp-1 ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {task.title || 'Untitled Task'}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {!isTrashView && (
                            <button 
                                type="button" 
                                onClick={() => togglePin(task.id)} 
                                disabled={task.completed}
                                className={`p-1 rounded-lg transition-colors ${task.completed ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : task.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-300 hover:text-slate-500 cursor-pointer'}`}
                            >
                                <Pin className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {task.priority && (
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${priorityBadges[task.priority]}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>
                </div>

                <p className={`text-xs line-clamp-2 mb-3 ${isTrashView ? 'pl-2' : 'pl-8'} text-slate-600 dark:text-slate-300`}>
                    {task.description || 'No description provided.'}
                </p>

                {task.subtasks && task.subtasks.length > 0 && !isTrashView && (
                    <div className="mb-3 pl-8 space-y-1.5 border-l-2 border-slate-100 dark:border-slate-800 ml-2 py-1">
                        {task.subtasks.map(sub => (
                            <div key={sub.id} onClick={() => toggleSubtask(task.id, sub.id)} className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                                <CheckSquare className={`w-3.5 h-3.5 ${sub.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                                <span className={sub.completed ? 'line-through text-slate-400' : ''}>{sub.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
                <div className="flex flex-wrap items-center gap-2">
                    {task.category && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <Tag className="w-2.5 h-2.5" />
                            {task.category}
                        </span>
                    )}
                    {task.dueDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className={`text-[10px] font-medium ${isOverdue ? 'text-rose-600 font-semibold' : isDueToday ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                                {isOverdue ? `Overdue` : isDueToday ? 'Today' : task.dueDate}
                            </span>
                        </div>
                    )}
                    {task.isRecurring && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" /> {task.recurrenceType}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {isTrashView ? (
                        <>
                            <button type="button" onClick={() => restoreFromTrash(task.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl cursor-pointer" title="Restore">
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => setIsDeleting(true)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer" title="Delete Permanently">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                type="button" 
                                onClick={() => { setPomodoroTask(task); setIsPomodoroActive(true); }} 
                                disabled={task.completed}
                                className={`p-1.5 rounded-xl transition-colors ${task.completed ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer'}`}
                            >
                                <Play className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => handleEditClick(task)} disabled={task.completed} className={`p-1.5 rounded-xl transition-colors ${task.completed ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer'}`}>
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => setIsDeleting(true)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;