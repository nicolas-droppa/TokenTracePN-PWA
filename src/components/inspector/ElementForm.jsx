import React from 'react';
import { useTheme } from '../../store/useSettingsStore';
import { usePetriStore } from '../../store/usePetriStore';
import { isEnabled } from '../../core/petriEngine';
import { InputField } from './components/InputField';
import { PlaceFields } from './components/PlaceFields';
import { TransitionFields } from './components/TransitionFields';
import { ArcFields } from './components/ArcFields';
import { Divider } from '../ui/Divider';

export const ElementForm = ({ element }) => {
    const mode = usePetriStore((s) => s.mode);
    const marking = usePetriStore((s) => s.marking);
    const setAttribute = usePetriStore((s) => s.setAttribute);
    const transitions = usePetriStore((s) => s.transitions);
    const arcs = usePetriStore((s) => s.arcs);

    const theme = useTheme();

    if (!element) return null;

    const isRunning = mode === 'run';
    const isPlace = element.type === 'place';
    const isTransition = element.type === 'transition';
    const isArc = element.type === 'arc';
    const isFireable = isTransition && isRunning && isEnabled({ transitions, arcs }, marking ?? {}, element.id);

    const commonFields = (
        <>
            {element.x !== undefined && element.y !== undefined && (
                <div className="space-y-1.5">
                    <div
                        className="text-[9px] font-medium uppercase tracking-[0.12em]"
                        style={{ color: theme.text.label }}
                    >
                        Position
                    </div>
                    <div className="flex w-full items-center gap-2.5">
                        <InputField
                            label="X"
                            inline
                            type="number"
                            value={element.x}
                            disabled={isRunning}
                            onChange={(nextValue) =>
                                setAttribute(element.id, 'x', Number.isFinite(Number(nextValue)) ? Math.round(Number(nextValue)) : 0)
                            }
                            theme={theme}
                        />
                        <InputField
                            label="Y"
                            inline
                            type="number"
                            value={element.y}
                            disabled={isRunning}
                            onChange={(nextValue) =>
                                setAttribute(element.id, 'y', Number.isFinite(Number(nextValue)) ? Math.round(Number(nextValue)) : 0)
                            }
                            theme={theme}
                        />
                    </div>
                </div>
            )}
        </>
    );

    let extraFields = null;

    if (isPlace) {
        extraFields = <PlaceFields element={element} isRunning={isRunning} theme={theme} />;
    } else if (isTransition) {
        extraFields = <TransitionFields element={element} isFireable={isFireable} isRunning={isRunning} theme={theme} />;
    } else if (isArc) {
        extraFields = <ArcFields element={element} isRunning={isRunning} theme={theme} />;
    }

    return (
        <div className="space-y-2.5" style={{ color: theme.text.label }}>
            {commonFields}
            {extraFields && (
                <>
                    {isArc ? null : <Divider />}
                    {extraFields}
                </>
            )}
        </div>
    );
};
