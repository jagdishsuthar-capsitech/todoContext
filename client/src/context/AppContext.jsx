// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadTasks, saveTasks, loadTheme, saveTheme, loadWorkspaces, saveWorkspaces, loadCategories, saveCategories, loadStreakData, saveStreakData, loadTrash, saveTrash } from '../utils/storage.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [tasks, setTasks] = useState(loadTasks);
    const [trash, setTrash] = useState(loadTrash);
    const [theme, setTheme] = useState(loadTheme);

    const [workspaces, setWorkspaces] = useState(loadWorkspaces);
    const [categories, setCategories] = useState(loadCategories);
    const [activeWorkspace, setActiveWorkspace] = useState('Personal');
    const [streakData, setStreakData] = useState(loadStreakData);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        saveTheme(theme);
    }, [theme]);

    useEffect(() => { saveTasks(tasks); }, [tasks]);
    useEffect(() => { saveTrash(trash); }, [trash]);
    useEffect(() => { saveWorkspaces(workspaces); }, [workspaces]);
    useEffect(() => { saveCategories(categories); }, [categories]);
    useEffect(() => { saveStreakData(streakData); }, [streakData]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isZenModeOpen, setIsZenModeOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [activityLog, setActivityLog] = useState([]);
    const [pomodoroTask, setPomodoroTask] = useState(null);
    const [isPomodoroActive, setIsPomodoroActive] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'Personal',
        dueDate: '',
        isRecurring: false,
        recurrenceType: 'daily',
        subtasks: []
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const logActivity = (action) => {
        setActivityLog(prev => [{ id: Date.now(), action, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)]);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const parseNaturalLanguage = (input) => {
        let title = input;
        let priority = 'medium';
        let category = activeWorkspace;
        let dueDate = '';

        if (input.toLowerCase().includes('high priority') || input.toLowerCase().includes('!high')) {
            priority = 'high';
            title = title.replace(/high priority|!high/gi, '');
        } else if (input.toLowerCase().includes('low priority') || input.toLowerCase().includes('!low')) {
            priority = 'low';
            title = title.replace(/low priority|!low/gi, '');
        }

        const tagMatch = input.match(/#([a-zA-Z0-9_-]+)/);
        if (tagMatch) {
            category = tagMatch[1];
            category = category.charAt(0).toUpperCase() + category.slice(1);
            title = title.replace(tagMatch[0], '');
            if (!categories.includes(category)) {
                setCategories(prev => [...prev, category]);
            }
        }

        const today = new Date();
        if (input.toLowerCase().includes('tomorrow')) {
            today.setDate(today.getDate() + 1);
            dueDate = today.toISOString().split('T')[0];
            title = title.replace(/tomorrow/gi, '');
        } else if (input.toLowerCase().includes('today')) {
            dueDate = today.toISOString().split('T')[0];
            title = title.replace(/today/gi, '');
        }

        return { title: title.trim().replace(/\s+/g, ' '), priority, category, dueDate };
    };

    const deleteWorkspace = (wsToDelete) => {
        if (wsToDelete.toLowerCase() === 'personal') {
            showToast('Default "Personal" workspace cannot be deleted!');
            return;
        }

        const updatedTasks = tasks.map(t => {
            const currentWs = t.workspace || 'Personal';
            if (currentWs === wsToDelete) {
                return { ...t, workspace: 'Personal' };
            }
            return t;
        });
        setTasks(updatedTasks);
        setWorkspaces(workspaces.filter(w => w !== wsToDelete));
        if (activeWorkspace === wsToDelete) setActiveWorkspace('Personal');

        showToast(`Workspace "${wsToDelete}" deleted.`);
        logActivity(`Deleted workspace: "${wsToDelete}"`);
    };

    const exportData = () => {
        const backupData = { version: "1.0", exportDate: new Date().toISOString(), tasks, trash, workspaces, categories, streakData };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `taskfy_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Data exported successfully!');
    };

    const importData = (event) => {
        const fileReader = new FileReader();
        if (event.target.files[0]) {
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = (e) => {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    if (parsedData.tasks) setTasks(parsedData.tasks);
                    if (parsedData.trash) setTrash(parsedData.trash);
                    if (parsedData.workspaces) setWorkspaces(parsedData.workspaces);
                    if (parsedData.categories) setCategories(parsedData.categories);
                    if (parsedData.streakData) setStreakData(parsedData.streakData);
                    showToast('Data restored successfully! 🎉');
                } catch (error) {
                    alert('Invalid JSON backup file!');
                }
            };
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', priority: 'medium', category: activeWorkspace, dueDate: '', isRecurring: false, recurrenceType: 'daily', subtasks: [] });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const parsed = parseNaturalLanguage(formData.title);
        const finalTitle = parsed.title || formData.title.trim();
        const now = Date.now();

        if (editingId !== null) {
            setTasks(tasks.map(t => t.id === editingId ? { ...t, ...formData, title: finalTitle, updatedAt: now } : t));
            showToast('Task updated successfully!');
            logActivity(`Updated task: "${finalTitle}"`);
        } else {
            const newTask = {
                id: now.toString(),
                ...formData,
                title: finalTitle,
                priority: formData.priority !== 'medium' ? formData.priority : parsed.priority,
                category: formData.category !== activeWorkspace ? formData.category : parsed.category,
                dueDate: formData.dueDate || parsed.dueDate || new Date().toISOString().split('T')[0],
                completed: false,
                isPinned: false,
                workspace: activeWorkspace,
                createdAt: now,
                updatedAt: null
            };
            setTasks([newTask, ...tasks]);
            showToast('Task created successfully!');
            logActivity(`Created task: "${newTask.title}"`);
        }
        setIsModalOpen(false);
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const updatedStatus = !t.completed;
                logActivity(`Marked "${t.title}" as ${updatedStatus ? 'Completed' : 'Active'}`);

                if (updatedStatus) {
                    const today = new Date().toISOString().split('T')[0];
                    const lastDate = streakData.lastCompletedDate;
                    if (lastDate !== today) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toISOString().split('T')[0];
                        if (lastDate === yesterdayStr) {
                            setStreakData({ currentStreak: streakData.currentStreak + 1, lastCompletedDate: today });
                        } else if (!lastDate || lastDate < yesterdayStr) {
                            setStreakData({ currentStreak: 1, lastCompletedDate: today });
                        }
                    }

                    if (t.isRecurring) {
                        const nextDate = new Date();
                        if (t.recurrenceType === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
                        else nextDate.setDate(nextDate.getDate() + 1);
                        
                        setTimeout(() => {
                            const renewed = { ...t, id: Date.now().toString(), completed: false, dueDate: nextDate.toISOString().split('T')[0] };
                            setTasks(prev => [renewed, ...prev]);
                            showToast(`Recurring task renewed for ${renewed.dueDate}`);
                        }, 500);
                    }
                }
                return { ...t, completed: updatedStatus };
            }
            return t;
        }));
    };

    const togglePin = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, isPinned: !t.isPinned } : t));
        showToast('Task pin status updated');
    };

    const toggleSubtask = (taskId, subtaskId) => {
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
                return { ...t, subtasks: updatedSubtasks };
            }
            return t;
        }));
    };

    const handleEditClick = (task) => {
        if (task.completed) return;
        setEditingId(task.id);
        setFormData({
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 'medium',
            category: task.category || 'Personal',
            dueDate: task.dueDate || '',
            isRecurring: task.isRecurring || false,
            recurrenceType: task.recurrenceType || 'daily',
            subtasks: task.subtasks || []
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        const target = tasks.find(t => t.id === id);
        if (target) {
            setTasks(tasks.filter(t => t.id !== id));
            setTrash(prev => [target, ...prev]);
            showToast('Task moved to trash');
            logActivity(`Moved to trash: "${target.title}"`);
        }
    };

    const restoreFromTrash = (id) => {
        const target = trash.find(t => t.id === id);
        if (target) {
            setTrash(trash.filter(t => t.id !== id));
            setTasks(prev => [target, ...prev]);
            showToast('Task restored');
        }
    };

    const permanentDelete = (id) => {
        setTrash(trash.filter(t => t.id !== id));
        showToast('Task permanently deleted');
    };

    const handleClearCompleted = () => {
        const completedToTrash = tasks.filter(t => t.completed && (t.workspace || 'Personal') === activeWorkspace);
        setTasks(tasks.filter(t => !t.completed || (t.workspace || 'Personal') !== activeWorkspace));
        setTrash(prev => [...completedToTrash, ...prev]);
        showToast('Cleared completed tasks to trash');
        logActivity('Cleared completed tasks');
    };

    const filteredTasks = tasks.filter(task => {
        const taskWs = task.workspace || 'Personal';
        if (taskWs !== activeWorkspace && filter !== 'trash') return false;

        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'trash') return true;
        if (filter === 'overdue') {
            const todayStr = new Date().toISOString().split('T')[0];
            return !task.completed && task.dueDate && task.dueDate < todayStr;
        }
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        if (filter === 'high') return task.priority === 'high' && !task.completed;
        if (filter === 'pinned') return task.isPinned && !task.completed;
        if (categories.includes(filter)) return task.category === filter && !task.completed;

        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (sortOrder === 'oldest') return a.createdAt - b.createdAt;
        if (sortOrder === 'asc') return a.title.localeCompare(b.title);
        if (sortOrder === 'desc') return b.title.localeCompare(a.title);
        return b.createdAt - a.createdAt;
    });

    const workspaceTasks = tasks.filter(t => (t.workspace || 'Personal') === activeWorkspace);
    const totalTasks = workspaceTasks.length;
    const completedTasksCount = workspaceTasks.filter(t => t.completed).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    const value = {
        tasks: sortedTasks, allTasks: tasks, trash, formData, setFormData, editingId,
        filter, setFilter, sortOrder, setSortOrder, searchQuery, setSearchQuery,
        handleSubmit, toggleComplete, handleEditClick, handleDelete, restoreFromTrash, permanentDelete, handleClearCompleted,
        progressPercentage, completedTasksCount, totalTasks, toggleTheme, theme,
        isSidebarOpen, setIsSidebarOpen, isModalOpen, setIsModalOpen, openCreateModal,
        isCommandPaletteOpen, setIsCommandPaletteOpen,
        isAnalyticsOpen, setIsAnalyticsOpen, isZenModeOpen, setIsZenModeOpen,
        toast, activeWorkspace, setActiveWorkspace, workspaces, setWorkspaces,
        deleteWorkspace, togglePin, toggleSubtask, activityLog, pomodoroTask, setPomodoroTask,
        isPomodoroActive, setIsPomodoroActive, categories, setCategories, exportData, importData,
        streakData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);