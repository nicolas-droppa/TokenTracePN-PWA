import React from 'react';
import { usePetriStore } from '../../store/usePetriStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { THEMES } from '../../theme.js';
import { TOOLS } from '../../constants/tools.js';

const TOOL_ITEMS = [
    { id: TOOLS.SELECT, label: 'Select', icon: '/icons/tools/select.svg' },
    { id: TOOLS.PAN, label: 'Pan', icon: '/icons/tools/pan.svg' },
    { id: TOOLS.PLACE, label: 'Place', icon: '/icons/tools/place.svg' },
    { id: TOOLS.TRANSITION, label: 'Transition', icon: '/icons/tools/transition.svg' },
    { id: TOOLS.ARC, action: TOOLS.ARC, isArc: true, label: 'Arc', icon: '/icons/tools/arc_regular.svg' },
    { id: 'arc-read', action: TOOLS.ARC, isArc: true, label: 'Read arc', icon: '/icons/tools/arc_read.svg' },
    { id: 'arc-inhibitor', action: TOOLS.ARC, isArc: true, label: 'Inhibitor', icon: '/icons/tools/arc_inhibitor.svg' },
    { id: 'arc-reset', action: TOOLS.ARC, isArc: true, label: 'Reset arc', icon: '/icons/tools/arc_reset.svg' },
];

export const CanvasToolbar = () => {
    const [selectedArcId, setSelectedArcId] = React.useState(TOOLS.ARC);
    const selectedTool      = usePetriStore((s) => s.selectedTool);
    const setSelectedTool   = usePetriStore((s) => s.setSelectedTool);
    const activeTheme       = useSettingsStore((s) => s.activeTheme);
    const mode              = usePetriStore((s) => s.mode);
    const startSimulation   = usePetriStore((s) => s.startSimulation);
    const stopSimulation    = usePetriStore((s) => s.stopSimulation);
    const stepCount         = usePetriStore((s) => s.history.length);

    const theme = THEMES[activeTheme] || THEMES.dark;
    const isRunning = mode === 'run';
    const iconFilter = activeTheme === 'light' ? 'none' : 'invert(1)';

    return (
        <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1.5 rounded-lg border shadow-lg backdrop-blur-md transition-colors duration-200 select-none"
            style={{
                backgroundColor: `${theme.sidebar.bg}cc`,
                borderColor: theme.sidebar.border,
            }}
        >
            {TOOL_ITEMS.map((tool) => {
                const isActive = !isRunning
                    && selectedTool === (tool.action || tool.id)
                    && (!tool.isArc || selectedArcId === tool.id);
                return (
                    <button
                        key={tool.id}
                        onClick={() => {
                            setSelectedArcId(tool.id);
                            setSelectedTool(tool.action || tool.id);
                        }}
                        disabled={isRunning}
                        title={isRunning ? 'Stop the simulation to edit' : tool.label}
                        className={`flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-none text-[10px] font-medium transition-all ${
                            isRunning ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        style={{
                            backgroundColor: 'transparent',
                            color: isActive ? theme.place.stroke : theme.text.label,
                            borderBottom: isActive ? `2px solid ${theme.place.stroke}` : '2px solid transparent',
                        }}
                    >
                        <img
                            src={tool.icon}
                            alt=""
                            aria-hidden="true"
                            className="h-8 w-8 object-contain"
                            style={{ filter: iconFilter }}
                        />
                        {tool.label}
                    </button>
                );
            })}

            <div
                className="w-px h-10 mx-1"
                style={{ backgroundColor: theme.sidebar.border }}
            />

            <button
                onClick={isRunning ? stopSimulation : startSimulation}
                className="flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer"
                style={{
                    backgroundColor: isRunning ? theme.transition.stroke : theme.place.stroke,
                    color: theme.bg,
                }}
            >
                <img
                    src={isRunning ? '/icons/system/sys_stop.svg' : '/icons/system/sys_start.svg'}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 object-contain"
                    style={{ filter: iconFilter }}
                />
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