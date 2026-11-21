import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';

// temp
const stripFrontmatter = (markdown) => markdown.replace(/^---[\s\S]*?---\s*/, '');

/**
 * Task of the lab (stays readable when the lab is locked).
 */
export const LabDescription = ({ lab }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const content = stripFrontmatter(lab.description || '').trim();

    return (
        <div
            className="h-full overflow-auto p-3 text-xs leading-relaxed"
            style={{ backgroundColor: theme.sidebar.inputBg, color: theme.text.code }}
        >
            {content ? (
                <div className="whitespace-pre-wrap">{content}</div>
            ) : (
                <p style={{ color: theme.disabled.text }}>{t('noDescription')}</p>
            )}
        </div>
    );
};
