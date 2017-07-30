const fs = require('fs')
const path = require('path')
const merge = require('deepmerge')
const defaultConfig = {
    tests: {
        path: [],
        formats: []
    },
    results: {
        path: [],
        formats: []
    },
    remote: [],
    repoPath: [],
    maxFailures: []
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

    createConfig (config) {
        fs.writeFile(path.join(__dirname, '../../config.json'), JSON.stringify(config || this.config, null, 4), 'utf8');
    }
}