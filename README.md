<div align="center">

<img src="./assets/banner.svg" alt="ZenBar Banner" width="100%" />

# 🧘 ZenBar

**Intelligent Top Status Bar Auto-Hide & Distraction-Free Zen Mode for GNOME Shell**

[![GNOME Version](https://img.shields.io/badge/GNOME-45%20%7C%2046%20%7C%2047%20%7C%2048%20%7C%2049%20%7C%2050%2B-blue?style=for-the-badge&logo=gnome)](https://github.com/Shivant7857/zenbar)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-green.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)
[![Adwaita UI](https://img.shields.io/badge/UI-Libadwaita%201.5-purple.svg?style=for-the-badge&logo=gtk)](https://gitlab.gnome.org/GNOME/libadwaita)
[![Wayland & X11](https://img.shields.io/badge/Supports-Wayland%20%26%20X11-orange?style=for-the-badge)](https://wayland.freedesktop.org/)

<p align="center">
  <b>Reclaim 100% of your screen estate with fluid, butter-smooth status bar auto-hiding and zero-distraction focus.</b>
</p>

[✨ Features](#-key-features) • [🚀 Quick Install](#-quick-installation) • [⚙️ Modes](#-modes-explained) • [⌨️ Shortcuts](#️-keyboard-shortcuts) • [🛠️ Configuration](#️-terminal-configuration)

</div>

---

## 🌟 Key Features

- 🧘 **Smart Auto-Hide (Peek Mode)**: The top status bar slides up seamlessly. Hover your cursor at the very top edge of the monitor to glide it back into view.
- 👻 **Ghost / Zen Mode**: Completely hides the status bar for true distraction-free, maximized coding and design workflows.
- 👁️ **Always Visible**: Instant 1-click fallback to the standard GNOME Shell panel whenever needed.
- 🛡️ **Active Menu Shield**: The panel **never** snaps shut or disappears while you are interacting with menus (WiFi, Quick Settings, Calendar, Sound, or App Indicators).
- 🔄 **Activities Overview Integration**: Choose whether the status bar gracefully reveals itself when you enter the GNOME Activities Overview (`Super` key).
- ⚡ **Ultra Lightweight & Butter-Smooth**: Written natively in modern ES Module JavaScript using GNOME Shell's Clutter easing engines.
- 🎨 **Modern Libadwaita Preferences**: Sleek GTK4 / Libadwaita UI with quick preset pills, interactive sliders, and immediate live updates.
- ⌨️ **Global Shortcut**: Press `<Super> + <Alt> + H` anytime to toggle visibility instantly.

---

## 📸 Display Modes Explained

| Mode | Behavior | Best Used For |
| :--- | :--- | :--- |
| **1. 🧘 Auto-Hide** | Panel stays hidden; slides smoothly into view when cursor touches top screen edge | Everyday multitasking, coding, web browsing |
| **2. 👻 Ghost / Zen Mode** | Panel is permanently hidden off-screen (reveals in Overview if enabled) | Deep work, fullscreen terminal, immersive gaming |
| **3. 👁️ Always Visible** | Normal standard GNOME panel behavior with strut allocation | Default desktop experience |

---

## 🚀 Quick Installation

### Method 1: One-Line Terminal Install

```bash
curl -fsSL https://raw.githubusercontent.com/Shivant7857/zenbar/main/scripts/install.sh | bash
```

### Method 2: Manual / Git Clone

```bash
git clone https://github.com/Shivant7857/zenbar.git
cd zenbar
bash scripts/install.sh
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Super</kbd> + <kbd>Alt</kbd> + <kbd>H</kbd> | **Toggle Top Bar** (Instantly show or hide the status bar) |
| <kbd>Super</kbd> | **Overview Peek** (Temporarily brings up panel if Overview integration is ON) |

---

## ⚙️ Terminal Configuration (GSettings CLI)

Switch modes or tweak values instantly from scripts or terminal:

```bash
# 🧘 Set Mode: Auto-Hide
gsettings set org.gnome.shell.extensions.zenbar mode 'autohide'

# 👻 Set Mode: Ghost / Zen Mode (Completely Hidden)
gsettings set org.gnome.shell.extensions.zenbar mode 'permanent'

# 👁️ Set Mode: Always Visible
gsettings set org.gnome.shell.extensions.zenbar mode 'visible'

# ⏱️ Adjust Animation Duration (in seconds)
gsettings set org.gnome.shell.extensions.zenbar animation-time 0.20

# ⏳ Adjust Re-Hide Delay (in milliseconds)
gsettings set org.gnome.shell.extensions.zenbar hide-delay 300
```

---

## 🧩 Building from Source

```bash
# Compile schemas and package extension zip
make pack

# Install locally
make install

# Clean build artifacts
make clean
```

---

## 🗺️ Compatibility

| Platform | Supported Versions |
| :--- | :--- |
| **GNOME Shell** | `45`, `46`, `47`, `48`, `49`, `50`, `51+` |
| **Display Server** | Wayland & X11 |
| **Distros** | Ubuntu 24.04/26.04+, Fedora 39+, Arch Linux, Debian 12+, openSUSE |

---

## 👤 Author

**Shivant** — *Linux App Developer & UI/UX Designer*
- GitHub: [@Shivant7857](https://github.com/Shivant7857)
- Repository: [github.com/Shivant7857/zenbar](https://github.com/Shivant7857/zenbar)

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** — see the [LICENSE](LICENSE) file for details.
