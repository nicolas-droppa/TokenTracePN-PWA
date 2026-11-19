import React from 'react';
import { APP_LAYOUT } from '../../constants/layout';
import { usePetriStore } from '../../store/usePetriStore';
import { useTheme } from '../../store/useSettingsStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { selectIsRunning } from '../../store/slices/simulationSlice';
import { DiagnosticCount } from './components/DiagnosticCount';
import { StatusItem } from './components/StatusItem';
import { useTranslation } from 'react-i18next';

/**
 * Bottom status bar.
 */
export const StatusBar = () => {
    const { t } = useTranslation('statusBar');
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
            <DiagnosticCount count={errorCount} color={theme.diagnostics.error} title={t('diagnostics.errors', { count: errorCount })} theme={theme} />
            <span className="mx-1.5" aria-hidden="true" style={{ color: theme.text.label }}>·</span>
            <DiagnosticCount count={warningCount} color={theme.diagnostics.warning} title={t('diagnostics.warnings', { count: warningCount })} theme={theme} />
            <span className="mx-1.5" aria-hidden="true" style={{ color: theme.text.label }}>·</span>
            <DiagnosticCount count={infoCount} color={theme.diagnostics.active} title={t('diagnostics.info', { count: infoCount })} theme={theme} />
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
            <div className="flex items-center gap-1">
                <StatusItem
                    label={`${t('counts.placesShort')} ${placesCount}`}
                    title={t('counts.places', { count: placesCount })}
                />
                <span className="mx-1" aria-hidden="true" style={{ color: theme.text.label }}>·</span>
                <StatusItem
                    label={`${t('counts.transitionsShort')} ${transitionsCount}`}
                    title={t('counts.transitions', { count: transitionsCount })}
                />
                <span className="mx-1" aria-hidden="true" style={{ color: theme.text.label }}>·</span>
                <StatusItem
                    label={`${t('counts.arcsShort')} ${arcsCount}`}
                    title={t('counts.arcs', { count: arcsCount })}
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex">
                    <StatusItem
                        label={isRunning ? t('mode.running') : t('mode.editing')}
                        title={isRunning ? t('mode.runningTooltip') : t('mode.editingTooltip')}
                    />
                </div>

                <StatusItem
                    label={diagnosticsLabel}
                    title={t('diagnostics.tooltip')}
                    onClick={() => showPanel('problems')}
                />
            </div>
        </footer>
    );
};
