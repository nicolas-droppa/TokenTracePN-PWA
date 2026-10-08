import { useEffect } from 'react';

/**
 * Calls onOutside when the user presses the mouse outside of the given element.
 * @param {React.RefObject<HTMLElement>} ref - Element to watch.
 * @param {Function} onOutside - Called on outside press.
 */
export const useClickOutside = (ref, onOutside) => {
    useEffect(() => {
        const handleMouseDown = (event) => {
            if (ref.current && !ref.current.contains(event.target)) onOutside();
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [ref, onOutside]);
};
