import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { getLabSolution } from '../../../labs/labRegistry';
import { LabCodeEditor } from './LabCodeEditor';
import { LabIcon, LAB_UI_ICONS } from './LabIcon';

/**
 * Reference solution of a lab, shown only after the lab is solved (all tests pass).
 * The file is loaded only then.
 * @param {Object} props
 * @param {Object} props.lab - Lab from the registry.
 * @param {boolean} props.isSolved - Is the lab solved?
 */
export const LabReference = ({ lab, isSolved }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const [solution, setSolution] = useState(undefined); // undefined = loading

    useEffect(() => {
        if (!isSolved) return undefined;

        let cancelled = false;
        getLabSolution(lab.id).then((code) => {
            if (!cancelled) setSolution(code);
        });

        return () => {
            cancelled = true;
        };
    }, [isSolved, lab.id]);

    if (!isSolved) {
        return (
            <div
                className="flex h-full flex-col items-center justify-center gap-3 p-7 text-center text-xs"
                style={{ backgroundColor: theme.sidebar.inputBg, color: theme.text.label }}
            >
                <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border"
                    style={{ borderColor: theme.sidebar.border }}
                >
                    <LabIcon src={LAB_UI_ICONS.lock} size={18} className="opacity-60" />
                </span>
                <p className="font-semibold" style={{ color: theme.text.code }}>{t('reference.title')}</p>
                <p className="max-w-[260px] leading-relaxed">{t('reference.lockedUntilSolved')}</p>
            </div>
        );
    }

    if (solution === undefined || solution === null) {
        return (
            <div
                className="flex h-full items-center justify-center p-6 text-xs"
                style={{ backgroundColor: theme.sidebar.inputBg, color: theme.text.label }}
            >
                {t(solution === null ? 'reference.missing' : 'reference.loading')}
            </div>
        );
    }

    return <LabCodeEditor key="reference" initialCode={solution} readOnly title={t('reference.editorTitle')} />;
};
