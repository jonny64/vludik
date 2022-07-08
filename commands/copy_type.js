const path = require("path")
const fs = require("fs")
const {view_path} = require ('../lib/path')
const {guess_file_path} = require ('../lib/path')


const make_from_to = function (o) {

	let {root, slice_path, type, new_type} = o

	let is_ui_src = /(roster|popup)/.test (type)

	let view_types = [
		{name: 'Model'},
		{name: 'Content'},
		{name: 'Data', is_ui: 1},
		{name: 'View', is_ui: 1},
		{name: 'Html', is_ui: 1},
	]

	let todo = []

	for (let view of view_types) {

		let view_dir = view_path (view.name)

		if (is_ui_src && !view.is_ui) continue

		let prefer = view.is_ui? 'plural_same' : ''
		let copy_from = guess_file_path (path.join(root, view_dir), type, prefer)

		if (!fs.existsSync (copy_from)) {
			continue
		}

		let ext = path.extname (copy_from)
		let copy_to = path.join (path.dirname (copy_from), new_type + ext)
		if (slice_path) {
			view_dir = path.dirname (copy_from).split (root)[1]
			copy_to = path.join (slice_path, view_dir, new_type + ext)
		}
		if (fs.existsSync (copy_to)) {
			continue
		}

		todo.push ([copy_from, copy_to])
	}

	return todo
}

function replace_in_file (file_path, from, to) {

	let data = fs.readFileSync (file_path, 'utf8')

	let result = data.replace(new RegExp(from,'g'), to)

	fs.writeFileSync(file_path, result, 'utf8')
}

module.exports = {

	make_from_to,

	copy_type: async function (o) {

		let {type, new_type} = o

		let todo = make_from_to (o)

		let created_files = []

		for (let [copy_from, copy_to] of todo) {

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

		return created_files
	}
}
