import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../store/useSettingsStore';
import { LAB_TABS } from '../../../constants/labs';

export const LabTabs = ({ activeTab, onChange }) => {
    const { t } = useTranslation('labPanel');
    const theme = useTheme();

    return (
        <div
            role="tablist"
            className="flex items-center gap-1.5 border-b px-2.5 py-1.5"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            {LAB_TABS.map((tab) => {
                const isActive = activeTab === tab;

                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab)}
                        className="inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[10px] font-medium uppercase leading-none tracking-wide transition-colors duration-150 hover:bg-[var(--hover)]"
                        style={{
                            backgroundColor: isActive ? `${theme.text.label}15` : undefined,
                            color: isActive ? theme.text.code : theme.text.label,
                            '--hover': `${theme.text.label}14`,
                        }}
                    >
                        {t(`tabs.${tab}`)}
                    </button>
                );
            })}
        </div>
    );
};
