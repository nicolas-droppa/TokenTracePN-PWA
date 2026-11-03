import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { Field } from './Field';
import { InputField } from './InputField';

export const TransitionFields = ({ element, isFireable, isRunning, theme }) => {
    const setAttribute = usePetriStore((s) => s.setAttribute);
    const arcs = usePetriStore((s) => s.arcs);
    const places = usePetriStore((s) => s.places);

    const inputPlaces = arcs
        .filter((arc) => arc.target === element.id)
        .map((arc) => places.find((place) => place.id === arc.source)?.label || arc.source);

    const outputPlaces = arcs
        .filter((arc) => arc.source === element.id)
        .map((arc) => places.find((place) => place.id === arc.target)?.label || arc.target);

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

            <Field
                label="Input places"
                value={inputPlaces.length ? inputPlaces.join(', ') : '—'}
                theme={theme}
                readOnly
            />

            <Field
                label="Output places"
                value={outputPlaces.length ? outputPlaces.join(', ') : '—'}
                theme={theme}
                readOnly
            />

            {isRunning && (
                <Field
                    label="Enabled"
                    value={isFireable ? 'yes' : 'no'}
                    theme={theme}
                    readOnly
                />
            )}
        </div>
    );
};
