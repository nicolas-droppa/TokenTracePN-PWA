import { describe, it, expect } from 'vitest';
import { missingRequirements, selectTaskStatus } from '@/store/useAnalysisStore';
import { ANALYSIS_TASK_STATUS as S } from '@/constants/analysis';

const task = (id, requires = []) => ({ id, requires, template: 'TEMPLATE' });
const state = (overrides = {}) => ({ solvedTasks: [], codeByTask: {}, ...overrides });

describe('selectTaskStatus', () => {
    it('is TODO when available and untouched', () => {
        expect(selectTaskStatus(task('a'))(state())).toBe(S.TODO);
    });

    it('is LOCKED when a requirement is not solved', () => {
        expect(selectTaskStatus(task('a', ['b']))(state())).toBe(S.LOCKED);
    });

    it('is TODO when all requirements are solved', () => {
        expect(selectTaskStatus(task('a', ['b']))(state({ solvedTasks: ['b'] }))).toBe(S.TODO);
    });

    it('is IN_PROGRESS when code differs from the template', () => {
        expect(selectTaskStatus(task('a'))(state({ codeByTask: { a: 'WORK' } }))).toBe(S.IN_PROGRESS);
    });

    it('is TODO when saved code equals the template', () => {
        expect(selectTaskStatus(task('a'))(state({ codeByTask: { a: 'TEMPLATE' } }))).toBe(S.TODO);
    });

    it('stays SOLVED even if a requirement is missing', () => {
        expect(selectTaskStatus(task('a', ['b']))(state({ solvedTasks: ['a'] }))).toBe(S.SOLVED);
    });

    it('is LOCKED with two requirements when only one is solved', () => {
        expect(selectTaskStatus(task('a', ['b', 'c']))(state({ solvedTasks: ['b'] }))).toBe(S.LOCKED);
    });
});

describe('missingRequirements', () => {
    it('returns only unsolved requirement ids', () => {
        expect(missingRequirements(task('a', ['b', 'c']), ['b'])).toEqual(['c']);
    });
});
