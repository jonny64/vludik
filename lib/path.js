const path = require("path")

module.exports = {

	project_path: function (dir) {
		console.log (dir)
		while (dir) {
			dir = path.dirname (dir)
			if (dir.endsWith ('back') || dir.endsWith ('front')) {
				return path.dirname (dir)
			}
		}
		throw 'cant find project path! ' + dir
	},

	view_path: function (view) {
		switch (view) {
			case 'Model': return ['back', 'lib', 'Model'].join ('/');
			case 'Content': return ['back', 'lib', 'Content'].join ('/');
			case 'Data': return ['front', 'root', '_', 'app', 'js', 'data'].join ('/');
			case 'View': return ['front', 'root', '_', 'app', 'js', 'view'].join ('/');
			case 'Html': return ['front', 'root', '_', 'app', 'html'].join ('/');
		}
	},

	is_model: function (p) {
		return /\bModel\b/.test (p)
	},

}
