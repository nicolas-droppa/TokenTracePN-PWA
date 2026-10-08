const pad = (value) => String(value).padStart(2, '0');

/**
 * Formats a duration for the simulation timer.
 * 5 -> '00:05', 65 -> '01:05', 3665 -> '01:01:05', 90065 -> '01:01:01:05'
 * @param {number} totalSeconds - Seconds.
 * @returns {string} mm:ss | hh:mm:ss | dd:hh:mm:ss.
 */
export const formatElapsedTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    const parts = days > 0
        ? [days, hours, minutes, seconds]
        : hours > 0
            ? [hours, minutes, seconds]
            : [minutes, seconds];

    return parts.map(pad).join(':');
};
