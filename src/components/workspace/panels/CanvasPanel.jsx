import React from 'react';
import { PetriCanvas } from '../../canvas/PetriCanvas';
import { CanvasToolbar } from '../../canvas/CanvasToolbar';

export const CanvasPanel = () => (
    <div className="relative h-full w-full overflow-hidden">
        <CanvasToolbar />
        <PetriCanvas />
    </div>
);
