const {project_path} = require ('../../lib/path')

test ('project path from content', () => {
	let as_is = project_path (`p:\\projects\\app\\slices\\budget\\back\\lib\\Content\\voc_cfo.js`)
	let to_be = `p:\\projects\\app\\slices\\budget`
	expect(as_is).toBe(to_be)
})

test ('project path from model', () => {
	let as_is = project_path (`p:\\projects\\app\\back\\lib\\Model\\oltp\\voc_cfo.js`)
	let to_be = `p:\\projects\\app`
	expect(as_is).toBe(to_be)
})

test ('project path from view', () => {
	let as_is = project_path (`p:\\projects\\app\\slices\\budget\\front\\root\\_\\app\\html\\voc_cfo.html`)
	let to_be = `p:\\projects\\app\\slices\\budget`
	expect(as_is).toBe(to_be)
})

test ('project path error', () => {
	let as_is = () => project_path (`p:\\projects\\app`)
	expect(as_is).toThrowError('cant find project path')
})
