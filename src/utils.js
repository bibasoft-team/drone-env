// procc
function processEnv(env) {
	if (isSimple(env)) return env

	if (!('input' in env)) throw 'missing input field'

	if (isRegexReplace(env)) return processReplace(env)

	throw 'invalid config'
}

function processReplace(env) {
	const regex = parseRegex(env.regex)
	return env.input.replace(regex, env.replace)
}

function isSimple(env) {
	return ['string', 'number', 'boolean', 'undefined'].includes(typeof env)
}

function isRegexReplace(env) {
	return typeof env === 'object' && 'regex' in env && 'replace' in env
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

	processReplace,

	parseRegex,
}
