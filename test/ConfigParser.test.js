const expect = require('chai').expect
const ConfigParser = require('../lib/utils/ConfigParser').ConfigParser
const configParser = new ConfigParser
const DEFAULT_CONFIG = {
    testsPath: [],
    results: {
        path: [],
        formats: []
    },
    maxFailures: 3
}

describe('ConfigParser.config', () => {
    const jsonConfig = require('../rapid.json')
    const jsConfig = require('../rapid.conf.js')()

    it('should return DEFAULT_CONFIG when no config is set', () => {
        expect(ConfigParser.config).to.deep.equal(DEFAULT_CONFIG)
    })

    it('should set the given config to be used', () => {
        ConfigParser.config = 'rapid.json'

        expect(ConfigParser.config).to.deep.equal(jsonConfig)
    })

    it('should support json configs', () => {
        ConfigParser.config = 'rapid.json'

        expect(ConfigParser.config).to.deep.equal(jsonConfig)
    })

    it('should support js configs', () => {
        ConfigParser.config = 'rapid.conf.js'

        expect(ConfigParser.config).to.deep.equal(jsConfig)
    })

    it('should support configs that return an object', () => {
        ConfigParser.config = 'rapid.json'

        expect(ConfigParser.config).to.deep.equal(jsonConfig)
    })

    it('should support configs that return a function', () => {
        ConfigParser.config = 'rapid.conf.js'

        expect(ConfigParser.config).to.deep.equal(jsConfig)
    })

    it('should support merging configurations with the DEFAULT_CONFIG', () => {
        const mergedConfig = Object.assign(DEFAULT_CONFIG, jsConfig)
        configParser.merge = 'rapid.conf.js'

        expect(ConfigParser.config).to.deep.equal(mergedConfig)
    })
})