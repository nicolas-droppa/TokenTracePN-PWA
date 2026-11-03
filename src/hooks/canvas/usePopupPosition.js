import { useMemo, useRef } from 'react';
import { useElementSize } from '../useElementSize';
import { computePopupPosition, getAnchor } from './helpers/popupPosition';

export const usePopupPosition = (element, { pan, zoom, width, height, places = [], transitions = [] } = {} ) => {
    const popupRef = useRef(null);
    const { width: popupWidth, height: popupHeight } = useElementSize(popupRef);

    const anchor = useMemo(
        () => getAnchor(element, { places, transitions }),
        [element, places, transitions],
    );

    const position = useMemo(() => {
        if (!popupWidth || !popupHeight || !anchor) return null;

        return computePopupPosition({
            element,
            anchor,
            popup: { width: popupWidth, height: popupHeight },
            bounds: { width, height },
            pan,
            zoom,
        });
    }, [anchor, popupWidth, popupHeight, width, height, pan, zoom]);

    return { popupRef, position };
};
