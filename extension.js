const vscode = require('vscode');
const path = require("path");

function activate(context) {

    console.log('starting vludik');

    function focusFunction (func) {
        let editor = vscode.window.activeTextEditor;
        var uri = vscode.Uri.file(editor.document.fileName);
        vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri).then(syms => {
            if (!Array.isArray(syms)) {
                console.log(syms);
                return
            }
            console.log (syms)
            for (i of syms) {
                for (c of i.children) {
                    if (c.name.startsWith(func)) {
                        console.log (c)
                        return editor.revealRange(c.location.range)
                    }
                }
            }

            console.log (func + ' not found!')
        });
    }

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', function () {
        open_view('Content').then(() => {
            focusFunction ('select_' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_get_item', function () {
        open_view('Content').then(() => {
            focusFunction ('get_item_of_' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', function () {
        open_view('View').then(() => {
            focusFunction ('$_DRAW.' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw_item', function () {
        open_view('View').then(() => {
            focusFunction ('$_DRAW.' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_model', function () {
        open_view('Model');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_html', function () {
        open_view('Html');
    }));

    function open_view(view) {
        let view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        let view_dir = view_path (view);
        let root = project_path (view_file.dir)
        let ext = view == 'Html'? 'html' : 'js'
        let file_path = path.join(root, view_dir, view_file.name + '.' + ext);
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