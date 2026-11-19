import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/header/Header';
import { Workspace } from './components/workspace/Workspace';
import { useTheme } from './store/useSettingsStore';
import { useCodeSync } from './hooks/useCodeSync';
import { StatusBar } from './components/status-bar/StatusBar';
import { APP_LAYOUT } from './constants/layout';
import { LabBar } from './components/lab-bar/LabBar';

export default function App() {
    const theme = useTheme();
    useCodeSync();

    return (
        <div
            className="flex h-dvh w-screen flex-col overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: theme.bg }}
        >
            <Header />
            <main className="relative flex min-h-0 flex-1">
                <div className="relative min-w-0 flex-1">
                    <Workspace />
                </div>
                <LabBar />
            </main>
            <StatusBar />

            <Toaster
                position="bottom-right"
                containerStyle={{ bottom: APP_LAYOUT.STATUS_BAR_HEIGHT_PX + 8 }}
            />
        </div>
    );
}
