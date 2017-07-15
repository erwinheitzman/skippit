const ConfigParser = require('./utils/ConfigParser').ConfigParser
const configParser = new ConfigParser
const XmlProcessor = require('./XmlProcessor').XmlProcessor
const xmlProcessor = new XmlProcessor
const Files = require('./Files').Files
const files = new Files

configParser.config = 'rapid.json'
const { results } = configParser.config

module.exports.Results = class {
    constructor () {
        this.failedTests = {}
    }

    get () {
        return files.get(results.path, results.formats)
    }

    process () {
        this.failedTests = xmlProcessor.processFiles(this.get())
    }
}