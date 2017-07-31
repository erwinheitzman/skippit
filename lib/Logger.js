const fs = require('fs')

class Logger {
    constructor () {
        this._disabledTests = []
    }

    get disabledTests () {
        return this._disabledTests
    }

    set disabledTests (test) {
        this._disabledTests.push(test)
    }

    createLogFile () {
        const d = new Date()

        fs.writeFileSync(`./disabled ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ` +
            `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.json`,  JSON.stringify(this._disabledTests, null, 4), 'utf8')
    }
}

module.exports = new Logger