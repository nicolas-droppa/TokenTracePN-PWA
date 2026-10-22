import React from 'react';
import { useCodeChecker } from '../../hooks/useCodeChecker';

const IssueFilterButton = ({ label, title, count, theme, active, onClick, filterKey }) => {
    const style = (theme && theme.diagnostics && theme.diagnostics.filter && theme.diagnostics.filter[filterKey])
        || { tone: '#94a3b8', border: '#64748b', background: 'rgba(148, 163, 184, 0.12)', activeText: '#1e293b' };

    const hasCount = count > 0;

    return (
        <div className="flex items-center justify-start gap-2">
            <button
                type="button"
                title={title}
                onClick={onClick}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium leading-none transition-all duration-150 ease-out hover:bg-slate-400/10"
                style={{
                    color: active ? style.activeText : (theme && theme.text && theme.text.label) || '#111',
                    opacity: active || hasCount ? 1 : 0.65,
                    backgroundColor: active ? style.background : 'transparent',
                }}
            >
                <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                        backgroundColor: active ? style.tone : hasCount ? style.tone : (theme && theme.disabled && theme.disabled.text) || '#64748b',
                        opacity: active || hasCount ? 1 : 0.4,
                    }}
                />
                {label}
                <span
                    className="inline-flex items-center justify-center text-[11px] font-semibold leading-none"
                    style={{
                        color: hasCount ? style.tone : ((theme && theme.text && theme.text.label) || '#111'),
                        opacity: active || hasCount ? 1 : 0.45,
                        textDecoration: hasCount ? `underline ${style.tone}88` : 'none',
                        textUnderlineOffset: '2px',
                        textDecorationThickness: '1.5px',
                    }}
                >
                    {count}
                </span>
            </button>
        </div>
    );
};

const getSeverityMeta = (severity, theme) => {
    const palette = theme?.diagnostics ?? {};
    const bySeverity = {
        error: { color: palette.error, label: 'Error' },
        warning: { color: palette.warning, label: 'Warning' },
        info: { color: palette.active, label: 'Info' },
    };

    return bySeverity[severity] ?? { color: theme?.text?.label, label: 'Issue' };
};

export const CodeCheckerPanel = ({ errors = [], theme = {}, code = '', language = 'dpn' }) => {
    const [activeFilter, setActiveFilter] = React.useState('all');
    const displayErrors = useCodeChecker({ code, language, delayMs: 450 });
    const finalErrors = displayErrors.length > 0 ? displayErrors : errors || [];
    const counts = {
        all: finalErrors.length,
        error: finalErrors.filter((e) => (e && e.severity) === 'error').length,
        warning: finalErrors.filter((e) => (e && e.severity) === 'warning').length,
        info: finalErrors.filter((e) => (e && e.severity) === 'info').length,
    };
    const visibleErrors = activeFilter === 'all'
        ? finalErrors
        : finalErrors.filter((e) => (e && e.severity) === activeFilter);

    return (
        <div
            className="flex h-full flex-col text-xs"
            style={{
                color: (theme && theme.text && theme.text.label),
                backgroundColor: (theme && theme.bg),
            }}
        >
            <div className="sticky top-0 z-10 flex items-center justify-start gap-2 border-b px-2 py-2" style={{ borderColor: (theme && theme.sidebar && theme.sidebar.border), backgroundColor: (theme && theme.sidebar && theme.sidebar.bg) }}>
                <IssueFilterButton label="Issue(s)" title="All issues" count={counts.all} theme={theme} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} filterKey="all" />
                <IssueFilterButton label="Errors" title="Errors" count={counts.error} theme={theme} active={activeFilter === 'error'} onClick={() => setActiveFilter('error')} filterKey="error" />
                <IssueFilterButton label="Warnings" title="Warnings" count={counts.warning} theme={theme} active={activeFilter === 'warning'} onClick={() => setActiveFilter('warning')} filterKey="warning" />
                <IssueFilterButton label="Info" title="Info" count={counts.info} theme={theme} active={activeFilter === 'info'} onClick={() => setActiveFilter('info')} filterKey="info" />
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-2 py-2" style={{ color: (theme && theme.disabled && theme.disabled.text), backgroundColor: (theme && theme.bg) }}>
                {visibleErrors.length === 0 ? (
                    <div className="text-[11px]">No issues</div>
                ) : (
                    visibleErrors.map((err, idx) => {
                        const msg = (err && (err.message || err.msg)) || String(err);
                        const line = err && err.line ? ` (line ${err.line})` : '';
                        const severity = (err && err.severity) || 'info';
                        const severityMeta = getSeverityMeta(severity, theme);
                        const dotColor = severityMeta.color;

                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-2 border-b py-1.5 last:border-b-0"
                                style={{ borderColor: (theme && theme.sidebar && theme.sidebar.border), backgroundColor: 'transparent' }}
                            >
                                <span
                                    className="mt-0.5 inline-block w-[2px] shrink-0 self-stretch rounded-full"
                                    style={{ backgroundColor: dotColor }}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] uppercase tracking-wide" style={{ color: dotColor }}>
                                        {severityMeta.label}
                                    </div>
                                    <div style={{ color: (theme && theme.text && theme.text.label) }}>
                                        {msg}{line}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CodeCheckerPanel;
