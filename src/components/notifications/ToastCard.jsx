import React from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../store/useSettingsStore';
import { NOTIFY_STATUS, NOTIFY_TOPIC } from '../../constants/notifications';

const TopicIcon = ({ topic, color }) => {
    const props = { className: "w-4 h-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" };

    if (topic === NOTIFY_TOPIC.COPY) {
        return (
            <svg {...props}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
        );
    }

    if (topic === NOTIFY_TOPIC.LOCK) {
        return (
            <svg {...props}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        );
    }

    if (topic === NOTIFY_TOPIC.NETWORK) {
        return (
            <svg {...props}>
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
        );
    }

    return (
        <svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
};

export const ToastCard = ({ t, status, topic, title, message }) => {
    const theme = useTheme();
    const accent = getStatusColor(status, theme);

    return (
        <div
            role="status"
            onClick={() => toast.dismiss(t.id)}
            className={`pointer-events-auto flex w-80 cursor-pointer items-start gap-3.5 rounded-xl p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 ${
                t.visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'
            }`}
            style={{
                backgroundColor: `${theme.sidebar.inputBg}e6`,
                backgroundImage: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)`,
                border: `1px solid ${theme.sidebar.border}`,
            }}
        >
            <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5 shadow-md"
                style={{ backgroundColor: accent }}
            >
                <TopicIcon topic={topic} color={theme.sidebar.bg} />
            </span>

            <div className="min-w-0 flex-1">
                {title && (
                    <p className="text-xs font-bold leading-4 tracking-wide" style={{ color: theme.text.token }}>
                        {title}
                    </p>
                )}
                {message && (
                    <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: theme.text.label }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status, theme) => {
    switch (status) {
        case NOTIFY_STATUS.SUCCESS:
            return theme.status.run;
        case NOTIFY_STATUS.ERROR:
            return theme.diagnostics.error;
        case NOTIFY_STATUS.WARNING:
            return theme.diagnostics.warning;
        default:
            return theme.place.stroke;
    }
};
