const Results = require('./Results');
const xmldoc = require('xmldoc/lib/xmldoc');
const fs = require('fs');

class XmlProcessor {
    constructor () {
        this.results = Results.get();
    }

    processFiles () {
        const failedTests = {};

        this.results.forEach(file => {
            const data = fs.readFileSync(file, 'utf8');
            const xml = new xmldoc.XmlDocument(data);
            const testsuites = xml.children;

            testsuites.forEach(testsuite => {
                testsuite.children.forEach(testcase => {
                    if (testcase.firstChild) {
                        if (testcase.firstChild.name === 'failure') {
                            if (!failedTests[testcase.attr.name]) {
                                failedTests[testcase.attr.name] = { failed: 1 };
                            } else {
                                failedTests[testcase.attr.name].failed++;
                            }
                        }
                    }
                });
            });
        });

        return failedTests;
    }
}

module.exports = new XmlProcessor();
