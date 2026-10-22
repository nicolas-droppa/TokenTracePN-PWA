import { useEffect, useState } from 'react';
import * as dpnParser from '../core/parsers/dpnParser';

const DEFAULT_DELAY_MS = 450;

function normalizeParseError(err) {
    if (!err) return { message: 'Unknown error' };
    if (typeof err === 'string') return { message: err };
    return {
        message: err.message || err.msg || String(err),
        line: err.line,
        col: err.col,
        severity: err.severity,
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
                    setErrors([normalizeParseError('Parser not available')]);
                    return;
                }

                const parsed = parseFn(code) || {};
                const parsedErrors = Array.isArray(parsed.errors) ? parsed.errors : [];

                setErrors(parsedErrors.length > 0 ? parsedErrors : []);
            } catch (err) {
                setErrors([normalizeParseError(err)]);
            }
        }, delayMs);

        return () => clearTimeout(timer);
    }, [code, language, delayMs]);

    console.log('useCodeChecker errors:', errors);
    return errors;
};

export default useCodeChecker;
