const {open_view} = require ('../../../lib/path')
const path = require('path')
const fs = require ('fs')

jest.mock('fs')

const root = path.normalize('p:/projects/app/slices/budget/')
const app = path.join(root, 'front', 'root', '_', 'app')

const mock_fs = f => {
	let files = f
	fs.existsSync.mockImplementation ((file_path) => {
		let is_ok = files [file_path]? true : false
		return is_ok
	})
}

test ('view_path Content -> Content', async () => {
  let p = path.join(root, 'back', 'lib', 'Content', 'voc_cfo.js')
	mock_fs ({[p]: 1})
	let as_is = await open_view ('Content', p)
	let to_be = p
	expect(as_is).toBe(to_be)
})

test ('view_path Model -> Model', async () => {
  let p = path.join(root, 'back', 'lib', 'Model', 'oltp', 'voc_cfo.js')
	mock_fs ({[p]: 1})
	let as_is = await open_view ('Model', p, 'roster')
	let to_be = p
	expect(as_is).toBe(to_be)
})

test ('view_path Content -> Html', async () => {
  let p_from = path.join(root, 'back', 'lib', 'Content', 'voc_cfo.js')
  let p_to = path.join(root, 'front', 'root', '_', 'app', 'html', 'voc_cfo.html')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Html', p_from)).toBe(p_to)
})

test ('view_path Data -> Content goto_select', async () => {
  let p_from = path.join(root, 'front', 'root', '_', 'app', 'js', 'data', 'voc_cfo.js')
  let p_to = path.join(root, 'back', 'lib', 'Content', 'voc_cfo.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Content', p_from)).toBe(p_to)
})

test ('view_path View -> Data', async () => {
  let p_from = path.join(app, 'js', 'view', 'tb_lease_ctr_svc_intr.js')
  let p_to = path.join(app, 'js', 'data', 'tb_lease_ctr_svc_intr.js')

	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
    [path.join(app, 'js', 'data', 'tb_lease_ctr_svc_intrs.js')]: 1,
    [path.join(app, 'js', 'view', 'tb_lease_ctr_svc_intrs.js')]: 1,
	})

	expect(await open_view ('Data', p_from)).toBe(p_to)
})

test ('view_path Data -> Content goto_get_item', async () => {
  let p_from = path.join(root, 'front', 'root', '_', 'app', 'js', 'data', 'voc_warehouse.js')
  let p_to = path.join(root, 'back', 'lib', 'Content', 'voc_warehouses.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Content', p_from, 'item')).toBe(p_to)
})

test ('view_path Data -> Content goto_select', async () => {
  let p_from = path.join(root, 'front', 'root', '_', 'app', 'js', 'data', 'voc_warehouse.js')
  let p_to = path.join(root, 'back', 'lib', 'Content', 'voc_warehouses.js')
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Content', p_from, 'roster')).toBe(p_to)
})
