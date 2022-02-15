const vscode = require('vscode')
const path = require("path")
const fs = require("fs")
const {project_path, view_path} = require ('../lib/path')
const {open_file} = require ('../lib/ui')
const {guess_file_path} = require ('../lib/guess')

async function ask_new_slice (root) {

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

function replace_in_file (file_path, from, to, callback) {

	let data = fs.readFileSync (file_path, 'utf8')

	let result = data.replace(new RegExp(from,'g'), to)

	fs.writeFileSync(file_path, result, 'utf8')
}

module.exports = {

	copy_type: async function (o) {

		let view_file = path.parse(vscode.window.activeTextEditor.document.fileName)
		let type =  view_file.name
		let root = project_path (view_file.dir)

		let new_type = o? o.new_type : await vscode.window.showInputBox({prompt: "Copy to: ", placeHolder: "Enter new type name"})
		if (!new_type) return

		let slice_path = await ask_new_slice (root)

		let created_files = []

		for (let view of ['Model', 'Content', 'Data', 'View', 'Html']) {

			let view_dir = view_path (view)
			let copy_from = guess_file_path (path.join(root, view_dir), type)
			if (!fs.existsSync (copy_from)) {
				console.log (`${copy_from} does not exist, skipping...`)
				continue
			}

			let ext = path.extname (copy_from)
			let copy_to = path.join (path.dirname (copy_from), new_type + ext)
			if (slice_path) {
				view_dir = path.dirname (copy_from).split (root)[1]
				copy_to = path.join (slice_path, view_dir, new_type + ext)
			}
			if (fs.existsSync (copy_to)) {
				console.log (`${copy_to} already exists, skipping...`)
				continue
			}

			let copy_to_dir = path.dirname (copy_to)
			if (!fs.existsSync (copy_to_dir)) {
				fs.mkdirSync(copy_to_dir, { recursive: true })
			}

			console.log (`copy ${copy_from} -> ${copy_to}`)
			fs.copyFileSync (copy_from, copy_to)

			console.log (`replace in ${copy_to}: ${type} -> ${new_type}`)
			replace_in_file (copy_to, type, new_type)

			created_files.push (copy_to)
		}

		let open_files = created_files.map (i => open_file (i))
		await Promise.all (open_files)
	}
}
