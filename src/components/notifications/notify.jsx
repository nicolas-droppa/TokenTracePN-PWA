import React from 'react';
import toast from 'react-hot-toast';
import { ToastCard } from './ToastCard';
import { NOTIFY_STATUS, NOTIFY_DURATION } from '../../constants/notifications';

export const notify = ({ status, topic, title, message }) => {
    const safeTitle = title || 'Notification';
    const safeMessage = message || 'Action completed.';

    toast.custom((t) => <ToastCard t={t} status={status} topic={topic} title={safeTitle} message={safeMessage} />, {
        id: topic,
        position: 'bottom-right',
        duration: status === NOTIFY_STATUS.ERROR ? NOTIFY_DURATION.ERROR : NOTIFY_DURATION.DEFAULT,
    });
};
