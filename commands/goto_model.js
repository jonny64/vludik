const path = require("path")
const vscode = require ('vscode')
const {is_model, open_view} = require ('../lib/path')
const {en_plural} = require ('../lib/plural')
const {type_name, open_file} = require ('../lib/ui')

module.exports = {

	goto_model: async function () {

		let type = type_name ()

		type = en_plural (type)

		let file_path = vscode.window.activeTextEditor.document.fileName
		let file = path.parse(file_path)
		let file_path_new
		if (is_model (file_path)) {
			let is_vw = /_vw$/.test (file.name)
			if (is_vw) {
				file_path_new = path.join(file.dir, file.name.replace (/_vw$/, '') + file.ext)
			} else {
				file_path_new = path.join(file.dir, file.name + '_vw' + file.ext)
			}
		} else {
			file_path_new = await open_view ('Model', file_path)
		}

		await open_file (file_path_new)
	}
}
