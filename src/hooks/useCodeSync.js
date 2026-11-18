import { useEffect } from 'react';
import { usePetriStore } from '../store/usePetriStore';
import { netFromCode } from '../core/parsers/dpn';

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
    const setDiagnostics = usePetriStore((s) => s.setDiagnostics);

    useEffect(() => {
        // isRunning is a dependency so the latest code is applied right after Stop
        if (language !== 'dpn') {
            setCodeHasErrors(false);
            setDiagnostics([]);
            return undefined;
        }
        if (isRunning) return undefined;

        const timer = setTimeout(() => {
            const { net, diagnostics } = netFromCode(code);
            const hasErrors = !net || diagnostics.some((err) => err.severity === 'error');

            setCodeHasErrors(hasErrors);
            setDiagnostics(diagnostics);
            if (net) setNet(net);
        }, SYNC_DELAY_MS);

        return () => clearTimeout(timer);
    }, [code, language, isRunning, setNet, setCodeHasErrors, setDiagnostics]);
};
