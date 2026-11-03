import { useEffect } from 'react';

/**
 * Calls onOutside when the user presses the mouse outside of the given element.
 * @param {React.RefObject<HTMLElement>} ref - Element to watch.
 * @param {Function} onOutside - Called on outside press.
 */
export const useClickOutside = (ref, onOutside) => {
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;

            const activeElement = document.activeElement;
            if (activeElement && ref.current.contains(activeElement)) {
                activeElement.blur();
            }

            onOutside();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [ref, onOutside]);
};
