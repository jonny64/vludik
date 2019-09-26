const vscode = require('vscode');
const path = require("path");

function activate(context) {

    console.log('starting vludik');

    function focusFunction( prefix ) {
        let editor = vscode.window.activeTextEditor;
        var uri = vscode.Uri.file(editor.document.fileName);
        vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri).then(syms => {
            let sym = syms.find(function(i) {return i.name.startsWith(prefix)})
            editor.revealRange(sym.location.range)
        });
    }

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', function () {
        open_view('Content').then(() => {
            focusFunction ('select_')
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', function () {
        open_view('Presentation').then(() => {
            focusFunction ('draw_')
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
}

exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;