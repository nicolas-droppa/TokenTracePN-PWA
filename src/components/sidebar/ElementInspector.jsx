import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const ElementInspector = () => {
    const { selectedElement, updateElement, places, transitions, arcs, activeTheme } = usePetriStore();
    const theme = THEMES[activeTheme] || THEMES.dark;

    if (!selectedElement) {
        return (
            <div 
                className="p-4 text-xs h-full flex flex-col justify-center items-center text-center"
                style={{ color: theme.disabled.text }}
            >
                <p className="font-medium mb-1" style={{ color: theme.text.label }}>
                    Select an element on the canvas to view and edit its properties.
                </p>
                
                <div 
                    className="mt-4 pt-4 border-t w-full text-left space-y-1"
                    style={{ borderColor: theme.sidebar.border }}
                >
                    <p>Places: <span className="font-semibold" style={{ color: theme.text.label }}>{places.length}</span></p>
                    <p>Transitions: <span className="font-semibold" style={{ color: theme.text.label }}>{transitions.length}</span></p>
                    <p>Arcs: <span className="font-semibold" style={{ color: theme.text.label }}>{arcs.length}</span></p>
                </div>
            </div>
        );
    }

    const isPlace = places.some((p) => p.id === selectedElement.id);
    const isTransition = transitions.some((t) => t.id === selectedElement.id);
    const isArc = arcs.some((a) => a.id === selectedElement.id);

    return (
        <div 
            className="p-4 space-y-4 overflow-y-auto h-full text-xs"
            style={{ color: theme.text.label }}
        >
            <div 
                className="flex items-center justify-between border-b pb-2"
                style={{ borderColor: theme.sidebar.border }}
            >
                <h3 className="text-xs uppercase tracking-wider font-semibold">
                    Inspector — {isPlace ? 'Place' : isTransition ? 'Transition' : 'Arc'}
                </h3>
                <span 
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ 
                        backgroundColor: theme.sidebar.inputBg,
                        color: theme.disabled.text,
                        border: `1px solid ${theme.sidebar.inputBorder}`
                    }}
                >
                    {selectedElement.id}
                </span>
            </div>

            {/* Label Field */}
            {(isPlace || isTransition) && (
                <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.label }}>
                        Label
                    </label>
                    <input
                        type="text"
                        value={selectedElement.label || ''}
                        onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                        className="w-full rounded px-2.5 py-1.5 text-xs focus:outline-none transition-colors"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            borderColor: theme.sidebar.inputBorder,
                            color: theme.text.token,
                            border: `1px solid ${theme.sidebar.inputBorder}`
                        }}
                    />
                </div>
            )}

            {/* Place Specifics: Tokens */}
            {isPlace && (
                <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.label }}>
                        Number of Tokens
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={selectedElement.tokens ?? 0}
                        onChange={(e) =>
                            updateElement(selectedElement.id, {
                                tokens: Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                        }
                        className="w-full rounded px-2.5 py-1.5 text-xs focus:outline-none transition-colors"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            borderColor: theme.sidebar.inputBorder,
                            color: theme.text.token,
                            border: `1px solid ${theme.sidebar.inputBorder}`
                        }}
                    />
                </div>
            )}

            {/* Arc Specifics: Weight */}
            {isArc && (
                <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.label }}>
                        Weight
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={selectedElement.weight ?? 1}
                        onChange={(e) =>
                            updateElement(selectedElement.id, {
                                weight: Math.max(1, parseInt(e.target.value, 10) || 1),
                            })
                        }
                        className="w-full rounded px-2.5 py-1.5 text-xs focus:outline-none transition-colors"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            borderColor: theme.sidebar.inputBorder,
                            color: theme.text.token,
                            border: `1px solid ${theme.sidebar.inputBorder}`
                        }}
                    />
                </div>
            )}
        </div>
    );
};