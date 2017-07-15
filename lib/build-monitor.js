'use strict'

const fs = require('fs')
const Git = require("nodegit")
const path = './results/'
const files = fs.readdirSync(path)
const xmldoc = require('xmldoc/lib/xmldoc')
const testPath = './tests'
const failedTests = {}

class TestProcessor {
    getTestFiles(dir) {
        return require('./getFiles')
    }
}

class XmlProcessor extends TestProcessor {
    processFiles(files) {
        files.forEach(file => {
            const data = fs.readFileSync(path + file, 'utf8')
            const xml = new xmldoc.XmlDocument(data)
            const testsuites = xml.children

            testsuites.forEach(testsuite => {
                testsuite.children.forEach(testcase => {
                    if (testcase.firstChild && testcase.firstChild.name === 'failure') {
                        if (!failedTests[testcase.attr.name]) {
                            failedTests[testcase.attr.name] = { failed: 1 }
                        } else {
                            failedTests[testcase.attr.name].failed++
                        }
                    }
                })
            })
        })
    }
}

class ProcessorFactory {
    getProcessor (type) {
        (type + 'Processor')(getTextFiles())
    }
}

function disableTests(files) {
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

disableTests(getTestFiles(testPath));
