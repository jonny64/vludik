[![](https://vsmarketplacebadge.apphb.com/version-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)
[![](https://vsmarketplacebadge.apphb.com/rating-short/jonny64.vludik.svg)](https://marketplace.visualstudio.com/items?itemName=jonny64.vludik)

This [vscode](https://code.visualstudio.com/download) plugin adds: navigation hotkeys for [dia.js](https://github.com/do-/dia.js/wiki) framework

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

| to do                                                | run
| ----                                                 | ---
| run all tests (including e2e)                        | npm test && npm run e2e
| run all unit tests                                   | npm test
| run single unit test by name tag                     | npx jest -t 'popup'
| run e2e tests                                        | npm run e2e
| build *.vsix package                                 | vsce package (npm install -g vsce first)

Debug in vscode:
* open vludik folder
* run - Start debugging
* set breakpoints, etc.

## Installation
* `Ctrl Shift P` - `Install extensions` - search `vludik` in marketplace

or manually

* `Ctrl Shift P` - `Install from vsix`
