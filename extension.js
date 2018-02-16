const vscode = require('vscode');
const path = require("path");

function activate(context) {

    console.log('starting vludik');

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', function () {
        open_view('Content');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', function () {
        open_view('Presentation');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_model', function () {
        open_view('Model');
    }));

    function open_view(view) {
        var view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        var lib_dir = path.dirname(view_file.dir);
        var file_path = path.join(lib_dir, view, view_file.name + '.' + 'pm');
        vscode.workspace.openTextDocument(file_path).then(doc => {
            vscode.window.showTextDocument(doc);
            console.log('opened ' + file_path);
        });
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;