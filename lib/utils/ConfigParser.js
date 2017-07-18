const path = require('path')
const defaultConfig = {
    testsPath: [],
    results: {
        path: [],
        formats: []
    },
    maxFailures: 3
}
let config = defaultConfig

module.exports.ConfigParser = class {

    static get config () {
        return config
    }

    static set config (filename) {
        let configFile = require(path.resolve(process.cwd(), filename))

        if (typeof configFile === 'function') {
            configFile = configFile()
        }

        config = configFile
    }

    merge (config) {
        config = require(path.resolve(process.cwd(), config))

        if (typeof config === 'function') {
            config = config()
        }

        config = Object.assign(defaultConfig, config)
    }
}
