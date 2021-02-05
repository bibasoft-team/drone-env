const fs = require('fs')

const mock = require('mock-fs')

const generate = require('./generate')

afterEach(() => {
	delete process.env.PLUGIN_ENVS
	delete process.env.PLUGIN_OUTPUT
	mock.restore()
})

beforeEach(() => {
	mock()
})

const file_name = 'out.env'

test('file created', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: 123,
	})
	process.env.PLUGIN_OUTPUT = file_name
	generate()
	expect(fs.existsSync(file_name)).toBe(true)
})

test('simple string env', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: 'api.net',
	})
	process.env.PLUGIN_OUTPUT = file_name
	generate()
	expect(fs.readFileSync(file_name).toString()).toBe('TEST=api.net')
})

test('regex replace env', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: {
			from: 'test_234',
			transform: [
				{
					regex: '[0-9]+',
					replace: 'ok',
				},
			],
		},
	})
	process.env.PLUGIN_OUTPUT = file_name
	generate()
	expect(fs.readFileSync(file_name).toString()).toBe('TEST=test_ok')
})

test('wrong regex', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: {
			from: 'test_234',
			transform: [
				{
					regex: '[0-9]+)',
					replace: 'ok',
				},
			],
		},
	})
	process.env.PLUGIN_OUTPUT = file_name
	expect(() => generate()).toThrow()
})

test('missing file_name', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: {
			from: 'test_234',
			transform: [
				{
					regex: '[0-9]+',
					replace: 'ok',
				},
			],
		},
	})
	expect(() => generate()).toThrow()
})

test('append existing file', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: 123,
	})
	process.env.PLUGIN_OUTPUT = file_name
	fs.writeFileSync(file_name, 'EXISTING=env')
	generate()
	expect(fs.readFileSync(file_name).toString()).toBe('EXISTING=env\nTEST=123')
})

test('multiple string env', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: 'api.net',
		TEST2: 'test too',
	})
	process.env.PLUGIN_OUTPUT = file_name
	generate()
	expect(fs.readFileSync(file_name).toString()).toBe('TEST=api.net\nTEST2=test too')
})

test('multiple types env', () => {
	process.env.PLUGIN_ENVS = JSON.stringify({
		TEST: 'api.net',
		TEST2: {
			from: 'test_123',
			transform: [
				{
					regex: '[0-9]+',
					replace: 'ok',
				},
			],
		},
	})
	process.env.PLUGIN_OUTPUT = file_name
	generate()
	expect(fs.readFileSync(file_name).toString()).toBe('TEST=api.net\nTEST2=test_ok')
})
