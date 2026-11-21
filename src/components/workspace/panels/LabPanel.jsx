import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { useLabStore } from '../../../store/useLabStore';
import { LABS, getLab } from '../../../labs/labRegistry';
import { useLabText } from '../../../hooks/useLabText';
import { LabView } from '../../lab-panel/LabView';

const LabPanelListItem = ({ lab, onOpen, borderColor, hoverColor }) => {
    const { title } = useLabText(lab);

    return (
        <button
            type="button"
            onClick={() => onOpen(lab.id)}
            className="cursor-pointer rounded-md border px-2 py-1.5 text-left transition-colors hover:bg-[var(--hover)]"
            style={{ borderColor, '--hover': hoverColor }}
        >
            {title}
        </button>
    );
};

/**
 * Dockview panel showing the active lab.
 * Without an active lab it lists the labs (the lab bar is hidden on mobile).
 */
export const LabPanel = () => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const activeLabId = useLabStore((s) => s.activeLabId);
    const openLab = useLabStore((s) => s.openLab);
    const lab = getLab(activeLabId);

    return (
        <div className="h-full w-full overflow-hidden" style={{ backgroundColor: theme.sidebar.bg }}>
            {lab ? (
                <LabView key={lab.id} lab={lab} />
            ) : (
                <div className="flex flex-col gap-2 p-3 text-xs" style={{ color: theme.text.label }}>
                    <p>{t('empty')}</p>
                    {LABS.map((item) => (
                        <LabPanelListItem
                            key={item.id}
                            lab={item}
                            onOpen={openLab}
                            borderColor={theme.sidebar.border}
                            hoverColor={`${theme.text.label}14`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
