import { useState, useRef, useEffect } from 'react';
import { CANVAS_CONFIG } from '../../constants/layout';
import {
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

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const handleWheel = (e) => {
            e.preventDefault();

            const rect = svgElement.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            setZoom((prevZoom) => {
                const targetZoom = calculateTargetZoom(prevZoom, e.deltaY);
                if (targetZoom === prevZoom) return prevZoom;

                setPan((prevPan) => 
                    calculateZoomPan({
                        mouseX,
                        mouseY,
                        currentPan: prevPan,
                        currentZoom: prevZoom,
                        targetZoom,
                    })
                );

                return targetZoom;
            });
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