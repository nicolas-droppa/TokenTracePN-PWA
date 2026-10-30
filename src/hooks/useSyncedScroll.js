/**
 * Keeps scroll containers at the same scroll position.
 * bind(index) for each container and pass the result to it.
 * @returns {(index: number) => { ref: Function, onScroll: Function }}
 */
import { useRef } from 'react';

export const useSyncedScroll = () => {
    const containers = useRef([]);

    const bind = (index) => ({
        ref: (element) => {
            containers.current[index] = element;
        },
        onScroll: (event) => {
            const { scrollTop, scrollLeft } = event.currentTarget;

            containers.current.forEach((element, i) => {
                if (i === index || !element) return;
                // Stops echoing the scroll event back to original container
                if (element.scrollTop !== scrollTop) element.scrollTop = scrollTop;
                if (element.scrollLeft !== scrollLeft) element.scrollLeft = scrollLeft;
            });
        },
    });

    return bind;
};