// src/components/PomodoroModal.jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PomodoroModal = () => {
    const { pomodoroTask, isPomodoroActive, setIsPomodoroActive } = useApp();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer = null;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            alert('Pomodoro session completed! Take a break 🎉');
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    if (!isPomodoroActive) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        <Clock className="w-4 h-4" /> Focus Timer
                    </div>
                    <button onClick={() => { setIsPomodoroActive(false); setIsRunning(false); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {pomodoroTask && (
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-6 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl truncate">
                        🎯 Focus on: "{pomodoroTask.title}"
                    </p>
                )}

                <div className="text-5xl font-black text-slate-900 dark:text-white font-mono my-6 tracking-tight">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setIsRunning(!isRunning)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer">
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-xl cursor-pointer" title="Reset">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroModal;