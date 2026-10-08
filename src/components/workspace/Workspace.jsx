import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MOBILE_MEDIA_QUERY } from '../../constants/workspace';
import { DockWorkspace } from './DockWorkspace';
import { MobileWorkspace } from './MobileWorkspace';

/**
 * Main workspace container that switches between mobile and desktop layouts.
 */
export const Workspace = () => {
    const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
    return isMobile ? <MobileWorkspace /> : <DockWorkspace />;
};
