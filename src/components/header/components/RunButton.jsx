import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
);

const StopIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
);

/**
 * Starts or stops the simulation.
 * @param {boolean} isRunning - Current simulation state.
 * @param {Function} onClick - Toggles the simulation.
 */
export const RunButton = ({ isRunning, onClick }) => {
    const theme = useTheme();

    return (
        <button
            type="button"
            onClick={onClick}
            title={isRunning ? 'Stop simulation' : 'Start simulation'}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium leading-none transition-colors duration-150 ease-out hover:bg-slate-400/10"
            style={{ color: theme.text.label, opacity: 0.92 }}
        >
            <span
                className="flex items-center transition-colors duration-150"
                style={{ color: isRunning ? theme.status.stop : theme.status.run }}
            >
                {isRunning ? <StopIcon /> : <PlayIcon />}
            </span>
            <span className="hidden md:inline">{isRunning ? 'Stop' : 'Run'}</span>
        </button>
    );
};
