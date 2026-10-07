import React from 'react';
import { PetriCanvas as Canvas } from './components/canvas/PetriCanvas';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/header/Header';
import { BottomBar } from './components/layout/BottomBar';
import { PanelDivider } from './components/layout/PanelDivider';
import { useSettingsStore } from './store/useSettingsStore';
import { THEMES } from './theme';
import { useBottomPanel } from './hooks/useBottomPanel';

export default function App() {
    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;
    const {
        code,
        setCode,
        language,
        setLanguage,
        bottomBarHeight,
        handleBottomResizeStart,
    } = useBottomPanel();

    return (
        <div 
            className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: theme.bg }}
        >
            <Header />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar code={code} setCode={setCode} language={language} setLanguage={setLanguage} />

                <div className="flex-1 h-full overflow-hidden">
                    <div className="flex flex-col h-full w-full">
                        <main className="flex-1 min-h-0 relative overflow-hidden">
                            <CanvasToolbar />
                            <Canvas />
                        </main>

                        <PanelDivider
                            theme={theme}
                            onMouseDown={handleBottomResizeStart}
                            height="0.375rem"
                            cursor="ns-resize"
                        />

                        <div
                            className="shrink-0 overflow-hidden"
                            style={{
                                height: `${bottomBarHeight}px`,
                                minHeight: '120px',
                                maxHeight: '260px',
                                backgroundColor: theme.sidebar.bg,
                            }}
                        >
                            <BottomBar code={code} language={language} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}