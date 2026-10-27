import React from 'react';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import Hero from './component/Hero';

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <Hero />
                </main>
            </div>
        </div>
    );
}