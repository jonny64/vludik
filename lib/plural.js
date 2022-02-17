function remove_postfix (s) {

	let postfixes = [
		[/_roster$/,            ''],
		[/_new$/,               ''],
		[/_common$/,            ''],
		[/_vw$/,                ''],
	]

	for (i = 0; i < postfixes.length; i++) {
		var re = postfixes [i] [0]
		if (!s.match (re)) continue
		return s.replace (re, postfixes [i] [1])
	}

	return s

}

module.exports = {

	en_plural: function (s) {

		s = s.replace (/_popup$/, '')

		s = remove_postfix (s)

		if (/s$/.test (s)) return s

		if (/cfo$/.test (s)) return s

		return s + 's'
	},

	en_unplural: function (s) {

		if (s.match (/(status|goods)$/)) return s

		s = remove_postfix (s)

		let table = [
			[/tives$/,          'tive'],
			[/ives$/,            'ife'],
			[/ves$/,               'f'],
			[/ies$/,               'y'],
			// [/ice$/,            'ouse'],
			[/men$/,             'man'],
			[/eet(h?)$/,       'oot$1'],
			[/(o|ch|sh|ss|x)es$/, '$1'],
			[/s$/,                  ''],
		]

		for (i = 0; i < table.length; i++) {
			var re = table [i] [0]
			if (!s.match (re)) continue
			return s.replace (re, table [i] [1])
		}

		return s

	}

}
