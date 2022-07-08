const {open_view} = require ('../../../lib/path')

const fs = require ('fs')
jest.mock('fs')
const root = `p:\\projects\\mil\\slices\\budget\\`
const app = `${root}front\\root\\_\\app`

const mock_fs = f => {
	let files = f
	fs.existsSync.mockImplementation ((file_path) => {
		let is_ok = files [file_path]? true : false
		// console.log (`fs mock existsSync ${file_path} returned=${is_ok}`)
		return is_ok
	})
}

test ('#1 view_path Content -> Content', async () => {
	let p = `${root}back\\lib\\Content\\voc_cfo.js`
	mock_fs ({[p]: 1})
	let as_is = await open_view ('Content', p)
	let to_be = p
	expect(as_is).toBe(to_be)
})

test ('#2 view_path Model -> Model', async () => {
	let p = `${root}back\\lib\\Model\\oltp\\voc_cfo.js`
	mock_fs ({[p]: 1})
	let as_is = await open_view ('Model', p)
	let to_be = p
	expect(as_is).toBe(to_be)
})

test ('#3 view_path Content -> Html', async () => {
	let p_from = `${root}back\\lib\\Content\\voc_cfo.js`
	let p_to   = `${root}front\\root\\_\\app\\html\\voc_cfo.html`
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Html', p_from)).toBe(p_to)
})

test ('#4 view_path Data -> Content', async () => {
	let p_from = `${root}front\\root\\_\\app\\js\\data\\voc_cfo.js`
	let p_to   = `${root}back\\lib\\Content\\voc_cfo.js`
	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
	})
	expect(await open_view ('Content', p_from)).toBe(p_to)
})

test ('#5 view_path View -> Data', async () => {

	let p_from = `${app}\\js\\view\\tb_lease_ctr_svc_intr.js`
	let p_to = `${app}\\js\\data\\tb_lease_ctr_svc_intr.js`

	mock_fs ({
		[p_from]: 1,
		[p_to]: 1,
		[`${app}\\js\\data\\tb_lease_ctr_svc_intrs.js`]: 1,
		[`${app}\\js\\view\\tb_lease_ctr_svc_intrs.js`]: 1,
	})

	expect(await open_view ('Data', p_from)).toBe(p_to)
})
