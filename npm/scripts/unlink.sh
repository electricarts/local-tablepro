#!/bin/sh

set -eu

addon_path="$HOME/Library/Application Support/Local/addons/local-tablepro"

if [ ! -L "$addon_path" ]; then
	echo "$addon_path is not a symbolic link; refusing to remove it."
	exit 1
fi

unlink "$addon_path"
echo "Unlinked local-tablepro. Restart Local to finish."
