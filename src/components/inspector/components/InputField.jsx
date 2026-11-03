import React from 'react';

export const InputField = ({
    label,
    value,
    onChange,
    theme,
    type = 'text',
    min,
    step,
    placeholder,
    disabled = false,
    select = false,
    options = [],
    inline = false,
}) => {
    const [draftValue, setDraftValue] = React.useState(value ?? '');
    const [isFocused, setIsFocused] = React.useState(false);
    const cancelRef = React.useRef(false);

    React.useEffect(() => {
        setDraftValue(value ?? '');
    }, [value]);

    const fieldBg = theme.sidebar.inputBg;
    const textColor = theme.text.token;
    const labelColor = theme.text.label;
    const disabledText = theme.disabled.text;
    const borderColor = theme.sidebar.inputBorder;
    const accentColor = theme.place.stroke;
    const disabledBg = disabled ? theme.sidebar.bg : fieldBg;
    const border = disabled ? '1px solid transparent' : `1px solid ${isFocused ? accentColor : borderColor}`;

    const commitValue = (nextValue) => {
        if (typeof onChange !== 'function') return;

        const normalizedCurrent = value == null ? '' : String(value);
        const normalizedNext = nextValue == null ? '' : String(nextValue);

        if (normalizedCurrent === normalizedNext) return;

        onChange(nextValue);
    };

    const handleInputChange = (event) => {
        const nextValue = event.target.value;
        setDraftValue(nextValue);
    };

    const handleBlur = () => {
        if (cancelRef.current) {
            cancelRef.current = false;
            return;
        }

        commitValue(draftValue);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            commitValue(draftValue);
            event.currentTarget.blur();
            return;
        }

        if (event.key === 'Escape') {
            cancelRef.current = true;
            setDraftValue(value ?? '');
            event.currentTarget.blur();
        }
    };

    const sharedProps = {
        value: draftValue,
        disabled,
        placeholder,
        onChange: handleInputChange,
        onBlur: (event) => {
            setIsFocused(false);
            handleBlur(event);
        },
        onFocus: () => setIsFocused(true),
        onKeyDown: handleKeyDown,
        className: inline
            ? 'w-[58px] rounded-md px-2 py-1 text-[11px] font-mono leading-4 outline-none transition-colors'
            : 'w-full rounded-lg px-2.5 py-1.5 text-[12px] font-mono leading-5 outline-none transition-colors',
        style: {
            backgroundColor: disabledBg,
            border,
            color: disabled ? disabledText : textColor,
            opacity: disabled ? 0.72 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            boxShadow: disabled
                ? 'none'
                : isFocused
                    ? `0 0 0 1px ${accentColor}40, inset 0 0 0 1px rgba(255,255,255,0.02)`
                    : 'inset 0 0 0 1px rgba(255,255,255,0.02)',
            minWidth: 0,
            transition: 'border-color 120ms ease, box-shadow 120ms ease',
        },
    };

    return (
        <div className={inline ? 'flex items-center gap-1.5' : 'space-y-1'}>
            {label && (
                <label
                    className={inline ? 'text-[9px] font-medium uppercase tracking-[0.12em] whitespace-nowrap' : 'block text-[9px] font-medium uppercase tracking-[0.12em]'}
                    style={{ color: labelColor }}
                >
                    {label}
                </label>
            )}

            {select ? (
                <select
                    {...sharedProps}
                    value={draftValue}
                    onChange={(event) => {
                        const nextValue = event.target.value;
                        setDraftValue(nextValue);
                        commitValue(nextValue);
                    }}
                    onBlur={undefined}
                    onKeyDown={undefined}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={Boolean(option.disabled)}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    {...sharedProps}
                    type={type}
                    min={min}
                    step={step}
                />
            )}
        </div>
    );
};
