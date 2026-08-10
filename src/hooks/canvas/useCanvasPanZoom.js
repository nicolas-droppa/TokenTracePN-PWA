import { useState, useRef, useEffect } from 'react';
import { CANVAS_CONFIG } from '../../constants/layout';

export const useCanvasPanZoom = (selectedTool) => {
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

            const direction = e.deltaY < 0 ? 1 : -1;

            setZoom((prevZoom) => {
                const targetZoom = direction > 0 
                    ? Math.min(prevZoom * CANVAS_CONFIG.ZOOM.FACTOR, CANVAS_CONFIG.ZOOM.MAX) 
                    : Math.max(prevZoom / CANVAS_CONFIG.ZOOM.FACTOR, CANVAS_CONFIG.ZOOM.MIN);

                if (targetZoom === prevZoom) return prevZoom;

                const canvasX = (mouseX - pan.x) / prevZoom;
                const canvasY = (mouseY - pan.y) / prevZoom;

                setPan({
                    x: mouseX - canvasX * targetZoom,
                    y: mouseY - canvasY * targetZoom,
                });

                return targetZoom;
            });
        };

        svgElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => svgElement.removeEventListener('wheel', handleWheel);
    }, [pan]);

    const getCanvasCoordinates = (clientX, clientY) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        return {
            x: (clientX - rect.left - pan.x) / zoom,
            y: (clientY - rect.top - pan.y) / zoom,
        };
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