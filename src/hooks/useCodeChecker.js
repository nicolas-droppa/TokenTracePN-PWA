import { useEffect, useState } from 'react';
import * as dpnParser from '../core/parsers/dpnParser';
import { DIAGNOSTIC } from '../constants/diagnostics';

const DEFAULT_DELAY_MS = 450;

/** Unexpected failure (a bug, not a mistake in the code) as a diagnostic. */
function unknownError(err) {
    return {
        severity: 'error',
        code: DIAGNOSTIC.UNKNOWN_ERROR,
        params: { details: err?.message || String(err ?? '') },
        line: err?.line,
        col: err?.col,
    };
}

export const useCodeChecker = ({ code = '', language = 'dpn', delayMs = DEFAULT_DELAY_MS } = {}) => {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (language !== 'dpn') {
            setErrors([]);
            return undefined;
        }

        const timer = setTimeout(() => {
            try {
                const parseFn = dpnParser.parse || (dpnParser.default && dpnParser.default.parse);
                if (!parseFn) {
                    setErrors([unknownError('Parser not available')]);
                    return;
                }

                const parsed = parseFn(code) || {};
                const parsedErrors = Array.isArray(parsed.errors) ? parsed.errors : [];

                setErrors(parsedErrors.length > 0 ? parsedErrors : []);
            } catch (err) {
                setErrors([unknownError(err)]);
            }
        }, delayMs);

        return () => clearTimeout(timer);
    }, [code, language, delayMs]);

    return errors;
};

export default useCodeChecker;
