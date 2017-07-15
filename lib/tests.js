const fs = require('fs')
const path = require('path')
const Files = require('./Files').Files
const files = new Files

module.exports.Tests = class {
    constructor () {
        this.failedTests = {}
    }

    get (extensions, recursive) {
        return files.get(, extensions, recursive)
    }

    process  () {

    }

    disable (files) {
        files.forEach(file => {
            fs.readFile(file, 'utf8', (err, data) => {
                let newData = false
                if (err) throw err

                for (const test in failedTests) {

                    // Matches (arrow) function(s) declaration/expression(s) with and without parameters/values
                    const regex = new RegExp('(it|test)(\\([\'|"]' + test + '[\'|"],\\s?' +
                        '(?:function\\s?\\((?:[\'|"]?\\w+)?[\'|"]?\\)\\s?{' + '|' +
                        '\\w+\\);?' + '|' +
                        '\\(?(?:[\'|"]?\\w+)?[\'|"]?\\)?\\s?=>\\s?{?))', 'g')
                    
                    if (failedTests[test].failed >= 3) {
                        if (data.match(regex)) {
                            data = data.replace(regex, '$1.skip$2')
                            newData = true;
                        }
                    }
                }

                if (newData) {
                    fs.writeFile(file, data, 'utf8', err => {
                        if (err) throw err
                    })
                }
            })
        })
    }
}