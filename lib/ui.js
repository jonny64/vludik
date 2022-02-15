const vscode = require('vscode')

module.exports = {

	open_file: async function (file_path) {
		console.log (`open_file ${file_path}`)
		let doc = await vscode.workspace.openTextDocument(file_path)
		await vscode.window.showTextDocument(doc)
	}

}
