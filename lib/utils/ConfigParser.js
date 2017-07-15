const fs = require('fs')
const path = require('path')
const DEFAULT_CONFIG = {
    testsPath: [],
    resultsPath: [],    
    maxFailures: 3
}
let CONFIG = DEFAULT_CONFIG

module.exports.ConfigParser = class {
    // constructor () {
    //     this.config = DEFAULT_CONFIG
    // }

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
    
    // addConfigFile () {
    //     fs.readdirSync(process.cwd()).forEach(file => {
    //         if (file.match(/rapid.conf.js$|rapid.json$/)) {
    //             let config = require(path.resolve(process.cwd(), file))
                
    //             if (typeof config === 'function') {
    //                 config = config()
    //             }

    //             this.config = Object.assign(this.config, config)
    //         }
    //     })
    // }
}