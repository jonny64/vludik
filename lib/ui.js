const path = require("path")
const vscode = require('vscode')
const {project_path, view_path} = require ('./path')
const {guess_file_path} = require ('./guess')

const open_file = async function (file_path) {
	console.log (`open_file ${file_path}`)
	let doc = await vscode.workspace.openTextDocument(file_path)
	await vscode.window.showTextDocument(doc)
}

module.exports = {

	type_name: function () {
		var file = path.parse(vscode.window.activeTextEditor.document.fileName)
		return file.name
	},

	open_view: async function (view, type, prefer) {
		let view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
		type = type || view_file.name
		let view_dir = view_path (view);
		let root = project_path (view_file.dir)
		let file_path = guess_file_path (path.join(root, view_dir), type, prefer)
		if (!file_path) throw `${view}/${type} not found`
		await open_file (file_path)
	},

	open_file,

	focus_function: async function (func) {
		let editor = vscode.window.activeTextEditor;
		let uri = vscode.Uri.file(editor.document.fileName);
		let syms = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri)

		if (!Array.isArray(syms)) {
			console.log ('no symbols found')
			return
		}

		for (i of syms) {
			for (c of i.children) {
				if (c.name.startsWith(func)) {
					console.log (c)
					return editor.revealRange(c.location.range, 3)
				}
			}

			if (i.name.startsWith(func)) {
				console.log (i)
				return editor.revealRange(i.location.range, 3)
			}
		}

		console.log (func + ' not found!')
	}

}
