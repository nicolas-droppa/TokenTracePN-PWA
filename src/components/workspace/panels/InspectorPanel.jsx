import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { ElementInspector } from '../../panels/ElementInspector';

export const InspectorPanel = () => {
    const theme = useTheme();

    return (
        <div className="h-full w-full overflow-hidden" style={{ backgroundColor: theme.sidebar.bg }}>
            <ElementInspector />
        </div>
    );
};
