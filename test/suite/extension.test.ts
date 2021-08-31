import * as assert from 'assert'
import * as path from 'path'
import * as fs from 'fs'

import * as vscode from 'vscode'
const vludik = require ('../../extension.js')
const no_slices_workspace = '../../test/workspaces/elu_dia_slick_template'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test ('should copy type in project without slices', async () => {
		const as_is = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users.js')
		const to_be = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users_copy.js')

		const uri = vscode.Uri.file (as_is)
		await vscode.workspace.openTextDocument(uri)
		await vscode.commands.executeCommand ('extension.copy_type', {new_type: 'users_copy'})

		assert (fs.existsSync (to_be), to_be)
	});
});
