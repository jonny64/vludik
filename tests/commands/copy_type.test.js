const {make_from_to} = require ('../../commands/copy_type')
const path = require('path')
const fs = require ('fs')
jest.mock('fs')

const root = path.join('p:', 'app')
const slice_root = path.join('p:', 'app', 'slices', 'budget')

const mock_fs = f => {
	let files = f
	fs.existsSync.mockImplementation ((file_path) => {
		let is_ok = files [file_path]? true : false
		return is_ok
	})
}

test ('copy_type popup no slice', async () => {
    let app = path.join(slice_root, 'front', 'root', '_', 'app')
    let back = path.join(slice_root, 'back')

    const mockFiles = {
        [path.join(back, 'lib', 'Content', 'voc_budget_arts.js')]: 1,
        [path.join(back, 'lib', 'Model', 'oltp', 'voc_budget_arts.js')]: 1,
        [path.join(app, 'js', 'data', 'voc_budget_art_popup.js')]: 1,
        [path.join(app, 'js', 'view', 'voc_budget_art_popup.js')]: 1,
        [path.join(app, 'html', 'voc_budget_art_popup.html')]: 1,
    }

    mock_fs(mockFiles)

	let as_is = await make_from_to ({root: slice_root, slice_path: '', type: 'voc_budget_art_popup', new_type: 'voc_cfo_art_popup'})
	let to_be = [
		[
            path.join(app, 'js', 'data', 'voc_budget_art_popup.js'),
            path.join(app, 'js', 'data', 'voc_cfo_art_popup.js')
		],
		[
            path.join(app, 'js', 'view', 'voc_budget_art_popup.js'),
            path.join(app, 'js', 'view', 'voc_cfo_art_popup.js')
		],
		[
            path.join(app, 'html', 'voc_budget_art_popup.html'),
            path.join(app, 'html', 'voc_cfo_art_popup.html')
		],
	]

	expect(as_is).toEqual(to_be)
})

test ('copy_type popup with slice', async () => {
    let app = path.join('front', 'root', '_', 'app')
    let slice_path_target = path.join(root, 'slices', 'vocs')

    const mockFiles = {
        [path.join(slice_root, 'back', 'lib', 'Content', 'voc_budget_arts.js')]: 1,
        [path.join(slice_root, 'back', 'lib', 'Model', 'oltp', 'voc_budget_arts.js')]: 1,
        [path.join(slice_root, app, 'js', 'data', 'voc_budget_art_popup.js')]: 1,
        [path.join(slice_root, app, 'js', 'view', 'voc_budget_art_popup.js')]: 1,
        [path.join(slice_root, app, 'html', 'voc_budget_art_popup.html')]: 1,
        [path.join(slice_path_target, 'back', 'lib', 'Model', 'oltp', 'voc_cfo_arts.js')]: 1,
    }

    mock_fs(mockFiles)

	let as_is = await make_from_to ({root: slice_root, slice_path: slice_path_target, type: 'voc_budget_arts', new_type: 'voc_cfo_arts'})
	let to_be = [
		[
            path.join(slice_root, 'back', 'lib', 'Content', 'voc_budget_arts.js'),
            path.join(slice_path_target, 'back', 'lib', 'Content', 'voc_cfo_arts.js'),
		],
	]

	expect(as_is).toEqual(to_be)
})

test ('copy_type popup slice to root', async () => {
    let app = path.join('front', 'root', '_', 'app')
	let slice_path_target = root

    const mockFiles = {
        [path.join(slice_root, 'back', 'lib', 'Content', 'voc_budget_arts.js')]: 1,
        [path.join(slice_root, 'back', 'lib', 'Model', 'oltp', 'voc_budget_arts.js')]: 1,
        [path.join(slice_root, app, 'js', 'data', 'voc_budget_art_popup.js')]: 1,
        [path.join(slice_root, app, 'js', 'view', 'voc_budget_art_popup.js')]: 1,
        [path.join(slice_root, app, 'html', 'voc_budget_art_popup.html')]: 1,
        [path.join(slice_path_target, 'back', 'lib', 'Model', 'oltp', 'voc_cfo_arts.js')]: 1,
    }
    
    mock_fs(mockFiles)

	let as_is = await make_from_to ({root: slice_root, slice_path: slice_path_target, type: 'voc_budget_arts', new_type: 'voc_cfo_arts'})
	let to_be = [
		[
            path.join(slice_root, 'back', 'lib', 'Content', 'voc_budget_arts.js'),
            path.join(slice_path_target, 'back', 'lib', 'Content', 'voc_cfo_arts.js'),
		],
	]

	expect(as_is).toEqual(to_be)
})

test ('copy_type popup to popup no slice', async () => {
    let app = path.join(root, 'front', 'root', '_', 'app')
    let back = path.join(root, 'back')

    const mockFiles = {
        [path.join(back, 'lib', 'Content', 'tb_claim_work_goods.js')]: 1,
        [path.join(back, 'lib', 'Model', 'oltp', 'tb_claim_work_goods.js')]: 1,
        [path.join(app, 'js', 'data', 'tb_claim_work_goods_popup.js')]: 1,
        [path.join(app, 'js', 'view', 'tb_claim_work_goods_popup.js')]: 1,
        [path.join(app, 'html', 'tb_claim_work_goods_popup.html')]: 1,
    }

    mock_fs(mockFiles)

	let as_is = await make_from_to ({
		root       : root,
		slice_path : '',
		type       : 'tb_claim_work_goods_popup',
		new_type   : 'tb_claim_work_staff_popup',
	})

	let to_be = [
		[
            path.join(app, 'js', 'data', 'tb_claim_work_goods_popup.js'),
            path.join(app, 'js', 'data', 'tb_claim_work_staff_popup.js')
		],
		[
            path.join(app, 'js', 'view', 'tb_claim_work_goods_popup.js'),
            path.join(app, 'js', 'view', 'tb_claim_work_staff_popup.js')
		],
		[
            path.join(app, 'html', 'tb_claim_work_goods_popup.html'),
            path.join(app, 'html', 'tb_claim_work_staff_popup.html')
		],
	]

	expect(as_is).toEqual(to_be)
})

test ('copy_type subroster to subroster no html no slice', async () => {
    let app = path.join(root, 'front', 'root', '_', 'app')
    let back = path.join(root, 'back')

    const mockFiles = {
        [path.join(back, 'lib', 'Content', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(back, 'lib', 'Model', 'oltp', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'data', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'view', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'data', 'tb_rental_ctr_intr.js')]: 1,
        [path.join(app, 'js', 'view', 'tb_rental_ctr_intr.js')]: 1,
        [path.join(app, 'html', 'tb_rental_ctr_intr.html')]: 1,
    }

    mock_fs(mockFiles)

	let as_is = await make_from_to ({
		root       : root,
		slice_path : '',
		type       : 'tb_rental_ctr_intrs',
		new_type   : 'tb_lease_ctr_intrs',
	})

	let to_be = [
		[
            path.join(back, 'lib', 'Model', 'oltp', 'tb_rental_ctr_intrs.js'),
            path.join(back, 'lib', 'Model', 'oltp', 'tb_lease_ctr_intrs.js'),
		],
		[
            path.join(back, 'lib', 'Content', 'tb_rental_ctr_intrs.js'),
            path.join(back, 'lib', 'Content', 'tb_lease_ctr_intrs.js'),
		],
		[
            path.join(app, 'js', 'data', 'tb_rental_ctr_intrs.js'),
            path.join(app, 'js', 'data', 'tb_lease_ctr_intrs.js')
		],
		[
            path.join(app, 'js', 'view', 'tb_rental_ctr_intrs.js'),
            path.join(app, 'js', 'view', 'tb_lease_ctr_intrs.js')
		],
	]

	expect(as_is).toEqual(to_be)
})

test ('copy_type item to item no Model Content no slice', async () => {
    let app = path.join(root, 'front', 'root', '_', 'app')
    let back = path.join(root, 'back')

    const mockFiles = {
        [path.join(back, 'lib', 'Content', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(back, 'lib', 'Model', 'oltp', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'data', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'view', 'tb_rental_ctr_intrs.js')]: 1,
        [path.join(app, 'js', 'data', 'tb_rental_ctr_intr.js')]: 1,
        [path.join(app, 'js', 'view', 'tb_rental_ctr_intr.js')]: 1,
        [path.join(app, 'html', 'tb_rental_ctr_intr.html')]: 1,
    }

    mock_fs(mockFiles)

	let as_is = await make_from_to ({
		root       : root,
		slice_path : '',
		type       : 'tb_rental_ctr_intr',
		new_type   : 'tb_lease_ctr_intr',
	})

	let to_be = [
		[
            path.join(app, 'js', 'data', 'tb_rental_ctr_intr.js'),
            path.join(app, 'js', 'data', 'tb_lease_ctr_intr.js')
		],
		[
            path.join(app, 'js', 'view', 'tb_rental_ctr_intr.js'),
            path.join(app, 'js', 'view', 'tb_lease_ctr_intr.js')
		],
		[
            path.join(app, 'html', 'tb_rental_ctr_intr.html'),
            path.join(app, 'html', 'tb_lease_ctr_intr.html')
		],
	]

	expect(as_is).toEqual(to_be)
})
