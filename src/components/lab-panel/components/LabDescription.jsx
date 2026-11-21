import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { useLabText } from '../../../hooks/useLabText';
import './labMarkdown.css';

/**
 * Task of the lab (stays readable when the lab is locked).
 */
export const LabDescription = ({ lab }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();
    const { body } = useLabText(lab);

    return (
        <div
            className="h-full overflow-auto p-3 text-xs leading-relaxed"
            style={{ backgroundColor: theme.sidebar.inputBg, color: theme.text.code }}
        >
            {body ? (
                <div className="lab-md" style={{
                    '--md-text': theme.text.label,
                    '--md-strong': theme.text.code,
                    '--md-muted': theme.text.label,
                    '--md-border': theme.sidebar.border,
                    '--md-code-bg': `${theme.text.label}1f`,
                    '--md-pre-bg': theme.sidebar.bg,
                }}>
                    <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
                </div>
            ) : (
                <p style={{ color: theme.disabled.text }}>{t('noDescription')}</p>
            )}
        </div>
    );
};
