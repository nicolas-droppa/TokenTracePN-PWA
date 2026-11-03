import React from 'react';

export const Field = ({
    label,
    value,
    theme,
    className = '',
    valueClassName = '',
    inline = false,
    readOnly = false,
}) => {
    const textColor = theme.text.label;
    const fieldBg = theme.sidebar.inputBg;
    const accentColor = theme.text.token;
    const borderColor = theme.sidebar.border;

    const baseFieldStyle = readOnly
        ? {
            backgroundColor: 'transparent',
            color: accentColor,
            border: '1px solid transparent',
            boxShadow: 'none',
        }
        : {
            backgroundColor: fieldBg,
            color: accentColor,
            border: `1px solid ${borderColor}`,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
        };

    if (inline) {
        return (
            <div
                className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-mono leading-5 ${className}`}
                style={baseFieldStyle}
            >
                {label && (
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em]" style={{ color: textColor }}>
                        {label}
                    </span>
                )}

                <span className={`ml-auto ${valueClassName}`}>{value}</span>
            </div>
        );
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label
                    className="block text-[9px] font-medium uppercase tracking-[0.12em]"
                    style={{ color: textColor }}
                >
                    {label}
                </label>
            )}

            <div
                className={`w-full rounded-lg px-2.5 py-1.5 text-[12px] font-mono leading-5 ${valueClassName}`}
                style={baseFieldStyle}
            >
                {value}
            </div>
        </div>
    );
};
