import React from 'react';
import { useTheme } from '../../store/useSettingsStore';

export const Divider = () => {
    const theme = useTheme();

    return (
        <div className="py-1">
            <div className="h-px w-full" style={{ backgroundColor: theme.sidebar.border }} />
        </div>
    );
};
