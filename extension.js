const vscode = require('vscode');
const path = require("path");
const fs = require("fs");

function activate(context) {

    console.log('starting vludik');

    function focus_function (func) {
        let editor = vscode.window.activeTextEditor;
        let uri = vscode.Uri.file(editor.document.fileName);
        vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri).then(syms => {
            console.log (syms)
            if (!Array.isArray(syms)) {
                return
            }

            let editor = vscode.window.activeTextEditor;

            for (i of syms) {
                for (c of i.children) {
                    if (c.name.startsWith(func)) {
                        console.log (c)
                        return editor.revealRange(c.location.range)
                    }
                }

                if (i.name.startsWith(func)) {
                    console.log (i)
                    return editor.revealRange(c.location.range)
                }
            }

            throw (func + ' not found!')
        });
    }

    function is_model (p) {
        return /\bModel\b/.test (p)
    }

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', async function () {
        try {
            await open_view ('Content')
            focus_function ('select_' + type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_get_item', async function () {
        try {
            await open_view ('Content')
            focus_function ('get_item_of_' + type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_data', async function () {
        try {
            await open_view ('Data')
            focus_function (type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
	}))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', async function () {
        try {
            let type = type_name ()
            await open_view ('View', type, 'roster')
            focus_function (type)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw_item', async function () {
        try {
            let type = type_name ()
            await open_view ('View', type, 'item')
            focus_function (type)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_model', async function () {
        try {
            let type = type_name ()
            type = en_plural (type)

            let p = vscode.window.activeTextEditor.document.fileName
            if (is_model (p) && !/_vw\.js/.test (p)) {
                type = type + '_vw'
            }

            await open_view ('Model', type)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_html', async function () {
        await open_view ('Html')
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.copy_type', async function () {

        let view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        let type =  view_file.name
        let root = project_path (view_file.dir)

        let new_type = await vscode.window.showInputBox({prompt: "Copy to: ", placeHolder: "Enter new type name"})

        if (!new_type) return
        let slices_dir = path.dirname (root)
        let items = fs.readdirSync (slices_dir)

        let new_slice = await vscode.window.showQuickPick(items, {
            placeHolder: "Target slice name (Esc to keep current)",
            canPickMany: false,
        })
        if (!new_slice) new_slice = ''

        for (let view of ['Model', 'Content', 'Data', 'View', 'Html']) {

            let view_dir = view_path (view)
            let ext = view == 'Html'? 'html' : 'js'
            let copy_from = guess_file_path (path.join(root, view_dir), type, ext)
            if (!fs.existsSync (copy_from)) continue

            let copy_to = path.join (path.dirname (copy_from), new_type + '.' + ext)
            if (new_slice) {
                let slices = path.dirname (root)
                view_dir = path.dirname (copy_from).split (root)[1]
                copy_to = path.join (slices, new_slice, view_dir, new_type + '.' + ext)
            }
            if (fs.existsSync (copy_to)) continue

            fs.copyFileSync (copy_from, copy_to)
            replace_in_file (copy_to, type, new_type, () => open_file (copy_to))
        }
    }));

    function replace_in_file (file_path, from, to, callback) {

        var done = callback

        fs.readFile(file_path, 'utf8', function (err, data) {

            if (err) {
                return console.log(err);
            }

            var result = data.replace(new RegExp(from,'g'), to);

            fs.writeFile(file_path, result, 'utf8', function (err) {
                if (err) return console.log(err);
                done ()
            });
        });
    }

    async function open_view (view, type, prefer) {
        let view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        type = type || view_file.name
        let view_dir = view_path (view);
        let root = project_path (view_file.dir)
        let ext = view == 'Html'? 'html' : 'js'
        let file_path = guess_file_path (path.join(root, view_dir), type, ext, prefer)
        if (!file_path) throw `${view}/${type} not found`
        return open_file (file_path)
    }

    async function open_file (file_path) {
        let doc = await vscode.workspace.openTextDocument(file_path)
        let editor = await vscode.window.showTextDocument(doc);
        console.log('opened ' + file_path);
    }

    function guess_file_path (view_path, file_name, ext, prefer) {

        let file_path = ''

        let prefixes = ['']
        if (is_model (view_path)) {
            prefixes = prefixes.concat (['oltp', 'dw'])
        }

        for (prefix of prefixes) {

            file_path = path.join(view_path, file_name + '.' + ext);
            console.log (file_path)
            if (fs.existsSync(file_path)) return file_path

            file_path = path.join(view_path, prefix, file_name + '.' + ext);
            console.log (file_path)
            if (fs.existsSync(file_path)) return file_path

            switch (prefer) {
                case 'roster':
                    file_path = path.join(view_path, prefix, en_plural (file_name) + '.' + ext)
                    console.log (file_path)
                    if (fs.existsSync(file_path)) return file_path
                case 'item':
                    file_path = path.join(view_path, prefix, en_unplural (file_name) + '.' + ext)
                    console.log (file_path)
                    if (fs.existsSync(file_path)) return file_path
            }


            file_path = path.join(view_path, prefix, en_unplural (file_name) + '.' + ext);
            console.log (file_path)
            if (fs.existsSync(file_path)) return file_path

            file_path = path.join(view_path, prefix, en_plural (en_unplural (file_name)) + '.' + ext);
            console.log (file_path)
            if (fs.existsSync(file_path)) return file_path

        }

        return ''
    }

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

    function open_file (file_path) {
        return vscode.workspace.openTextDocument(file_path).then(doc => {
            vscode.window.showTextDocument(doc);
            console.log('opened ' + file_path);
        })
    }

    function view_path (view) {
        switch (view) {
            case 'Model': return ['back', 'lib', 'Model'].join ('/');
            case 'Content': return ['back', 'lib', 'Content'].join ('/');
            case 'Data': return ['front', 'root', '_', 'app', 'js', 'data'].join ('/');
            case 'View': return ['front', 'root', '_', 'app', 'js', 'view'].join ('/');
            case 'Html': return ['front', 'root', '_', 'app', 'html'].join ('/');
        }
    }

    function project_path (dir) {
        console.log (dir)
        while (dir) {
            dir = path.dirname (dir)
            if (dir.endsWith ('back') || dir.endsWith ('front')) {
                return path.dirname (dir)
            }
        }
        throw 'cant find project path! ' + dir
    }

    function type_name () {
        var file = path.parse(vscode.window.activeTextEditor.document.fileName);
        return file.name;
    }
}

exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;