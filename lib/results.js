module.exports.Results = class {
    constructor () {
        this.failedTests = {}
    }

    getFiles(dir) {
        return require('./getFiles')
    }
}