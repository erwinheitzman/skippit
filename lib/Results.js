const config = require('./utils/getConfig');
// const XmlProcessor = require('./XmlProcessor');
const Files = require('./Files');

const { results } = config;

class Results {
    constructor () {
        this.failedTests = {};
    }

    get () {
        return Files.get(results.path, results.formats);
    }

    // process () {
    //     this.failedTests = XmlProcessor.processFiles(this.get());
    // }
}

module.exports = new Results();
