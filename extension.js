const vscode = require('vscode')
const path = require("path")

const {open_view, is_model} = require ('./lib/path')
const {focus_function, type_name, open_file} = require ('./lib/ui')
const {en_plural} = require ('./lib/plural')

const {copy_type} = require('./commands/copy_type')
const {goto_select} = require('./commands/goto_select')
const {goto_get_item} = require('./commands/goto_get_item')
const {goto_data} = require('./commands/goto_data')
const {goto_draw} = require('./commands/goto_draw')
const {goto_draw_item} = require('./commands/goto_draw_item')

function activate(context) {

    console.log('starting vludik');

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_select', async function () {
        try {
            goto_select ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_get_item', async function () {
        try {
            goto_get_item ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_data', async function () {
        try {
            goto_data ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw', async function () {
        try {
            goto_draw ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_draw_item', async function () {
        try {
            goto_draw_item ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_model', async function () {
        try {
            let type = type_name ()
            type = en_plural (type)

            let file_path = vscode.window.activeTextEditor.document.fileName
            let file = path.parse(file_path)
            let file_path_new
            if (is_model (file_path)) {
                let is_vw = /_vw$/.test (file.name)
                if (is_vw) {
                    file_path_new = path.join(file.dir, file.name.replace (/_vw$/, '') + file.ext)
                } else {
                    file_path_new = path.join(file.dir, file.name + '_vw' + file.ext)
                }
            } else {
                file_path_new = await open_view ('Model', file_path)
            }

            await open_file (file_path_new)

        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_html', async function () {
        let file_path = vscode.window.activeTextEditor.document.fileName
        let file_path_new = await open_view ('Html', file_path)
        await open_file (file_path_new)
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.copy_type', async function (o) {
        try {
            copy_type (o)
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    console.log ('vludik started')
}

exports.activate = activate

exports.deactivate = function () {
}
