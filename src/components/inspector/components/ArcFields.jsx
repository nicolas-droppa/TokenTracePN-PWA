import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { InputField } from './InputField';

export const ArcFields = ({ element, isRunning, theme }) => {
    const setAttribute = usePetriStore((s) => s.setAttribute);
    const places = usePetriStore((s) => s.places);
    const transitions = usePetriStore((s) => s.transitions);

    const isPlaceToTransition =
        places.some((place) => place.id === element.source) &&
        transitions.some((transition) => transition.id === element.target);

    const selectedArcType = isPlaceToTransition ? (element.arcType || 'regular') : 'regular';

    return (
        <div className="space-y-2.5">
            <InputField
                label="Weight"
                type="number"
                min={1}
                value={element.weight ?? 1}
                disabled={isRunning}
                onChange={(nextValue) =>
                    setAttribute(element.id, 'weight', Math.max(1, parseInt(nextValue, 10) || 1))
                }
                theme={theme}
            />

            <InputField
                label="Type"
                select
                value={selectedArcType}
                disabled={isRunning}
                onChange={(nextValue) => setAttribute(element.id, 'type', nextValue)}
                options={[
                    { value: 'regular', label: 'Regular' },
                    { value: 'read', label: 'Read', disabled: !isPlaceToTransition },
                    { value: 'inhibitor', label: 'Inhibitor', disabled: !isPlaceToTransition },
                    { value: 'reset', label: 'Reset', disabled: !isPlaceToTransition },
                ]}
                theme={theme}
            />
        </div>
    );
};
