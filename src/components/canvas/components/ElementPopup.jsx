import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { usePetriStore } from '../../../store/usePetriStore';
import { ElementForm } from '../../inspector/ElementForm';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { POPUP_SHORTCUTS } from '../../../constants/shortcuts';
import { selectInspectedElement } from '../../../store/slices/editorSlice';
import { Divider } from '../../ui/Divider';
import { usePopupPosition } from '../../../hooks/canvas/usePopupPosition';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { MOBILE_MEDIA_QUERY } from '../../../constants/workspace';
import { CANVAS_CONFIG } from '../../../constants/layout';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

export const ElementPopup = ({ width, height, pan, zoom }) => {
    const element = usePetriStore(selectInspectedElement);

    if (!element) return null;

    return <PopupCard element={element} width={width} height={height} pan={pan} zoom={zoom} />;
};

const PopupCard = ({ element, width, height, pan, zoom }) => {
    const closeInspector = usePetriStore((s) => s.closeInspector);
    const places = usePetriStore((s) => s.places);
    const transitions = usePetriStore((s) => s.transitions);
    const theme = useTheme();

    const { popupRef, position } = usePopupPosition(element, {
        pan,
        zoom,
        width,
        height,
        places,
        transitions,
    });

    useClickOutside(popupRef, closeInspector);

    useKeyboardShortcuts([
        { codes: POPUP_SHORTCUTS.close, handler: closeInspector, enabled: Boolean(element) },
    ]);

    const typeLabel = element.type ? element.type.charAt(0).toUpperCase() + element.type.slice(1) : '';

    const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

    const cornerOffset = CANVAS_CONFIG.RULER_THICKNESS_PX + CANVAS_CONFIG.MOBILE_POPUP_POSITION_OFFSET_IN_CANVAS_PX;

    const positionStyle = isMobile
        ? { right: cornerOffset, bottom: cornerOffset }
        : { left: position?.left ?? 0, top: position?.top ?? 0 };

    return (
        <div
            ref={popupRef}
            className="absolute z-20 w-48 overflow-hidden rounded-lg border"
            style={{
                ...positionStyle,
                visibility: isMobile || position ? 'visible' : 'hidden',
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-3">
                <div className="min-w-0">
                    <div
                        className="text-[9px] font-medium uppercase tracking-[0.15em]"
                        style={{ color: theme.text.label }}
                    >
                        {typeLabel}
                    </div>
                    <div className="mt-1 text-[11px] font-mono tracking-[0.02em]" style={{ color: theme.text.token }}>
                        id: {element.id}
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="Close inspector"
                    onClick={closeInspector}
                    className="flex size-6 items-center justify-center rounded-md text-base leading-none transition-colors hover:opacity-80"
                    style={{
                        backgroundColor: 'transparent',
                        color: theme.text.label,
                    }}
                >
                    ×
                </button>
            </div>

            <Divider />

            <div className="px-3 pb-3 pt-1">
                <ElementForm element={element} />
            </div>
        </div>
    );
};
