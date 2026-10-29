#!/usr/bin/env bash
set -e

# ZenBar — Clean uninstaller script
# Author: Shivant (https://github.com/Shivant7857)

UUID="zenbar@shivant7857.github.io"
DEST_DIR="${HOME}/.local/share/gnome-shell/extensions/${UUID}"

echo "🗑️ Disabling and uninstalling ZenBar..."

if command -v gnome-extensions >/dev/null 2>&1; then
    gnome-extensions disable "${UUID}" 2>/dev/null || true
fi

rm -rf "${DEST_DIR}"
rm -f "${HOME}/.local/share/glib-2.0/schemas/org.gnome.shell.extensions.zenbar.gschema.xml"

if command -v glib-compile-schemas >/dev/null 2>&1; then
    glib-compile-schemas "${HOME}/.local/share/glib-2.0/schemas" 2>/dev/null || true
fi

echo "✅ ZenBar removed cleanly."
