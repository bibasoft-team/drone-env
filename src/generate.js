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
	const { PLUGIN_OUTPUT, PLUGIN_ENVS } = process.env

	if (!PLUGIN_OUTPUT) throw 'missing output setting'

	const out_file = path.resolve(PLUGIN_OUTPUT)
	console.warn(__dirname, out_file)

	const ENVS = JSON.parse(PLUGIN_ENVS)

	const ENV_NAMES = Object.keys(ENVS)

	const PROCESSED_ENVS = ENV_NAMES.map(e => `${e}=${processEnv(ENVS[e])}`).join('\n')

	if (!fs.existsSync(out_file)) {
		fs.writeFileSync(out_file, PROCESSED_ENVS)
	} else {
		fs.appendFileSync(out_file, '\n' + PROCESSED_ENVS)
	}
}

module.exports = generate
