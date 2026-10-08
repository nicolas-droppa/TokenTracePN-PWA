import React, { useCallback, useRef, useState } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { MENUS } from '../../../constants/menu';
import { MenuDropdown } from './MenuDropdown';
import { MenuItem } from './MenuItem';
import { ThemeMenu } from './ThemeMenu';

/**
 * File / Edit / Settings menus.
 */
export const MenuBar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const ref = useRef(null);

    const closeMenu = useCallback(() => setOpenMenu(null), []);
    const toggleMenu = (id) => setOpenMenu((current) => (current === id ? null : id));
    useClickOutside(ref, closeMenu);

    // Menu item id -> handler. An item without a handler is shown as disabled.
    const actions = {};

    return (
        <nav ref={ref} className="flex items-center gap-2">
            {MENUS.map((menu) => (
                <MenuDropdown
                    key={menu.id}
                    label={menu.label}
                    isOpen={openMenu === menu.id}
                    onToggle={() => toggleMenu(menu.id)}
                >
                    {menu.items.map((item) => (
                        <MenuItem
                            key={item.id}
                            label={item.label}
                            disabled={!actions[item.id]}
                            onClick={() => {
                                actions[item.id]();
                                closeMenu();
                            }}
                        />
                    ))}
                </MenuDropdown>
            ))}

            <MenuDropdown label="Settings" isOpen={openMenu === 'settings'} onToggle={() => toggleMenu('settings')}>
                <ThemeMenu onSelect={closeMenu} />
            </MenuDropdown>
        </nav>
    );
};
