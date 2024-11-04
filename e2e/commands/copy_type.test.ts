import * as assert from 'assert'
import { before, it } from 'mocha'
import * as path from 'path'
import * as fs from 'fs'
import * as vscode from 'vscode'

const workspace_dir = {
	no_slices   : path.resolve(__dirname, '../../projects/elu_dia_slick_template')
}

const src_path = 'back/lib/Content/users.js'
const dst_path = [
	'back/lib/Content/users_copy.js'
	, 'back/lib/Model/users_copy.js'
	, 'front/root/_/app/js/data/users_copy.js'
	, 'front/root/_/app/js/view/users_copy.js'
	, 'front/root/_/app/html/users_copy.html'
]

suite ('Copy type Test Suite', () => {


	before (async () => {

		for (let p of dst_path) {
			for (let root of [workspace_dir.no_slices]) {
				let copy_path = path.join(root, p)
				console.log({copy_path})
				if (fs.existsSync (copy_path)) {
					console.log (`rm ${copy_path}`)
					await fs.unlinkSync (copy_path)
				}
			}
		}


	})

	it ('should copy type in project WITHOUT slices', async () => {

		let project_path = path.join(workspace_dir.no_slices)
		let folder = vscode.Uri.file (project_path)

		await vscode.commands.executeCommand('vscode.openFolder', folder)

		const as_is = path.join(project_path, src_path)
		if (!fs.existsSync(as_is)) {
			throw new Error(`Test file does not exist at path: ${as_is}`);
		}

		const uri = vscode.Uri.file (as_is)
		const doc = await vscode.workspace.openTextDocument(uri)
		const editor = vscode.window.showTextDocument(doc, {preview: false})
		await vscode.commands.executeCommand ('extension.copy_type', {
			type      : 'users',
			new_type  : 'users_copy',
			root      : project_path,
		})

		for (let p of dst_path) {
			const to_be = path.join(workspace_dir.no_slices, p)
			assert (fs.existsSync (to_be), `should exist ${to_be}`)
		}
	}).timeout(30000)

})
