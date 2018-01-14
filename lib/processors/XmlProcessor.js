const xmldoc = require('xmldoc');
const { readFileSync } = require('fs');

class XmlProcessor {
    processFiles (files) {
        const failedTests = {};

        files.forEach(file => {
            const data = readFileSync(file, 'utf8');
            const document = new xmldoc.XmlDocument(data);
            const testsuites = document.children;

            testsuites.forEach(testsuite => {
                if (testsuite.children) {
                    testsuite.childrenNamed('testcase').forEach(testcase => {
                        const failureNode = testcase.childNamed('failure');
                        const errorAttr = testcase.childNamed('error');
                        const failed = failureNode || errorAttr;

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
