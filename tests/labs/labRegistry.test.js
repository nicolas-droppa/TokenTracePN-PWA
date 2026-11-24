import { describe, it, expect } from 'vitest';
import { LABS, getLabSolution } from '@/labs/labRegistry';

describe('getLabSolution', () => {
    it('loads the solution of a lab that has one', async () => {
        const code = await getLabSolution('incidence-matrix');
        expect(code).toContain('def incidence_matrix(');
    });

    it('returns null for a lab without a solution', async () => {
        expect(await getLabSolution('does-not-exist')).toBeNull();
    });

    it('solution defines the function from task.js', async () => {
        for (const lab of LABS) {
            const code = await getLabSolution(lab.id);
            if (code) expect(code).toContain(`def ${lab.functionName}(`);
        }
    });
});
