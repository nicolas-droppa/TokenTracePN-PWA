import { useEffect, useState } from 'react';

/**
 * Seconds elapsed.
 * @param {boolean} isRunning - true | false.
 * @returns {number} Seconds.
 */
export const useElapsedTime = (isRunning) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            setElapsedSeconds(0);
            return undefined;
        }

        const startAt = Date.now();
        const intervalId = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startAt) / 1000));
        }, 250);

        return () => clearInterval(intervalId);
    }, [isRunning]);

    return elapsedSeconds;
};
