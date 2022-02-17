const vscode = require ('vscode')
const {open_view} = require ('../lib/path')
const {open_file} = require ('../lib/ui')

module.exports = {

	goto_html: async function () {

		let file_path = vscode.window.activeTextEditor.document.fileName

		let file_path_new = await open_view ('Html', file_path)

		await open_file (file_path_new)

	}
}
