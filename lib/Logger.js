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

    formatDate (date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    formatTime (date) {
        return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    }

    createLogFile () {
        const d = new Date()

        fs.writeFileSync(
            `./disabled  ${this.formatDate(d)} ${this.formatTime()}.json`,
            JSON.stringify(this._disabledTests, null, 4),
            'utf8'
        )
    }
}

module.exports = new Logger