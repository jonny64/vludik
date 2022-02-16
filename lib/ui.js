const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

const open_file = async function (file_path) {
	console.log (`open_file ${file_path}`)
	if (!fs.existsSync (file_path)) {
		console.log (`${file_path} not found!`)
		return
	}
	let doc = await vscode.workspace.openTextDocument(file_path)
	await vscode.window.showTextDocument(doc)
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
	}

}
