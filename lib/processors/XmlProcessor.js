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
                        const failure = testcase.childNamed('failure');
                        const error = testcase.childNamed('error');
                        const systemError = testcase.childNamed('system-err');

                        if (failure || error || systemError) {
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
