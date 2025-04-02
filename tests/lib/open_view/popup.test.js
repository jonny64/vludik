const {open_view} = require ('../../../lib/path')
const path = require('path')
const fs = require ('fs')
jest.mock('fs')

const root = path.normalize('p:/projects/app/slices/budget/')

const mock_fs = f => {
	let files = f
	fs.existsSync.mockImplementation ((file_path) => {
		let is_ok = files [file_path]? true : false
		return is_ok
	})
}

test ('view_path Content -> View popup', async () => {
    let p_from = path.join(root, 'back', 'lib', 'Content', 'voc_budget_arts.js')
    let p_to = path.join(root, 'front', 'root', '_', 'app', 'js', 'view', 'voc_budget_art_popup.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('View', p_from, 'item')).toBe(p_to)
})

test ('view_path Html popup -> Model', async () => {
    let p_from = path.join(root, 'front', 'root', '_', 'app', 'html', 'voc_budget_art_popup.html')
    let p_to = path.join(root, 'back', 'lib', 'Model', 'oltp', 'voc_budget_arts.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Model', p_from, 'roster')).toBe(p_to)
})

test ('view_path Html popup -> Model special voc_okei', async () => {
    let p_from = path.join(root, 'front', 'root', '_', 'app', 'html', 'voc_okei_popup.html')
    let p_to = path.join(root, 'back', 'lib', 'Model', 'oltp', 'voc_okei.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Model', p_from, 'roster')).toBe(p_to)
})

test ('view_path Html popup -> View', async () => {
    let p_from = path.join(root, 'front', 'root', '_', 'app', 'html', 'voc_budget_art_popup.html')
    let p_to = path.join(root, 'front', 'root', '_', 'app', 'js', 'view', 'voc_budget_art_popup.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('View', p_from, 'item')).toBe(p_to)
})
