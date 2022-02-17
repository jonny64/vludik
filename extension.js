const vscode = require('vscode')

const {ask_new_type, open_file} = require ('./lib/ui')
const {copy_type}      = require('./commands/copy_type')

const {goto_select  }  = require('./commands/goto_select')
const {goto_get_item}  = require('./commands/goto_get_item')
const {goto_data}      = require('./commands/goto_data')
const {goto_draw}      = require('./commands/goto_draw')
const {goto_draw_item} = require('./commands/goto_draw_item')
const {goto_html}      = require('./commands/goto_html')
const {goto_model}     = require('./commands/goto_model')

const activate = function (context) {

    console.log('starting vludik')

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
            goto_model ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto_html', async function () {
        try {
            goto_html ()
        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.copy_type', async function (options) {
        try {

            let o = options && options.new_type? options : await ask_new_type ()

            if (!o.new_type) {
                console.log (`copy_type no input, skipping`)
                return
            }

            let created_files = await copy_type (o)
            let open_files = created_files.map (i => open_file (i))
            await Promise.all (open_files)

        } catch (x) {
            vscode.window.showInformationMessage ((x || {}).message || x)
        }
    }))

    console.log ('vludik started')
}

const deactivate = function () {}

module.exports = {
    activate,
    deactivate,
}
