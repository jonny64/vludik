const {make_from_to} = require ('../../../commands/copy_type')

const fs = require ('fs')
jest.mock('fs')
const root = `p:\\projects\\mil\\slices\\budget\\`

const mock_fs = f => {
	let files = f
	fs.existsSync.mockImplementation ((file_path) => {
		let is_ok = files [file_path]? true : false
		// console.log (`fs mock existsSync ${file_path} returned=${is_ok}`)
		return is_ok
	})
}

test ('copy_type popup', async () => {

	let app = `${root}front\\root\\_\\app\\`
	let back = `${root}back`

	mock_fs ({
		[`${back}lib\\Content\\voc_budget_art_popup.js`]: 1,
		[`${back}lib\\Model\\oltp\\voc_budget_art_popup.js`]: 1,
		[`${app}js\\data\\voc_budget_art_popup.js`]: 1,
		[`${app}js\\view\\voc_budget_art_popup.js`]: 1,
		[`${app}html\\voc_budget_art_popup.html`]: 1,
	})

	let as_is = await make_from_to ({root, slice_path: '', type: 'voc_budget_art_popup', new_type: 'voc_cfo_art_popup'})
	let to_be = [
		[
			`${app}js\\data\\voc_budget_art_popup.js`,
			`${app}js\\data\\voc_cfo_art_popup.js`
		],
		[
			`${app}js\\view\\voc_budget_art_popup.js`,
			`${app}js\\view\\voc_cfo_art_popup.js`
		],
		[
			`${app}html\\voc_budget_art_popup.html`,
			`${app}html\\voc_cfo_art_popup.html`
		],
	]

	expect(as_is).toEqual(to_be)
})
