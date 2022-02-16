const vscode = require('vscode');
const path = require("path");

const {open_view, focus_function, type_name} = require ('./lib/ui')
const {en_plural} = require ('./lib/plural')
const {copy_type} = require('./commands/copy_type')
const {is_model} = require ('./lib/path')

function activate(context) {

    console.log('starting vludik');

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

    console.log ('vludik started')
}

exports.activate = activate

exports.deactivate = function () {
}
