const Results = require('../Results');
const xmldoc = require('xmldoc');
const { readFileSync } = require('fs');

class XmlProcessor {
    processFiles (settings) {
        const failedTests = {};

        Results.get(settings).forEach(file => {
            const data = readFileSync(file, 'utf8');
            const document = new xmldoc.XmlDocument(data);
            const testsuites = document.children;

            testsuites.forEach(testsuite => {
                if (testsuite.children) {
                    testsuite.childrenNamed('testcase').forEach(testcase => {
                        const failed = testcase.childNamed('failure');

                        if (failed) {
                            const { name } = testcase.attr;

                            if (!failedTests[name]) {
                                failedTests[name] = { failed: 1 };
                            } else {
                                failedTests[name].failed++;
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
