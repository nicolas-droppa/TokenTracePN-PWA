import { useEffect } from 'react';
import { usePetriStore } from '../store/usePetriStore';
import { parse } from '../core/parsers/dpnParser';
import { buildNet } from '../core/parsers/dpnBuilder';

const SYNC_DELAY_MS = 400;

/**
 * Code -> canvas: after the user stops typing, parses the DPN code and replaces the net in the store.
 */
export const useCodeSync = () => {
    const code = usePetriStore((s) => s.code);
    const language = usePetriStore((s) => s.language);
    const isRunning = usePetriStore((s) => s.mode === 'run');
    const setNet = usePetriStore((s) => s.setNet);
    const setCodeHasErrors = usePetriStore((s) => s.setCodeHasErrors);

    useEffect(() => {
        // isRunning is a dependency so the latest code is applied right after Stop
        if (language !== 'dpn') {
            setCodeHasErrors(false);
            return undefined;
        }
        if (isRunning) return undefined;

        const timer = setTimeout(() => {
            const { model, errors } = parse(code);
            const hasErrors = !model || errors.some((err) => err.severity === 'error');

            setCodeHasErrors(hasErrors);
            if (!hasErrors) setNet(buildNet(model));
        }, SYNC_DELAY_MS);

        return () => clearTimeout(timer);
    }, [code, language, isRunning, setNet, setCodeHasErrors]);
};
