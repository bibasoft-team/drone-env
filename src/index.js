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
const { processEnv } = require('./utils')

function generate() {
	const { PLUGIN_OUTPUT, PLUGIN_ENVS } = process.env

	if (!PLUGIN_OUTPUT) throw 'missing output setting'

	const ENVS = JSON.parse(PLUGIN_ENVS)

	const ENV_NAMES = Object.keys(ENVS)

	const PROCESSED_ENVS = ENV_NAMES.map(e => `${e}=${processEnv(ENVS[e])}`).join('\n')

	if (!fs.existsSync(PLUGIN_OUTPUT)) {
		fs.writeFileSync(PLUGIN_OUTPUT, PROCESSED_ENVS)
	} else {
		fs.appendFileSync(PLUGIN_OUTPUT, '\n' + PROCESSED_ENVS)
	}
}

module.exports = generate
