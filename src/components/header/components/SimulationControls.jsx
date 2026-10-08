import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { usePetriStore } from '../../../store/usePetriStore';
import { useElapsedTime } from '../../../hooks/useElapsedTime';
import { formatElapsedTime } from '../../../utils/time';
import { RunButton } from './RunButton';

/**
 * Fired-transition counter, simulation timer and Run/Stop button.
 */
export const SimulationControls = () => {
    const theme = useTheme();
    const isRunning = usePetriStore((s) => s.mode === 'run');
    const stepCount = usePetriStore((s) => s.history.length);
    const startSimulation = usePetriStore((s) => s.startSimulation);
    const stopSimulation = usePetriStore((s) => s.stopSimulation);
    const elapsedSeconds = useElapsedTime(isRunning);

    const statClass = 'text-[11px] font-medium leading-none tabular-nums tracking-[0.14em]';

    return (
        <div className="flex h-full items-center gap-2">
            <span
                className={`${statClass} w-9 text-center`}
                style={{ color: theme.text.label, opacity: stepCount > 0 || isRunning ? 0.7 : 0.25 }}
                title="Fired transitions"
                aria-live="polite"
            >
                {stepCount}
            </span>

            <span
                className={`${statClass} min-w-[4.5rem] text-center`}
                style={{ color: theme.text.label, opacity: isRunning ? 0.85 : 0.45 }}
                title="Simulation time"
            >
                {formatElapsedTime(elapsedSeconds)}
            </span>

            <RunButton isRunning={isRunning} onClick={isRunning ? stopSimulation : startSimulation} />
        </div>
    );
};
