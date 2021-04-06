const {
	processEnv,
	isSimple,
	isRegexReplace,
	processReplace,
	parseRegex,
	isLowercaseReplace,
	isUppercaseReplace,
	processLowercase,
	processUppercase,
} = require('./utils')

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
	expect(isSimple({ transform: [{ e: 1 }] })).toBe(false)
})

test('isSimple — array to be false', () => {
	expect(isSimple([2, 4])).toBe(false)
})

test('isLowercase – lowercase to be true', () => {
	expect(isLowercaseReplace('lowercase')).toBe(true)
})

test('isLowercase – other words to be false', () => {
	expect(isLowercaseReplace('sample')).toBe(false)
})

test('isUppercase – uppercase to be true', () => {
	expect(isUppercaseReplace('uppercase')).toBe(true)
})

test('isUppercase – other words to be false', () => {
	expect(isUppercaseReplace('sample')).toBe(false)
})

test('isRegexReplace — replace regex to be true', () => {
	expect(
		isRegexReplace({
			regex: /test/,
			from: 'test',
			replace: '$1',
		}),
	).toBe(true)
})

test('isRegexReplace — other regex to be false', () => {
	expect(
		isRegexReplace({
			regex: /test/,
			from: 'test',
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

test('processLowercase – must transform to lowercase', () => {
	expect(processLowercase('QWERTY')).toBe('qwerty')
})

test('processLowercase – partical transform to lowercase', () => {
	expect(processLowercase('QWErty')).toBe('qwerty')
})

test('processUppercase – must transform to uppercase', () => {
	expect(processUppercase('qwerty')).toBe('QWERTY')
})

test('processUppercase – partical transform to uppercase', () => {
	expect(processUppercase('QWErty')).toBe('QWERTY')
})

test('processReplace — wrong regex', () => {
	expect(() => {
		processReplace({ regex: /[0-9])/ })
	}).toThrow()
})

test('processReplace — simple text replace', () => {
	expect(processReplace('abcABC1234_abc', { regex: /([0-9]+)/g.source, replace: 'xyz' })).toBe(
		'abcABCxyz_abc',
	)
})

test('processReplace — replace with groups', () => {
	expect(
		processReplace('abcABC_1234_abc', {
			regex: /(.*)_([0-9]+)_(.*)/g.source,
			replace: '$2',
		}),
	).toBe('1234')
})

test('processReplace — escape groups', () => {
	expect(
		processReplace('abcABC_1234_abc', {
			regex: /(.*)_([0-9]+)_(.*)/g.source,
			replace: '$$10',
		}),
	).toBe('$10')
})

test('processReplace — allow empty replace', () => {
	expect(
		processReplace('abcABC_1234_abc', {
			regex: /[0-9]+/g.source,
			replace: '',
		}),
	).toBe('abcABC__abc')
})

test('processReplace — replacement with a non-existent group', () => {
	expect(
		processReplace('abcABC_1234_abc', {
			regex: /[0-9]+/g.source,
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

test('processEnv — missing field `from`', () => {
	expect(() => {
		processEnv({ transform: [{ regex: 'wgwg', replace: 'tre' }] })
	}).toThrow()
})

test('processEnv —test without transform', () => {
	expect(() => {
		processEnv({ from: 'test' })
	}).toBe('test')
})

test('processEnv — wrong regex', () => {
	expect(() => {
		processEnv({ regex: 'wgwg)', replace: 'tre', from: 'wfwg' })
	}).toThrow()
})

test('processEnv — incorrect config', () => {
	expect(() => {
		processEnv({ from: 'test', transform: [{ regex: 'test' }] })
	}).toThrow()
})

test('processEnv — simple replace', () => {
	expect(
		processEnv({ from: 'test123', transform: [{ regex: /[0-9]+/g.source, replace: '4' }] }),
	).toBe('test4')
})

test('processEnv — replace with groups', () => {
	expect(
		processEnv({
			from: 'test123',
			transform: [{ regex: /([a-z]+)([0-9]+)/g.source, replace: '$2' }],
		}),
	).toBe('123')
})

test('processEnv — lowercase', () => {
	expect(processEnv({ from: 'QWERTY', transform: ['lowercase'] })).toBe('qwerty')
})

test('processEnv — uppercase', () => {
	expect(processEnv({ from: 'qwerty', transform: ['uppercase'] })).toBe('QWERTY')
})

test('processEnv — composite lowercase and regex', () => {
	expect(
		processEnv({ from: '123_ok', transform: [{ regex: '[0-9]+', replace: 'TEST' }, 'lowercase'] }),
	).toBe('test_ok')
})

test('processEnv — composite regex and regex', () => {
	expect(
		processEnv({
			from: '123_ok',
			transform: [
				{ regex: '[0-9]+', replace: 'test_ok_ok' },
				{ regex: '(_ok)+', replace: '123' },
			],
		}),
	).toBe('test123')
})

test('processEnv — composite transforms order', () => {
	expect(
		processEnv({ from: '123_OK', transform: ['lowercase', { regex: '[0-9]+', replace: 'TEST' }] }),
	).toBe('TEST_ok')
})
