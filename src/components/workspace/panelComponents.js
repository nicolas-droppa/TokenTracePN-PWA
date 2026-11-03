import { CanvasPanel } from './panels/CanvasPanel';
import { CodePanel } from './panels/CodePanel';
import { ProblemsPanel } from './panels/ProblemsPanel';
import { MatricesPanel } from './panels/MatricesPanel';

/**
 * Maps panel names to their corresponding React components.
 */
export const PANEL_COMPONENTS = {
    canvas: CanvasPanel,
    code: CodePanel,
    problems: ProblemsPanel,
    matrices: MatricesPanel,
};
