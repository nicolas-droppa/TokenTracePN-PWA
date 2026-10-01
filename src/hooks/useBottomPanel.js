import { useRef, useState } from 'react';

const DEFAULT_CODE = `place p1;\nplace p2(l: "P2", m: 5, x:250, y:230);\np1(x:250, y:330);\ntransition t1(x:250, y:280);\nt1 -> p1(w: 2, t: "inhibitor");`;

export const useBottomPanel = () => {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [language, setLanguage] = useState('dpn');
    const [bottomBarHeight, setBottomBarHeight] = useState(180);
    const dragStartRef = useRef(null);

    const handleBottomResizeStart = (event) => {
        event.preventDefault();
        dragStartRef.current = {
            pointerY: event.clientY,
            startHeight: bottomBarHeight,
        };

        const handleMouseMove = (moveEvent) => {
            if (!dragStartRef.current) return;
            const deltaY = dragStartRef.current.pointerY - moveEvent.clientY;
            const nextHeight = dragStartRef.current.startHeight + deltaY;
            setBottomBarHeight(Math.min(Math.max(nextHeight, 120), 260));
        };

        const handleMouseUp = () => {
            dragStartRef.current = null;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return {
        code,
        setCode,
        language,
        setLanguage,
        bottomBarHeight,
        handleBottomResizeStart,
    };
};

export default useBottomPanel;
