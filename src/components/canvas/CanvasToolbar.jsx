import React from 'react';
import { usePetriStore } from '../../store/usePetriStore.js';
import { THEMES } from '../../theme.js';
import { TOOLS } from '../../constants/tools.js';

const TOOL_ITEMS = [
    { id: TOOLS.SELECT, label: 'Select / Move' },
    { id: TOOLS.PAN, label: 'Pan' },
    { id: TOOLS.PLACE, label: '+ Place' },
    { id: TOOLS.TRANSITION, label: '+ Transition' },
    { id: TOOLS.ARC, label: '+ Arc' },
];

export const CanvasToolbar = () => {
    const selectedTool      = usePetriStore((s) => s.selectedTool);
    const setSelectedTool   = usePetriStore((s) => s.setSelectedTool);
    const activeTheme       = usePetriStore((s) => s.activeTheme);
    const mode              = usePetriStore((s) => s.mode);
    const startSimulation   = usePetriStore((s) => s.startSimulation);
    const stopSimulation    = usePetriStore((s) => s.stopSimulation);
    const stepCount         = usePetriStore((s) => s.history.length);

    const theme = THEMES[activeTheme] || THEMES.dark;
    const isRunning = mode === 'run';

    return (
        <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1.5 rounded-lg border shadow-lg backdrop-blur-md transition-colors duration-200 select-none"
            style={{
                backgroundColor: `${theme.sidebar.bg}cc`,
                borderColor: theme.sidebar.border,
            }}
        >
            {TOOL_ITEMS.map((tool) => {
                const isActive = !isRunning && selectedTool === tool.id;
                return (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        disabled={isRunning}
                        title={isRunning ? 'Stop the simulation to edit' : tool.label}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            isRunning ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        style={{
                            backgroundColor: isActive ? theme.place.stroke : 'transparent',
                            color: isActive ? theme.bg : theme.text.label,
                        }}
                    >
                        {tool.label}
                    </button>
                );
            })}

            <div
                className="w-px h-5 mx-1"
                style={{ backgroundColor: theme.sidebar.border }}
            />

            <button
                onClick={isRunning ? stopSimulation : startSimulation}
                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"
                style={{
                    backgroundColor: isRunning ? theme.transition.stroke : theme.place.stroke,
                    color: theme.bg,
                }}
            >
                {isRunning ? 'Stop' : 'Run'}
            </button>

            {isRunning && (
                <span
                    className="px-2 text-xs font-mono"
                    style={{ color: theme.text.label }}
                >
                    step {stepCount}
                </span>
            )}
        </div>
    );
};