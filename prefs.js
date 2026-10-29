/**
 * ZenBar — Preferences UI (Libadwaita / GTK4)
 * Author: Shivant (https://github.com/Shivant7857)
 * License: GPL-3.0
 */

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

export default class ZenBarPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        window.set_default_size(680, 680);

        const page = new Adw.PreferencesPage({
            title: _('ZenBar Settings'),
            icon_name: 'view-fullscreen-symbolic',
        });
        window.add(page);

        // ==========================================
        // SECTION 1: DISPLAY MODE SELECTOR
        // ==========================================
        const modeGroup = new Adw.PreferencesGroup({
            title: _('Status Bar Behavior'),
            description: _('Select how your top status bar behaves to optimize screen space.'),
        });
        page.add(modeGroup);

        const modes = ['autohide', 'permanent', 'visible'];
        const modeRow = new Adw.ComboRow({
            title: _('Active Mode'),
            subtitle: _('Switch between Auto-Hide, Ghost/Zen Mode, or Normal visibility'),
            icon_name: 'preferences-desktop-display-symbolic',
        });

        const stringList = new Gtk.StringList();
        stringList.append(_('🧘 Auto-Hide (Smart Peek: Reveals when cursor touches top screen edge)'));
        stringList.append(_('👻 Ghost / Zen Mode (Completely Hidden: Maximized distraction-free focus)'));
        stringList.append(_('👁️ Always Visible (Standard GNOME top panel)'));
        modeRow.set_model(stringList);

        const currentMode = settings.get_string('mode');
        const currentIndex = modes.indexOf(currentMode);
        modeRow.set_selected(currentIndex >= 0 ? currentIndex : 0);

        modeRow.connect('notify::selected', () => {
            const idx = modeRow.get_selected();
            if (idx >= 0 && idx < modes.length) {
                settings.set_string('mode', modes[idx]);
            }
        });
        modeGroup.add(modeRow);

        // Quick Action Switch Buttons
        const quickGroup = new Adw.PreferencesGroup({
            title: _('Quick Presets'),
            description: _('One-click presets for rapid switching'),
        });
        page.add(quickGroup);

        // Auto-Hide Card
        const autoActionRow = new Adw.ActionRow({
            title: _('Enable Auto-Hide Mode'),
            subtitle: _('Panel slides away when not in use and slides back on top hover'),
            icon_name: 'input-mouse-symbolic',
        });
        const btnAuto = new Gtk.Button({
            label: _('Apply Auto-Hide'),
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action', 'pill'],
        });
        btnAuto.connect('clicked', () => {
            modeRow.set_selected(0);
        });
        autoActionRow.add_suffix(btnAuto);
        quickGroup.add(autoActionRow);

        // Ghost Mode Card
        const ghostActionRow = new Adw.ActionRow({
            title: _('Enable Ghost / Zen Mode'),
            subtitle: _('Completely hides the top bar for a clean, zero-distraction desktop'),
            icon_name: 'view-conceal-symbolic',
        });
        const btnGhost = new Gtk.Button({
            label: _('Apply Ghost Mode'),
            valign: Gtk.Align.CENTER,
            css_classes: ['destructive-action', 'pill'],
        });
        btnGhost.connect('clicked', () => {
            modeRow.set_selected(1);
        });
        ghostActionRow.add_suffix(btnGhost);
        quickGroup.add(ghostActionRow);

        // ==========================================
        // SECTION 2: FINE-TUNING & ANIMATION
        // ==========================================
        const optionsGroup = new Adw.PreferencesGroup({
            title: _('Fine-Tuning & Dynamics'),
            description: _('Customize trigger timings, animations, and overview behavior'),
        });
        page.add(optionsGroup);

        // Overview Toggle
        const overviewRow = new Adw.SwitchRow({
            title: _('Show in Activities Overview'),
            subtitle: _('Temporarily display the top bar when pressing the Super key'),
            icon_name: 'view-grid-symbolic',
            active: settings.get_boolean('show-in-overview'),
        });
        settings.bind('show-in-overview', overviewRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        optionsGroup.add(overviewRow);

        // Animation Time SpinRow
        const animRow = new Adw.SpinRow({
            title: _('Animation Duration (Seconds)'),
            subtitle: _('Smoothness and speed of slide-in / slide-out transitions'),
            icon_name: 'media-playback-start-symbolic',
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.05,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
                value: settings.get_double('animation-time'),
            }),
        });
        settings.bind('animation-time', animRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        optionsGroup.add(animRow);

        // Hide Delay SpinRow
        const delayRow = new Adw.SpinRow({
            title: _('Hide Delay (Milliseconds)'),
            subtitle: _('Grace period before hiding after the mouse cursor exits the panel'),
            icon_name: 'alarm-symbolic',
            adjustment: new Gtk.Adjustment({
                lower: 50,
                upper: 1500,
                step_increment: 50,
                page_increment: 100,
                value: settings.get_int('hide-delay'),
            }),
        });
        settings.bind('hide-delay', delayRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        optionsGroup.add(delayRow);

        // ==========================================
        // SECTION 3: KEYBOARD SHORTCUTS
        // ==========================================
        const shortcutGroup = new Adw.PreferencesGroup({
            title: _('Keyboard Shortcuts'),
            description: _('Instant hardware controls to toggle panel visibility on demand'),
        });
        page.add(shortcutGroup);

        const shortcutRow = new Adw.ActionRow({
            title: _('Toggle Top Bar Visibility'),
            subtitle: _('Press Super + Alt + H anywhere to instantly show or hide the bar'),
            icon_name: 'input-keyboard-symbolic',
        });
        const shortcutBadge = new Gtk.ShortcutLabel({
            accelerator: '<Super><Alt>h',
            valign: Gtk.Align.CENTER,
        });
        shortcutRow.add_suffix(shortcutBadge);
        shortcutGroup.add(shortcutRow);

        // ==========================================
        // SECTION 4: ABOUT & DEVELOPER
        // ==========================================
        const aboutGroup = new Adw.PreferencesGroup({
            title: _('About ZenBar'),
        });
        page.add(aboutGroup);

        const authorRow = new Adw.ActionRow({
            title: _('Created by Shivant'),
            subtitle: _('Linux App Developer & UI/UX Designer • github.com/Shivant7857/zenbar'),
            icon_name: 'starred-symbolic',
        });
        aboutGroup.add(authorRow);
    }
}
