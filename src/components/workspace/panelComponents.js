import { CanvasPanel } from './panels/CanvasPanel';
import { CodePanel } from './panels/CodePanel';
import { InspectorPanel } from './panels/InspectorPanel';
import { ProblemsPanel } from './panels/ProblemsPanel';

/**
 * Maps panel names to their corresponding React components.
 */
export const PANEL_COMPONENTS = {
    canvas: CanvasPanel,
    code: CodePanel,
    inspector: InspectorPanel,
    problems: ProblemsPanel,
};
