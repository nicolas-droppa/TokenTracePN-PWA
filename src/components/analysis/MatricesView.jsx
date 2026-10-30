import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { useTheme } from '../../store/useSettingsStore';
import { buildIOMatrices } from '../../core/analysis/matrices';
import { displayName } from '../../core/models';
import { useSyncedScroll } from '../../hooks/useSyncedScroll';
import { MatrixTable } from './components/MatrixTable';

/**
 * Input and output matrices of the current net, recomputed only on change.
 */
export const MatricesView = () => {
    const theme = useTheme();
    const places = usePetriStore((s) => s.places);
    const transitions = usePetriStore((s) => s.transitions);
    const arcs = usePetriStore((s) => s.arcs);
    const bindScroll = useSyncedScroll();

    const matrices = React.useMemo(
        () => buildIOMatrices({ places, transitions, arcs }),
        [places, transitions, arcs]
    );

    const rows = React.useMemo(() => places.map(toHeader), [places]);
    const columns = React.useMemo(() => transitions.map(toHeader), [transitions]);

    const hasIgnoredArcs = arcs.some((arc) => arc.arcType !== 'regular');

    if (places.length === 0 || transitions.length === 0) {
        return (
            <p className="p-3 text-xs" style={{ color: theme.disabled.text }}>
                Add places and transitions to see the matrices.
            </p>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col gap-2 p-2" style={{ backgroundColor: theme.sidebar.inputBg }}>
            {hasIgnoredArcs && (
                <p className="px-1 text-xs" style={{ color: theme.disabled.text }}>
                    Read, inhibitor and reset arcs are not shown in the matrices.
                </p>
            )}

            <div className="flex min-h-0 flex-1 gap-2">
                <MatrixTable
                    title="Pre (I)"
                    rows={rows}
                    columns={columns}
                    matrix={matrices.input}
                    scroll={bindScroll(0)}
                />
                <MatrixTable
                    title="Post (O)"
                    rows={rows}
                    columns={columns}
                    matrix={matrices.output}
                    scroll={bindScroll(1)}
                />
            </div>
        </div>
    );
};

/** Header cell data: label for display, id for keys and the tooltip. */
const toHeader = (node) => ({ id: node.id, label: displayName(node) });