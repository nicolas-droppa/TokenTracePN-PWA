import { useCallback, useSyncExternalStore } from 'react';

/**
 * True while the CSS media query matches. Re-renders on change.
 * @param {string} query - e.g. '(max-width: 767px)'.
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
    const subscribe = useCallback(
        (onChange) => {
            const media = window.matchMedia(query);
            media.addEventListener('change', onChange);
            return () => media.removeEventListener('change', onChange);
        },
        [query]
    );

    return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
};
