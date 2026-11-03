import { useEffect, useRef } from 'react';
import { LONG_PRESS } from '../constants/interaction';

/**
 * Calls onLongPress when a touch is held still on the element.
 * @param {Function} onLongPress
 */
export const useLongPress = (onLongPress) => {
    const timerRef = useRef(null);
    const startRef = useRef(null);

    const cancel = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        startRef.current = null;
    };

    useEffect(() => cancel, []);

    const onPointerDown = (event) => {
        if (event.pointerType !== 'touch') return;

        startRef.current = { x: event.clientX, y: event.clientY };
        timerRef.current = setTimeout(() => {
            cancel();
            onLongPress(event);
        }, LONG_PRESS.DURATION_MS);
    };

    const onPointerMove = (event) => {
        if (!startRef.current) return;

        const dx = event.clientX - startRef.current.x;
        const dy = event.clientY - startRef.current.y;
        
        if (Math.hypot(dx, dy) > LONG_PRESS.MOVE_TOLERANCE_PX) cancel();
    };

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp: cancel,
        onPointerLeave: cancel,
        onPointerCancel: cancel,
    };
};