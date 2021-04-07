const envRegex = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)(:([^}]*))?\}/gm

// procc
function processEnv(env) {
	if (typeof env === 'object') {
		return processTransform(env)
	}

	if (isJsonString(env)) {
		return processTransform(JSON.parse(env))
	}

	return replaceEnvVars(env)
}

function processTransform(env) {
	if (!('from' in env)) throw 'missing `from` field'
	if (!('transform' in env)) throw 'missing `transform` field'

	const from = replaceEnvVars(env.from)

	const res = env.transform.reduce((res, step) => {
		if (isRegexReplace(step)) return processReplace(res, step)
		if (isLowercaseReplace(step)) return processLowercase(res)
		if (isUppercaseReplace(step)) return processUppercase(res)

		throw 'invalid config'
	}, from)

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

function isJsonString(str) {
	try {
		const val = JSON.parse(str)
		return typeof val === 'object'
	} catch (e) {
		return false
	}
}

function replaceEnvVars(str) {
	if (envRegex.test(str)) {
		return str.replace(envRegex, (_, env_name) => {
			return process.env[env_name]
		})
	}

	return str
}

module.exports = {
	processEnv,

	isRegexReplace,
	isLowercaseReplace,
	isUppercaseReplace,

	processReplace,
	processLowercase,
	processUppercase,

	parseRegex,
}
