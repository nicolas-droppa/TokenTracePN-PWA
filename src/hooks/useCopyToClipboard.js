import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to handle copying text to clipboard.
 * @returns {Object} Object containing the copy function.
 */
export const useCopyToClipboard = () => {
    const copy = async (text) => {
        if (!navigator?.clipboard) return false;

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Failed to copy text', error);
            return false;
        }
    };

    return { copy };
};
