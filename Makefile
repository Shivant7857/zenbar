UUID = zenbar@shivant7857.github.io
ZIP_NAME = $(UUID).shell-extension.zip
INSTALL_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: all pack install uninstall clean schema

all: schema pack

schema:
	@echo "Compiling GSettings schemas..."
	glib-compile-schemas schemas/

pack: schema
	@echo "Packaging $(ZIP_NAME)..."
	gnome-extensions pack --force --extra-source=stylesheet.css --out-dir=.

install:
	@echo "Installing ZenBar..."
	bash scripts/install.sh

uninstall:
	@echo "Uninstalling ZenBar..."
	bash scripts/uninstall.sh

clean:
	@echo "Cleaning build artifacts..."
	rm -f schemas/gschemas.compiled
	rm -f $(ZIP_NAME)
