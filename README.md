[![](https://vsmarketplacebadge.apphb.com/version-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)
[![](https://vsmarketplacebadge.apphb.com/rating-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)

# vludik README

    navigation hotkeys for dia.js framework (https://github.com/do-/dia.js/wiki)

## Features

	hotkeys to navigate:

	alt + g = get_item
	alt + s = select
	alt + u = do_update
	alt + c = do_create
	alt + d = js/data current type: item or roster
	alt + m = js/view item
	alt + w = js/view roster
	alt + e = html current type: item or roster

	F5      = goto model and back to screen where we started
	F12     = copy Content data view html Model to new screen: asks name of new screen

## Building
	npm install -g vsce
	vsce package

builds [*.vsix](https://github.com/jonny64/vludik/releases) package

## Installation
* `Ctrl Shift P` - `Install extensions` - search `vludik` in marketplace

or manually

* `Ctrl Shift P` - `Install from vsix`
