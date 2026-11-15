import React from 'react';
import { ARC_TYPE } from '../../constants/net';
import { usePetriStore } from '../../store/usePetriStore';
import { useTheme } from '../../store/useSettingsStore';
import { buildMatrices } from '../../core/analysis/matrices';
import { displayName, nextFreeCell, nextNodeId, arcId } from '../../core/models';
import { useSyncedScroll } from '../../hooks/useSyncedScroll';
import { MatrixTable } from './components/MatrixTable';
import { MATRIX_VIEWS } from '../../constants/matrices';
import { cellCommand } from '../../core/matrixEdits';
import { selectIsRunning } from '../../store/slices/simulationSlice';
import { notify } from '../notifications/notify.jsx';
import { NOTIFY_STATUS, NOTIFY_TOPIC } from '../../constants/notifications';

/**
 * Input and output matrices of the current net, recomputed only on change.
 */
export const MatricesView = () => {
    const theme = useTheme();
    const places = usePetriStore((s) => s.places);
    const transitions = usePetriStore((s) => s.transitions);
    const arcs = usePetriStore((s) => s.arcs);
    const isRunning = usePetriStore(selectIsRunning);
    const isMatrixEditable = usePetriStore((s) => s.isMatrixEditable);
    const toggleMatrixEditable = usePetriStore((s) => s.toggleMatrixEditable);
    const execute = usePetriStore((s) => s.execute);
    const bindScroll = useSyncedScroll();
    const editable = isMatrixEditable && !isRunning;

    const matrices = React.useMemo(
        () => buildMatrices({ places, transitions, arcs }),
        [places, transitions, arcs]
    );

    const rows = React.useMemo(() => places.map(toHeader), [places]);
    const columns = React.useMemo(() => transitions.map(toHeader), [transitions]);
    const availableViews = React.useMemo(() => MATRIX_VIEWS, []);
    const [visibleKeys, setVisibleKeys] = React.useState(() => new Set(availableViews.map((view) => view.key)));

    React.useEffect(() => {
        setVisibleKeys((current) => {
            const next = new Set(availableViews.map((view) => view.key));
            const filtered = [...current].filter((key) => next.has(key));
            return filtered.length > 0 ? new Set(filtered) : next;
        });
    }, [availableViews]);

    const toggleView = (key) => {
        setVisibleKeys((current) => {
            const next = new Set(current);
            if (next.has(key) && next.size === 1) {
                return next;
            }

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const visible = availableViews.filter((view) => visibleKeys.has(view.key));

    const addNode = (kind) => {
        const net = { places, transitions, arcs };
        const id = nextNodeId(kind === 'place' ? 'p' : 't', net);
        const { x, y } = nextFreeCell(net);
        execute({ type: kind === 'place' ? 'addPlace' : 'addTransition', id, x, y });
    };

    const deleteNode = (id, kind) => {
        const count = arcs.filter((arc) => arc.source === id || arc.target === id).length;
        const label = kind === 'place' ? 'Place' : 'Transition';

        execute({ type: 'deleteElement', id });
        notify({
            status: NOTIFY_STATUS.INFO,
            topic: NOTIFY_TOPIC.EDIT,
            title: `${label} ${id} deleted`,
            message: count > 0 ? `Removed with ${count} ${count === 1 ? 'arc' : 'arcs'}.` : 'No arcs were attached.',
        });
    };

    const hasMatrixPresence = (viewKey, matrix) => {
        if (!matrix || matrix.length === 0) return false;

        if (viewKey === 'inhibitor') {
            return matrix.some((row) => row.some((value) => Number.isFinite(value)));
        }

        if (viewKey === 'reset') {
            return matrix.some((row) => row.some((value) => value === 1));
        }

        return matrix.some((row) => row.some((value) => value !== 0));
    };

    if (places.length === 0 || transitions.length === 0) {
        return (
            <p className="p-3 text-xs" style={{ color: theme.disabled.text }}>
                Add places and transitions to see the matrices.
            </p>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col" style={{ backgroundColor: theme.sidebar.inputBg }}>
            <div
                className="flex flex-wrap items-center gap-2 border-b px-2 py-1.5"
                style={{
                    backgroundColor: theme.sidebar.bg,
                    borderColor: theme.sidebar.border,
                }}
            >
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {availableViews.map((view) => {
                        const isVisible = visibleKeys.has(view.key);
                        const hasArc = hasMatrixPresence(view.key, matrices[view.key]);

                        return (
                            <button
                                key={view.key}
                                type="button"
                                aria-pressed={isVisible}
                                onClick={() => toggleView(view.key)}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-150"
                                style={{
                                    backgroundColor: isVisible ? `${theme.place.stroke}18` : 'transparent',
                                    color: isVisible ? theme.text.code : theme.text.label,
                                    opacity: isVisible || (hasArc ? 1 : 0.7),
                                }}
                            >
                                <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor: hasArc ? theme.place.stroke : theme.disabled.text,
                                        opacity: isVisible || (hasArc ? 1 : 0.45),
                                    }}
                                />
                                {view.title}
                            </button>
                        );
                    })}
                </div>

                {editable && (
                    <div className="ml-auto flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => addNode('place')}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-150"
                            style={{
                                borderColor: theme.sidebar.border,
                                backgroundColor: `${theme.place.stroke}18`,
                                color: theme.text.code,
                            }}
                        >
                            + Place
                        </button>
                        <button
                            type="button"
                            onClick={() => addNode('transition')}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-150"
                            style={{
                                borderColor: theme.sidebar.border,
                                backgroundColor: `${theme.transition.stroke}18`,
                                color: theme.text.code,
                            }}
                        >
                            + Transition
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={toggleMatrixEditable}
                    disabled={isRunning}
                    aria-pressed={isMatrixEditable}
                    title={isRunning ? 'Stop the simulation to edit matrices' : isMatrixEditable ? 'Lock matrix editing' : 'Unlock to edit matrices'}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                        backgroundColor: isMatrixEditable ? `${theme.place.stroke}18` : 'transparent',
                        color: isMatrixEditable ? theme.text.code : theme.text.label,
                    }}
                >
                    <span aria-hidden="true">{isMatrixEditable ? 'Y' : 'N'}</span>
                    <span>{isMatrixEditable ? 'Editing' : 'Edit'}</span>
                </button>
            </div>

            <div className="flex min-h-0 flex-1 gap-2 p-2">
                {visible.map((view, index) => (
                    <MatrixTable
                        key={view.key}
                        title={view.title}
                        rows={rows}
                        columns={columns}
                        matrix={matrices[view.key]}
                        view={view}
                        editable={editable}
                        onDeleteNode={deleteNode}
                        onCellCommit={(placeId, transitionId, value) => {
                            const command = cellCommand({ places, transitions, arcs }, view, placeId, transitionId, value);
                            if (!command) return;

                            if (command.type === 'updateArc' && command.values?.type) {
                                const [source, target] = view.direction === 'placeToTransition'
                                    ? [placeId, transitionId]
                                    : [transitionId, placeId];
                                const existing = arcs.find((arc) => arc.id === arcId(source, target));
                                const previousType = existing?.arcType ?? 'regular';
                                const nextType = command.values.type;

                                notify({
                                    status: NOTIFY_STATUS.INFO,
                                    topic: NOTIFY_TOPIC.EDIT,
                                    title: 'Arc type changed',
                                    message: `${source}->${target} changed from ${previousType} to ${nextType}`,
                                });
                            }

                            execute(command);
                        }}
                        scroll={bindScroll(index)}
                    />
                ))}
            </div>
        </div>
    );
};

/** Header cell data: label for display, id for keys and the tooltip. */
const toHeader = (node) => ({ id: node.id, label: displayName(node) });
