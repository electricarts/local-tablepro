#!/bin/sh

set -eu

addon_dir="$HOME/Library/Application Support/Local/addons"
addon_path="$addon_dir/local-tablepro"

if [ ! -d "$addon_dir" ]; then
	echo "Cannot locate $addon_dir. Is Local installed?"
	exit 1
fi

if [ -e "$addon_path" ] || [ -L "$addon_path" ]; then
	echo "$addon_path already exists; refusing to overwrite it."
	exit 1
fi

ln -s "$(pwd)" "$addon_path"
npm install --prefix "$addon_path"
npm run build --prefix "$addon_path"

echo "Linked local-tablepro to $addon_path. Restart Local to enable it."
