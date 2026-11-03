import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { Field } from './Field';
import { InputField } from './InputField';

export const PlaceFields = ({ element, isRunning, theme }) => {
    const setAttribute = usePetriStore((s) => s.setAttribute);
    const marking = usePetriStore((s) => s.marking);
    const arcs = usePetriStore((s) => s.arcs);
    const transitions = usePetriStore((s) => s.transitions);

    const incomingTransitions = arcs
        .filter((arc) => arc.target === element.id)
        .map((arc) => transitions.find((transition) => transition.id === arc.source)?.label || arc.source);

    const outgoingTransitions = arcs
        .filter((arc) => arc.source === element.id)
        .map((arc) => transitions.find((transition) => transition.id === arc.target)?.label || arc.target);

    return (
        <div className="space-y-2.5">
            <InputField
                label="Label"
                value={element.label || ''}
                placeholder={element.id}
                disabled={isRunning}
                onChange={(nextValue) => setAttribute(element.id, 'label', nextValue)}
                theme={theme}
            />

            <InputField
                label="Initial tokens"
                type="number"
                min={0}
                value={element.tokens ?? 0}
                disabled={isRunning}
                onChange={(nextValue) =>
                    setAttribute(element.id, 'tokens', Math.max(0, parseInt(nextValue, 10) || 0))
                }
                theme={theme}
            />

            <Field
                label="Input transitions"
                value={incomingTransitions.length ? incomingTransitions.join(', ') : '—'}
                theme={theme}
                readOnly
            />

            <Field
                label="Output transitions"
                value={outgoingTransitions.length ? outgoingTransitions.join(', ') : '—'}
                theme={theme}
                readOnly
            />

            {isRunning && (
                <Field
                    label="Current marking"
                    value={marking?.[element.id] ?? 0}
                    theme={theme}
                />
            )}
        </div>
    );
};
