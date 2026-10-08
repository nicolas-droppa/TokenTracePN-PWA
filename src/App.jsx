import React from 'react';
import { Header } from './components/header/Header';
import { Workspace } from './components/workspace/Workspace';
import { useTheme } from './store/useSettingsStore';

export default function App() {
    const theme = useTheme();

    return (
        <div
            className="flex h-dvh w-screen flex-col overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: theme.bg }}
        >
            <Header />
            <main className="relative min-h-0 flex-1">
                <Workspace />
            </main>
        </div>
    );
}
