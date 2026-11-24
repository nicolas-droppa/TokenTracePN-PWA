import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { LAB_STATUS, LAB_STATUS_KEYS } from '../../../constants/labs';
import { getLab } from '../../../labs/labRegistry';
import { labStatusColor } from '../../../utils/labStatusColor';
import { LabIconBox } from './LabIconBox';
import { LabLink } from './LabLink';
import { useLabText } from '../../../hooks/useLabText';

/**
 * Title, status and actions of the open lab.
 * A locked lab shows which labs to solve first instead of the actions.
 */
export const LabHeader = ({ lab, status, isLocked, missingRequirements = [], onReset, onCheck }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const { title } = useLabText(lab);
    const statusColor = labStatusColor(status, theme);

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <LabIconBox lab={lab} size={34} iconSize={22} isActive={!isLocked} isLocked={isLocked} />

                <div className="flex min-w-0 flex-col gap-1">
                    <h2
                        className="truncate text-xs font-bold tracking-wide"
                        style={{ color: isLocked ? theme.disabled.text : theme.text.label }}
                    >
                        {title}
                    </h2>

                    {isLocked ? (
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]" style={{ color: theme.text.label }}>
                            <span>{t('locked.solveFirst')}</span>
                            {missingRequirements.map((id) => {
                                const required = getLab(id);
                                return required ? <LabLink key={id} lab={required} /> : null;
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: statusColor }}>
                            <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: statusColor }}
                            />
                            <span>{t(LAB_STATUS_KEYS[status] ?? LAB_STATUS_KEYS[LAB_STATUS.TODO])}</span>
                        </div>
                    )}
                </div>
            </div>

            {!isLocked && (
                <div className="flex shrink-0 items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onReset}
                        title={t('actions.resetTooltip')}
                        className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border px-2 text-[10px] font-medium uppercase leading-none tracking-wide transition-colors hover:bg-[var(--hover)]"
                        style={{
                            borderColor: theme.sidebar.border,
                            color: theme.text.label,
                            '--hover': `${theme.text.label}14`,
                        }}
                    >
                        {t('common:actions.reset')}
                    </button>

                    <button
                        type="button"
                        onClick={onCheck}
                        disabled={!onCheck}
                        title={t('actions.checkTooltip')}
                        className="inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[10px] font-semibold uppercase leading-none tracking-wide transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                            backgroundColor: `${theme.place.stroke}18`,
                            color: theme.place.stroke,
                            border: `1px solid ${theme.place.stroke}55`,
                        }}
                    >
                        {t('common:actions.check')}
                    </button>
                </div>
            )}
        </div>
    );
};
