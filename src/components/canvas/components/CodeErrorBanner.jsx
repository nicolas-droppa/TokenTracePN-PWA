import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { useTheme } from '../../../store/useSettingsStore';

/**
 * Shown over the canvas while the code has errors, canvas keeps the last valid net.
 */
export const CodeErrorBanner = () => {
    const theme = useTheme();
    const visible = usePetriStore((s) => s.codeHasErrors && s.mode !== 'run');

    if (!visible) return null;

    return (
        <div
            role="status"
            className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md border px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur-md"
            style={{
                backgroundColor: `${theme.sidebar.bg}e6`,
                borderColor: theme.diagnostics.error,
                color: theme.diagnostics.errorText,
            }}
        >
            Fix the errors in the code to edit the canvas
        </div>
    );
};
