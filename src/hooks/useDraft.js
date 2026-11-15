import { useEffect, useRef, useState } from 'react';

/**
 * Local draft for an input: commits on blur or Enter.
 * @param {Object} options
 * @param {*} options.value - Current committed value.
 * @param {(value: *) => string} [options.format] - Value -> input text.
 * @param {(draft: string) => void} options.onCommit - Called with the draft on blur or Enter.
 * @param {(event: KeyboardEvent) => void} [options.onKeyDown] - Extra key handling (arrows).
 * @returns {{ draft: string, inputProps: Object }}
 */
export const useDraft = ({ value, format = String, onCommit, onKeyDown }) => {
    const [draft, setDraft] = useState(() => format(value));
    const cancelRef = useRef(false);

    useEffect(() => {
        setDraft(format(value));
    }, [value, format]);

    const handleBlur = () => {
        if (!cancelRef.current) onCommit(draft);
        cancelRef.current = false;
        setDraft(format(value));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            cancelRef.current = true;
            event.currentTarget.blur();
            return;
        }
        onKeyDown?.(event);
    };

    return {
        draft,
        inputProps: {
            value: draft,
            onChange: (event) => setDraft(event.target.value),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
        },
    };
};