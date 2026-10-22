import React from 'react';
import { PetriCanvas } from '../../canvas/PetriCanvas';
import { CanvasToolbar } from '../../canvas/CanvasToolbar';
import { CodeErrorBanner } from '../../canvas/components/CodeErrorBanner';

export const CanvasPanel = () => (
    <div className="relative h-full w-full overflow-hidden">
        <CanvasToolbar />
        <CodeErrorBanner />
        <PetriCanvas />
    </div>
);
