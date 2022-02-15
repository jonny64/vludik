const vscode = require('vscode');
const path = require("path");

const {open_file} = require ('./lib/ui')
const {guess_file_path} = require ('./lib/guess')
const {copy_type} = require('./commands/copy_type')
const {project_path, view_path, is_model} = require ('./lib/path')

function activate(context) {

    console.log('starting vludik');

    async function focus_function (func) {
        let editor = vscode.window.activeTextEditor;
        let uri = vscode.Uri.file(editor.document.fileName);
        let syms = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri)
        console.log (syms)
        if (!Array.isArray(syms)) {
            return
        }

        for (i of syms) {
            for (c of i.children) {
                if (c.name.startsWith(func)) {
                    console.log (c)
                    return editor.revealRange(c.location.range, 3)
                }
            }

            if (i.name.startsWith(func)) {
                console.log (i)
                return editor.revealRange(i.location.range, 3)
            }
        }

        console.log (func + ' not found!')
    }

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', async function () {
        try {
            await open_view ('Content')
            await focus_function ('select_' + type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_get_item', async function () {
        try {
            await open_view ('Content')
            await focus_function ('get_item_of_' + type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_data', async function () {
        try {
            await open_view ('Data')
            await focus_function (type_name ())
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
	}))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', async function () {
        try {
            let type = type_name ()
            await open_view ('View', type, 'roster')
            await focus_function (type)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw_item', async function () {
        try {
            let type = type_name ()
            await open_view ('View', type, 'item')
            await focus_function (type)
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

    context.subscriptions.push(vscode.commands.registerCommand('extension.copy_type', async function (o) {
        try {
            copy_type (o)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    async function open_view (view, type, prefer) {
        let view_file = path.parse(vscode.window.activeTextEditor.document.fileName);
        type = type || view_file.name
        let view_dir = view_path (view);
        let root = project_path (view_file.dir)
        let file_path = guess_file_path (path.join(root, view_dir), type, prefer)
        if (!file_path) throw `${view}/${type} not found`
        await open_file (file_path)
    }


    function type_name () {
        var file = path.parse(vscode.window.activeTextEditor.document.fileName);
        return file.name;
    }

    console.log ('vludik started')
}

exports.activate = activate

exports.deactivate = function () {
}
