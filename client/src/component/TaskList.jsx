// src/components/TaskList.jsx
import React from 'react';
import TaskCard from './TaskCard';
import { useApp } from '../context/AppContext';
import { ClipboardList, Trash2 } from 'lucide-react';

const TaskList = () => {
    const { tasks, trash, filter } = useApp();

    const isTrash = filter === 'trash';
    const displayList = isTrash ? trash : tasks;

    return (
        <div>
            {displayList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center px-4">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-3">
                        {isTrash ? <Trash2 className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{isTrash ? 'Trash bin is empty' : 'No tasks found'}</h3>
                    <p className="text-xs text-slate-400 max-w-xs">{isTrash ? 'Deleted tasks will appear here.' : 'Click the "+ New Task" button to get started!'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayList.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            )}
        </div>
    );
};

export default TaskList;