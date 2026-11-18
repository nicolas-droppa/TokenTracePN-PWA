import React from 'react';
import { APP_LAYOUT } from '../../constants/layout';
import { usePetriStore } from '../../store/usePetriStore';
import { useTheme } from '../../store/useSettingsStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { selectIsRunning } from '../../store/slices/simulationSlice';
import { DiagnosticCount } from './components/DiagnosticCount';
import { StatusItem } from './components/StatusItem';

/**
 * Bottom status bar.
 */
export const StatusBar = () => {
    const theme = useTheme();
    const placesCount = usePetriStore((s) => s.places.length);
    const transitionsCount = usePetriStore((s) => s.transitions.length);
    const arcsCount = usePetriStore((s) => s.arcs.length);
    const isRunning = usePetriStore(selectIsRunning);
    const errorCount = usePetriStore((s) => s.diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length);
    const warningCount = usePetriStore((s) => s.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length);
    const infoCount = usePetriStore((s) => s.diagnostics.filter((diagnostic) => diagnostic.severity === 'info').length);
    const showPanel = useWorkspaceStore((s) => s.showPanel);

    const diagnosticsLabel = (
        <>
            <DiagnosticCount count={errorCount} color={theme.diagnostics.error} title={`${errorCount} errors`} theme={theme} />
            <span className="mx-1.5" style={{ color: theme.text.label }} aria-hidden="true">·</span>
            <DiagnosticCount count={warningCount} color={theme.diagnostics.warning} title={`${warningCount} warnings`} theme={theme} />
            <span className="mx-1.5" style={{ color: theme.text.label }} aria-hidden="true">·</span>
            <DiagnosticCount count={infoCount} color={theme.diagnostics.active} title={`${infoCount} info`} theme={theme} />
        </>
    );

    return (
        <footer
            className="flex w-full shrink-0 select-none items-center justify-between border-t px-2 sm:px-4"
            style={{
                height: APP_LAYOUT.STATUS_BAR_HEIGHT_PX,
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <div className="flex items-center gap-2">
                <StatusItem label={`P ${placesCount}`} title={`${placesCount} places`} />
                <span aria-hidden="true" style={{ color: theme.text.label }}>·</span>
                <StatusItem label={`T ${transitionsCount}`} title={`${transitionsCount} transitions`} />
                <span aria-hidden="true" style={{ color: theme.text.label }}>·</span>
                <StatusItem label={`A ${arcsCount}`} title={`${arcsCount} arcs`} />
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex">
                    <StatusItem
                        label={isRunning ? 'Running' : 'Editing'}
                        title={isRunning ? 'Simulation mode' : 'Edit mode'}
                    />
                </div>

                <StatusItem
                    label={diagnosticsLabel}
                    title="Open Problems panel"
                    onClick={() => showPanel('problems')}
                />
            </div>
        </footer>
    );
};
