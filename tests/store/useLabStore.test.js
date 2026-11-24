import { describe, it, expect } from 'vitest';
import { missingRequirements, selectLabStatus, useLabStore } from '@/store/useLabStore';
import { LAB_STATUS as S } from '@/constants/labs';

const lab = (id, requires = []) => ({ id, requires, template: 'TEMPLATE' });
const state = (overrides = {}) => ({ solvedLabs: [], codeByLab: {}, ...overrides });

describe('selectLabStatus', () => {
    it('is TODO when available and untouched', () => {
        expect(selectLabStatus(lab('a'))(state())).toBe(S.TODO);
    });

    it('is LOCKED when a requirement is not solved', () => {
        expect(selectLabStatus(lab('a', ['b']))(state())).toBe(S.LOCKED);
    });

    it('is TODO when all requirements are solved', () => {
        expect(selectLabStatus(lab('a', ['b']))(state({ solvedLabs: ['b'] }))).toBe(S.TODO);
    });

    it('is IN_PROGRESS when code differs from the template', () => {
        expect(selectLabStatus(lab('a'))(state({ codeByLab: { a: 'WORK' } }))).toBe(S.IN_PROGRESS);
    });

    it('is TODO when saved code equals the template', () => {
        expect(selectLabStatus(lab('a'))(state({ codeByLab: { a: 'TEMPLATE' } }))).toBe(S.TODO);
    });

    it('stays SOLVED even if a requirement is missing', () => {
        expect(selectLabStatus(lab('a', ['b']))(state({ solvedLabs: ['a'] }))).toBe(S.SOLVED);
    });

    it('is LOCKED with two requirements when only one is solved', () => {
        expect(selectLabStatus(lab('a', ['b', 'c']))(state({ solvedLabs: ['b'] }))).toBe(S.LOCKED);
    });
});

describe('missingRequirements', () => {
    it('returns only unsolved requirement ids', () => {
        expect(missingRequirements(lab('a', ['b', 'c']), ['b'])).toEqual(['c']);
    });
});

describe('lab actions', () => {
    it('openLab switches to the lab, toggleLab closes it again', () => {
        useLabStore.getState().openLab('a');
        expect(useLabStore.getState().activeLabId).toBe('a');

        useLabStore.getState().openLab('b');
        expect(useLabStore.getState().activeLabId).toBe('b');

        useLabStore.getState().toggleLab('b');
        expect(useLabStore.getState().activeLabId).toBeNull();
    });
});
