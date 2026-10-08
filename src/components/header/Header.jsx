import React from 'react';
import { useTheme } from '../../store/useSettingsStore';
import { MenuBar } from './components/MenuBar';
import { SimulationControls } from './components/SimulationControls';

/**
 * Top bar: logo and menus on the left, simulation controls in the center.
 */
export const Header = () => {
    const theme = useTheme();

    return (
        <header
            className="relative flex h-10 w-full shrink-0 select-none items-center justify-between border-b px-4 transition-colors duration-200"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <div className="flex items-center gap-2">
                <span className="mr-2 text-sm font-bold tracking-wide" style={{ color: theme.text.token }}>
                    TT<span style={{ color: theme.place.stroke }}>PN</span>
                </span>
                <MenuBar />
            </div>

            <div className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
                <SimulationControls />
            </div>
        </header>
    );
};
