import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const CanvasToolbar = () => {
    const { selectedTool, setSelectedTool, activeTheme } = usePetriStore();
    const theme = THEMES[activeTheme] || THEMES.dark;

    const tools = [
        { id: 'select', label: 'Select / Move' },
        { id: 'pan', label: 'Pan' },
        { id: 'place', label: '+ Place' },
        { id: 'transition', label: '+ Transition' },
        { id: 'arc', label: '+ Arc' },
    ];

    return (
        <div
            className="absolute top-4 left-4 z-10 flex items-center space-x-1 p-1.5 rounded-lg border shadow-lg backdrop-blur-md transition-colors duration-200 select-none"
            style={{
                backgroundColor: `${theme.sidebar.bg}cc`,
                borderColor: theme.sidebar.border,
            }}
        >
            {tools.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer"
                        style={{
                            backgroundColor: isActive ? theme.place.stroke : 'transparent',
                            color: isActive ? theme.bg : theme.text.label,
                        }}
                    >
                        {tool.label}
                    </button>
                );
            })}
        </div>
    );
};