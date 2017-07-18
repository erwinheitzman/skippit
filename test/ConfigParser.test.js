const path = require('path')
const expect = require('chai').expect
const { ConfigParser } = require('../lib/utils/ConfigParser')
const configParser = new ConfigParser
const defaultConfig = configParser.config

describe('ConfigParser.config', () => {
    it('should return default configurations when no custom config exists', () => {
        configParser.addConfig(path.resolve(__dirname, '..', './_config.json'))
        expect(configParser.config).to.deep.equal(defaultConfig)
    })

    it('should merge custom config with the default', () => {
        configParser.addConfig(path.resolve(__dirname, '..', './config.json'))
        expect(configParser.config).to.deep.equal(require('../config.json'))
    })
})