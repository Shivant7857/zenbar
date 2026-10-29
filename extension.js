/**
 * ZenBar — Intelligent Top Bar & Auto-Hide Extension for GNOME Shell
 * Author: Shivant (https://github.com/Shivant7857)
 * License: GPL-3.0
 */

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Meta from 'gi://Meta';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Shell from 'gi://Shell';

export default class ZenBarExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._isPanelHidden = false;
        this._animating = false;
        this._hideTimeoutId = null;
        this._menuEvent = null;
        this._blockerMenu = null;
        this._unredirectDisabled = false;

        this._mode = this._settings.get_string('mode');
        this._animationTime = this._settings.get_double('animation-time');
        this._hideDelay = this._settings.get_int('hide-delay');
        this._showInOverview = this._settings.get_boolean('show-in-overview');

        // Watch settings changes
        this._settingsChangedIds = [
            this._settings.connect('changed::mode', () => this._onModeChanged()),
            this._settings.connect('changed::animation-time', () => {
                this._animationTime = this._settings.get_double('animation-time');
            }),
            this._settings.connect('changed::hide-delay', () => {
                this._hideDelay = this._settings.get_int('hide-delay');
            }),
            this._settings.connect('changed::show-in-overview', () => {
                this._showInOverview = this._settings.get_boolean('show-in-overview');
            }),
        ];

        // Global Shortcut: Super + Alt + H (configurable)
        Main.wm.addKeybinding(
            'toggle-shortcut',
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this._toggleVisibility()
        );

        // GNOME Activities Overview hooks
        this._overviewShowingId = Main.overview.connect('showing', () => {
            if (this._showInOverview) {
                this._showPanel(false);
            }
        });

        this._overviewHidingId = Main.overview.connect('hiding', () => {
            if (this._mode === 'permanent' || this._mode === 'autohide') {
                const [x, y] = global.get_pointer();
                const primary = Main.layoutManager.primaryMonitor;
                const panelBox = Main.layoutManager.panelBox;
                if (this._mode === 'permanent' || y > (primary?.y || 0) + (panelBox.height || 32)) {
                    this._hidePanel(false);
                }
            }
        });

        // Smart Cursor Proximity Tracker
        this._cursorTracker = (typeof global.backend?.get_cursor_tracker === 'function')
            ? global.backend.get_cursor_tracker()
            : Meta.CursorTracker.get_for_display(global.display);

        this._cursorTrackerId = this._cursorTracker.connect(
            'position-invalidated',
            () => this._onCursorMoved()
        );

        // Apply initial display mode
        this._onModeChanged();
    }

    disable() {
        if (this._hideTimeoutId) {
            GLib.source_remove(this._hideTimeoutId);
            this._hideTimeoutId = null;
        }

        if (this._cursorTracker && this._cursorTrackerId) {
            this._cursorTracker.disconnect(this._cursorTrackerId);
            this._cursorTrackerId = null;
        }

        if (this._overviewShowingId) {
            Main.overview.disconnect(this._overviewShowingId);
            this._overviewShowingId = null;
        }

        if (this._overviewHidingId) {
            Main.overview.disconnect(this._overviewHidingId);
            this._overviewHidingId = null;
        }

        if (this._blockerMenu && this._menuEvent) {
            this._blockerMenu.disconnect(this._menuEvent);
            this._menuEvent = null;
            this._blockerMenu = null;
        }

        Main.wm.removeKeybinding('toggle-shortcut');

        if (this._settingsChangedIds) {
            for (const id of this._settingsChangedIds) {
                this._settings.disconnect(id);
            }
            this._settingsChangedIds = null;
        }

        this._setUnredirectDisabled(false);

        // Restore default GNOME panel struts & coordinates
        const panelBox = Main.layoutManager.panelBox;
        panelBox.remove_all_transitions();
        panelBox.y = 0;
        panelBox.show();
        this._setStruts(true);

        this._isPanelHidden = false;
        this._animating = false;
        this._settings = null;
    }

    _setStruts(affectsStruts) {
        const panelBox = Main.layoutManager.panelBox;
        Main.layoutManager.removeChrome(panelBox);
        Main.layoutManager.addChrome(panelBox, {
            affectsStruts: affectsStruts,
            trackFullscreen: true,
        });
    }

    _onModeChanged() {
        this._mode = this._settings.get_string('mode');

        if (this._mode === 'visible') {
            this._setStruts(true);
            this._showPanel(false);
        } else if (this._mode === 'permanent') {
            this._setStruts(false);
            this._hidePanel(false);
        } else {
            // 'autohide' mode
            this._setStruts(false);
            const [x, y] = global.get_pointer();
            const primary = Main.layoutManager.primaryMonitor;
            const panelBox = Main.layoutManager.panelBox;
            const panelHeight = panelBox.height || 32;

            if (primary && y <= primary.y + panelHeight) {
                this._showPanel(false);
            } else {
                this._hidePanel(false);
            }
        }
    }

    _toggleVisibility() {
        if (this._isPanelHidden) {
            this._showPanel(false);
        } else {
            this._hidePanel(false);
        }
    }

    _onCursorMoved() {
        if (this._mode !== 'autohide') return;
        if (Main.overview.visible) return;

        const [x, y] = global.get_pointer();
        const primary = Main.layoutManager.primaryMonitor;
        if (!primary) return;

        // Ensure pointer is within the bounds of primary display horizontally
        if (x < primary.x || x > primary.x + primary.width) {
            return;
        }

        const panelBox = Main.layoutManager.panelBox;
        const panelHeight = panelBox.height || 32;
        const triggerSensitivity = 3;

        // Pointer reached top edge: reveal panel smoothly
        if (y <= primary.y + triggerSensitivity) {
            if (this._hideTimeoutId) {
                GLib.source_remove(this._hideTimeoutId);
                this._hideTimeoutId = null;
            }
            if (this._isPanelHidden) {
                this._showPanel(false);
            }
            return;
        }

        // Pointer inside panel bounds: keep panel visible
        if (y <= primary.y + panelHeight) {
            if (this._hideTimeoutId) {
                GLib.source_remove(this._hideTimeoutId);
                this._hideTimeoutId = null;
            }
            return;
        }

        // Pointer below panel bounds: schedule auto-hide
        if (!this._isPanelHidden && !this._hideTimeoutId) {
            // Prevent hiding if an active popup menu is open
            const activeMenu = Main.panel.menuManager?.activeMenu;
            if (activeMenu) {
                if (!this._menuEvent) {
                    this._blockerMenu = activeMenu;
                    this._menuEvent = activeMenu.connect('open-state-changed', (menu, open) => {
                        if (!open) {
                            if (this._blockerMenu && this._menuEvent) {
                                this._blockerMenu.disconnect(this._menuEvent);
                                this._menuEvent = null;
                                this._blockerMenu = null;
                            }
                            this._onCursorMoved();
                        }
                    });
                }
                return;
            }

            this._hideTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, this._hideDelay, () => {
                this._hideTimeoutId = null;
                if (Main.panel.menuManager?.activeMenu) {
                    return GLib.SOURCE_REMOVE;
                }
                const [curX, curY] = global.get_pointer();
                if (curY > primary.y + panelHeight) {
                    this._hidePanel(false);
                }
                return GLib.SOURCE_REMOVE;
            });
        }
    }

    _showPanel(immediate = false) {
        const panelBox = Main.layoutManager.panelBox;
        const duration = immediate ? 0 : Math.round(this._animationTime * 1000);

        if (this._animating) {
            panelBox.remove_all_transitions();
            this._animating = false;
        }

        panelBox.show();
        this._setUnredirectDisabled(true);

        if (duration === 0) {
            panelBox.y = 0;
            this._isPanelHidden = false;
            return;
        }

        this._animating = true;
        panelBox.ease({
            y: 0,
            duration: duration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                this._animating = false;
                this._isPanelHidden = false;
            },
        });
    }

    _hidePanel(immediate = false) {
        if (this._mode === 'visible') return;

        const panelBox = Main.layoutManager.panelBox;
        const targetY = -(panelBox.height || 32);
        const duration = immediate ? 0 : Math.round(this._animationTime * 1000);

        if (this._animating) {
            panelBox.remove_all_transitions();
            this._animating = false;
        }

        if (duration === 0) {
            panelBox.y = targetY;
            panelBox.hide();
            this._isPanelHidden = true;
            this._setUnredirectDisabled(false);
            return;
        }

        this._animating = true;
        panelBox.ease({
            y: targetY,
            duration: duration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                this._animating = false;
                this._isPanelHidden = true;
                panelBox.hide();
                this._setUnredirectDisabled(false);
            },
        });
    }

    _setUnredirectDisabled(disabled) {
        if (disabled === this._unredirectDisabled) return;
        try {
            if (global.compositor?.disable_unredirect) {
                if (disabled)
                    global.compositor.disable_unredirect();
                else
                    global.compositor.enable_unredirect();
            } else if (Meta.disable_unredirect_for_display) {
                if (disabled)
                    Meta.disable_unredirect_for_display(global.display);
                else
                    Meta.enable_unredirect_for_display(global.display);
            }
        } catch (e) {
            // Ignore if compositor does not support unredirect calls
        }
        this._unredirectDisabled = disabled;
    }
}
