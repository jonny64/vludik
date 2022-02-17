const vscode = require ('vscode')
const {open_view} = require ('../lib/path')
const {type_name, open_file, focus_function} = require ('../lib/ui')

module.exports = {

	goto_draw: async function () {

		let file_path = vscode.window.activeTextEditor.document.fileName

		let file_path_new = await open_view ('View', file_path, 'roster')

		await open_file (file_path_new)

		await focus_function (type_name ())

	}
}
