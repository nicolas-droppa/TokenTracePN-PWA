import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { useLabStore } from '../../../store/useLabStore';
import { getLab } from '../../../labs/labRegistry';
import { LabIcon, LAB_UI_ICONS } from './LabIcon';

/**
 * Calm placeholder for the tabs of a locked lab (the task stays readable).
 * @param {Object} props
 * @param {'code'|'reference'} props.tab - Tab it replaces (picks the message).
 * @param {string[]} props.missingRequirements - Ids of labs to solve first.
 */
export const LabLockedState = ({ tab, missingRequirements = [] }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const openLab = useLabStore((s) => s.openLab);

    const firstMissing = getLab(missingRequirements[0]);
    const labs = missingRequirements.map((id) => getLab(id)?.title ?? id).join(', ');

    return (
        <div
            className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-xs"
            style={{ backgroundColor: theme.sidebar.inputBg, color: theme.text.label }}
        >
            <span
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{ borderColor: theme.sidebar.border }}
            >
                <LabIcon src={LAB_UI_ICONS.lock} size={18} className="opacity-60" />
            </span>

            <p className="max-w-[240px] leading-relaxed">{t(`locked.${tab}`, { labs })}</p>

            {firstMissing && (
                <button
                    type="button"
                    onClick={() => openLab(firstMissing.id)}
                    className="cursor-pointer rounded-md border px-3 py-1.5 text-[11px] transition-colors hover:bg-[var(--hover)]"
                    style={{
                        borderColor: theme.sidebar.border,
                        color: theme.text.code,
                        '--hover': `${theme.text.label}14`,
                    }}
                >
                    {t('locked.open', { lab: firstMissing.title })} →
                </button>
            )}
        </div>
    );
};
