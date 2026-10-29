#!/usr/bin/env bash
set -e

# ZenBar — One-line installer script
# Author: Shivant (https://github.com/Shivant7857)

UUID="zenbar@shivant7857.github.io"
DEST_DIR="${HOME}/.local/share/gnome-shell/extensions/${UUID}"

echo "🧘 Installing ZenBar extension..."

# Create destination folder
mkdir -p "${DEST_DIR}/schemas"

# Copy files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cp "${SCRIPT_DIR}/metadata.json" "${DEST_DIR}/"
cp "${SCRIPT_DIR}/extension.js" "${DEST_DIR}/"
cp "${SCRIPT_DIR}/prefs.js" "${DEST_DIR}/"
cp "${SCRIPT_DIR}/stylesheet.css" "${DEST_DIR}/"
cp "${SCRIPT_DIR}/schemas/org.gnome.shell.extensions.zenbar.gschema.xml" "${DEST_DIR}/schemas/"

# Also copy schemas to local schemas directory for gsettings CLI support
mkdir -p "${HOME}/.local/share/glib-2.0/schemas"
cp "${SCRIPT_DIR}/schemas/org.gnome.shell.extensions.zenbar.gschema.xml" "${HOME}/.local/share/glib-2.0/schemas/"

# Compile schemas
echo "⚙️ Compiling schemas..."
glib-compile-schemas "${DEST_DIR}/schemas"
glib-compile-schemas "${HOME}/.local/share/glib-2.0/schemas"

# Enable extension
echo "✨ Enabling ZenBar..."
if command -v gnome-extensions >/dev/null 2>&1; then
    gnome-extensions enable "${UUID}" 2>/dev/null || true
fi

echo "✅ ZenBar successfully installed and enabled!"
echo "👉 Press Super + Alt + H to toggle your status bar."
echo "👉 Configure options in Extension Manager or run: gnome-extensions prefs ${UUID}"
