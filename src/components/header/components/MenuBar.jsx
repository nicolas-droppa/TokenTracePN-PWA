import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { MENUS } from '../../../constants/menu';
import { PANELS } from '../../../constants/workspace';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import { usePetriStore } from '../../../store/usePetriStore';
import { MenuDropdown } from './MenuDropdown';
import { MenuItem } from './MenuItem';
import { ThemeMenu } from './ThemeMenu';
import { LanguageMenu } from './LanguageMenu';

/**
 * File / Edit / Settings menus.
 */
export const MenuBar = () => {
    const { t } = useTranslation();
    const [openMenu, setOpenMenu] = useState(null);
    const ref = useRef(null);

    const closeMenu = useCallback(() => setOpenMenu(null), []);
    const toggleMenu = (id) => setOpenMenu((current) => (current === id ? null : id));
    useClickOutside(ref, closeMenu);

    const showPanel = useWorkspaceStore((s) => s.showPanel);
    const resetLayout = useWorkspaceStore((s) => s.resetLayout);
    const selectedId = usePetriStore((s) => s.selectedId);
    const deleteElement = usePetriStore((s) => s.deleteElement);
    const isRunning = usePetriStore((s) => s.mode === 'run');

    const actions = {
        ...Object.fromEntries(PANELS.map((panel) => [`show:${panel.id}`, () => showPanel(panel.id)])),
        resetLayout,
        ...(selectedId && !isRunning && { deleteSelected: () => deleteElement(selectedId) }),
    };

    return (
        <nav ref={ref} className="flex items-center gap-2">
            {MENUS.map((menu) => (
                <MenuDropdown
                    key={menu.id}
                    label={t(menu.labelKey)}
                    isOpen={openMenu === menu.id}
                    onToggle={() => toggleMenu(menu.id)}
                >
                    {menu.items.map((item) => (
                        <MenuItem
                            key={item.id}
                            label={t(item.labelKey)}
                            disabled={!actions[item.id]}
                            onClick={() => {
                                actions[item.id]();
                                closeMenu();
                            }}
                        />
                    ))}
                </MenuDropdown>
            ))}

            <MenuDropdown label={t('header:menus.settings')} isOpen={openMenu === 'settings'} onToggle={() => toggleMenu('settings')}>
                <ThemeMenu onSelect={closeMenu} />
                <LanguageMenu onSelect={closeMenu} />
            </MenuDropdown>
        </nav>
    );
};
