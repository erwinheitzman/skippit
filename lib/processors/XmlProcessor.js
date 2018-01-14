const Results = require('../Results');
const xmldoc = require('xmldoc');
const fs = require('fs');

class XmlProcessor {
    processFiles (settings) {
        const failedTests = {};

        Results.get(settings).forEach(file => {
            const data = fs.readFileSync(file, 'utf8');
            const document = new xmldoc.XmlDocument(data);
            const testsuites = document.children;

            testsuites.forEach(testsuite => {
                if (testsuite.children) {
                    testsuite.childrenNamed('testcase').forEach(testcase => {
                        const failed = testcase.childNamed('failure');

                        if (failed) {
                            // if (failed.name === 'failure') {
                                const fullName = testcase.attr.classname
                                    + ' - ' + testcase.attr.name;

                                if (!failedTests[fullName]) {
                                    failedTests[fullName] = { failed: 1 };
                                } else {
                                    failedTests[fullName].failed++;
                                }
                            // }
                        }
                    });
                }
            });
        });

        return failedTests;
    }
}

module.exports = new XmlProcessor();
