import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const Toolbar = () => {
  const { selectedTool, setSelectedTool, activeTheme, setTheme } = usePetriStore();

  const tools = [
    { id: 'select', label: 'Select / Move' },
    { id: 'pan', label: 'Pan (Posun)' },
    { id: 'place', label: '+ Place' },
    { id: 'transition', label: '+ Transition' },
    { id: 'arc', label: '+ Arc' },
  ];

  return (
    <div className="absolute top-4 left-4 flex gap-3 z-10">
      {/* Tools */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-xl flex gap-1.5 shadow-2xl">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTool === tool.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Theme Toggler */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-xl flex gap-1.5 shadow-2xl">
        {Object.keys(THEMES).map((themeKey) => (
          <button
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeTheme === themeKey
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {THEMES[themeKey].label}
          </button>
        ))}
      </div>
    </div>
  );
};