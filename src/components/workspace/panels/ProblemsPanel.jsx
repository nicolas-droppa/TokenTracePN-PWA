import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { useTheme } from '../../../store/useSettingsStore';
import { CodeCheckerPanel } from '../../panels/CodeCheckerPanel';

export const ProblemsPanel = () => {
    const theme = useTheme();
    const code = usePetriStore((s) => s.code);
    const language = usePetriStore((s) => s.language);

    return (
        <div className="h-full w-full overflow-auto" style={{ backgroundColor: theme.sidebar.bg }}>
            <CodeCheckerPanel theme={theme} code={code} language={language} />
        </div>
    );
};
