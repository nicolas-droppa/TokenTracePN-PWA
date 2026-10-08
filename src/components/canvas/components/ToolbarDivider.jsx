import React from 'react';
import { useTheme } from '../../../store/useSettingsStore.js';

export const ToolbarDivider = () => {
    const theme = useTheme();

    return (
        <div className="py-1">
            <div className="h-px w-full" style={{ backgroundColor: theme.sidebar.border }} />
        </div>
    );
};
