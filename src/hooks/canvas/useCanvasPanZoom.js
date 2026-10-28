import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { CANVAS_CONFIG } from '../../constants/layout';
import {
    calculateInitialPan,
    calculateTargetZoom,
    calculateZoomPan,
    screenToCanvasCoordinates,
} from './helpers/canvasPanZoom';

export const useCanvasPanZoom = () => {
    const [zoom, setZoom] = useState(CANVAS_CONFIG.ZOOM.DEFAULT);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const svgRef = useRef(null);
    const zoomRef = useRef(zoom);
    const panRef = useRef(pan);

    useEffect(() => { zoomRef.current = zoom; }, [zoom]);
    useEffect(() => { panRef.current = pan; }, [pan]);

    useLayoutEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const height = svgElement.getBoundingClientRect().height;
        if (height <= 0) return;

        setPan(calculateInitialPan(height));
    }, []);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const handleWheel = (e) => {
            e.preventDefault();

            const rect = svgElement.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const currentZoom = zoomRef.current;
            const currentPan = panRef.current;
            const targetZoom = calculateTargetZoom(currentZoom, e.deltaY);

            if (targetZoom === currentZoom) return;

            const nextPan = calculateZoomPan({
                mouseX,
                mouseY,
                currentPan,
                currentZoom,
                targetZoom,
            });

            setPan(nextPan);
            setZoom(targetZoom);
        };

        svgElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => svgElement.removeEventListener('wheel', handleWheel);
    }, []);

    const getCanvasCoordinates = (clientX, clientY) => {
        return screenToCanvasCoordinates(clientX, clientY, svgRef.current, pan, zoom);
    };

    const startPanning = (clientX, clientY) => {
        setIsPanning(true);
        setPanStart({ x: clientX - pan.x, y: clientY - pan.y });
    };

    const updatePanning = (clientX, clientY) => {
        if (isPanning) {
            setPan({ x: clientX - panStart.x, y: clientY - panStart.y });
        }
    };

    const stopPanning = () => {
        setIsPanning(false);
    };

    return {
        svgRef,
        zoom,
        pan,
        isPanning,
        getCanvasCoordinates,
        startPanning,
        updatePanning,
        stopPanning,
    };
};