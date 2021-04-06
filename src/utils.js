// procc
function processEnv(env) {
	if (isSimple(env)) return env

	if (!('from' in env)) throw 'missing `from` field'
	if (!('transform' in env)) {
		return env.from
	}

	const res = env.transform.reduce((res, step) => {
		if (isRegexReplace(step)) return processReplace(res, step)
		if (isLowercaseReplace(step)) return processLowercase(res)
		if (isUppercaseReplace(step)) return processUppercase(res)

		throw 'invalid config'
	}, env.from)

	return res
}

function processReplace(from, env) {
	const regex = parseRegex(env.regex)
	return from.replace(regex, env.replace)
}

function processLowercase(from) {
	return from.toLowerCase()
}

function processUppercase(from) {
	return from.toUpperCase()
}

function isSimple(env) {
	return ['string', 'number', 'boolean', 'undefined'].includes(typeof env)
}

function isRegexReplace(env) {
	return typeof env === 'object' && 'regex' in env && 'replace' in env
}

function isLowercaseReplace(env) {
	return env === 'lowercase'
}

function isUppercaseReplace(env) {
	return env === 'uppercase'
}

function parseRegex(regex) {
	try {
		return new RegExp(regex, 'g')
	} catch {
		throw 'Invalid regex'
	}
}

module.exports = {
	processEnv,

	isSimple,
	isRegexReplace,
	isLowercaseReplace,
	isUppercaseReplace,

	processReplace,
	processLowercase,
	processUppercase,

	parseRegex,
}
