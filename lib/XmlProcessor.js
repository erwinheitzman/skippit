const Files = require('./Files').Files
const fs = require('fs')
const xmldoc = require('xmldoc/lib/xmldoc')

module.exports.XmlProcessor = class extends Files {
    processFiles(files) {
        const failedTests = {}

        files.forEach(file => {
            const data = fs.readFileSync(file, 'utf8')
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

        return failedTests
    }
}