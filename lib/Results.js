const config = require('./utils/getConfig')
const { XmlProcessor } = require('./XmlProcessor')
const xmlProcessor = new XmlProcessor
const Files = require('./Files').Files
const files = new Files

const { results } = config

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