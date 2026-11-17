import { describe, it, expect } from 'vitest';
import { applyCommand } from '@/core/netCommands';
import { createPlace, createTransition, createArc } from '@/core/models';
import { ARC_TYPE } from '@/constants/net';

const baseNet = (...arcs) => ({
    places: [createPlace({ id: 'p' })],
    transitions: [createTransition({ id: 't' })],
    arcs,
});

const arcOf = (net, id) => net.arcs.find((arc) => arc.id === id);

describe('updateArc', () => {
    it('changes type and weight in one step', () => {
        const net = baseNet(createArc({ source: 'p', target: 't' }));

        const next = applyCommand(net, {
            type: 'updateArc',
            id: 'p->t',
            values: { type: ARC_TYPE.INHIBITOR, weight: 3 },
        });

        expect(arcOf(next, 'p->t')).toMatchObject({ arcType: ARC_TYPE.INHIBITOR, weight: 3 });
    });

    it('returns the same net when the arc does not exist', () => {
        const net = baseNet();

        const next = applyCommand(net, { type: 'updateArc', id: 'p->t', values: { weight: 2 } });

        expect(next).toBe(net);
    });

    it('forces weight 1 when the type becomes reset', () => {
        const net = baseNet(createArc({ source: 'p', target: 't', weight: 3 }));

        const next = applyCommand(net, {
            type: 'updateArc',
            id: 'p->t',
            values: { type: ARC_TYPE.RESET, weight: 5 },
        });

        expect(arcOf(next, 'p->t')).toMatchObject({ arcType: ARC_TYPE.RESET, weight: 1 });
    });

    it.each([ARC_TYPE.READ, ARC_TYPE.INHIBITOR, ARC_TYPE.RESET])(
        'rejects %s on a transition -> place arc', (arcType) => {
            const net = baseNet(createArc({ source: 't', target: 'p' }));

            const next = applyCommand(net, { type: 'updateArc', id: 't->p', values: { type: arcType } });

            expect(next).toBe(net);
        }
    );

    it.each([0, -1, 'abc'])('rejects invalid weight %s', (weight) => {
        const net = baseNet(createArc({ source: 'p', target: 't', weight: 2 }));

        const next = applyCommand(net, {
            type: 'updateArc',
            id: 'p->t',
            values: { weight },
        });

        expect(next).toBe(net);
    });

    it('does not mutate the original net', () => {
        const arc = createArc({ source: 'p', target: 't', weight: 1 });
        const net = baseNet(arc);

        const next = applyCommand(net, {
            type: 'updateArc',
            id: 'p->t',
            values: { weight: 4 },
        });

        expect(arc.weight).toBe(1);
        expect(net.arcs[0].weight).toBe(1);
        expect(next.arcs[0].weight).toBe(4);
        expect(next).not.toBe(net);
    });
});

describe('setAttribute', () => {
    it('changes the weight of an arc', () => {
        const net = baseNet(createArc({ source: 'p', target: 't', weight: 1 }));

        const next = applyCommand(net, {
            type: 'setAttribute',
            id: 'p->t',
            key: 'weight',
            value: 5,
        });

        expect(arcOf(next, 'p->t').weight).toBe(5);
    });

    it('changes the tokens of a place', () => {
        const net = baseNet();

        const next = applyCommand(net, {
            type: 'setAttribute',
            id: 'p',
            key: 'tokens',
            value: 7,
        });

        expect(next.places[0].tokens).toBe(7);
    });

    it('returns the same net for an unknown attribute', () => {
        const net = baseNet();

        expect(applyCommand(net, {
            type: 'setAttribute',
            id: 'p',
            key: 'unknown',
            value: 3,
        })).toBe(net);
    });
});

describe('addArc', () => {
    it('adds an arc with the given weight', () => {
        const net = baseNet();

        const next = applyCommand(net, {
            type: 'addArc',
            source: 'p',
            target: 't',
            weight: 4,
        });

        expect(arcOf(next, 'p->t')).toMatchObject({ weight: 4, arcType: ARC_TYPE.REGULAR });
    });

    it('does not add a second arc between the same nodes', () => {
        const net = baseNet(createArc({ source: 'p', target: 't' }));

        const next = applyCommand(net, {
            type: 'addArc',
            source: 'p',
            target: 't',
            weight: 5,
        });

        expect(next).toBe(net);
        expect(next.arcs).toHaveLength(1);
    });

    it('rejects place -> place', () => {
        const net = {
            places: [createPlace({ id: 'p1' }), createPlace({ id: 'p2' })],
            transitions: [createTransition({ id: 't' })],
            arcs: [],
        };

        const next = applyCommand(net, {
            type: 'addArc',
            source: 'p1',
            target: 'p2',
            weight: 1,
        });

        expect(next).toBe(net);
    });
});


describe('deleteElement', () => {
    it('removes a place together with its arcs', () => {
        const net = {
            places: [createPlace({ id: 'p1' }), createPlace({ id: 'p2' })],
            transitions: [createTransition({ id: 't' })],
            arcs: [
                createArc({ source: 'p1', target: 't' }),
                createArc({ source: 't', target: 'p2' }),
            ],
        };

        const next = applyCommand(net, { type: 'deleteElement', id: 'p1' });

        expect(next.places.map((place) => place.id)).not.toContain('p1');
        expect(next.arcs).toHaveLength(1);
        expect(next.arcs[0].id).toBe('t->p2');
    });
});