const fs = require('fs');

class Logger {
    constructor () {
        this._disabledTests = [];
    }

    get disabledTests () {
        return this._disabledTests;
    }

    set disabledTests (test) {
        this._disabledTests.push(test);
    }

    formatDate (date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    formatTime (date) {
        return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    }

    createLogFile () {
        const d = new Date();
        const dateFormatted = `${this.formatDate(d)} ${this.formatTime(d)}`;
        const fileName = `disabled ${dateFormatted}.json`;
        const data = JSON.stringify(this._disabledTests, null, 4);

        fs.writeFile('./' + fileName, data, 'utf8', (err) => {
            if (err) {
                throw err;
            }
        });
    }
}

module.exports = new Logger();
