const { readFileSync } = require('fs');

class XmlProcessor {
    processFiles (files) {
        const failedTests = {};

        files.forEach(file => {
            const data = readFileSync(file, 'utf8');
            const document = JSON.parse(data);
            const testsuites = document.suites;

            testsuites.forEach(testsuite => {
                if (testsuite.tests) {
                    testsuite.tests.forEach(testcase => {
                        const failed = testcase.state === 'fail';

                        if (failed) {
                            const { name } = testcase;

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
