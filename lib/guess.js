const fs = require("fs")
const path = require("path")
const {is_model} = require ('../lib/path')
const {en_plural, en_unplural} = require ('../lib/plural')

module.exports = {

	guess_file_path: function (view_path, file_name, prefer) {

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
						console.log (file_path)
						if (fs.existsSync(file_path)) return file_path
					case 'item':
						file_path = path.join(view_path, prefix, en_unplural (file_name) + ext)
						console.log (file_path)
						if (fs.existsSync(file_path)) return file_path
				}

				file_path = path.join(view_path, file_name + ext)
				console.log (file_path)
				if (fs.existsSync(file_path)) return file_path

				file_path = path.join(view_path, prefix, file_name + ext)
				console.log (file_path)
				if (fs.existsSync(file_path)) return file_path

				file_path = path.join(view_path, prefix, en_unplural (file_name) + ext)
				console.log (file_path)
				if (fs.existsSync(file_path)) return file_path

				file_path = path.join(view_path, prefix, en_plural (en_unplural (file_name)) + ext)
				console.log (file_path)
				if (fs.existsSync(file_path)) return file_path

			}
		}

		return ''
	},

}
