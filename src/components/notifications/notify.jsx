import React from 'react';
import toast from 'react-hot-toast';
import i18n from '../../i18n';
import { ToastCard } from './ToastCard';
import { NOTIFY_STATUS, NOTIFY_DURATION } from '../../constants/notifications';

export const notify = ({ status, topic, title, message }) => {
    const safeTitle = title || i18n.t('notifications:defaultTitle');
    const safeMessage = message || i18n.t('notifications:defaultMessage');

    toast.custom((t) => <ToastCard t={t} status={status} topic={topic} title={safeTitle} message={safeMessage} />, {
        id: topic,
        position: 'bottom-right',
        duration: status === NOTIFY_STATUS.ERROR ? NOTIFY_DURATION.ERROR : NOTIFY_DURATION.DEFAULT,
    });
};
