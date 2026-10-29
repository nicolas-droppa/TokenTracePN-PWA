import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { MatricesView } from '../../analysis/MatricesView';

export const MatricesPanel = () => {
    const theme = useTheme();

    return (
        <div className="h-full w-full overflow-hidden" style={{ backgroundColor: theme.sidebar.bg }}>
            <MatricesView />
        </div>
    );
};