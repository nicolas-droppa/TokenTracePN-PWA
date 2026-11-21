import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, useTheme } from '../../../store/useSettingsStore';
import { usePythonEditor } from '../../../hooks/editor/usePythonEditor';

/**
 * Python editor of a lab (also the read-only reference). Exposes setCode through the ref (used by reset).
 */
export const LabCodeEditor = forwardRef(({ initialCode, onChange, readOnly = false, title = 'Python' }, ref) => {
    const { t } = useTranslation('labPanel');
    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = useTheme();
    const isDark = String(activeThemeKey || 'dark').toLowerCase().includes('dark');

    const { containerRef, setCode } = usePythonEditor({
        initialCode,
        readOnly,
        onChange,
        theme,
        isDark,
    });

    useImperativeHandle(ref, () => ({ setCode }), [setCode]);

    return (
        <div
            className="flex h-full flex-col transition-colors duration-200"
            style={{ backgroundColor: theme.sidebar.inputBg }}
        >
            <div
                className="flex items-center justify-between border-b px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ borderColor: theme.sidebar.border, color: theme.text.label }}
            >
                <span>{title}</span>
                {readOnly && (
                    <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                        style={{
                            backgroundColor: `${theme.disabled.text}22`,
                            color: theme.disabled.text,
                        }}
                    >
                        {t('readOnly')}
                    </span>
                )}
            </div>

            <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden" style={{ minHeight: 120 }} />
        </div>
    );
});

LabCodeEditor.displayName = 'LabCodeEditor';
