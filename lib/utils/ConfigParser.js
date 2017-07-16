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

    static get config () {
        return CONFIG
    }

    static set config (config) {
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
