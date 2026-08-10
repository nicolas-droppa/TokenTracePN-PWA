import React from 'react';
import { PetriCanvas as Canvas } from './components/canvas/PetriCanvas';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { usePetriStore } from './store/usePetriStore';
import { THEMES } from './theme';

export default function App() {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    return (
        <div 
            className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: theme.bg }}
        >
            <Header />
            
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />

                <main className="flex-1 h-full relative overflow-hidden">
                    <CanvasToolbar />
                    <Canvas />
                </main>
            </div>
        </div>
    );
}