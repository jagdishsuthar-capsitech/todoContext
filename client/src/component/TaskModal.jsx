// src/components/TaskModal.jsx
import React, { useState } from 'react';
import { X, Tag, Plus, Trash, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TaskModal = () => {
    const { isModalOpen, setIsModalOpen, formData, setFormData, handleSubmit, editingId, categories, setCategories } = useApp();
    const [subtaskInput, setSubtaskInput] = useState('');
    const [newCategoryInput, setNewCategoryInput] = useState('');
    const [showNewCatInput, setShowNewCatInput] = useState(false);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const addCustomCategory = () => {
        if (!newCategoryInput.trim()) return;
        const formattedCat = newCategoryInput.trim();
        if (!categories.includes(formattedCat)) {
            setCategories([...categories, formattedCat]);
        }
        setFormData(prev => ({ ...prev, category: formattedCat }));
        setNewCategoryInput('');
        setShowNewCatInput(false);
    };

    const addSubtask = () => {
        if (!subtaskInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, { id: Date.now().toString(), text: subtaskInput.trim(), completed: false }]
        }));
        setSubtaskInput('');
    };

    const removeSubtask = (id) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(s => s.id !== id)
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {editingId !== null ? 'Edit Task Details' : 'Create New Task'}
                    </h3>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Task Title *</label>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
                                <Sparkles className="w-3 h-3" /> NLP supported (e.g. "Meeting tomorrow #work !high")
                            </span>
                        </div>
                        <input
                            type="text"
                            name="title"
                            required
                            maxLength={90}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Complete project report tomorrow #work !high"
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Task Description</label>
                            <span className="text-[10px] text-slate-400">{formData.description.length}/200 chars</span>
                        </div>
                        <textarea
                            name="description"
                            rows={3}
                            maxLength={200}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add detailed notes or context..."
                            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category / Tag</label>
                            <button type="button" onClick={() => setShowNewCatInput(!showNewCatInput)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                                {showNewCatInput ? 'Cancel' : '+ Add Custom Tag'}
                            </button>
                        </div>

                        {showNewCatInput ? (
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newCategoryInput}
                                    onChange={(e) => setNewCategoryInput(e.target.value)}
                                    placeholder="e.g., #Fitness, #Finance..."
                                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                                />
                                <button type="button" onClick={addCustomCategory} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer">Add</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <Tag className="w-4 h-4 text-slate-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="dark:bg-slate-800">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Subtasks Checklist</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={subtaskInput}
                                onChange={(e) => setSubtaskInput(e.target.value)}
                                placeholder="Add checklist item..."
                                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                            />
                            <button type="button" onClick={addSubtask} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-indigo-700">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto">
                            {formData.subtasks?.map(sub => (
                                <div key={sub.id} className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs">
                                    <span className="text-slate-700 dark:text-slate-300">{sub.text}</span>
                                    <button type="button" onClick={() => removeSubtask(sub.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Due Date</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer" />
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Recurring Task
                            </label>
                            <input type="checkbox" name="isRecurring" checked={formData.isRecurring} onChange={handleChange} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                        </div>
                        {formData.isRecurring && (
                            <select name="recurrenceType" value={formData.recurrenceType} onChange={handleChange} className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                                <option value="daily">Repeats Daily</option>
                                <option value="weekly">Repeats Weekly</option>
                            </select>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer">{editingId !== null ? 'Save Changes' : 'Create Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;