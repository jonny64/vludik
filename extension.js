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
            let sym = syms.find(function(i) {return i.name.startsWith(func)})
            if (sym) {
                return editor.revealRange(sym.location.range)
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
        open_view('Presentation').then(() => {
            focusFunction ('draw_' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw_item', function () {
        open_view('Presentation').then(() => {
            focusFunction ('draw_item_of_' + type_name ())
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_model', function () {
        open_view('Model');
    }));

    function open_view(view) {
        var view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        var lib_dir = path.dirname(view_file.dir);
        var file_path = path.join(lib_dir, view, view_file.name + '.' + 'pm');
        return vscode.workspace.openTextDocument(file_path).then(doc => {
            vscode.window.showTextDocument(doc);
            console.log('opened ' + file_path);
        })
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