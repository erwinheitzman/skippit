const path = require('path')
const DEFAULT_CONFIG = {
    testsPath: [],
    results: {
        path: [],
        formats: []
    },
    maxFailures: 3
}
let CONFIG = DEFAULT_CONFIG

module.exports.ConfigParser = class {

    get config () {
        return CONFIG
    }

    set config (config) {
        config = require(path.resolve(process.cwd(), config))

        if (typeof config === 'function') {
            config = config()
        }

        CONFIG = config
    }

    merge (config) {
        config = require(path.resolve(process.cwd(), config))

        if (typeof config === 'function') {
            config = config()
        }

        CONFIG = Object.assign(DEFAULT_CONFIG, config)
    }
}
