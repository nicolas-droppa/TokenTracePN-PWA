import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { CodeCheckerPanel } from '../../panels/CodeCheckerPanel';

export const ProblemsPanel = () => {
    const theme = useTheme();

    return (
        <div className="h-full w-full overflow-auto" style={{ backgroundColor: theme.sidebar.bg }}>
            <CodeCheckerPanel theme={theme} />
        </div>
    );
};
