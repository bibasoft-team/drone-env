const { processEnv, isSimple, isRegexReplace, processReplace, parseRegex } = require('./utils')

test('isSimple — string to be true', () => {
	expect(isSimple('string')).toBe(true)
})

test('isSimple — number to be true', () => {
	expect(isSimple(1)).toBe(true)
})

test('isSimple — boolean to be true', () => {
	expect(isSimple(true)).toBe(true)
})

test('isSimple — undefined to be true', () => {
	expect(isSimple(undefined)).toBe(true)
})

test('isSimple — object to be false', () => {
	expect(isSimple({ e: 1 })).toBe(false)
})

test('isSimple — array to be false', () => {
	expect(isSimple([2, 4])).toBe(false)
})

test('isRegexReplace — replace regex to be true', () => {
	expect(
		isRegexReplace({
			regex: /test/,
			input: 'test',
			replace: '$1',
		}),
	).toBe(true)
})

test('isRegexReplace — other regex to be false', () => {
	expect(
		isRegexReplace({
			regex: /test/,
			input: 'test',
			out: '$1',
		}),
	).toBe(false)
})

test('isRegexReplace — string to be false', () => {
	expect(isRegexReplace('test')).toBe(false)
})

test('isRegexReplace — number to be false', () => {
	expect(isRegexReplace(1)).toBe(false)
})

test('isRegexReplace — undefined to be false', () => {
	expect(isRegexReplace(undefined)).toBe(false)
})

test('isRegexReplace — only regex to be false', () => {
	expect(isRegexReplace({ regex: '123' })).toBe(false)
})

test('isRegexReplace — empty object to be false', () => {
	expect(isRegexReplace({})).toBe(false)
})

test('parseRegex — the correct expression must be parsed', () => {
	const regex = /([0-9])+/g
	expect(parseRegex(regex.source)).toEqual(regex)
})

test('parseRegex — the wrong expression should not be parsed', () => {
	expect(() => {
		parseRegex('[0-9])')
	}).toThrow()
})

test('processReplace — wrong regex', () => {
	expect(() => {
		processReplace({ regex: /[0-9])/ })
	}).toThrow()
})

test('processReplace — simple text replace', () => {
	expect(
		processReplace({ regex: /([0-9]+)/g.source, input: 'abcABC1234_abc', replace: 'xyz' }),
	).toBe('abcABCxyz_abc')
})

test('processReplace — replace with groups', () => {
	expect(
		processReplace({
			regex: /(.*)_([0-9]+)_(.*)/g.source,
			input: 'abcABC_1234_abc',
			replace: '$2',
		}),
	).toBe('1234')
})
test('processReplace — escape groups', () => {
	expect(
		processReplace({
			regex: /(.*)_([0-9]+)_(.*)/g.source,
			input: 'abcABC_1234_abc',
			replace: '$$10',
		}),
	).toBe('$10')
})
test('processReplace — allow empty replace', () => {
	expect(
		processReplace({
			regex: /[0-9]+/g.source,
			input: 'abcABC_1234_abc',
			replace: '',
		}),
	).toBe('abcABC__abc')
})
test('processReplace — replacement with a non-existent group', () => {
	expect(
		processReplace({
			regex: /[0-9]+/g.source,
			input: 'abcABC_1234_abc',
			replace: '$2',
		}),
	).toBe('abcABC_$2_abc')
})

test('processEnv — string', () => {
	expect(processEnv('string')).toBe('string')
})
test('processEnv — number', () => {
	expect(processEnv(123)).toBe(123)
})
test('processEnv — boolean', () => {
	expect(processEnv(true)).toBe(true)
})
test('processEnv — undefined', () => {
	expect(processEnv(undefined)).toBe(undefined)
})
test('processEnv — missing input field', () => {
	expect(() => {
		processEnv({ regex: 'wgwg', replace: 'tre' })
	}).toThrow()
})
test('processEnv — wrong regex', () => {
	expect(() => {
		processEnv({ regex: 'wgwg)', replace: 'tre', input: 'wfwg' })
	}).toThrow()
})
test('processEnv — incorrect config', () => {
	expect(() => {
		processEnv({ input: 'test' })
	}).toThrow()
})
test('processEnv — simple replace', () => {
	expect(processEnv({ regex: /[0-9]+/g.source, input: 'test123', replace: '4' })).toBe('test4')
})
test('processEnv — replace with groups', () => {
	expect(processEnv({ regex: /([a-z]+)([0-9]+)/g.source, input: 'test123', replace: '$2' })).toBe(
		'123',
	)
})
