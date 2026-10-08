import { useEffect, useRef } from 'react';

/**
 * True when the user is typing somewhere (input, textarea, CodeMirror...),
 * so single-key shortcuts must not fire.
 */
const isTypingTarget = (element) =>
    element instanceof HTMLElement &&
    (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));

/**
 * Global single-key shortcuts.
 *
 * @param {Array<{
 *   codes: string[],            // KeyboardEvent.code values that trigger it
 *   handler: Function,          // what to do
 *   enabled?: boolean,          // false = key passes through untouched (default true)
 *   repeat?: boolean,           // true = fires again while the key is held (default false)
 * }>} bindings
 */
export const useKeyboardShortcuts = (bindings) => {
    const bindingsRef = useRef(bindings);
    bindingsRef.current = bindings;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.defaultPrevented || event.isComposing) return;
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (isTypingTarget(event.target)) return;

            const binding = bindingsRef.current.find((b) => b.codes?.includes(event.code));
            if (!binding || binding.enabled === false) return;

            event.preventDefault();
            if (event.repeat && !binding.repeat) return;

            binding.handler(event);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};
