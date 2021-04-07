/**
        DRONE_REPO_NAME,
        DRONE_SOURCE_BRANCH,
        DRONE_COMMIT_MESSAGE,
        DRONE_BUILD_NUMBER,
        DRONE_COMMIT_AUTHOR,
        DRONE_BUILD_STATUS,
        DRONE_REPO_BRANCH,
 */

const fs = require('fs')
const path = require('path')
const { processEnv } = require('./utils')

function generate() {
	const { PLUGIN_OUTPUT = '.env', PLUGIN_ENVS } = process.env

	if (!PLUGIN_OUTPUT) throw 'missing output setting'

	const out_file = path.resolve(PLUGIN_OUTPUT)

	const ENVS = PLUGIN_ENVS
		? JSON.parse(PLUGIN_ENVS)
		: Object.keys(process.env)
				.filter(k => k.startsWith('PLUGIN_') && k !== 'PLUGIN_OUTPUT')
				.reduce(
					(all, name) => ({
						...all,
						[name.slice('PLUGIN_'.length)]: process.env[name],
					}),
					{},
				)

	const PROCESSED_ENVS = Object.keys(ENVS).reduce(
		(all, name) => ({
			...all,
			[name]: processEnv(ENVS[name]),
		}),
		{},
	)

	const out = Object.keys(PROCESSED_ENVS)
		.map(name => `${name}=${PROCESSED_ENVS[name]}`)
		.join('\n')

	if (!fs.existsSync(out_file)) {
		fs.writeFileSync(out_file, out)
	} else {
		fs.appendFileSync(out_file, '\n' + out)
	}
}

module.exports = generate
