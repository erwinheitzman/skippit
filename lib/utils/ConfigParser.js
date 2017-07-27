const fs = require('fs')
const merge = require('deepmerge')
const defaultConfig = {
    remote: [],
    tests: {
        path: [],
        formats: []
    },
    results: {
        path: [],
        formats: []
    },
    maxFailures: 3
}

module.exports.ConfigParser = class {
    constructor () {
        this.config = defaultConfig
    }

    getConfig () {
        return this.config
    }

    addConfig (filename) {
        this.config = merge(defaultConfig, fs.existsSync(filename) ? require(filename) : {})
    }
}