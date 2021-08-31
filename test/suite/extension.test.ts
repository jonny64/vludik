import * as assert from 'assert'
import { before, it } from 'mocha'
import * as path from 'path'
import * as fs from 'fs'

import * as vscode from 'vscode'
const no_slices_workspace = '../../test/workspaces/elu_dia_slick_template'

suite('Extension Test Suite', () => {

	console.log ('Start all tests.')

	let extension : vscode.Extension<any>|undefined

	before (async () => {
		extension = await vscode.extensions.getExtension('jonny64.vludik')
		console.log (`open ${no_slices_workspace}...`)
		let uri = vscode.Uri.file (no_slices_workspace)
		await vscode.commands.executeCommand('vscode.openFolder', uri)
	})

	it ('should load and activate extension', async () => {
		assert.ok (extension)
		assert.ok (extension.isActive)
	})

	it ('should copy type in project without slices', async () => {
		const as_is = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users.js')
		const to_be = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users_copy.js')

		const uri = vscode.Uri.file (as_is)
		await vscode.workspace.openTextDocument(uri)
		await vscode.commands.executeCommand ('extension.copy_type', {new_type: 'users_copy'})

		assert (fs.existsSync (to_be), to_be)
	});
});
