const {project_path} = require ('../../lib/path')
const path = require('path')

test ('project path from content', () => {
  const inputPath = path.join('p:', 'projects', 'app', 'slices', 'budget', 'back', 'lib', 'Content', 'voc_cfo.js')
  const expectedPath = path.join('p:', 'projects', 'app', 'slices', 'budget')

  expect(project_path(inputPath)).toBe(expectedPath)
})

test ('project path from model', () => {
  const inputPath = path.join('p:', 'projects', 'app', 'back', 'lib', 'Model', 'oltp', 'voc_cfo.js')
  const expectedPath = path.join('p:', 'projects', 'app')

  expect(project_path(inputPath)).toBe(expectedPath)
})

test ('project path from view', () => {
  const inputPath = path.join('p:', 'projects', 'app', 'slices', 'budget', 'front', 'root', '_', 'app', 'html', 'voc_cfo.html')
  const expectedPath = path.join('p:', 'projects', 'app', 'slices', 'budget')

  expect(project_path(inputPath)).toBe(expectedPath)
})

test ('project path error', () => {
  const inputPath = path.join('p:', 'projects', 'app')
  const as_is = () => project_path(inputPath)

	expect(as_is).toThrowError('cant find project path')
})
