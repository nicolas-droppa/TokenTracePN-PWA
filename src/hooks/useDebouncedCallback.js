import { useCallback, useEffect, useRef } from 'react';

/**
 * Debounced version of a callback.
 * Pending call is flushed on unmount, so nothing typed is lost when the component goes away.
 * @param {Function} callback - Function to call after the delay.
 * @param {number} delayMs - Delay in milliseconds.
 * @returns {Function & { flush: () => void, cancel: () => void }}
 */
export const useDebouncedCallback = (callback, delayMs) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const timerRef = useRef(null);
    const argsRef = useRef(null);

    const cancel = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        argsRef.current = null;
    }, []);

    const flush = useCallback(() => {
        if (!timerRef.current) return;
        const args = argsRef.current;
        cancel();
        callbackRef.current(...args);
    }, [cancel]);

    const debounced = useCallback(
        (...args) => {
            argsRef.current = args;
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(flush, delayMs);
        },
        [delayMs, flush]
    );

    useEffect(() => flush, [flush]);

    debounced.flush = flush;
    debounced.cancel = cancel;
    return debounced;
};
