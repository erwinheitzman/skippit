const Results = require('../Results');
const xmldoc = require('xmldoc/lib/xmldoc');
const fs = require('fs');

class XmlProcessor {
    constructor () {
        this.results = Results.get();
    }

    processFiles (settings) {
        const failedTests = {};

        this.results = Results.get(settings);
        this.results.forEach(file => {
            const data = fs.readFileSync(file, 'utf8');
            const xml = new xmldoc.XmlDocument(data);
            const testsuites = xml.children;

            testsuites.forEach(testsuite => {
                if (testsuite.children) {
                    testsuite.children.forEach(testcase => {
                        if (testcase.firstChild) {
                            if (testcase.firstChild.name === 'failure') {
                                const name = testcase.attr.name;

                                if (!failedTests[name]) {
                                    failedTests[name] = { failed: 1 };
                                } else {
                                    failedTests[name].failed++;
                                }
                            }
                        }
                    });
                }
            });
        });

        return failedTests;
    }
}

module.exports = new XmlProcessor();
