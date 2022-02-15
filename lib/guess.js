const fs = require("fs")
const path = require("path")
const {is_model} = require ('../lib/path')

function remove_postfix (s) {

    let postfixes = [
        [/_roster$/,            ''],
        [/_new$/,               ''],
        [/_popup$/,             ''],
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

function en_plural (s) {

    s = remove_postfix (s)

    if (/s$/.test (s)) return s

    return s + 's'
}

function en_unplural (s) {

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
    }

}
