import * as assert from 'assert'
import { before, it } from 'mocha'
import * as path from 'path'
import * as fs from 'fs'

import * as vscode from 'vscode'
const no_slices_workspace = '../../test/workspaces/elu_dia_slick_template'

suite ('Vludik Test Suite', () => {

	const as_is = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users.js')
	const to_be = path.join(__dirname, no_slices_workspace, 'back/lib/Content/users_copy.js')

	before (async () => {
		console.log (`open ${no_slices_workspace}...`)
		let uri = vscode.Uri.file (no_slices_workspace)
		await vscode.commands.executeCommand('vscode.openFolder', uri)
		if (fs.existsSync (to_be)) {
			console.log (`rm ${to_be}`)
			await fs.unlinkSync (to_be)
		}
	})

	it ('should copy type in project without slices', async () => {
		const uri = vscode.Uri.file (as_is)
		let doc = await vscode.workspace.openTextDocument(uri)
		await vscode.window.showTextDocument(doc)
		await vscode.commands.executeCommand ('extension.copy_type', {new_type: 'users_copy'})

		assert (fs.existsSync (to_be), to_be)
	})
})
