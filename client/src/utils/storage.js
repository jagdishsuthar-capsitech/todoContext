// --- Tasks Storage ---
export const loadTasks = () => {
    try {
        const data = localStorage.getItem('taskfy_tasks');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
        return [];
    }
};

export const saveTasks = (tasks) => {
    try {
        localStorage.setItem('taskfy_tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
    }
};

// --- Trash Bin Storage ---
export const loadTrash = () => {
    try {
        const data = localStorage.getItem('taskfy_trash');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load trash from localStorage:', error);
        return [];
    }
};

export const saveTrash = (trash) => {
    try {
        localStorage.setItem('taskfy_trash', JSON.stringify(trash));
    } catch (error) {
        console.error('Failed to save trash to localStorage:', error);
    }
};

// --- Theme Storage ---
export const loadTheme = () => {
    try {
        return localStorage.getItem('taskfy_theme') || 'light';
    } catch {
        return 'light';
    }
};

export const saveTheme = (theme) => {
    try {
        localStorage.setItem('taskfy_theme', theme);
    } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
    }
};

// --- Workspaces Storage ---
export const loadWorkspaces = () => {
    try {
        const data = localStorage.getItem('taskfy_workspaces');
        return data ? JSON.parse(data) : ['Personal', 'Work', 'Study'];
    } catch (error) {
        console.error('Failed to load workspaces:', error);
        return ['Personal', 'Work', 'Study'];
    }
};

export const saveWorkspaces = (workspaces) => {
    try {
        localStorage.setItem('taskfy_workspaces', JSON.stringify(workspaces));
    } catch (error) {
        console.error('Failed to save workspaces:', error);
    }
};

// --- Custom Categories / Tags Storage ---
export const loadCategories = () => {
    try {
        const data = localStorage.getItem('taskfy_categories');
        return data ? JSON.parse(data) : ['Personal', 'Work', 'Study', 'Fitness', 'Finance'];
    } catch (error) {
        console.error('Failed to load categories:', error);
        return ['Personal', 'Work', 'Study', 'Fitness', 'Finance'];
    }
};

export const saveCategories = (categories) => {
    try {
        localStorage.setItem('taskfy_categories', JSON.stringify(categories));
    } catch (error) {
        console.error('Failed to save categories:', error);
    }
};

// --- Streak Data Storage ---
export const loadStreakData = () => {
    try {
        const data = localStorage.getItem('taskfy_streak');
        return data ? JSON.parse(data) : { currentStreak: 1, lastCompletedDate: null };
    } catch (error) {
        console.error('Failed to load streak data:', error);
        return { currentStreak: 1, lastCompletedDate: null };
    }
};

export const saveStreakData = (streakData) => {
    try {
        localStorage.setItem('taskfy_streak', JSON.stringify(streakData));
    } catch (error) {
        console.error('Failed to save streak data:', error);
    }
};