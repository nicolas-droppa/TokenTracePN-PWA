import React from 'react';

export const PanelDivider = ({
    theme,
    onMouseDown,
    className = '',
    height = '0.375rem',
    cursor = 'ns-resize',
    style = {},
    innerBarWidth = '2.5rem',
    innerBarHeight = '0.125rem',
    innerBarColor,
}) => (
    <div
        className={`w-full transition-colors flex items-center justify-center shrink-0 ${className}`}
        onMouseDown={onMouseDown}
        style={{
            height,
            backgroundColor: theme?.sidebar?.resizeHandle ?? '#2a2f3a',
            cursor,
            ...style,
        }}
    >
        <div
            className="rounded-full transition-colors"
            style={{
                width: innerBarWidth,
                height: innerBarHeight,
                backgroundColor: innerBarColor ?? theme?.disabled?.stroke ?? '#8b93a7',
            }}
        />
    </div>
);

export default PanelDivider;
