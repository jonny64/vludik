const fs = require('fs')
const path = require('path')
const vscode = require('vscode')
const {project_path} = require ('../lib/path')

const open_file = async function (file_path) {
	console.log (`open_file ${file_path}`)
	if (!fs.existsSync (file_path)) {
		console.log (`${file_path} not found!`)
		return
	}
	let doc = await vscode.workspace.openTextDocument(file_path)
	return vscode.window.showTextDocument(doc)
}

const ask_new_slice = async function (root) {

	let slices_dir = /slices/.test (root)? path.dirname (root) : path.join (root, 'slices')

	if (!fs.existsSync (slices_dir)) return ''

	let items = fs.readdirSync (slices_dir)

	let new_slice = await vscode.window.showQuickPick(items, {
		placeHolder: "Target slice name (Esc to keep current)",
		canPickMany: false,
	})

	if (!new_slice) return ''

	return path.join (slices_dir, new_slice)
}

const ask_new_type = async function (o) {

	let view_file = path.parse(vscode.window.activeTextEditor.document.fileName)
	let type =  view_file.name
	let root = project_path (view_file.dir)

	let new_type = await vscode.window.showInputBox({prompt: "Copy to: ", placeHolder: "Enter new type name"})

	if (!new_type) return new_type

	let slice_path = await ask_new_slice (root)

	return {root, type, new_type, slice_path}
}

module.exports = {

	type_name: function () {
		let file = path.parse(vscode.window.activeTextEditor.document.fileName)
		return file.name
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
	},

	ask_new_type,

}
