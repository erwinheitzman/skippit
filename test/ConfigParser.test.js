const expect = require('chai').expect
const ConfigParser = require('../lib/utils/ConfigParser').ConfigParser
const configParser = new ConfigParser
const DEFAULT_CONFIG = {
    testsPath: [],
    resultsPath: [],    
    maxFailures: 3
}

describe('ConfigParser.config', () => {
    const jsonConfig = require('../rapid.json')
    const jsConfig = require('../rapid.conf.js')()

    it('should return DEFAULT_CONFIG when no config is set', () => {
        expect(configParser.config).to.deep.equal(DEFAULT_CONFIG)
    })

    it('should set the given config to be used', () => {
        configParser.config = 'rapid.json'

        expect(configParser.config).to.deep.equal(jsonConfig)
    })

    it('should support json configs', () => {
        configParser.config = 'rapid.json'

        expect(configParser.config).to.deep.equal(jsonConfig)
    })

    it('should support js configs', () => {
        configParser.config = 'rapid.conf.js'

        expect(configParser.config).to.deep.equal(jsConfig)
    })

    it('should support configs that return an object', () => {
        configParser.config = 'rapid.json'

        expect(configParser.config).to.deep.equal(jsonConfig)
    })

    it('should support configs that return a function', () => {
        configParser.config = 'rapid.conf.js'

        expect(configParser.config).to.deep.equal(jsConfig)
    })

    it('should support merging configurations with the DEFAULT_CONFIG', () => {
        const mergedConfig = Object.assign(DEFAULT_CONFIG, jsConfig)
        configParser.merge = 'rapid.conf.js'

        expect(configParser.config).to.deep.equal(mergedConfig)
    })
})