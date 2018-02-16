// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('starting vludik');

    let disposable = vscode.commands.registerCommand('extension.goto_content', function () {

        var view_file = path.parse(vscode.window.activeTextEditor.document.fileName)

        var lib_dir = path.dirname(view_file.dir)

        var file_path  = path.join(lib_dir, 'Content', view_file.name + '.' + 'pm')

        vscode.workspace.openTextDocument(file_path).then(doc => {
            vscode.window.showTextDocument(doc)
            console.log('opened ' + file_path);
        })
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;