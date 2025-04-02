const fs = require("fs")
const path = require("path")
const vscode = require ('vscode')
const {en_plural, en_unplural} = require ('./plural')
const darn = l => console.log (l)

const project_path = function (dir) {

	let dirname = (p) => {
		let parts = p.split (path.sep)
		parts.pop ()
		return parts.join (path.sep)
	}

	while (dir) {
		dir = dirname (dir)
		if (dir.endsWith ('back') || dir.endsWith ('front') || dir.endsWith ('frontend')) {
			return dirname (dir)
		}
	}

	throw 'cant find project path! ' + dir
}

const view_path = function (view) {

	const config = vscode.workspace.getConfiguration('vludik');
	switch (view) {
		case 'Model': return ['back', 'lib', 'Model'].join ('/');
		case 'Content': return ['back', 'lib', 'Content'].join ('/');
		case 'Data': return [ config.frontendPath, 'js', 'data'].join ('/');
		case 'View': return [ config.frontendPath, 'js', 'view'].join ('/');
		case 'Html': return [ config.frontendPath, 'html'].join ('/');
	}
}

const is_model = function (p) {
	return /\bModel\b/.test (p)
}

const guess_file_path = function (view_path, file_name, prefer) {

	let file_path = ''

	let prefixes = ['']
	if (is_model (view_path)) {
		prefixes = prefixes.concat (['oltp', 'dw'])
	}

	let exts = ['.js', '.html', '.pm']

	for (ext of exts) {
		for (prefix of prefixes) {

			switch (prefer) {
				case 'roster':
					file_path = path.join(view_path, prefix, en_plural (file_name) + ext)
					if (fs.existsSync(file_path)) return file_path
				case 'item':
					file_path = path.join(view_path, prefix, en_unplural (file_name) + ext)
					if (fs.existsSync(file_path)) return file_path

					let popup = en_unplural (en_plural (file_name)) + '_popup'
					file_path = path.join(view_path, prefix, popup + ext)
					if (fs.existsSync(file_path)) return file_path
			}

			file_path = path.join(view_path, file_name + ext)
			if (fs.existsSync(file_path)) return file_path

			file_path = path.join(view_path, prefix, file_name + ext)
			if (fs.existsSync(file_path)) return file_path

			if (!prefer) continue

			file_path = path.join(view_path, prefix, en_unplural (file_name) + ext)
			if (fs.existsSync(file_path)) return file_path

			file_path = path.join(view_path, prefix, en_plural (en_unplural (file_name)) + ext)
			if (fs.existsSync(file_path)) return file_path

		}
	}

	return ''
}

module.exports = {

	is_model,

	project_path,

	view_path,

	guess_file_path,

	open_view: async function (view, file_path, prefer) {

		let view_file = path.parse(file_path)
		let type = view_file.name

		let view_dir = view_path (view)
		let root = project_path (view_file.dir)
		let file_path_new = guess_file_path (path.join(root, view_dir), type, prefer)

		if (!file_path_new) throw `${view}/${type} not found`

		return file_path_new
	},

}
