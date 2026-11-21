import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { LAB_STATUS, LAB_STATUS_KEYS } from '../../../constants/labs';
import { labStatusColor } from '../../../utils/labStatusColor';
import { LabIconBox } from '../../lab-panel/components/LabIconBox';
import { useLabStore, selectLabStatus, missingRequirements } from '../../../store/useLabStore';
import { getLab, getLabText } from '../../../labs/labRegistry';
import { useLabText } from '../../../hooks/useLabText';

/**
 * One icon in the lab bar.
 * @param {Object} props - Component props.
 * @param {Object} props.lab - Lab with id, icon and texts.
 * @param {boolean} props.isActive - Whether the lab is currently active.
 * @param {Function} props.onClick - Click handler.
 */
export const LabBarItem = ({ lab, isActive = false, onClick }) => {
    const { t } = useTranslation('labBar');
    const { i18n } = useTranslation();
    const theme = useTheme();
    const status = useLabStore(selectLabStatus(lab));
    const solvedLabs = useLabStore((s) => s.solvedLabs);
    const isLocked = status === LAB_STATUS.LOCKED;
    const statusLabel = t(LAB_STATUS_KEYS[status] ?? LAB_STATUS_KEYS[LAB_STATUS.LOCKED]);
    const { title, summary } = useLabText(lab);

    let tooltip = summary ? `${title} [${statusLabel}]\n${summary}` : `${title} [${statusLabel}]`;
    if (status === LAB_STATUS.LOCKED) {
        const missing = missingRequirements(lab, solvedLabs).map((labId) => {
            const reqLab = getLab(labId);
            return reqLab ? getLabText(reqLab, i18n.language).title : labId;
        });
        tooltip = `${title} [${statusLabel}]\n${t('requires', { labs: missing.join(', ') })}`;
    }

    return (
        <button
            type="button"
            title={tooltip}
            aria-label={`${title}, ${statusLabel}`}
            aria-pressed={isActive}
            onClick={onClick}
            className="group relative flex h-12 w-full cursor-pointer items-center justify-center"
        >
            <LabIconBox lab={lab} isActive={isActive} isLocked={isLocked} />

            <span
                className="absolute bottom-1 right-[9px] h-[5px] w-[5px] rounded-full"
                style={{ backgroundColor: labStatusColor(status, theme), boxShadow: `0 0 0 2px ${theme.sidebar.bg}` }}
                aria-hidden="true"
            />
        </button>
    );
};
