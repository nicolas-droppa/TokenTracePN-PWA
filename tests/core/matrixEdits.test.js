import { describe, it, expect } from 'vitest';
import { cellCommand } from '@/core/matrixEdits';
import { createArc } from '@/core/models';
import { MATRIX_VIEWS } from '@/constants/matrices';
import { ARC_TYPE } from '@/constants/net';

const view = (key) => MATRIX_VIEWS.find((v) => v.key === key);

const netWith = (...arcs) => ({
    places: [{ id: 'p', type: 'place' }],
    transitions: [{ id: 't', type: 'transition' }],
    arcs,
});

describe('cellCommand', () => {
    it('adds an arc when the cell was empty', () => {
        const command = cellCommand(netWith(), view('input'), 'p', 't', 2);

        expect(command).toEqual({
            type: 'addArc',
            source: 'p',
            target: 't',
            arcType: ARC_TYPE.REGULAR,
            weight: 2,
        });
    });

    it('does nothing when 0 is written into an empty cell', () => {
        expect(cellCommand(netWith(), view('input'), 'p', 't', 0)).toBeNull();
    });

    it('changes the weight of an existing arc', () => {
        const net = netWith(createArc({ source: 'p', target: 't', weight: 1 }));

        expect(cellCommand(net, view('input'), 'p', 't', 3)).toEqual({
            type: 'setAttribute', id: 'p->t', key: 'weight', value: 3,
        });
    });

    it('deletes the arc when 0 is written', () => {
        const net = netWith(createArc({ source: 'p', target: 't' }));

        expect(cellCommand(net, view('input'), 'p', 't', 0)).toEqual({ type: 'deleteElement', id: 'p->t' });
    });

    it('uses transition -> place direction in the output matrix', () => {
        const command = cellCommand(netWith(), view('output'), 'p', 't', 1);

        expect(command.source).toBe('t');
        expect(command.target).toBe('p');
    });

    it('changes the arc type when another matrix is edited', () => {
        const net = netWith(createArc({ source: 'p', target: 't' }));

        expect(cellCommand(net, view('inhibitor'), 'p', 't', 2)).toEqual({
            type: 'updateArc',
            id: 'p->t',
            values: { type: ARC_TYPE.INHIBITOR, weight: 2 },
        });
    });

    it('ignores 0 in a matrix whose arc has another type', () => {
        const net = netWith(createArc({ source: 'p', target: 't' }));

        expect(cellCommand(net, view('inhibitor'), 'p', 't', 0)).toBeNull();
    });

    it('does not change the weight of a reset arc', () => {
        const net = netWith(createArc({ source: 'p', target: 't', arcType: ARC_TYPE.RESET }));

        expect(cellCommand(net, view('reset'), 'p', 't', 3)).toBeNull();
    });

    it.each(['abc', '-1', '1.5'])('rejects invalid input %s', (value) => {
        expect(cellCommand(netWith(), view('input'), 'p', 't', value)).toBeNull();
    });
});
